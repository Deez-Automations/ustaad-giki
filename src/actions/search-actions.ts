"use server";

import { prisma } from "@/lib/prisma";

interface SearchMentorsParams {
    searchQuery?: string;
    course?: string;
    minRate?: number;
    maxRate?: number;
}

export async function searchMentors(params: SearchMentorsParams = {}) {
    try {
        const { searchQuery, course, minRate, maxRate } = params;

        const mentors = await prisma.profile.findMany({
            where: {
                isMentor: true,
                isProfileComplete: true,
                ...(course && {
                    subjects: {
                        contains: course,
                    },
                }),
                ...(minRate && {
                    hourlyRate: {
                        gte: minRate,
                    },
                }),
                ...(maxRate && {
                    hourlyRate: {
                        lte: maxRate,
                    },
                }),
                ...(searchQuery && {
                    OR: [
                        {
                            user: {
                                name: {
                                    contains: searchQuery,
                                },
                            },
                        },
                        {
                            subjects: {
                                contains: searchQuery,
                            },
                        },
                    ],
                }),
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                rating: "desc",
            },
        });

        return {
            mentors: mentors.map(m => ({
                id: m.userId,
                name: m.user.name || "Unknown",
                photo: m.livePhotoUrl,
                department: m.department,
                subjects: m.subjects ? JSON.parse(m.subjects) : [],
                hourlyRate: m.hourlyRate || 0,
                rating: m.rating,
                reviewCount: m.reviewCount,
                proficiencyLevel: m.proficiencyLevel,
                bio: m.mentorBio,
            })),
        };
    } catch (error) {
        console.error("[searchMentors]", error);
        return { error: "Failed to search mentors", mentors: [] };
    }
}
