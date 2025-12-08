"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateMentorBio(bio: string) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id as string;

        await prisma.profile.update({
            where: { userId },
            data: { mentorBio: bio },
        });

        revalidatePath("/mentor");
        revalidatePath("/mentor/profile");

        return { success: true };
    } catch (error) {
        console.error("[updateMentorBio]", error);
        return { error: "Failed to update bio" };
    }
}

export async function updateHourlyRate(rate: number) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        if (rate < 500 || rate > 1000) {
            return { error: "Rate must be between PKR 500-1000" };
        }

        const userId = session.user.id as string;

        await prisma.profile.update({
            where: { userId },
            data: { hourlyRate: rate },
        });

        revalidatePath("/mentor");
        revalidatePath("/mentor/profile");
        revalidatePath("/mentors");

        return { success: true };
    } catch (error) {
        console.error("[updateHourlyRate]", error);
        return { error: "Failed to update rate" };
    }
}

export async function toggleSOSAcceptance(accepts: boolean) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id as string;

        await prisma.profile.update({
            where: { userId },
            data: { acceptsSOS: accepts },
        });

        revalidatePath("/mentor");
        revalidatePath("/mentor/profile");

        return { success: true };
    } catch (error) {
        console.error("[toggleSOSAcceptance]", error);
        return { error: "Failed to update SOS preference" };
    }
}

export async function updateSubjects(subjects: string[]) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        if (subjects.length === 0) {
            return { error: "Select at least one subject" };
        }

        const userId = session.user.id as string;

        await prisma.profile.update({
            where: { userId },
            data: { subjects: JSON.stringify(subjects) },
        });

        revalidatePath("/mentor");
        revalidatePath("/mentor/profile");
        revalidatePath("/mentors");

        return { success: true };
    } catch (error) {
        console.error("[updateSubjects]", error);
        return { error: "Failed to update subjects" };
    }
}

export async function updateProficiencyLevel(level: string) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const userId = session.user.id as string;

        await prisma.profile.update({
            where: { userId },
            data: { proficiencyLevel: level },
        });

        revalidatePath("/mentor");
        revalidatePath("/mentor/profile");

        return { success: true };
    } catch (error) {
        console.error("[updateProficiencyLevel]", error);
        return { error: "Failed to update proficiency" };
    }
}
