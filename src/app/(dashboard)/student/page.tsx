import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTimeSlots } from "@/actions/timetable-actions";
import { getMyBookings } from "@/actions/booking-actions";
import DeleteAccountButton from "@/components/account/DeleteAccountButton";
import TimetableDisplay from "@/components/timetable/TimetableDisplay";

export default async function StudentDashboard() {
    const session = await auth();

    if (!session) redirect("/auth/login");

    // Redirect mentors to their dashboard
    const userRole = (session.user as any)?.role;
    if (userRole === "MENTOR") {
        redirect("/mentor");
    }

    const userId = session.user?.id as string;

    // Fetch time slots for the current user
    const timeSlotsResult = await getTimeSlots();
    const timeSlots = timeSlotsResult.timeSlots || [];
    const hasTimetable = timeSlots.length > 0;

    // Fetch bookings
    const bookingsResult = await getMyBookings();
    const bookings = bookingsResult.bookings || [];
    const upcomingBookings = bookings.filter((b: any) =>
        (b.status === "PENDING" || b.status === "CONFIRMED") && b.studentId === userId
    );
    const confirmedBookings = bookings.filter((b: any) =>
        b.status === "CONFIRMED" && b.studentId === userId
    );

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
            mentorName: b.mentor?.name || "Mentor",
            status: b.status,
            course: b.course,
            topic: b.topic,
        };
    });

    // Count classes today
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const classesToday = timeSlots.filter((slot: any) => slot.day === today).length;

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-giki-blue">Welcome, {session.user?.name} 👋</h1>
                    <p className="text-gray-600">Student Dashboard</p>
                </div>
                <form action={async () => {
                    "use server"
                    await signOut()
                }}>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        Sign Out
                    </button>
                </form>
            </div>

            {/* Quick Stats - Removed Wallet */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-500 mb-2">Upcoming Sessions</h3>
                    <p className="text-3xl font-bold text-giki-blue">{upcomingBookings.length}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {confirmedBookings.length} confirmed, {upcomingBookings.length - confirmedBookings.length} pending
                    </p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-500 mb-2">Classes Today</h3>
                    <p className="text-3xl font-bold text-giki-gold">{classesToday}</p>
                    <p className="text-sm text-gray-500 mt-1">{today}</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Left: Timetable (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    {hasTimetable ? (
                        <>
                            <TimetableDisplay
                                timeSlots={timeSlots}
                                confirmedBookings={bookingEvents}
                                showAllDays={true}
                            />
                            <div className="text-center">
                                <Link
                                    href="/timetable"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
                                >
                                    📅 Edit Timetable
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Timetable Yet</h3>
                            <p className="text-gray-600 mb-4">Upload your GIKI timetable or build it manually.</p>
                            <Link
                                href="/timetable"
                                className="inline-block px-6 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
                            >
                                Add Your Timetable
                            </Link>
                        </div>
                    )}
                </div>

                {/* Right: Upcoming Bookings & Actions (1/3 width) */}
                <div className="space-y-6">
                    {/* Upcoming Bookings */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                            <h3 className="font-bold text-green-800">📚 Upcoming Sessions</h3>
                        </div>
                        <div className="p-4">
                            {upcomingBookings.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingBookings.slice(0, 3).map((booking: any) => (
                                        <div key={booking.id} className="p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${booking.status === "CONFIRMED" ? "bg-green-500" : "bg-yellow-500"
                                                    }`} />
                                                <p className="font-semibold text-gray-800 text-sm">{booking.course}</p>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">
                                                with {booking.mentor?.name || "Mentor"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(booking.scheduledDate).toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                })} • {booking.startTime}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm text-center py-4">No upcoming sessions</p>
                            )}
                        </div>
                    </div>

                    {/* Find Mentors CTA */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                        <h3 className="font-bold text-purple-800 mb-2">🔍 Find a Mentor</h3>
                        <p className="text-sm text-purple-600 mb-4">Connect with top GIKI mentors</p>
                        <Link
                            href="/mentors"
                            className="block w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-opacity-90 transition-all text-center"
                        >
                            Browse Mentors
                        </Link>
                    </div>

                    {/* SOS Alert CTA */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                        <h3 className="font-bold text-red-800 mb-2">🆘 Need Urgent Help?</h3>
                        <p className="text-sm text-red-600 mb-4">Send an SOS alert to available mentors</p>
                        <Link
                            href="/mentors"
                            className="block w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-opacity-90 transition-all text-center"
                        >
                            Send SOS Alert
                        </Link>
                    </div>
                </div>
            </div>

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
