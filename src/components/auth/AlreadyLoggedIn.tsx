"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface AlreadyLoggedInProps {
    userName: string;
    currentRole: string;
    targetRole: "STUDENT" | "MENTOR";
    dashboardLink: string;
}

export default function AlreadyLoggedIn({ userName, currentRole, targetRole, dashboardLink }: AlreadyLoggedInProps) {
    const handleSignOut = async () => {
        await signOut({ callbackUrl: targetRole === "MENTOR" ? "/auth/mentor-register" : "/auth/register" });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-giki-blue/5 via-white to-giki-gold/5 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">👋</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Hey {userName}!
                </h2>

                <p className="text-gray-600 mb-6">
                    You're already logged in as a <strong className="text-giki-blue">{currentRole}</strong>.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                        Want to register as a {targetRole.toLowerCase()}?
                    </p>
                    <p className="text-sm text-blue-700">
                        You'll need to sign out first and create a new account, or use a different email address.
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        href={dashboardLink}
                        className="block w-full px-6 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                        Go to My Dashboard
                    </Link>

                    <button
                        onClick={handleSignOut}
                        className="w-full px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center space-x-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out & Register as {targetRole === "MENTOR" ? "Mentor" : "Student"}</span>
                    </button>

                    <Link
                        href="/"
                        className="block text-sm text-gray-500 hover:text-gray-700 mt-4"
                    >
                        ← Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
