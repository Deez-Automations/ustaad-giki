"use server";

import { prisma } from "@/lib/prisma";

/**
 * Check if an email already exists in the database
 */
export async function checkEmailExists(email: string): Promise<{ exists: boolean; role?: string }> {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { role: true },
        });

        if (user) {
            return { exists: true, role: user.role };
        }

        return { exists: false };
    } catch (error) {
        console.error("[checkEmailExists]", error);
        return { exists: false };
    }
}
