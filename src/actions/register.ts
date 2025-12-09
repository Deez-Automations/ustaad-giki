"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email().endsWith("@giki.edu.pk", "Must be a GIKI email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rollNumber: z.string().min(1, "Roll number is required"),
    batch: z.string().min(1, "Batch is required"),
    faculty: z.string().min(1, "Faculty is required"),
    department: z.string().optional(),
    courses: z.array(z.string()).optional(),
    cnic: z.string().length(13, "CNIC must be 13 digits"),
    livePhotoUrl: z.string().optional(),
});

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
    console.log("[Register] Starting registration for:", data.email);

    try {
        const validatedFields = RegisterSchema.safeParse(data);

        if (!validatedFields.success) {
            const errors = validatedFields.error.issues.map((e: { message: string }) => e.message).join(", ");
            console.log("[Register] Validation failed:", errors);
            return { error: errors || "Invalid fields" };
        }

        const { email, password, name, rollNumber, batch, faculty, department, courses, cnic, livePhotoUrl } = validatedFields.data;

        // Check if user exists
        console.log("[Register] Checking if user exists...");
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log("[Register] Email already in use:", email);
            return { error: "Email already in use" };
        }

        // Check if roll number exists
        console.log("[Register] Checking if roll number exists...");
        const existingProfile = await prisma.profile.findUnique({
            where: { rollNumber },
        });

        if (existingProfile) {
            console.log("[Register] Roll number already registered:", rollNumber);
            return { error: "Roll number already registered" };
        }

        console.log("[Register] Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("[Register] Creating user in database...");
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "STUDENT",
                profile: {
                    create: {
                        rollNumber,
                        batch,
                        faculty,
                        department: department || null,
                        subjects: courses ? JSON.stringify(courses) : null,
                        cnic,
                        livePhotoUrl: livePhotoUrl || null,
                        isVerified: true, // Auto-verify for now
                    },
                },
            },
        });

        console.log("[Register] User created successfully:", user.id);
        return { success: true, userId: user.id };

    } catch (error: any) {
        console.error("[Register] Error:", error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            if (error.meta?.target?.includes('email')) {
                return { error: "Email already in use" };
            }
            if (error.meta?.target?.includes('rollNumber')) {
                return { error: "Roll number already registered" };
            }
            return { error: "A unique constraint was violated" };
        }

        return { error: error.message || "Something went wrong during registration. Please try again." };
    }
}
