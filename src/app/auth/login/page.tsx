import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-giki-blue mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to continue your learning journey.</p>
            </div>

            <LoginForm />

            <p className="mt-6 text-sm text-gray-500">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-giki-blue font-medium hover:underline">
                    Register Now
                </Link>
            </p>
        </div>
    );
}
