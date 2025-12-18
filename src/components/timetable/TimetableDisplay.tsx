"use client";

import { useState } from "react";
import React from "react";

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
}

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function TimetableDisplay({
    timeSlots,
    confirmedBookings = [],
    showAllDays = true,
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
        const slotStartHour = slot.startTime.split(":")[0];
        const checkHour = hour.split(":")[0];
        return slotStartHour === checkHour;
    };

    const isBookingStart = (booking: BookingEvent, hour: string) => {
        const bookingStartHour = booking.startTime.split(":")[0];
        const checkHour = hour.split(":")[0];
        return bookingStartHour === checkHour;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-giki-blue to-blue-600">
                <h3 className="text-lg font-bold text-white">📅 Weekly Schedule</h3>
                <p className="text-blue-100 text-sm">
                    {timeSlots.length} classes • {confirmedBookings.length} tutoring sessions
                </p>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 bg-gray-50 font-semibold text-gray-600 text-center text-sm border-r border-b border-gray-200 w-20">
                                Time
                            </th>
                            {days.map(day => (
                                <th key={day} className="p-3 bg-gray-50 font-semibold text-gray-700 text-center text-sm border-r last:border-r-0 border-b border-gray-200">
                                    {day.substring(0, 3)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {HOURS.map(hour => (
                            <tr key={hour}>
                                <td className="p-2 text-sm font-mono text-gray-500 text-center border-r border-b border-gray-100 bg-gray-50 w-20">
                                    {hour}
                                </td>
                                {days.map(day => {
                                    const slot = getSlotAt(day, hour);
                                    const booking = getBookingAt(day, hour);
                                    const isStartSlot = slot && isSlotStart(slot, hour);
                                    const isStartBooking = booking && isBookingStart(booking, hour);

                                    return (
                                        <td
                                            key={`${day}-${hour}`}
                                            className="p-1 border-r last:border-r-0 border-b border-gray-100 h-14 relative align-top"
                                        >
                                            {/* Class/TimeSlot */}
                                            {isStartSlot && slot && (
                                                <div
                                                    className="absolute inset-0 m-1 rounded-lg p-2 text-white cursor-pointer hover:opacity-90 transition-opacity z-10 overflow-hidden"
                                                    style={{ backgroundColor: slot.color || "#3b82f6" }}
                                                    onClick={() => setSelectedEvent(slot)}
                                                >
                                                    <div className="font-bold text-sm truncate">{slot.title}</div>
                                                    {slot.location && (
                                                        <div className="text-white/80 text-xs truncate">{slot.location}</div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Confirmed Booking - Show even if there's a slot conflict */}
                                            {isStartBooking && booking && (
                                                <div
                                                    className={`absolute inset-0 m-1 rounded-lg p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-pointer hover:opacity-90 transition-opacity z-20 overflow-hidden ${slot ? 'ring-2 ring-yellow-400' : ''}`}
                                                    onClick={() => setSelectedEvent(booking)}
                                                >
                                                    <div className="font-bold text-sm truncate">📚 {booking.course}</div>
                                                    <div className="text-white/90 text-xs truncate">
                                                        {booking.studentName || booking.mentorName}
                                                    </div>
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

            {/* Legend */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span className="text-gray-600">Class</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gradient-to-r from-green-500 to-emerald-500"></div>
                    <span className="text-gray-600">Tutoring Session</span>
                </div>
                {confirmedBookings.length === 0 && timeSlots.length === 0 && (
                    <span className="text-gray-400 italic">No events to display</span>
                )}
            </div>

            {/* Event Details Popup */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        {'course' in selectedEvent ? (
                            // Booking details
                            <>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-2xl">📚</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{selectedEvent.course}</h3>
                                        <p className="text-sm text-gray-500">Tutoring Session</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm bg-gray-50 rounded-xl p-4">
                                    {selectedEvent.topic && (
                                        <p><span className="font-semibold text-gray-600">Topic:</span> {selectedEvent.topic}</p>
                                    )}
                                    <p><span className="font-semibold text-gray-600">Day:</span> {selectedEvent.day}</p>
                                    <p><span className="font-semibold text-gray-600">Time:</span> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                                    {selectedEvent.studentName && (
                                        <p><span className="font-semibold text-gray-600">Student:</span> {selectedEvent.studentName}</p>
                                    )}
                                    {selectedEvent.mentorName && (
                                        <p><span className="font-semibold text-gray-600">Mentor:</span> {selectedEvent.mentorName}</p>
                                    )}
                                    <p>
                                        <span className="font-semibold text-gray-600">Status:</span>{" "}
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            {selectedEvent.status}
                                        </span>
                                    </p>
                                </div>
                            </>
                        ) : (
                            // Class details
                            <>
                                <div className="flex items-center gap-4 mb-4">
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: selectedEvent.color }}
                                    >
                                        <span className="text-white text-2xl">📖</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{selectedEvent.title}</h3>
                                        <p className="text-sm text-gray-500">Class</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm bg-gray-50 rounded-xl p-4">
                                    <p><span className="font-semibold text-gray-600">Day:</span> {selectedEvent.day}</p>
                                    <p><span className="font-semibold text-gray-600">Time:</span> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
                                    {selectedEvent.location && (
                                        <p><span className="font-semibold text-gray-600">Location:</span> {selectedEvent.location}</p>
                                    )}
                                </div>
                            </>
                        )}
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="w-full mt-4 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
