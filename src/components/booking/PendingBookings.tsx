"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/actions/booking-actions";
import { useRouter } from "next/navigation";

interface Booking {
    id: string;
    course: string;
    topic?: string | null;
    scheduledDate: Date | string;
    startTime: string;
    endTime: string;
    totalAmount: number;
    student?: {
        name: string | null;
    };
}

interface PendingBookingsProps {
    bookings: Booking[];
}

export default function PendingBookings({ bookings }: PendingBookingsProps) {
    const [processing, setProcessing] = useState<string | null>(null);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleAccept = async (bookingId: string) => {
        setProcessing(bookingId);
        setError("");

        const result = await updateBookingStatus(bookingId, "CONFIRMED");

        if (result.error) {
            setError(result.error);
        } else {
            router.refresh();
        }
        setProcessing(null);
    };

    const handleDecline = async (bookingId: string) => {
        setProcessing(bookingId);
        setError("");

        const result = await updateBookingStatus(bookingId, "CANCELLED", "Declined by mentor");

        if (result.error) {
            setError(result.error);
        } else {
            router.refresh();
        }
        setProcessing(null);
    };

    if (bookings.length === 0) return null;

    return (
        <div className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">
                📬 Pending Booking Requests ({bookings.length})
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className={`flex items-center justify-between bg-white p-4 rounded-xl border border-yellow-100 transition-opacity ${processing === booking.id ? "opacity-50" : ""
                            }`}
                    >
                        <div>
                            <p className="font-semibold text-gray-800">
                                {booking.student?.name || "Student"}
                            </p>
                            <p className="text-sm text-gray-600">
                                {booking.course} • {booking.topic || "General session"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(booking.scheduledDate).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                })} • {booking.startTime} - {booking.endTime}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-green-600">
                                PKR {booking.totalAmount?.toLocaleString()}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleAccept(booking.id)}
                                    disabled={processing !== null}
                                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {processing === booking.id ? "..." : "Accept"}
                                </button>
                                <button
                                    onClick={() => handleDecline(booking.id)}
                                    disabled={processing !== null}
                                    className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
