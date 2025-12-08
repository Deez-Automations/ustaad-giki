"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TimetableUpload from "@/components/timetable/TimetableUpload";
import CalendarBuilder from "@/components/timetable/CalendarBuilder";
import { ExtractedTimeSlot } from "@/lib/ocr-service";
import { TimeSlotData, saveExtractedTimeSlots } from "@/actions/timetable-actions";
import { ArrowLeft, Upload as UploadIcon, Calendar } from "lucide-react";
import Link from "next/link";

interface TimetableClientProps {
    initialTimeSlots: any[];
}

export default function TimetableClient({ initialTimeSlots }: TimetableClientProps) {
    const [mode, setMode] = useState<"upload" | "calendar">("upload");
    const [extractedSlots, setExtractedSlots] = useState<TimeSlotData[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleExtracted = (slots: ExtractedTimeSlot[]) => {
        setExtractedSlots(slots as TimeSlotData[]);
        setMode("calendar");
    };

    const handleSave = async (timeSlots: TimeSlotData[]) => {
        setIsSaving(true);
        const result = await saveExtractedTimeSlots(timeSlots);

        if (result.error) {
            alert("Failed to save timetable: " + result.error);
        } else {
            alert(`Timetable saved successfully! (${result.count} time slots)`);
            router.refresh();
        }
        setIsSaving(false);
    };

    const currentSlots = extractedSlots.length > 0 ? extractedSlots : initialTimeSlots;

    return (
        <div>
            {/* Back Button */}
            <Link
                href="/student"
                className="inline-flex items-center gap-2 text-giki-blue hover:underline mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {/* Mode Toggle */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setMode("upload")}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${mode === "upload"
                            ? "bg-giki-blue text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <UploadIcon className="w-5 h-5" />
                    Upload Timetable
                </button>
                <button
                    onClick={() => setMode("calendar")}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${mode === "calendar"
                            ? "bg-giki-blue text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Calendar className="w-5 h-5" />
                    Interactive Calendar
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                {mode === "upload" ? (
                    <TimetableUpload onExtracted={handleExtracted} />
                ) : (
                    <CalendarBuilder
                        initialTimeSlots={currentSlots}
                        onSave={handleSave}
                    />
                )}
            </div>

            {isSaving && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-giki-blue border-t-transparent rounded-full mx-auto mb-3"></div>
                        <p className="text-gray-700 font-medium">Saving timetable...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
