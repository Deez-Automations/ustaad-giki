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
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState("");
    const router = useRouter();

    const handleExtracted = (slots: ExtractedTimeSlot[]) => {
        setExtractedSlots(slots as TimeSlotData[]);
        setMode("calendar");
    };

    const handleSave = async (timeSlots: TimeSlotData[]) => {
        setIsSaving(true);
        setSaveError("");
        const result = await saveExtractedTimeSlots(timeSlots);

        if (result.error) {
            setSaveError(result.error);
            setIsSaving(false);
        } else {
            setSaveSuccess(true);
            // Redirect to dashboard after short delay
            setTimeout(() => {
                router.push("/student");
                router.refresh();
            }, 1500);
        }
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
                {saveError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        Failed to save timetable: {saveError}
                    </div>
                )}
                {mode === "upload" ? (
                    <TimetableUpload onExtracted={handleExtracted} />
                ) : (
                    <CalendarBuilder
                        initialTimeSlots={currentSlots}
                        onSave={handleSave}
                    />
                )}
            </div>

            {/* Saving/Success Overlay */}
            {(isSaving || saveSuccess) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 text-center">
                        {saveSuccess ? (
                            <>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-xl font-bold text-gray-800 mb-2">Timetable Saved!</p>
                                <p className="text-gray-600">Redirecting to dashboard...</p>
                            </>
                        ) : (
                            <>
                                <div className="animate-spin w-10 h-10 border-4 border-giki-blue border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-700 font-medium">Saving timetable...</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
