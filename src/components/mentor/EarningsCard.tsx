"use client";

import { TrendingUp, DollarSign, Clock } from "lucide-react";

interface EarningsCardProps {
    totalEarnings: number;
    monthlyEarnings: number;
    pendingPayments: number;
}

export default function EarningsCard({ totalEarnings, monthlyEarnings, pendingPayments }: EarningsCardProps) {
    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Earnings Overview</h3>
                <TrendingUp className="w-6 h-6 text-green-600" />
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                    <p className="text-3xl font-bold text-green-600">PKR {totalEarnings.toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <p className="text-xs text-gray-600">This Month</p>
                        </div>
                        <p className="text-lg font-bold text-gray-800">PKR {monthlyEarnings.toLocaleString()}</p>
                    </div>

                    <div className="bg-white rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <p className="text-xs text-gray-600">Pending</p>
                        </div>
                        <p className="text-lg font-bold text-gray-800">PKR {pendingPayments.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Calendar({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}
