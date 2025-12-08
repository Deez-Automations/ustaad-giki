import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSOSAlertsForMentor } from "@/actions/sos-actions";
import MentorSOSAlerts from "@/components/sos/MentorSOSAlerts";
import MentorStats from "@/components/mentor/MentorStats";
import ActiveSessions from "@/components/mentor/ActiveSessions";
import EarningsCard from "@/components/mentor/EarningsCard";
import ReviewsDisplay from "@/components/mentor/ReviewsDisplay";
import ProfileCompletion from "@/components/mentor/ProfileCompletion";

export default async function MentorDashboard() {
    const session = await auth();

    if (!session || !session.user) redirect("/auth/login");

    const userId = session.user.id as string;

    // Fetch mentor profile data
    const profile = await prisma.profile.findUnique({
        where: { userId },
    });

    if (!profile || !profile.isMentor) {
        redirect("/student");
    }

    // Fetch SOS alerts
    const sosResult = await getSOSAlertsForMentor();
    const sosAlerts = sosResult.alerts || [];

    // Mock data for sessions (will be real when booking system is built)
    const mockSessions: { id: string; studentName: string; course: string; startTime: string; duration: number; status: "upcoming" | "in-progress" | "completed" }[] = [];

    // Mock reviews
    const reviews: any[] = [];

    // Calculate profile completion
    const calculateCompletion = () => {
        if (!profile) return { percentage: 0, missing: [] };

        const fields = [
            { name: "Bio", value: profile.mentorBio },
            { name: "Hourly Rate", value: profile.hourlyRate },
            { name: "Department", value: profile.department },
            { name: "Subjects", value: profile.subjects },
            { name: "Live Photo", value: profile.livePhotoUrl },
        ];

        const filledFields = fields.filter(f => f.value).length;
        const percentage = Math.round((filledFields / fields.length) * 100);
        const missing = fields.filter(f => !f.value).map(f => f.name);

        return { percentage, missing };
    };

    const { percentage: completionPercentage, missing: missingFields } = calculateCompletion();

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-giki-blue to-giki-gold bg-clip-text text-transparent">
                        Ustaad Panel 🎓
                    </h1>
                    <p className="text-gray-600 mt-1">Welcome back, {session.user?.name}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Link
                        href="/mentor/profile"
                        className="px-4 py-2 bg-giki-blue text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                    >
                        Edit Profile
                    </Link>
                    <form action={async () => {
                        "use server"
                        await signOut()
                    }}>
                        <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>

            {/* SOS Alerts (if any) - Priority Display */}
            {sosAlerts.length > 0 && (
                <div className="mb-8">
                    <MentorSOSAlerts
                        initialAlerts={sosAlerts}
                        hourlyRate={profile.hourlyRate || 500}
                    />
                </div>
            )}

            {/* Stats Cards */}
            <MentorStats
                totalEarnings={profile.totalEarnings || 0}
                totalSessions={0}
                averageRating={profile.rating || 5.0}
                responseTime="< 2 hrs"
                acceptanceRate={95}
                thisWeekEarnings={0}
            />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Left: Sessions & Earnings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Sessions */}
                    <ActiveSessions sessions={mockSessions} />

                    {/* Earnings Breakdown */}
                    <EarningsCard
                        totalEarnings={profile.totalEarnings || 0}
                        monthlyEarnings={0}
                        pendingPayments={0}
                    />
                </div>

                {/* Right: Profile & Reviews */}
                <div className="space-y-6">
                    {/* Profile Completion */}
                    <ProfileCompletion
                        completionPercentage={completionPercentage}
                        missingFields={missingFields}
                    />

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link
                                href="/timetable"
                                className="block px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-center"
                            >
                                📅 Manage Availability
                            </Link>
                            <Link
                                href="/mentor/profile"
                                className="block px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium text-center"
                            >
                                ⚙️ Profile Settings
                            </Link>
                            <Link
                                href="/mentors"
                                className="block px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-center"
                            >
                                🔍 View as Student
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <ReviewsDisplay
                reviews={reviews}
                averageRating={profile.rating || 0}
                totalReviews={profile.reviewCount || 0}
            />
        </div>
    );
}
