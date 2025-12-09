"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Calendar, BookOpen, Loader2, Check, AlertCircle } from "lucide-react";
import { findAvailableSlots, createBooking } from "@/actions/booking-actions";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentor: {
        id: string;
        name: string;
        hourlyRate: number;
        subjects: string[];
    };
}

interface AvailableSlot {
    startTime: string;
    endTime: string;
}

interface DaySlots {
    day: string;
    slots: AvailableSlot[];
}

export default function BookingModal({ isOpen, onClose, mentor }: BookingModalProps) {
    const [step, setStep] = useState<"loading" | "select" | "confirm" | "success" | "no-slots">("loading");
    const [availableSlots, setAvailableSlots] = useState<DaySlots[]>([]);
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string>("");
    const [topic, setTopic] = useState("");
    const [notes, setNotes] = useState("");
    const [sessionDuration, setSessionDuration] = useState(60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [studentHasTimetable, setStudentHasTimetable] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadAvailableSlots();
        }
    }, [isOpen, mentor.id, sessionDuration]);

    const loadAvailableSlots = async () => {
        setStep("loading");
        setError("");

        const result = await findAvailableSlots(mentor.id, sessionDuration);

        if (result.error) {
            setError(result.error);
            setStep("no-slots");
            return;
        }

        if (!result.studentHasTimetable) {
            setStudentHasTimetable(false);
        }

        if (result.availableSlots && result.availableSlots.length > 0) {
            setAvailableSlots(result.availableSlots);
            setSelectedDay(result.availableSlots[0].day);
            setStep("select");
        } else {
            setStep("no-slots");
        }
    };

    const handleBooking = async () => {
        if (!selectedSlot || !selectedCourse) {
            setError("Please select a time slot and course");
            return;
        }

        setIsSubmitting(true);
        setError("");

        // Calculate scheduled date (next occurrence of selected day)
        const today = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const targetDay = days.indexOf(selectedDay);
        const currentDay = today.getDay();
        const daysUntil = (targetDay - currentDay + 7) % 7 || 7;
        const scheduledDate = new Date(today);
        scheduledDate.setDate(today.getDate() + daysUntil);

        const result = await createBooking({
            mentorId: mentor.id,
            course: selectedCourse,
            topic: topic || undefined,
            scheduledDate: scheduledDate.toISOString().split("T")[0],
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            notes: notes || undefined,
        });

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else {
            setStep("success");
        }
    };

    const resetAndClose = () => {
        setStep("loading");
        setSelectedDay("");
        setSelectedSlot(null);
        setSelectedCourse("");
        setTopic("");
        setNotes("");
        setError("");
        onClose();
    };

    // Calculate price
    const price = selectedSlot
        ? (parseInt(selectedSlot.endTime.split(":")[0]) * 60 + parseInt(selectedSlot.endTime.split(":")[1])
            - parseInt(selectedSlot.startTime.split(":")[0]) * 60 - parseInt(selectedSlot.startTime.split(":")[1]))
        / 60 * mentor.hourlyRate
        : 0;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={resetAndClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Book a Session</h2>
                            <p className="text-sm text-gray-600">with {mentor.name}</p>
                        </div>
                        <button
                            onClick={resetAndClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Loading State */}
                        {step === "loading" && (
                            <div className="text-center py-12">
                                <Loader2 className="w-12 h-12 text-giki-blue animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Finding available time slots...</p>
                                <p className="text-sm text-gray-500 mt-2">Comparing your timetable with mentor&apos;s schedule</p>
                            </div>
                        )}

                        {/* No Slots Available */}
                        {step === "no-slots" && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-8 h-8 text-orange-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">No Available Slots</h3>
                                {!studentHasTimetable ? (
                                    <>
                                        <p className="text-gray-600 mb-4">You haven&apos;t set up your timetable yet.</p>
                                        <a
                                            href="/timetable"
                                            className="inline-block px-6 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90"
                                        >
                                            Set Up Timetable
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-600 mb-4">
                                            No matching free time slots found between your schedule and the mentor&apos;s availability.
                                        </p>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Try adjusting your timetable or check back later.
                                        </p>
                                        <div className="flex gap-3 justify-center">
                                            <a
                                                href="/timetable"
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                                            >
                                                Edit Timetable
                                            </a>
                                            <button
                                                onClick={resetAndClose}
                                                className="px-4 py-2 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Select Time Slot */}
                        {step === "select" && (
                            <div className="space-y-6">
                                {/* Session Duration */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 inline mr-2" />
                                        Session Duration
                                    </label>
                                    <div className="flex gap-2">
                                        {[30, 60, 90, 120].map((mins) => (
                                            <button
                                                key={mins}
                                                onClick={() => setSessionDuration(mins)}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${sessionDuration === mins
                                                        ? "bg-giki-blue text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {mins} min
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Day Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Select Day
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {availableSlots.map((daySlots) => (
                                            <button
                                                key={daySlots.day}
                                                onClick={() => {
                                                    setSelectedDay(daySlots.day);
                                                    setSelectedSlot(null);
                                                }}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedDay === daySlots.day
                                                        ? "bg-giki-blue text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {daySlots.day}
                                                <span className="ml-1 text-xs opacity-75">
                                                    ({daySlots.slots.length})
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Slot Selection */}
                                {selectedDay && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Select Time Slot
                                        </label>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                                            {availableSlots
                                                .find((d) => d.day === selectedDay)
                                                ?.slots.map((slot, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedSlot?.startTime === slot.startTime
                                                                ? "bg-green-500 text-white"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        {slot.startTime} - {slot.endTime}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Course Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <BookOpen className="w-4 h-4 inline mr-2" />
                                        Select Course
                                    </label>
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                    >
                                        <option value="">Choose a course...</option>
                                        {mentor.subjects.map((subject) => (
                                            <option key={subject} value={subject}>
                                                {subject}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Topic (Optional) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Topic (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g., Chapter 5 - Data Structures"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                    />
                                </div>

                                {/* Notes (Optional) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Notes for Mentor (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any specific questions or topics you'd like to cover..."
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Price Summary */}
                                {selectedSlot && (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-green-700">Session Cost</p>
                                                <p className="text-2xl font-bold text-green-800">
                                                    PKR {price.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right text-sm text-green-700">
                                                <p>{selectedDay}</p>
                                                <p className="font-semibold">
                                                    {selectedSlot.startTime} - {selectedSlot.endTime}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={resetAndClose}
                                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleBooking}
                                        disabled={!selectedSlot || !selectedCourse || isSubmitting}
                                        className="flex-1 px-6 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Booking...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Confirm Booking
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Success State */}
                        {step === "success" && (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Requested!</h3>
                                <p className="text-gray-600 mb-6">
                                    Your booking request has been sent to {mentor.name}.<br />
                                    You&apos;ll be notified once they confirm.
                                </p>
                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-gray-600">
                                        <strong>{selectedDay}</strong> • {selectedSlot?.startTime} - {selectedSlot?.endTime}<br />
                                        <strong>{selectedCourse}</strong>
                                    </p>
                                </div>
                                <button
                                    onClick={resetAndClose}
                                    className="px-8 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
