import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import ProfileSettings from "@/components/mentor/ProfileSettings";

export default async function MentorProfilePage() {
    const session = await auth();

    if (!session || !session.user) redirect("/auth/login");

    const userId = session.user.id as string;

    const profile = await prisma.profile.findUnique({
        where: { userId },
    });

    if (!profile || !profile.isMentor) {
        redirect("/student");
    }

    const initialData = {
        bio: profile.mentorBio || "",
        hourlyRate: profile.hourlyRate || 500,
        department: profile.department || "",
        subjects: profile.subjects ? JSON.parse(profile.subjects) : [],
        proficiencyLevel: profile.proficiencyLevel || "Intermediate",
        acceptsSOS: profile.acceptsSOS ?? true,
    };

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/mentor"
                    className="inline-flex items-center text-giki-blue hover:underline mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
                <h1 className="text-4xl font-bold text-giki-blue">Profile Settings</h1>
                <p className="text-gray-600 mt-2">Manage your mentor profile and preferences</p>
            </div>

            {/* Profile Settings Component */}
            <ProfileSettings initialData={initialData} />
        </div>
    );
}
