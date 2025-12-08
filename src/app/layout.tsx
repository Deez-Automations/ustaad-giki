import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "USTAAD GIKI",
    description: "Smart Campus-Based Learning Platform for GIKI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(inter.variable, "antialiased bg-background text-foreground min-h-screen")}>
                {children}
            </body>
        </html>
    );
}
