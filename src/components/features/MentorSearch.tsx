"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, Video, Clock } from "lucide-react";
import { Button } from "@/components/ui/button"; // We'll create this or use standard

// Mock Data
const COURSES = ["CS101", "CS201", "EE202", "MATH101", "HUM103"];
const MENTORS = [
    {
        id: 1,
        name: "Ali Khan",
        year: "Senior",
        major: "Computer Science",
        courses: ["CS101", "CS201"],
        rating: 4.9,
        reviews: 124,
        hourlyRate: 500,
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    },
    {
        id: 2,
        name: "Sara Ahmed",
        year: "Junior",
        major: "Electrical Engineering",
        courses: ["EE202", "MATH101"],
        rating: 4.8,
        reviews: 89,
        hourlyRate: 450,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
        id: 3,
        name: "Bilal Zafar",
        year: "Senior",
        major: "Management Sciences",
        courses: ["HUM103"],
        rating: 5.0,
        reviews: 42,
        hourlyRate: 600,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
];

export default function MentorSearch() {
    const [selectedCourse, setSelectedCourse] = useState("All");

    const filteredMentors = selectedCourse === "All"
        ? MENTORS
        : MENTORS.filter(m => m.courses.includes(selectedCourse));

    return (
        <section className="py-20 px-4 bg-apple-gray">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-giki-blue mb-4">Find Your Course Mentor</h2>
                    <p className="text-gray-600">Verified seniors who have aced the exact courses you're taking.</p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    <button
                        onClick={() => setSelectedCourse("All")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCourse === "All" ? "bg-giki-blue text-white shadow-lg" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                    >
                        All Courses
                    </button>
                    {COURSES.map(course => (
                        <button
                            key={course}
                            onClick={() => setSelectedCourse(course)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCourse === course ? "bg-giki-blue text-white shadow-lg" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                        >
                            {course}
                        </button>
                    ))}
                </div>

                {/* Mentor Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMentors.map((mentor) => (
                        <motion.div
                            key={mentor.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-xl transition-all border border-gray-100"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <img src={mentor.image} alt={mentor.name} className="w-16 h-16 rounded-full object-cover border-2 border-giki-gold/20" />
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{mentor.name}</h3>
                                    <p className="text-sm text-giki-blue font-medium">{mentor.major}</p>
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-bold">{mentor.rating}</span>
                                        <span className="text-gray-400">({mentor.reviews})</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {mentor.courses.map(c => (
                                    <span key={c} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md font-medium">
                                        {c}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500">Starting at</p>
                                    <p className="font-bold text-giki-blue">Rs. {mentor.hourlyRate}<span className="text-xs font-normal text-gray-400">/hr</span></p>
                                </div>
                                <button className="px-4 py-2 bg-giki-blue text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors">
                                    Book Trial
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
