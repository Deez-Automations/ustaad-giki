"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email().endsWith("@giki.edu.pk", "Must be a GIKI email"),
    password: z.string().min(6),
    rollNumber: z.string().min(6),
    batch: z.string().min(2),
    faculty: z.string(),
    department: z.string().optional(),
    courses: z.array(z.string()).optional(),
    cnic: z.string().length(13, "CNIC must be 13 digits"),
    livePhotoUrl: z.string().optional(), // In a real app, we'd upload this to S3/Cloudinary
});

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
    const validatedFields = RegisterSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, name, rollNumber, batch, faculty, department, courses, cnic, livePhotoUrl } = validatedFields.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                profile: {
                    create: {
                        rollNumber,
                        batch,
                        faculty,
                        department,
                        subjects: courses ? JSON.stringify(courses) : null,
                        cnic,
                        livePhotoUrl,
                        isVerified: false, // Requires manual or auto verification later
                    },
                },
            },
        });

        return { success: "Account created! Please log in." };
    } catch (error) {
        console.error("Registration Error:", error);
        return { error: "Something went wrong during registration." };
    }
}
