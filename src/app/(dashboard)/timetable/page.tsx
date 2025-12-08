import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTimeSlots, saveExtractedTimeSlots } from "@/actions/timetable-actions";
import TimetableClient from "./TimetableClient";

export default async function TimetablePage() {
    const session = await auth();
    if (!session) redirect("/auth/login");

    const result = await getTimeSlots();
    const timeSlots = result.timeSlots || [];

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-giki-blue mb-2">My Timetable</h1>
                <p className="text-gray-600">
                    Upload your timetable or build it manually using our interactive calendar
                </p>
            </div>

            <TimetableClient initialTimeSlots={timeSlots} />
        </div>
    );
}
