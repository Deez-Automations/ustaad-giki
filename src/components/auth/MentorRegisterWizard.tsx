"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Camera, DollarSign, BookOpen, User } from "lucide-react";
import { registerMentor } from "@/actions/mentor-register";
import { GIKI_DEPARTMENTS, GIKI_COURSES_BY_DEPARTMENT, type GIKIDepartment } from "@/lib/giki-courses";

interface FormData {
    // Step 1: GIKI Credentials
    name: string;
    email: string;
    password: string;
    rollNumber: string;
    batch: string;
    faculty: string;
    cnic: string;

    // Step 2: Department & Subjects
    department: string;
    subjects: string[];

    // Step 3: Rate & Proficiency
    hourlyRate: number;
    proficiencyLevel: string;
    acceptsSOS: boolean;

    // Step 4: Bio
    mentorBio: string;

    // Step 5: Live Photo
    livePhotoData: string;
}

const STEPS = [
    { id: 1, title: "GIKI Credentials", icon: User },
    { id: 2, title: "Expertise", icon: BookOpen },
    { id: 3, title: "Rate & Level", icon: DollarSign },
    { id: 4, title: "Bio", icon: User },
    { id: 5, title: "Verification", icon: Camera },
];

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Expert"];

export default function MentorRegisterWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        rollNumber: "",
        batch: "",
        faculty: "",
        cnic: "",
        department: "",
        subjects: [],
        hourlyRate: 500,
        proficiencyLevel: "Intermediate",
        acceptsSOS: true,
        mentorBio: "",
        livePhotoData: "",
    });

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const updateFormData = (updates: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        setError("");
        if (currentStep < 5) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setError("");
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsCameraActive(true);
            }
        } catch (err) {
            setError("Camera access denied. Please enable camera permissions.");
        }
    }, []);

    const capturePhoto = useCallback(() => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const photoData = canvas.toDataURL("image/jpeg");
                updateFormData({ livePhotoData: photoData });

                // Stop camera
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                    setIsCameraActive(false);
                }
            }
        }
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            const result = await registerMentor(formData);

            if (result.error) {
                setError(result.error);
            } else {
                window.location.href = "/mentor";
            }
        } catch (err) {
            setError("Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSubject = (subject: string) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter(s => s !== subject)
                : [...prev.subjects, subject]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-giki-blue/5 via-white to-giki-gold/5 pt-24 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        {STEPS.map((step) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div key={step.id} className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCompleted
                                            ? "bg-green-500 text-white"
                                            : isActive
                                                ? "bg-giki-blue text-white"
                                                : "bg-gray-200 text-gray-400"
                                            }`}
                                    >
                                        {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                    </div>
                                    <p className="text-xs mt-2 text-center text-gray-600">{step.title}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-giki-blue h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / 5) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    className="bg-white rounded-3xl shadow-xl p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <AnimatePresence mode="wait">
                        {/* Step 1: GIKI Credentials */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold text-giki-blue mb-4">GIKI Credentials</h2>

                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => updateFormData({ name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                />

                                <input
                                    type="email"
                                    placeholder="Email (@giki.edu.pk)"
                                    value={formData.email}
                                    onChange={(e) => updateFormData({ email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => updateFormData({ password: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Roll Number"
                                        value={formData.rollNumber}
                                        onChange={(e) => updateFormData({ rollNumber: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Batch (e.g., 2021)"
                                        value={formData.batch}
                                        onChange={(e) => updateFormData({ batch: e.target.value })}
                                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Faculty (e.g., FCS, FEE)"
                                    value={formData.faculty}
                                    onChange={(e) => updateFormData({ faculty: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                />

                                <input
                                    type="text"
                                    placeholder="CNIC (xxxxx-xxxxxxx-x)"
                                    value={formData.cnic}
                                    onChange={(e) => updateFormData({ cnic: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                />
                            </motion.div>
                        )}

                        {/* Step 2: Department & Subjects */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold text-giki-blue mb-4">Subject Expertise</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => updateFormData({ department: e.target.value, subjects: [] })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                    >
                                        <option value="">Select Department</option>
                                        {GIKI_DEPARTMENTS.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                {formData.department && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subjects You Can Teach (select multiple)
                                        </label>
                                        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-2">
                                            {GIKI_COURSES_BY_DEPARTMENT[formData.department as GIKIDepartment]?.map((course) => (
                                                <label key={course} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.subjects.includes(course)}
                                                        onChange={() => toggleSubject(course)}
                                                        className="w-4 h-4 text-giki-blue focus:ring-giki-blue rounded"
                                                    />
                                                    <span className="text-sm">{course}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {formData.subjects.length} subject(s) selected
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 3: Rate & Proficiency */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-bold text-giki-blue mb-4">Rate & Proficiency</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hourly Rate (PKR)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min="500"
                                            max="1000"
                                            step="50"
                                            value={formData.hourlyRate}
                                            onChange={(e) => updateFormData({ hourlyRate: parseInt(e.target.value) })}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                                            <span>PKR 500</span>
                                            <span className="text-2xl font-bold text-giki-blue">PKR {formData.hourlyRate}</span>
                                            <span>PKR 1000</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Students will see this rate when booking sessions
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teaching Proficiency Level
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {PROFICIENCY_LEVELS.map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => updateFormData({ proficiencyLevel: level })}
                                                className={`px-4 py-3 rounded-lg font-medium transition-all ${formData.proficiencyLevel === level
                                                    ? "bg-giki-blue text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Emergency SOS Acceptance */}
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
                                    <div className="flex items-start space-x-4">
                                        <input
                                            type="checkbox"
                                            id="acceptsSOS"
                                            checked={formData.acceptsSOS}
                                            onChange={(e) => updateFormData({ acceptsSOS: e.target.checked })}
                                            className="mt-1 w-5 h-5 text-red-600 focus:ring-red-500 rounded"
                                        />
                                        <div className="flex-1">
                                            <label htmlFor="acceptsSOS" className="font-semibold text-gray-900 cursor-pointer flex items-center">
                                                <span className="text-xl mr-2">🚨</span>
                                                Accept Emergency SOS Alerts
                                            </label>
                                            <p className="text-sm text-gray-700 mt-1">
                                                Receive urgent help requests from students. Emergency sessions are charged at <strong>2x your hourly rate</strong>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Bio */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold text-giki-blue mb-4">About You</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio & Teaching Philosophy
                                    </label>
                                    <textarea
                                        value={formData.mentorBio}
                                        onChange={(e) => updateFormData({ mentorBio: e.target.value })}
                                        placeholder="Tell students about your teaching experience, approach, and what makes you a great mentor..."
                                        rows={8}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent resize-none"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        {formData.mentorBio.length} / 500 characters
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Live Photo */}
                        {currentStep === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-2xl font-bold text-giki-blue mb-4">Live Photo Verification</h2>

                                <div className="flex flex-col items-center space-y-4">
                                    {!formData.livePhotoData && !isCameraActive && (
                                        <button
                                            onClick={startCamera}
                                            className="px-6 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center space-x-2"
                                        >
                                            <Camera className="w-5 h-5" />
                                            <span>Start Camera</span>
                                        </button>
                                    )}

                                    {isCameraActive && (
                                        <div className="relative">
                                            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                className="w-full max-w-md rounded-lg border-4 border-giki-blue"
                                            />
                                            <button
                                                onClick={capturePhoto}
                                                className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
                                            >
                                                <Camera className="w-5 h-5" />
                                                <span>Capture Photo</span>
                                            </button>
                                        </div>
                                    )}

                                    {formData.livePhotoData && (
                                        <div className="relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={formData.livePhotoData}
                                                alt="Live photo"
                                                className="w-full max-w-md rounded-lg border-4 border-green-500"
                                            />
                                            <button
                                                onClick={() => {
                                                    updateFormData({ livePhotoData: "" });
                                                    startCamera();
                                                }}
                                                className="mt-4 w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all"
                                            >
                                                Retake Photo
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        {currentStep > 1 && (
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center space-x-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back</span>
                            </button>
                        )}

                        {currentStep < 5 ? (
                            <button
                                onClick={nextStep}
                                className="ml-auto px-6 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center space-x-2"
                            >
                                <span>Next</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.livePhotoData}
                                className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Complete Registration</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
