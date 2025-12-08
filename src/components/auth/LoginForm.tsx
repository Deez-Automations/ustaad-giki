"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
            } else {
                // Fetch the session to determine user role
                const sessionRes = await fetch("/api/auth/session");
                const session = await sessionRes.json();

                // Redirect based on role
                if (session?.user?.role === "MENTOR") {
                    router.push("/mentor");
                } else {
                    router.push("/student");
                }
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GIKI Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-giki-blue outline-none"
                    placeholder="u2021xxx@giki.edu.pk"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-giki-blue outline-none"
                    placeholder="••••••••"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-giki-blue text-white rounded-lg font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign In
            </button>
        </form>
    );
}
