"use client";

import { TrendingUp, Users, Clock, Award } from "lucide-react";

interface MentorStatsProps {
    totalSessions: number;
    totalEarnings: number;
    averageRating: number;
    responseTime: string;
    acceptanceRate: number;
    thisWeekEarnings: number;
}

export default function MentorStats({
    totalSessions,
    totalEarnings,
    averageRating,
    responseTime,
    acceptanceRate,
    thisWeekEarnings,
}: MentorStatsProps) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Earnings */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-sm text-green-700 font-medium">Total Earnings</p>
                        <p className="text-3xl font-bold text-green-900 mt-1">PKR {totalEarnings.toLocaleString()}</p>
                        <p className="text-xs text-green-600 mt-1">+PKR {thisWeekEarnings} this week</p>
                    </div>
                    <div className="p-3 bg-green-600 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Total Sessions */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-sm text-blue-700 font-medium">Sessions Completed</p>
                        <p className="text-3xl font-bold text-blue-900 mt-1">{totalSessions}</p>
                        <p className="text-xs text-blue-600 mt-1">{acceptanceRate}% acceptance rate</p>
                    </div>
                    <div className="p-3 bg-blue-600 rounded-xl">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Average Rating */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 border border-yellow-200">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-sm text-yellow-700 font-medium">Average Rating</p>
                        <p className="text-3xl font-bold text-yellow-900 mt-1">{averageRating.toFixed(1)} ⭐</p>
                        <p className="text-xs text-yellow-600 mt-1">Top-rated mentor</p>
                    </div>
                    <div className="p-3 bg-yellow-600 rounded-xl">
                        <Award className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-sm text-purple-700 font-medium">Avg Response Time</p>
                        <p className="text-3xl font-bold text-purple-900 mt-1">{responseTime}</p>
                        <p className="text-xs text-purple-600 mt-1">Quick responder</p>
                    </div>
                    <div className="p-3 bg-purple-600 rounded-xl">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
