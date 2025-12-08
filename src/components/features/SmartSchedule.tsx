"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2 } from "lucide-react";

export default function SmartSchedule() {
    return (
        <section className="py-20 px-4 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">

                {/* Text Content */}
                <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-6">
                        <Calendar className="w-4 h-4" />
                        SYNCED WITH GIKI TIMETABLE
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-giki-blue mb-6">
                        No more &quot;Free ho?&quot; texts. <br />
                        <span className="text-giki-gold">Smart Scheduling is here.</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        USTAAD automatically syncs with your GIKI course schedule. It finds the perfect time when both you and your mentor are free—avoiding GP slots, labs, and society events.
                    </p>

                    <ul className="space-y-4">
                        {[
                            "Auto-detects free slots",
                            "Avoids prayer & lunch breaks",
                            "Syncs with Google Calendar"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                <CheckCircle2 className="w-5 h-5 text-giki-blue" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Visual Demo */}
                <div className="lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-giki-blue/5 to-giki-gold/5 rounded-3xl transform rotate-3 scale-105" />
                    <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="font-bold text-gray-800">Wednesday, 20th Nov</h3>
                            <span className="text-xs text-gray-500">CS101 Mentorship</span>
                        </div>

                        <div className="space-y-3">
                            {/* Busy Slot */}
                            <div className="flex items-center gap-4 opacity-50">
                                <span className="text-xs font-mono text-gray-400 w-12">09:00</span>
                                <div className="flex-1 h-10 bg-red-50 border border-red-100 rounded-lg flex items-center px-3 text-xs text-red-400">
                                    Busy: CS101 Lecture
                                </div>
                            </div>

                            {/* Busy Slot */}
                            <div className="flex items-center gap-4 opacity-50">
                                <span className="text-xs font-mono text-gray-400 w-12">10:00</span>
                                <div className="flex-1 h-10 bg-red-50 border border-red-100 rounded-lg flex items-center px-3 text-xs text-red-400">
                                    Busy: Lab
                                </div>
                            </div>

                            {/* Free Slot (Highlighted) */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                                className="flex items-center gap-4"
                            >
                                <span className="text-xs font-mono text-giki-blue font-bold w-12">11:00</span>
                                <div className="flex-1 h-12 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between px-4 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-sm font-bold text-green-700">Perfect Match!</span>
                                    </div>
                                    <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-md font-medium">Book</button>
                                </div>
                            </motion.div>

                            {/* Busy Slot */}
                            <div className="flex items-center gap-4 opacity-50">
                                <span className="text-xs font-mono text-gray-400 w-12">12:00</span>
                                <div className="flex-1 h-10 bg-red-50 border border-red-100 rounded-lg flex items-center px-3 text-xs text-red-400">
                                    Busy: Lunch Break
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
