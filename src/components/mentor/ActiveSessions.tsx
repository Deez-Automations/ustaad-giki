"use client";

import { Calendar, Clock, User, Video } from "lucide-react";

interface Session {
    id: string;
    studentName: string;
    course: string;
    startTime: string;
    duration: number;
    status: "upcoming" | "in-progress" | "completed";
    isEmergency?: boolean;
}

interface ActiveSessionsProps {
    sessions: Session[];
}

export default function ActiveSessions({ sessions }: ActiveSessionsProps) {
    const upcomingSessions = sessions.filter(s => s.status === "upcoming");
    const inProgressSessions = sessions.filter(s => s.status === "in-progress");

    if (sessions.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No active sessions</p>
                <p className="text-sm text-gray-500 mt-1">Sessions will appear here when students book you</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-giki-blue" />
                Active & Upcoming Sessions ({sessions.length})
            </h3>

            <div className="space-y-3">
                {inProgressSessions.map((session) => (
                    <div
                        key={session.id}
                        className="border-2 border-green-500 bg-green-50 rounded-xl p-4 animate-pulse"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                                        IN PROGRESS
                                    </span>
                                    {session.isEmergency && (
                                        <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                                            🚨 SOS
                                        </span>
                                    )}
                                </div>
                                <p className="font-semibold text-gray-900">{session.course}</p>
                                <p className="text-sm text-gray-600">Student: {session.studentName}</p>
                            </div>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2">
                                <Video className="w-4 h-4" />
                                <span>Join Session</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {session.duration} min
                            </div>
                        </div>
                    </div>
                ))}

                {upcomingSessions.map((session) => (
                    <div
                        key={session.id}
                        className="border border-gray-200 bg-gray-50 rounded-xl p-4 hover:border-giki-blue transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                        UPCOMING
                                    </span>
                                    {session.isEmergency && (
                                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                            🚨 SOS 2x
                                        </span>
                                    )}
                                </div>
                                <p className="font-semibold text-gray-900">{session.course}</p>
                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                    <User className="w-3 h-3 mr-1" />
                                    {session.studentName}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{session.startTime}</p>
                                <p className="text-xs text-gray-500 flex items-center justify-end mt-1">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {session.duration} min
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
