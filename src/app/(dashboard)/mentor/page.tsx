import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSOSAlertsForMentor } from "@/actions/sos-actions";
import { getMyBookings } from "@/actions/booking-actions";
import { getTimeSlots } from "@/actions/timetable-actions";
import MentorSOSAlerts from "@/components/sos/MentorSOSAlerts";
import MentorStats from "@/components/mentor/MentorStats";
import EarningsCard from "@/components/mentor/EarningsCard";
import ReviewsDisplay from "@/components/mentor/ReviewsDisplay";
import ProfileCompletion from "@/components/mentor/ProfileCompletion";
import PendingBookings from "@/components/booking/PendingBookings";
import DeleteAccountButton from "@/components/account/DeleteAccountButton";
import TimetableDisplay from "@/components/timetable/TimetableDisplay";

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

    // Fetch bookings for this mentor
    const bookingsResult = await getMyBookings();
    const allBookings = bookingsResult.bookings || [];
    const pendingBookings = allBookings.filter((b: any) => b.status === "PENDING" && b.mentorId === userId);
    const confirmedBookings = allBookings.filter((b: any) => b.status === "CONFIRMED" && b.mentorId === userId);

    // Fetch timetable
    const timetableResult = await getTimeSlots();
    const timeSlots = timetableResult.timeSlots || [];

    // Convert confirmed bookings to timetable event format
    const bookingEvents = confirmedBookings.map((b: any) => {
        const scheduledDate = new Date(b.scheduledDate);
        const dayName = scheduledDate.toLocaleDateString("en-US", { weekday: "long" });
        return {
            id: b.id,
            day: dayName,
            startTime: b.startTime,
            endTime: b.endTime,
            title: b.course,
            studentName: b.student?.name || "Student",
            status: b.status,
            course: b.course,
            topic: b.topic,
        };
    });

    // Fetch real reviews and transform to component format
    const rawReviews = await prisma.review.findMany({
        where: { mentorId: userId },
        include: { student: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    const reviews = rawReviews.map((r) => ({
        id: r.id,
        studentName: r.student?.name || "Anonymous",
        rating: r.rating,
        comment: r.comment || "",
        date: r.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }),
    }));

    // Calculate profile completion
    const calculateCompletion = () => {
        if (!profile) return { percentage: 0, missing: [] };

        const fields = [
            { name: "Bio", value: profile.mentorBio },
            { name: "Hourly Rate", value: profile.hourlyRate },
            { name: "Department", value: profile.department },
            { name: "Subjects", value: profile.subjects },
        ];

        const filledFields = fields.filter(f => f.value).length;
        const percentage = Math.round((filledFields / fields.length) * 100);
        const missing = fields.filter(f => !f.value).map(f => f.name);

        return { percentage, missing };
    };

    const { percentage: completionPercentage, missing: missingFields } = calculateCompletion();
    const isProfileComplete = completionPercentage === 100;

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

            {/* Pending Booking Requests */}
            <PendingBookings bookings={pendingBookings} />

            {/* Stats Cards */}
            <MentorStats
                totalEarnings={profile.totalEarnings || 0}
                totalSessions={allBookings.filter((b: any) => b.status === "COMPLETED").length}
                averageRating={profile.rating || 5.0}
                responseTime="< 2 hrs"
                acceptanceRate={95}
                thisWeekEarnings={0}
            />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Left: Timetable (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Weekly Timetable with Confirmed Bookings */}
                    <TimetableDisplay
                        timeSlots={timeSlots}
                        confirmedBookings={bookingEvents}
                        showAllDays={true}
                    />

                    {/* Edit Timetable Button */}
                    <div className="text-center">
                        <Link
                            href="/timetable"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
                        >
                            📅 {timeSlots.length > 0 ? "Edit Timetable" : "Add Timetable"}
                        </Link>
                    </div>
                </div>

                {/* Right: Earnings & Quick Actions (1/3 width) */}
                <div className="space-y-6">
                    {/* Show ProfileCompletion only if not 100% */}
                    {!isProfileComplete && (
                        <ProfileCompletion
                            completionPercentage={completionPercentage}
                            missingFields={missingFields}
                        />
                    )}

                    {/* Earnings Overview (moves up when profile is complete) */}
                    <EarningsCard
                        totalEarnings={profile.totalEarnings || 0}
                        monthlyEarnings={0}
                        pendingPayments={pendingBookings.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0)}
                    />

                    {/* Upcoming Sessions List */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-800 mb-4">📅 Upcoming Sessions</h3>
                        {confirmedBookings.length > 0 ? (
                            <div className="space-y-3">
                                {confirmedBookings.slice(0, 5).map((booking: any) => (
                                    <div key={booking.id} className="p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <p className="font-semibold text-gray-800 text-sm">{booking.course}</p>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">
                                            with {booking.student?.name || "Student"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(booking.scheduledDate).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                            })} • {booking.startTime} - {booking.endTime}
                                        </p>
                                        <p className="text-xs font-medium text-green-600 mt-1">
                                            PKR {booking.totalAmount?.toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">No upcoming sessions</p>
                        )}
                    </div>

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

            {/* Danger Zone */}
            <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Danger Zone</h3>
                        <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <DeleteAccountButton />
                </div>
            </div>
        </div>
    );
}
