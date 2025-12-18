"use client";

import { useState } from "react";

interface TimeSlot {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    title: string;
    location?: string | null;
    color: string;
    isClass?: boolean;
}

interface BookingEvent {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    title: string;
    studentName?: string;
    mentorName?: string;
    status: string;
    course: string;
    topic?: string | null;
}

interface TimetableDisplayProps {
    timeSlots: TimeSlot[];
    confirmedBookings?: BookingEvent[];
    showAllDays?: boolean;
    compact?: boolean;
}

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function TimetableDisplay({
    timeSlots,
    confirmedBookings = [],
    showAllDays = true,
    compact = false
}: TimetableDisplayProps) {
    const [selectedEvent, setSelectedEvent] = useState<(TimeSlot | BookingEvent) | null>(null);

    const days = showAllDays ? ALL_DAYS : WEEKDAYS;

    // Get time slot at specific day and time
    const getSlotAt = (day: string, hour: string) => {
        return timeSlots.find(slot => {
            if (slot.day !== day) return false;
            const slotStart = parseInt(slot.startTime.split(":")[0]);
            const slotEnd = parseInt(slot.endTime.split(":")[0]);
            const checkHour = parseInt(hour.split(":")[0]);
            return checkHour >= slotStart && checkHour < slotEnd;
        });
    };

    // Get booking at specific day and time
    const getBookingAt = (day: string, hour: string) => {
        return confirmedBookings.find(booking => {
            if (booking.day !== day) return false;
            const bookingStart = parseInt(booking.startTime.split(":")[0]);
            const bookingEnd = parseInt(booking.endTime.split(":")[0]);
            const checkHour = parseInt(hour.split(":")[0]);
            return checkHour >= bookingStart && checkHour < bookingEnd;
        });
    };

    // Check if this is the start of a slot
    const isSlotStart = (slot: TimeSlot, hour: string) => {
        return slot.startTime.startsWith(hour.split(":")[0]);
    };

    const isBookingStart = (booking: BookingEvent, hour: string) => {
        return booking.startTime.startsWith(hour.split(":")[0]);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-giki-blue to-blue-600">
                <h3 className="text-lg font-bold text-white">📅 Weekly Schedule</h3>
                <p className="text-blue-100 text-sm">Your classes and confirmed sessions</p>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
                <div className={`grid ${showAllDays ? 'grid-cols-8' : 'grid-cols-6'} min-w-[700px]`}>
                    {/* Header Row */}
                    <div className="p-2 bg-gray-50 font-semibold text-gray-600 text-center text-xs border-r border-b border-gray-200">
                        Time
                    </div>
                    {days.map(day => (
                        <div key={day} className="p-2 bg-gray-50 font-semibold text-gray-700 text-center text-xs border-r last:border-r-0 border-b border-gray-200">
                            {day.substring(0, 3)}
                        </div>
                    ))}

                    {/* Time Rows */}
                    {HOURS.map(hour => (
                        <>
                            <div key={`time-${hour}`} className="p-2 text-xs font-mono text-gray-500 text-center border-r border-b border-gray-100 bg-gray-50">
                                {hour}
                            </div>
                            {days.map(day => {
                                const slot = getSlotAt(day, hour);
                                const booking = getBookingAt(day, hour);
                                const isStartSlot = slot && isSlotStart(slot, hour);
                                const isStartBooking = booking && isBookingStart(booking, hour);

                                return (
                                    <div
                                        key={`${day}-${hour}`}
                                        className={`p-1 border-r last:border-r-0 border-b border-gray-100 min-h-[${compact ? '40' : '50'}px] relative`}
                                    >
                                        {/* Class/TimeSlot */}
                                        {isStartSlot && slot && (
                                            <div
                                                className="absolute inset-0 m-0.5 rounded p-1 text-white text-xs cursor-pointer hover:opacity-90 transition-opacity z-10"
                                                style={{ backgroundColor: slot.color || "#3b82f6" }}
                                                onClick={() => setSelectedEvent(slot)}
                                            >
                                                <div className="font-semibold truncate">{slot.title}</div>
                                                {!compact && slot.location && (
                                                    <div className="text-white/70 truncate text-[10px]">{slot.location}</div>
                                                )}
                                            </div>
                                        )}

                                        {/* Confirmed Booking */}
                                        {isStartBooking && booking && !slot && (
                                            <div
                                                className="absolute inset-0 m-0.5 rounded p-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs cursor-pointer hover:opacity-90 transition-opacity z-10"
                                                onClick={() => setSelectedEvent(booking)}
                                            >
                                                <div className="font-semibold truncate">📚 {booking.course}</div>
                                                {!compact && (
                                                    <div className="text-white/80 truncate text-[10px]">
                                                        {booking.studentName || booking.mentorName}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span className="text-gray-600">Class</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-emerald-500"></div>
                    <span className="text-gray-600">Tutoring Session</span>
                </div>
            </div>

            {/* Event Details Popup */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        {'course' in selectedEvent ? (
                            // Booking details
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl">📚</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{selectedEvent.course}</h3>
                                        <p className="text-sm text-gray-500">Tutoring Session</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    {selectedEvent.topic && (
                                        <p><span className="font-medium text-gray-600">Topic:</span> {selectedEvent.topic}</p>
                                    )}
                                    <p><span className="font-medium text-gray-600">Day:</span> {selectedEvent.day}</p>
                                    <p><span className="font-medium text-gray-600">Time:</span> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                                    {selectedEvent.studentName && (
                                        <p><span className="font-medium text-gray-600">Student:</span> {selectedEvent.studentName}</p>
                                    )}
                                    {selectedEvent.mentorName && (
                                        <p><span className="font-medium text-gray-600">Mentor:</span> {selectedEvent.mentorName}</p>
                                    )}
                                    <p>
                                        <span className="font-medium text-gray-600">Status:</span>{" "}
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                            {selectedEvent.status}
                                        </span>
                                    </p>
                                </div>
                            </>
                        ) : (
                            // Class details
                            <>
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: selectedEvent.color }}
                                    >
                                        <span className="text-white text-xl">📖</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{selectedEvent.title}</h3>
                                        <p className="text-sm text-gray-500">Class</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium text-gray-600">Day:</span> {selectedEvent.day}</p>
                                    <p><span className="font-medium text-gray-600">Time:</span> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                                    {selectedEvent.location && (
                                        <p><span className="font-medium text-gray-600">Location:</span> {selectedEvent.location}</p>
                                    )}
                                </div>
                            </>
                        )}
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
