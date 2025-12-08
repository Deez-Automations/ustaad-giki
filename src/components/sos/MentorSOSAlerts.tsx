"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Clock, Check, X } from "lucide-react";
import { acceptSOSAlert } from "@/actions/sos-actions";

interface SOSAlert {
    id: string;
    course: string;
    urgency: string;
    timeLeft: number;
    description: string;
    status: string;
    acceptedById: string | null;
    doubleRate: boolean;
    expiresAt?: Date | null;
    createdAt: Date;
    student: {
        name: string | null;
        profile: {
            rollNumber: string;
            batch: string;
        } | null;
    };
}

interface MentorSOSAlertsProps {
    initialAlerts: SOSAlert[];
    hourlyRate: number;
}

export default function MentorSOSAlerts({ initialAlerts, hourlyRate }: MentorSOSAlertsProps) {
    const [alerts, setAlerts] = useState(initialAlerts);
    const [accepting, setAccepting] = useState<string | null>(null);

    const urgencyColors: Record<string, string> = {
        Critical: "border-red-500 bg-red-50",
        High: "border-orange-500 bg-orange-50",
        Medium: "border-yellow-500 bg-yellow-50",
    };

    const handleAccept = async (alertId: string) => {
        setAccepting(alertId);
        const result = await acceptSOSAlert(alertId);

        if (result.success) {
            // Remove from list
            setAlerts(alerts.filter(a => a.id !== alertId));
        }
        setAccepting(null);
    };

    if (alerts.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
                <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No pending SOS alerts</p>
                <p className="text-sm text-gray-500 mt-1">You'll be notified when students need urgent help</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                Emergency SOS Alerts ({alerts.length})
            </h3>

            {alerts.map((alert) => {
                const doublePrice = hourlyRate * 2;
                const timeSinceCreated = Math.floor((new Date().getTime() - new Date(alert.createdAt).getTime()) / 60000);

                return (
                    <div
                        key={alert.id}
                        className={`border-2 rounded-xl p-5 ${urgencyColors[alert.urgency] || "border-gray-300 bg-gray-50"}`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert.urgency === "Critical"
                                        ? "bg-red-600 text-white"
                                        : alert.urgency === "High"
                                            ? "bg-orange-600 text-white"
                                            : "bg-yellow-600 text-white"
                                        }`}>
                                        {alert.urgency}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-700">{alert.course}</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Student: {alert.student.name} • {alert.student.profile?.batch}
                                </p>
                            </div>

                            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                                <Clock className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-bold text-orange-600">{alert.timeLeft} min left</span>
                            </div>
                        </div>

                        <p className="text-gray-800 mb-4 text-sm">{alert.description}</p>

                        <div className="flex justify-between items-center">
                            <div className="text-sm">
                                <span className="text-gray-600">Emergency Rate: </span>
                                <span className="text-green-600 font-bold text-lg">PKR {doublePrice}</span>
                                <span className="text-xs text-gray-500 ml-1">(2x your rate)</span>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleAccept(alert.id)}
                                    disabled={accepting === alert.id}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50 flex items-center space-x-2"
                                >
                                    {accepting === alert.id ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Accepting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span>Accept & Help</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                            Posted {timeSinceCreated} minutes ago
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
