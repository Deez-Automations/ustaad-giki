"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileCompletionProps {
    completionPercentage: number;
    missingFields: string[];
}

export default function ProfileCompletion({ completionPercentage, missingFields }: ProfileCompletionProps) {
    const isComplete = completionPercentage === 100;

    return (
        <div className={`rounded-2xl p-6 border-2 ${isComplete
                ? "bg-green-50 border-green-300"
                : "bg-yellow-50 border-yellow-300"
            }`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Profile Completion</h3>
                {isComplete ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-bold text-gray-800">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ${isComplete ? "bg-green-500" : "bg-yellow-500"
                            }`}
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>
            </div>

            {isComplete ? (
                <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-green-600 font-medium">🎉 Profile Complete!</p>
                    <p className="text-sm text-gray-600 mt-1">Your profile is visible to students</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg p-4">
                    <p className="font-medium text-gray-800 mb-2">Complete your profile:</p>
                    <ul className="space-y-1">
                        {missingFields.map((field) => (
                            <li key={field} className="text-sm text-gray-600 flex items-center">
                                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                                {field}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
