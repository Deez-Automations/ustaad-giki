import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as React from "react";

// Client component wrapper for motion
import { NavbarMotion } from "./NavbarMotion";

export default async function Navbar() {
    const session = await auth();

    // Determine dashboard path based on user role
    const dashboardPath = (session?.user as any)?.role === "MENTOR" ? "/mentor" : "/student";

    return (
        <NavbarMotion>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-giki-blue rounded-lg flex items-center justify-center">
                            <span className="text-giki-gold font-bold text-xl">U</span>
                        </div>
                        <span className="font-bold text-giki-blue text-lg tracking-tight">USTAAD GIKI</span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-4 md:gap-8">
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/mentors" className="text-gray-600 hover:text-giki-blue transition-colors font-medium">Find a Mentor</Link>
                            <Link href="/about" className="text-gray-600 hover:text-giki-blue transition-colors font-medium">How it Works</Link>
                        </div>

                        {session ? (
                            <Link href={dashboardPath}>
                                <Button className="bg-giki-blue hover:bg-giki-blue/90 text-white rounded-full px-6">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/auth/login">
                                <Button variant="outline" className="border-giki-blue text-giki-blue hover:bg-giki-blue hover:text-white rounded-full px-6 transition-all">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </NavbarMotion>
    );
}
