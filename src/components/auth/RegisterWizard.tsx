"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Camera, Check, ChevronRight, Loader2, User, GraduationCap,
    Upload, Shield, BookOpen
} from "lucide-react";
import Webcam from "react-webcam";
import { registerUser } from "@/actions/register";
import { useRouter } from "next/navigation";
import { GIKI_DEPARTMENTS, GIKI_COURSES_BY_DEPARTMENT, type GIKIDepartment } from "@/lib/giki-courses";

const FACULTIES = ["FCS", "FEE", "FME", "FCE", "FMS"];
const BATCHES = ["2021", "2022", "2023", "2024", "2025"];

interface FormData {
    // Step 1: Basic Info
    name: string;
    email: string;
    password: string;

    // Step 2: Academic Details
    rollNumber: string;
    batch: string;
    faculty: string;
    department: string;

    // Step 3: Courses
    courses: string[];

    // Step 4: Verification
    cnic: string;

    // Step 5: Live Photo
    livePhotoUrl: string;
}

export default function StudentRegisterWizard() {
    const router = useRouter();
    const webcamRef = useRef<Webcam>(null);
    const [step, setStep] = useState(1);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        rollNumber: "",
        batch: "",
        faculty: "",
        department: "",
        courses: [],
        cnic: "",
        livePhotoUrl: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateFormData = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = async () => {
        setError("");

        // Validation for each step
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.password) {
                setError("Please fill all fields");
                return;
            }
            if (!formData.email.endsWith("@giki.edu.pk")) {
                setError("Must use GIKI email (@giki.edu.pk)");
                return;
            }
            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }
        }

        if (step === 2) {
            if (!formData.rollNumber || !formData.batch || !formData.faculty || !formData.department) {
                setError("Please fill all academic details");
                return;
            }
        }

        if (step === 3) {
            if (formData.courses.length === 0) {
                setError("Please select at least one course");
                return;
            }
        }

        if (step === 4) {
            if (formData.cnic.length !== 13) {
                setError("CNIC must be exactly 13 digits (no dashes)");
                return;
            }
        }

        setStep((s) => s + 1);
    };

    const prevStep = () => setStep((s) => s - 1);

    const toggleCourse = (course: string) => {
        if (formData.courses.includes(course)) {
            updateFormData({ courses: formData.courses.filter((c) => c !== course) });
        } else {
            updateFormData({ courses: [...formData.courses, course] });
        }
    };

    const capturePhoto = () => {
        if (webcamRef.current) {
            const photoData = webcamRef.current.getScreenshot();
            if (photoData) {
                updateFormData({ livePhotoUrl: photoData });
                setIsCameraActive(false);
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.livePhotoUrl) {
            setError("Please capture your photo for verification");
            return;
        }

        setIsSubmitting(true);
        setError("");

        const result = await registerUser(formData);

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else {
            router.push("/auth/login?success=true");
        }
    };

    const progress = (step / 5) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Progress bar */}
                <div className="h-2 bg-gray-100">
                    <motion.div
                        className="h-full bg-gradient-to-r from-giki-blue to-giki-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-giki-blue to-blue-700 text-white">
                    <h2 className="text-3xl font-black mb-2">Join USTAAD GIKI</h2>
                    <p className="text-blue-100">Step {step} of 5</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-giki-blue/10 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-giki-blue" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Basic Information</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateFormData({ name: e.target.value })}
                                    placeholder="Ali Ahmed Khan"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-giki-blue focus:ring-2 focus:ring-giki-blue/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">GIKI Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateFormData({ email: e.target.value })}
                                    placeholder="u2024xxx@giki.edu.pk"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-giki-blue focus:ring-2 focus:ring-giki-blue/20 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => updateFormData({ password: e.target.value })}
                                    placeholder="Minimum 6 characters"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-giki-blue focus:ring-2 focus:ring-giki-blue/20 outline-none transition-all"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Academic Details */}
                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Academic Details</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
                                    <input
                                        type="text"
                                        value={formData.rollNumber}
                                        onChange={(e) => updateFormData({ rollNumber: e.target.value })}
                                        placeholder="2024-CS-123"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-giki-blue focus:ring-2 focus:ring-giki-blue/20 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Batch</label>
                                    <select
                                        value={formData.batch}
                                        onChange={(e) => updateFormData({ batch: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-giki-blue focus:ring-2 focus:ring-giki-blue/20 outline-none transition-all"
                                    >
                                        <option value="">Select Batch</option>
                                        {BATCHES.map((batch) => (
                                            <option key={batch} value={batch}>{batch}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Faculty</label>
                                <select
                                    value={formData.faculty}
                                    onChange={(e) => updateFormData({ faculty: e.target.value, department: "" })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-giki-blue focus:ring-2 focus:ring-giki-blue/20 outline-none transition-all"
                                >
                                    <option value="">Select Faculty</option>
                                    {FACULTIES.map((faculty) => (
                                        <option key={faculty} value={faculty}>{faculty}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => updateFormData({ department: e.target.value, courses: [] })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-giki-blue focus:ring-2 focus:ring-giki-blue/20 outline-none transition-all"
                                >
                                    <option value="">Select Department</option>
                                    {GIKI_DEPARTMENTS.map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Courses */}
                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Select Your Courses</h3>
                            </div>

                            {formData.department ? (
                                <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-xl p-4 space-y-2">
                                    {GIKI_COURSES_BY_DEPARTMENT[formData.department as GIKIDepartment]?.map((course) => (
                                        <label
                                            key={course}
                                            className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.courses.includes(course)}
                                                onChange={() => toggleCourse(course)}
                                                className="w-5 h-5 text-giki-blue focus:ring-giki-blue rounded"
                                            />
                                            <span className="text-gray-700">{course}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    Please select a department first
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>{formData.courses.length}</strong> course(s) selected
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: CNIC Verification */}
                    {step === 4 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Identity Verification</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    CNIC Number (Without Dashes)
                                </label>
                                <input
                                    type="text"
                                    value={formData.cnic}
                                    onChange={(e) => updateFormData({ cnic: e.target.value.replace(/\D/g, "").slice(0, 13) })}
                                    placeholder="1234567890123"
                                    maxLength={13}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-giki-blue focus:ring-2 focus:ring-giki-blue/20 outline-none transition-all font-mono text-lg"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    {formData.cnic.length}/13 digits
                                </p>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    🔒 <strong>Security:</strong> Your CNIC is used for identity verification and will be kept secure.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 5: Live Photo */}
                    {step === 5 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Live Photo Verification</h3>
                            </div>

                            <div className="relative w-full h-80 bg-black rounded-2xl overflow-hidden border-4 border-giki-gold">
                                {!formData.livePhotoUrl && !isCameraActive && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                        <p className="text-white text-center">
                                            Click "Start Camera" to capture your photo
                                        </p>
                                    </div>
                                )}

                                {isCameraActive && !formData.livePhotoUrl && (
                                    <Webcam
                                        ref={webcamRef}
                                        audio={false}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full object-cover"
                                    />
                                )}

                                {formData.livePhotoUrl && (
                                    <img
                                        src={formData.livePhotoUrl}
                                        alt="Captured"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {!formData.livePhotoUrl && !isCameraActive && (
                                <button
                                    onClick={() => setIsCameraActive(true)}
                                    className="w-full py-4 bg-gradient-to-r from-giki-blue to-blue-700 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Camera className="w-5 h-5" />
                                    Start Camera
                                </button>
                            )}

                            {isCameraActive && !formData.livePhotoUrl && (
                                <button
                                    onClick={capturePhoto}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Camera className="w-5 h-5" />
                                    Capture Photo
                                </button>
                            )}

                            {formData.livePhotoUrl && (
                                <button
                                    onClick={() => {
                                        updateFormData({ livePhotoUrl: "" });
                                        setIsCameraActive(true);
                                    }}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Retake Photo
                                </button>
                            )}

                            <p className="text-xs text-gray-500 text-center">
                                This photo will be used to verify your identity against your GIKI ID card
                            </p>
                        </motion.div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                        {step > 1 && (
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                            >
                                ← Back
                            </button>
                        )}

                        {step < 5 ? (
                            <button
                                onClick={nextStep}
                                className="ml-auto px-8 py-3 bg-gradient-to-r from-giki-blue to-blue-700 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                Next
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.livePhotoUrl}
                                className="ml-auto px-8 py-3 bg-gradient-to-r from-giki-gold to-yellow-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Complete Registration
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
