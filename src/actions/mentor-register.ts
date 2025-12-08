"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

interface MentorRegistrationData {
    name: string;
    email: string;
    password: string;
    rollNumber: string;
    batch: string;
    faculty: string;
    cnic: string;
    department: string;
    subjects: string[];
    hourlyRate: number;
    proficiencyLevel: string; acceptsSOS: boolean;
    mentorBio: string;
    livePhotoData: string;
}

export async function registerMentor(data: MentorRegistrationData) {
    try {
        // Validation
        if (!data.email.endsWith("@giki.edu.pk")) {
            return { error: "Please use your GIKI email address" };
        }

        if (data.subjects.length === 0) {
            return { error: "Please select at least one subject you can teach" };
        }

        if (data.hourlyRate < 500 || data.hourlyRate > 1000) {
            return { error: "Hourly rate must be between PKR 500 and 1000" };
        }

        if (!data.livePhotoData) {
            return { error: "Live photo verification is required" };
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return { error: "Email already registered" };
        }

        // Check if roll number already exists
        const existingProfile = await prisma.profile.findUnique({
            where: { rollNumber: data.rollNumber },
        });

        if (existingProfile) {
            return { error: "Roll number already registered" };
        }

        // Hash password
        const hashedPassword = await hash(data.password, 12);

        // Create user and profile in a transaction
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: "MENTOR",
                profile: {
                    create: {
                        rollNumber: data.rollNumber,
                        batch: data.batch,
                        faculty: data.faculty,
                        cnic: data.cnic,
                        livePhotoUrl: data.livePhotoData,
                        isVerified: true, // Auto-verify since they provided live photo

                        // Mentor-specific fields
                        isMentor: true,
                        department: data.department,
                        subjects: JSON.stringify(data.subjects), // Store as JSON string
                        hourlyRate: data.hourlyRate,
                        proficiencyLevel: data.proficiencyLevel,
                        acceptsSOS: data.acceptsSOS,
                        mentorBio: data.mentorBio,
                        isProfileComplete: true,
                    },
                },
            },
        });

        return { success: true, userId: user.id };
    } catch (error) {
        console.error("Mentor registration error:", error);
        return { error: "Registration failed. Please try again." };
    }
}
