import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentDashboard() {
    const session = await auth();

    if (!session) redirect("/auth/login");

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
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
                    <p className="text-3xl font-bold text-giki-blue">0</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-500 mb-2">Wallet Balance</h3>
                    <p className="text-3xl font-bold text-giki-gold">PKR 0</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-500 mb-2">Active Requests</h3>
                    <p className="text-3xl font-bold text-giki-blue">0</p>
                </div>
            </div>

            {/* Timetable Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-giki-blue/10 to-giki-gold/10 rounded-2xl border border-giki-blue/20">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-giki-blue">My Timetable</h2>
                        <p className="text-sm text-gray-600">Manage your class schedule</p>
                    </div>
                    <Link href="/timetable" className="px-6 py-2 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-all">
                        Manage Timetable
                    </Link>
                </div>
                <p className="text-gray-600 text-sm">
                    Upload your GIKI timetable or build it manually. Our smart system will extract your schedule automatically.
                </p>
            </div>

            {/* Placeholder for future features */}
            <div className="mt-8 p-12 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                Search & Scheduling Engine Coming Soon...
            </div>
        </div>
    );
}
