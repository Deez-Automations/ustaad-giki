"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20">
            {/* Simple static background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="z-10 max-w-5xl mx-auto"
            >
                {/* Animated badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-gradient-to-r from-giki-blue/10 to-blue-400/10 border border-giki-blue/20 text-giki-blue text-sm font-semibold tracking-wider backdrop-blur-sm">
                        <Sparkles className="w-4 h-4" />
                        EXCLUSIVE FOR GIKI STUDENTS
                        <Sparkles className="w-4 h-4" />
                    </span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-giki-blue via-blue-600 to-blue-400 mb-6 tracking-tight leading-tight"
                >
                    USTAAD GIKI
                </motion.h1>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-3xl md:text-4xl font-bold text-gray-700 mb-6"
                >
                    Master Your Courses with{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-giki-blue to-blue-500">
                        Peer Mentorship
                    </span>
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
                >
                    Quiz ho, lab ho ya mid, <span className="font-semibold text-giki-blue">Ustaad's got you.</span>
                    <br />
                    Connect with top-rated seniors, sync schedules, ace your semester.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <Link href="/mentors">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,33,71,0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-10 py-5 bg-gradient-to-r from-giki-blue to-blue-700 text-white rounded-full font-bold text-lg shadow-2xl overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Find a Mentor
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-giki-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    </Link>

                    <Link href="/auth/register">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 bg-white text-giki-blue border-2 border-giki-blue rounded-full font-bold text-lg shadow-xl hover:bg-blue-50 transition-all"
                        >
                            Join as Student
                        </motion.button>
                    </Link>

                    <Link href="/auth/mentor-register">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,33,71,0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full font-bold text-lg shadow-2xl flex items-center gap-2"
                        >
                            <span>Become a Mentor</span>
                            <span className="text-2xl">🎓</span>
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Stats section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                >
                    <div className="text-center">
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-giki-blue to-blue-600">50+</div>
                        <div className="text-sm text-gray-600 mt-1">Expert Mentors</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">10min</div>
                        <div className="text-sm text-gray-600 mt-1">Avg Response</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">98%</div>
                        <div className="text-sm text-gray-600 mt-1">Success Rate</div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2 text-gray-400"
                >
                    <span className="text-xs font-medium">Scroll to explore</span>
                    <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-3 bg-gray-400 rounded-full mt-2"
                        />
                    </div>
                </motion.div>
            </motion.div>

            {/* CSS for grid pattern */}
            <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(0, 33, 71, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 33, 71, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
        </section>
    );
}
