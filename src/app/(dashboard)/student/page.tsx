import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTimeSlots } from "@/actions/timetable-actions";
import { getMyBookings } from "@/actions/booking-actions";
import DeleteAccountButton from "@/components/account/DeleteAccountButton";

// Days for the timetable display
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default async function StudentDashboard() {
    const session = await auth();

    if (!session) redirect("/auth/login");

    // Fetch time slots for the current user
    const timeSlotsResult = await getTimeSlots();
    const timeSlots = timeSlotsResult.timeSlots || [];
    const hasTimetable = timeSlots.length > 0;

    // Fetch bookings
    const bookingsResult = await getMyBookings();
    const bookings = bookingsResult.bookings || [];
    const upcomingBookings = bookings.filter((b: any) =>
        b.status === "PENDING" || b.status === "CONFIRMED"
    );

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

            <div className="grid md:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-500 mb-2">Upcoming Sessions</h3>
                    <p className="text-3xl font-bold text-giki-blue">{upcomingBookings.length}</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-500 mb-2">Wallet Balance</h3>
                    <p className="text-3xl font-bold text-giki-gold">PKR 0</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-500 mb-2">Classes Today</h3>
                    <p className="text-3xl font-bold text-giki-blue">
                        {timeSlots.filter((slot: any) => {
                            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                            return slot.day === today;
                        }).length}
                    </p>
                </div>
            </div>

            {/* Timetable Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-giki-blue/10 to-giki-gold/10 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-giki-blue">My Timetable</h2>
                            <p className="text-sm text-gray-600">
                                {hasTimetable
                                    ? `${timeSlots.length} class(es) scheduled`
                                    : "No timetable uploaded yet"
                                }
                            </p>
                        </div>
                        <Link
                            href="/timetable"
                            className="px-6 py-2 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
                        >
                            {hasTimetable ? "Edit Timetable" : "Add Timetable"}
                        </Link>
                    </div>
                </div>

                {hasTimetable ? (
                    <div className="p-4 overflow-x-auto">
                        {/* Mini Timetable View */}
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr>
                                    <th className="p-2 text-left text-xs font-semibold text-gray-500 w-20">Time</th>
                                    {DAYS.map(day => (
                                        <th key={day} className="p-2 text-center text-xs font-semibold text-gray-500">
                                            {day.slice(0, 3)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {HOURS.map(hour => (
                                    <tr key={hour} className="border-t border-gray-100">
                                        <td className="p-2 text-xs text-gray-500">{hour}</td>
                                        {DAYS.map(day => {
                                            const slot = timeSlots.find((s: any) =>
                                                s.day === day && s.startTime <= hour && s.endTime > hour
                                            );
                                            return (
                                                <td key={`${day}-${hour}`} className="p-1">
                                                    {slot && (
                                                        <div
                                                            className="px-2 py-1 rounded text-xs font-medium text-white truncate"
                                                            style={{ backgroundColor: slot.color || '#3b82f6' }}
                                                            title={`${slot.title} (${slot.location || 'No location'})`}
                                                        >
                                                            {slot.title?.slice(0, 15)}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
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

            {/* Upcoming Bookings Section */}
            {upcomingBookings.length > 0 && (
                <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-green-800">Upcoming Sessions</h2>
                        <p className="text-sm text-green-600">{upcomingBookings.length} session(s) scheduled</p>
                    </div>
                    <div className="p-4 space-y-3">
                        {upcomingBookings.slice(0, 5).map((booking: any) => (
                            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-12 rounded-full ${booking.status === "CONFIRMED" ? "bg-green-500" : "bg-yellow-500"
                                        }`} />
                                    <div>
                                        <p className="font-semibold text-gray-800">{booking.course}</p>
                                        <p className="text-sm text-gray-600">
                                            with {booking.mentor?.name || "Mentor"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(booking.scheduledDate).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                month: "short",
                                                day: "numeric",
                                            })} • {booking.startTime} - {booking.endTime}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === "CONFIRMED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {booking.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                                    </span>
                                    <p className="text-sm font-bold text-gray-800 mt-2">
                                        PKR {booking.totalAmount?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Find Mentors Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-purple-800">Find a Mentor</h2>
                        <p className="text-sm text-purple-600">Connect with top GIKI mentors for your courses</p>
                    </div>
                    <Link
                        href="/mentors"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
                    >
                        Browse Mentors
                    </Link>
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
