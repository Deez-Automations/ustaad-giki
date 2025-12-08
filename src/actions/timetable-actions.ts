"use server";

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface TimeSlotData {
    day: string;
    startTime: string;
    endTime: string;
    title: string;
    location?: string;
    color: string;
}

/**
 * Get all time slots for the current user
 */
export async function getTimeSlots() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        const timeSlots = await prisma.timeSlot.findMany({
            where: { userId: session.user.id },
            orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
        });

        return { timeSlots };
    } catch (error) {
        console.error("[getTimeSlots]", error);
        return { error: "Failed to fetch time slots" };
    }
}

/**
 * Create a new time slot
 */
export async function createTimeSlot(data: TimeSlotData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        const timeSlot = await prisma.timeSlot.create({
            data: {
                ...data,
                userId: session.user.id,
            },
        });

        revalidatePath('/timetable');
        revalidatePath('/student');
        revalidatePath('/mentor');

        return { timeSlot };
    } catch (error) {
        console.error("[createTimeSlot]", error);
        return { error: "Failed to create time slot" };
    }
}

/**
 * Update an existing time slot
 */
export async function updateTimeSlot(id: string, data: Partial<TimeSlotData>) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        // Verify ownership
        const existing = await prisma.timeSlot.findUnique({
            where: { id },
        });

        if (!existing || existing.userId !== session.user.id) {
            return { error: "Time slot not found or unauthorized" };
        }

        const timeSlot = await prisma.timeSlot.update({
            where: { id },
            data,
        });

        revalidatePath('/timetable');
        revalidatePath('/student');
        revalidatePath('/mentor');

        return { timeSlot };
    } catch (error) {
        console.error("[updateTimeSlot]", error);
        return { error: "Failed to update time slot" };
    }
}

/**
 * Delete a time slot
 */
export async function deleteTimeSlot(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        // Verify ownership
        const existing = await prisma.timeSlot.findUnique({
            where: { id },
        });

        if (!existing || existing.userId !== session.user.id) {
            return { error: "Time slot not found or unauthorized" };
        }

        await prisma.timeSlot.delete({
            where: { id },
        });

        revalidatePath('/timetable');
        revalidatePath('/student');
        revalidatePath('/mentor');

        return { success: true };
    } catch (error) {
        console.error("[deleteTimeSlot]", error);
        return { error: "Failed to delete time slot" };
    }
}

/**
 * Delete all time slots for the current user
 */
export async function clearAllTimeSlots() {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.timeSlot.deleteMany({
            where: { userId: session.user.id },
        });

        revalidatePath('/timetable');
        revalidatePath('/student');
        revalidatePath('/mentor');

        return { success: true };
    } catch (error) {
        console.error("[clearAllTimeSlots]", error);
        return { error: "Failed to clear time slots" };
    }
}

/**
 * Bulk save time slots (used after OCR extraction)
 */
export async function saveExtractedTimeSlots(timeSlots: TimeSlotData[]) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const userId = session.user.id as string;

    try {
        // Clear existing time slots
        await prisma.timeSlot.deleteMany({
            where: { userId },
        });

        //Create new time slots
        const created = await prisma.timeSlot.createMany({
            data: timeSlots.map(slot => ({
                ...slot,
                userId,
            })),
        });

        revalidatePath('/timetable');
        revalidatePath('/student');
        revalidatePath('/mentor');

        return { count: created.count };
    } catch (error) {
        console.error("[saveExtractedTimeSlots]", error);
        return { error: "Failed to save time slots" };
    }
}
