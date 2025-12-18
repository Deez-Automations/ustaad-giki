"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Delete the current user's account completely
 * This removes all associated data (profile, timeslots, bookings, reviews, etc.)
 */
export async function deleteAccount() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id;

        console.log(`[deleteAccount] Deleting account for user: ${userId}`);

        // Delete in proper order to respect foreign key constraints
        // 1. Delete reviews (where user is student or mentor)
        await prisma.review.deleteMany({
            where: {
                OR: [
                    { studentId: userId },
                    { mentorId: userId },
                ],
            },
        });

        // 2. Delete bookings (where user is student or mentor)
        await prisma.booking.deleteMany({
            where: {
                OR: [
                    { studentId: userId },
                    { mentorId: userId },
                ],
            },
        });

        // 3. Delete SOS alerts (where user is student or acceptedBy mentor)
        await prisma.sOSAlert.deleteMany({
            where: {
                OR: [
                    { studentId: userId },
                    { acceptedById: userId },
                ],
            },
        });

        // 4. Delete notifications
        await prisma.notification.deleteMany({
            where: { userId },
        });

        // 5. Delete activity logs
        await prisma.activityLog.deleteMany({
            where: { userId },
        });

        // 6. Delete mentor availability (uses userId field)
        await prisma.mentorAvailability.deleteMany({
            where: { userId },
        });

        // 7. Delete time slots
        await prisma.timeSlot.deleteMany({
            where: { userId },
        });

        // 8. Delete profile
        await prisma.profile.deleteMany({
            where: { userId },
        });

        // 9. Delete preferences
        await prisma.preference.deleteMany({
            where: { userId },
        });

        // 10. Finally delete the user
        await prisma.user.delete({
            where: { id: userId },
        });

        console.log(`[deleteAccount] Successfully deleted account for user: ${userId}`);

        return { success: true };

    } catch (error) {
        console.error("[deleteAccount] Error:", error);
        return { error: "Failed to delete account. Please try again." };
    }
}

