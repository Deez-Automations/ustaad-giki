"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, Send, X } from "lucide-react";
import { createSOSAlert } from "@/actions/sos-actions";
import { GIKI_COURSES_BY_DEPARTMENT, GIKI_DEPARTMENTS } from "@/lib/giki-courses";

interface SOSModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const URGENCY_LEVELS = [
    { value: "Critical", label: "Critical", color: "bg-red-600", mins: 30 },
    { value: "High", label: "High", color: "bg-orange-500", mins: 60 },
    { value: "Medium", label: "Medium", color: "bg-yellow-500", mins: 120 },
];

export default function SOSModal({ isOpen, onClose }: SOSModalProps) {
    const [selectedDept, setSelectedDept] = useState("");
    const [course, setCourse] = useState("");
    const [urgency, setUrgency] = useState("High");
    const [timeLeft, setTimeLeft] = useState(60);
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!course || !description) {
            setError("Please fill all fields");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const result = await createSOSAlert({
                course,
                urgency,
                timeLeft,
                description,
            });

            if (result.error) {
                setError(result.error);
            } else {
                onClose();
                // Reset form
                setCourse("");
                setDescription("");
                setTimeLeft(60);
            }
        } catch (err) {
            setError("Failed to send SOS alert");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-3xl">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-white/20 rounded-full">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Emergency SOS</h2>
                                    <p className="text-white/90 text-sm">Get urgent help from mentors</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">
                        {/* Urgency Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Urgency Level
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {URGENCY_LEVELS.map((level) => (
                                    <button
                                        key={level.value}
                                        onClick={() => {
                                            setUrgency(level.value);
                                            setTimeLeft(level.mins);
                                        }}
                                        className={`p-4 rounded-lg font-medium transition-all ${urgency === level.value
                                                ? `${level.color} text-white shadow-lg scale-105`
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {level.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Left */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time Until Quiz/Exam (minutes)
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="range"
                                    min="15"
                                    max="180"
                                    step="15"
                                    value={timeLeft}
                                    onChange={(e) => setTimeLeft(parseInt(e.target.value))}
                                    className="flex-1"
                                />
                                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                    <span className="text-xl font-bold text-blue-600">{timeLeft} min</span>
                                </div>
                            </div>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Department
                            </label>
                            <select
                                value={selectedDept}
                                onChange={(e) => {
                                    setSelectedDept(e.target.value);
                                    setCourse("");
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">Select Department</option>
                                {GIKI_DEPARTMENTS.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Course */}
                        {selectedDept && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Needing Help
                                </label>
                                <select
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">Select Course</option>
                                    {GIKI_COURSES_BY_DEPARTMENT[selectedDept as keyof typeof GIKI_COURSES_BY_DEPARTMENT]?.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What do you need help with?
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the topic/concepts you're struggling with..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Pricing Notice */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-1 flex items-center">
                                <span className="text-xl mr-2">⚡</span>
                                Emergency Pricing: 2x Rate
                            </h4>
                            <p className="text-sm text-yellow-800">
                                SOS alerts are charged at double the mentor's hourly rate due to urgency
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !course || !description}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Sending Alert...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-6 h-6" />
                                    <span>Send SOS Alert to Mentors</span>
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
