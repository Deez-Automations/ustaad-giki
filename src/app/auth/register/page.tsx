import RegisterWizard from "@/components/auth/RegisterWizard";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    const session = await auth();

    // If already logged in, redirect
    if (session && session.user) {
        if (session.user.role === "STUDENT") {
            redirect("/student");
        } else {
            redirect("/mentor");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-giki-blue mb-2">Join USTAAD GIKI</h1>
                <p className="text-gray-600">The premium peer learning network for GIKIans.</p>
            </div>

            <RegisterWizard />

            <p className="mt-6 text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-giki-blue font-medium hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
