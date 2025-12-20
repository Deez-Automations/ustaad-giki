"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateSOSAlertData {
    course: string;
    urgency: string;
    timeLeft: number;
    description: string;
}

/**
 * Create a new SOS alert and notify matching mentors
 */
export async function createSOSAlert(data: CreateSOSAlertData) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id as string;

        // Create SOS alert
        const alert = await prisma.sOSAlert.create({
            data: {
                studentId: userId,
                course: data.course,
                urgency: data.urgency,
                timeLeft: data.timeLeft,
                description: data.description,
                status: "PENDING",
                doubleRate: true,
            },
        });

        // Find mentors who teach this course and accept SOS
        const mentors = await prisma.profile.findMany({
            where: {
                isMentor: true,
                acceptsSOS: true,
                subjects: {
                    contains: data.course, // JSON string contains check
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        console.log(`[SOS] Alert created. Notified ${mentors.length} mentors for course: ${data.course}`);

        revalidatePath("/student");
        revalidatePath("/mentor");

        return {
            success: true,
            alertId: alert.id,
            mentorsNotified: mentors.length,
        };
    } catch (error) {
        console.error("[createSOSAlert]", error);
        return { error: "Failed to create SOS alert" };
    }
}

/**
 * Get pending SOS alerts for a mentor
 */
export async function getSOSAlertsForMentor() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id as string;

        // Get mentor profile to find their subjects
        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        if (!profile || !profile.isMentor) {
            return { alerts: [] };
        }

        // Parse subjects from JSON
        const subjects = profile.subjects ? JSON.parse(profile.subjects) : [];

        // Find alerts matching mentor's subjects
        const alerts = await prisma.sOSAlert.findMany({
            where: {
                status: "PENDING",
                course: {
                    in: subjects,
                },
            },
            include: {
                student: {
                    select: {
                        name: true,
                        profile: {
                            select: {
                                rollNumber: true,
                                batch: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return { alerts };
    } catch (error) {
        console.error("[getSOSAlertsForMentor]", error);
        return { error: "Failed to fetch SOS alerts" };
    }
}

/**
 * Accept an SOS alert
 */
export async function acceptSOSAlert(alertId: string) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id as string;
        const userRole = (session.user as any).role;

        // SECURITY: Only mentors can accept SOS alerts
        if (userRole !== "MENTOR") {
            console.warn(`[SECURITY] Non-mentor ${userId} attempted to accept SOS alert`);
            return { error: "Only mentors can accept SOS alerts" };
        }

        // Check if alert is still pending
        const alert = await prisma.sOSAlert.findUnique({
            where: { id: alertId },
        });

        if (!alert) {
            return { error: "Alert not found" };
        }

        if (alert.status !== "PENDING") {
            return { error: "Alert already accepted by another mentor" };
        }

        // Accept the alert
        await prisma.sOSAlert.update({
            where: { id: alertId },
            data: {
                status: "ACCEPTED",
                acceptedById: userId,
            },
        });

        revalidatePath("/mentor");
        revalidatePath("/student");

        return { success: true };
    } catch (error) {
        console.error("[acceptSOSAlert]", error);
        return { error: "Failed to accept alert" };
    }
}

/**
 * Get SOS alerts created by current student
 */
export async function getMySOSAlerts() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id as string;

        const alerts = await prisma.sOSAlert.findMany({
            where: {
                studentId: userId,
            },
            include: {
                acceptedBy: {
                    select: {
                        name: true,
                        profile: {
                            select: {
                                hourlyRate: true,
                                rating: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return { alerts };
    } catch (error) {
        console.error("[getMySOSAlerts]", error);
        return { error: "Failed to fetch alerts" };
    }
}

/**
 * Cancel a pending SOS alert
 */
export async function cancelSOSAlert(alertId: string) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id as string;

        // Verify ownership
        const alert = await prisma.sOSAlert.findUnique({
            where: { id: alertId },
        });

        if (!alert || alert.studentId !== userId) {
            return { error: "Unauthorized" };
        }

        await prisma.sOSAlert.update({
            where: { id: alertId },
            data: { status: "CANCELLED" },
        });

        revalidatePath("/student");

        return { success: true };
    } catch (error) {
        console.error("[cancelSOSAlert]", error);
        return { error: "Failed to cancel alert" };
    }
}
