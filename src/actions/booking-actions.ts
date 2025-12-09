"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Time slot structure for availability calculations
interface TimeRange {
    day: string;
    startTime: string;
    endTime: string;
}

// Working hours for sessions (8 AM to 6 PM)
const WORKING_HOURS = {
    start: "08:00",
    end: "18:00",
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Session duration options (in minutes)
const SESSION_DURATIONS = [30, 60, 90, 120];

/**
 * Convert time string "HH:MM" to minutes since midnight
 */
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to time string "HH:MM"
 */
function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Check if two time ranges overlap
 */
function rangesOverlap(range1: TimeRange, range2: TimeRange): boolean {
    if (range1.day !== range2.day) return false;

    const start1 = timeToMinutes(range1.startTime);
    const end1 = timeToMinutes(range1.endTime);
    const start2 = timeToMinutes(range2.startTime);
    const end2 = timeToMinutes(range2.endTime);

    return start1 < end2 && start2 < end1;
}

/**
 * Get free time slots for a user on a given day
 * This subtracts busy slots from working hours
 */
function getFreeSlots(busySlots: TimeRange[], day: string): TimeRange[] {
    const daySlots = busySlots.filter(s => s.day === day);

    // Sort by start time
    daySlots.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    const freeSlots: TimeRange[] = [];
    let currentTime = timeToMinutes(WORKING_HOURS.start);
    const endOfDay = timeToMinutes(WORKING_HOURS.end);

    for (const slot of daySlots) {
        const slotStart = timeToMinutes(slot.startTime);
        const slotEnd = timeToMinutes(slot.endTime);

        // If there's a gap before this busy slot, it's free time
        if (slotStart > currentTime) {
            freeSlots.push({
                day,
                startTime: minutesToTime(currentTime),
                endTime: minutesToTime(slotStart),
            });
        }

        // Move current time to end of this busy slot
        currentTime = Math.max(currentTime, slotEnd);
    }

    // Add remaining time until end of day
    if (currentTime < endOfDay) {
        freeSlots.push({
            day,
            startTime: minutesToTime(currentTime),
            endTime: minutesToTime(endOfDay),
        });
    }

    return freeSlots;
}

/**
 * Find available session slots that work for both student and mentor
 */
export async function findAvailableSlots(mentorId: string, sessionDuration: number = 60) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const studentId = session.user.id;

        // Fetch student's timetable (busy slots)
        const studentTimeSlots = await prisma.timeSlot.findMany({
            where: { userId: studentId },
        });

        // Fetch mentor's timetable (busy slots)
        const mentorTimeSlots = await prisma.timeSlot.findMany({
            where: { userId: mentorId },
        });

        // Fetch existing bookings for both (also busy)
        const existingBookings = await prisma.booking.findMany({
            where: {
                OR: [
                    { studentId: studentId },
                    { mentorId: mentorId },
                ],
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });

        // Convert to TimeRange format
        const studentBusy: TimeRange[] = studentTimeSlots.map(s => ({
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
        }));

        const mentorBusy: TimeRange[] = mentorTimeSlots.map(s => ({
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
        }));

        // Add existing bookings as busy slots
        for (const booking of existingBookings) {
            const bookingDate = new Date(booking.scheduledDate);
            const dayName = bookingDate.toLocaleDateString("en-US", { weekday: "long" });

            const busySlot: TimeRange = {
                day: dayName,
                startTime: booking.startTime,
                endTime: booking.endTime,
            };

            if (booking.studentId === studentId) {
                studentBusy.push(busySlot);
            }
            if (booking.mentorId === mentorId) {
                mentorBusy.push(busySlot);
            }
        }

        // Find available slots for each day
        const availableSlots: {
            day: string;
            slots: { startTime: string; endTime: string }[];
        }[] = [];

        for (const day of DAYS) {
            const studentFree = getFreeSlots(studentBusy, day);
            const mentorFree = getFreeSlots(mentorBusy, day);

            // Find overlapping free time
            const daySlots: { startTime: string; endTime: string }[] = [];

            for (const sSlot of studentFree) {
                for (const mSlot of mentorFree) {
                    // Calculate overlap
                    const overlapStart = Math.max(
                        timeToMinutes(sSlot.startTime),
                        timeToMinutes(mSlot.startTime)
                    );
                    const overlapEnd = Math.min(
                        timeToMinutes(sSlot.endTime),
                        timeToMinutes(mSlot.endTime)
                    );

                    // If overlap is at least session duration, it's a valid slot
                    if (overlapEnd - overlapStart >= sessionDuration) {
                        // Generate possible start times within this overlap
                        for (let start = overlapStart; start + sessionDuration <= overlapEnd; start += 30) {
                            daySlots.push({
                                startTime: minutesToTime(start),
                                endTime: minutesToTime(start + sessionDuration),
                            });
                        }
                    }
                }
            }

            if (daySlots.length > 0) {
                // Remove duplicates
                const uniqueSlots = daySlots.filter((slot, index, self) =>
                    index === self.findIndex(s =>
                        s.startTime === slot.startTime && s.endTime === slot.endTime
                    )
                );

                availableSlots.push({ day, slots: uniqueSlots });
            }
        }

        return {
            availableSlots,
            sessionDuration,
            studentHasTimetable: studentTimeSlots.length > 0,
            mentorHasTimetable: mentorTimeSlots.length > 0,
        };

    } catch (error) {
        console.error("[findAvailableSlots]", error);
        return { error: "Failed to find available slots" };
    }
}

/**
 * Create a booking request
 */
export async function createBooking(data: {
    mentorId: string;
    course: string;
    topic?: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    notes?: string;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const studentId = session.user.id;

        // Get mentor's hourly rate
        const mentorProfile = await prisma.profile.findUnique({
            where: { userId: data.mentorId },
        });

        if (!mentorProfile) {
            return { error: "Mentor not found" };
        }

        // Calculate duration and amount
        const startMins = timeToMinutes(data.startTime);
        const endMins = timeToMinutes(data.endTime);
        const durationMinutes = endMins - startMins;
        const hourlyRate = mentorProfile.hourlyRate || 500;
        const totalAmount = (durationMinutes / 60) * hourlyRate;

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                studentId,
                mentorId: data.mentorId,
                course: data.course,
                topic: data.topic || null,
                scheduledDate: data.scheduledDate,
                startTime: data.startTime,
                endTime: data.endTime,
                duration: durationMinutes,
                totalAmount,
                status: "PENDING",
                studentNotes: data.notes || null,
            },
        });

        revalidatePath("/student");
        revalidatePath("/mentor");
        revalidatePath("/mentors");

        return { success: true, bookingId: booking.id };

    } catch (error) {
        console.error("[createBooking]", error);
        return { error: "Failed to create booking" };
    }
}

/**
 * Get bookings for the current user
 */
export async function getMyBookings() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id;

        const bookings = await prisma.booking.findMany({
            where: {
                OR: [
                    { studentId: userId },
                    { mentorId: userId },
                ],
            },
            include: {
                student: {
                    select: { name: true, email: true },
                },
                mentor: {
                    select: {
                        name: true,
                        email: true,
                        profile: {
                            select: { hourlyRate: true, rating: true },
                        },
                    },
                },
            },
            orderBy: { scheduledDate: "asc" },
        });

        return { bookings };

    } catch (error) {
        console.error("[getMyBookings]", error);
        return { error: "Failed to fetch bookings" };
    }
}

/**
 * Update booking status (accept/reject/cancel)
 */
export async function updateBookingStatus(bookingId: string, status: "CONFIRMED" | "CANCELLED", reason?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Verify user is part of this booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return { error: "Booking not found" };
        }

        if (booking.studentId !== userId && booking.mentorId !== userId) {
            return { error: "Unauthorized" };
        }

        // Update booking
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status,
                cancelledById: status === "CANCELLED" ? userId : null,
                cancelReason: status === "CANCELLED" ? reason : null,
            },
        });

        revalidatePath("/student");
        revalidatePath("/mentor");

        return { success: true };

    } catch (error) {
        console.error("[updateBookingStatus]", error);
        return { error: "Failed to update booking" };
    }
}

/**
 * Get mentor's free slots (for display on mentor card)
 */
export async function getMentorFreeSlots(mentorId: string) {
    try {
        // Fetch mentor's timetable
        const mentorTimeSlots = await prisma.timeSlot.findMany({
            where: { userId: mentorId },
        });

        // Fetch mentor's existing bookings
        const existingBookings = await prisma.booking.findMany({
            where: {
                mentorId,
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });

        // Convert to busy slots
        const mentorBusy: TimeRange[] = mentorTimeSlots.map(s => ({
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
        }));

        // Add bookings as busy
        for (const booking of existingBookings) {
            const bookingDate = new Date(booking.scheduledDate);
            const dayName = bookingDate.toLocaleDateString("en-US", { weekday: "long" });
            mentorBusy.push({
                day: dayName,
                startTime: booking.startTime,
                endTime: booking.endTime,
            });
        }

        // Calculate free slots per day
        const freeSlots: { day: string; slots: TimeRange[] }[] = [];

        for (const day of DAYS) {
            const dayFree = getFreeSlots(mentorBusy, day);
            if (dayFree.length > 0) {
                freeSlots.push({ day, slots: dayFree });
            }
        }

        return {
            freeSlots,
            hasTimetable: mentorTimeSlots.length > 0,
        };

    } catch (error) {
        console.error("[getMentorFreeSlots]", error);
        return { error: "Failed to get mentor availability" };
    }
}
