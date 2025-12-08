"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, DollarSign, BookOpen, AlertTriangle } from "lucide-react";
import { updateMentorBio, updateHourlyRate, toggleSOSAcceptance, updateSubjects, updateProficiencyLevel } from "@/actions/update-mentor-profile";
import { GIKI_DEPARTMENTS, GIKI_COURSES_BY_DEPARTMENT, type GIKIDepartment } from "@/lib/giki-courses";

interface ProfileSettingsProps {
    initialData: {
        bio: string;
        hourlyRate: number;
        department: string;
        subjects: string[];
        proficiencyLevel: string;
        acceptsSOS: boolean;
    };
}

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Expert"];

export default function ProfileSettings({ initialData }: ProfileSettingsProps) {
    const router = useRouter();
    const [bio, setBio] = useState(initialData.bio);
    const [hourlyRate, setHourlyRate] = useState(initialData.hourlyRate);
    const [selectedSubjects, setSelectedSubjects] = useState(initialData.subjects);
    const [department, setDepartment] = useState(initialData.department);
    const [proficiencyLevel, setProficiencyLevel] = useState(initialData.proficiencyLevel);
    const [acceptsSOS, setAcceptsSOS] = useState(initialData.acceptsSOS);
    const [saving, setSaving] = useState<string | null>(null);
    const [success, setSuccess] = useState("");

    const handleSaveBio = async () => {
        setSaving("bio");
        setSuccess("");
        const result = await updateMentorBio(bio);
        if (result.success) {
            setSuccess("Bio updated successfully!");
            router.refresh();
        }
        setSaving(null);
    };

    const handleSaveRate = async () => {
        setSaving("rate");
        setSuccess("");
        const result = await updateHourlyRate(hourlyRate);
        if (result.success) {
            setSuccess("Rate updated successfully!");
            router.refresh();
        }
        setSaving(null);
    };

    const handleToggleSOS = async () => {
        setSaving("sos");
        setSuccess("");
        const newValue = !acceptsSOS;
        setAcceptsSOS(newValue);
        const result = await toggleSOSAcceptance(newValue);
        if (result.success) {
            setSuccess(`SOS alerts ${newValue ? "enabled" : "disabled"}!`);
            router.refresh();
        }
        setSaving(null);
    };

    const handleSaveSubjects = async () => {
        setSaving("subjects");
        setSuccess("");
        const result = await updateSubjects(selectedSubjects);
        if (result.success) {
            setSuccess("Subjects updated successfully!");
            router.refresh();
        }
        setSaving(null);
    };

    const handleSaveProficiency = async () => {
        setSaving("proficiency");
        setSuccess("");
        const result = await updateProficiencyLevel(proficiencyLevel);
        if (result.success) {
            setSuccess("Proficiency updated successfully!");
            router.refresh();
        }
        setSaving(null);
    };

    const toggleSubject = (subject: string) => {
        setSelectedSubjects(prev =>
            prev.includes(subject)
                ? prev.filter(s => s !== subject)
                : [...prev, subject]
        );
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                    {success}
                </div>
            )}

            {/* Bio Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">About You</h3>
                    <button
                        onClick={handleSaveBio}
                        disabled={saving === "bio"}
                        className="px-4 py-2 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                        {saving === "bio" ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{saving === "bio" ? "Saving..." : "Save Bio"}</span>
                    </button>
                </div>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell students about your teaching experience..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">{bio.length} / 500 characters</p>
            </div>

            {/* Hourly Rate Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        Hourly Rate
                    </h3>
                    <button
                        onClick={handleSaveRate}
                        disabled={saving === "rate"}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                        {saving === "rate" ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{saving === "rate" ? "Saving..." : "Save Rate"}</span>
                    </button>
                </div>
                <input
                    type="range"
                    min="500"
                    max="1000"
                    step="50"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                    className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>PKR 500</span>
                    <span className="text-2xl font-bold text-green-600">PKR {hourlyRate}</span>
                    <span>PKR 1000</span>
                </div>
            </div>

            {/* Emergency SOS Section */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4 flex-1">
                        <input
                            type="checkbox"
                            id="sosToggle"
                            checked={acceptsSOS}
                            onChange={handleToggleSOS}
                            disabled={saving === "sos"}
                            className="mt-1 w-6 h-6 text-red-600 focus:ring-red-500 rounded"
                        />
                        <div className="flex-1">
                            <label htmlFor="sosToggle" className="font-semibold text-gray-900 cursor-pointer flex items-center text-lg">
                                <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                                Accept Emergency SOS Alerts
                            </label>
                            <p className="text-sm text-gray-700 mt-2">
                                Receive urgent help requests from students. Emergency sessions are charged at <strong>2x your hourly rate (PKR {hourlyRate * 2})</strong>.
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Current status: <strong>{acceptsSOS ? "Accepting SOS" : "Not accepting SOS"}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                        Subjects You Teach
                    </h3>
                    <button
                        onClick={handleSaveSubjects}
                        disabled={saving === "subjects"}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                        {saving === "subjects" ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{saving === "subjects" ? "Saving..." : "Save Subjects"}</span>
                    </button>
                </div>

                {department && (
                    <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-2">
                        {GIKI_COURSES_BY_DEPARTMENT[department as GIKIDepartment]?.map((course) => (
                            <label key={course} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input
                                    type="checkbox"
                                    checked={selectedSubjects.includes(course)}
                                    onChange={() => toggleSubject(course)}
                                    className="w-4 h-4 text-giki-blue focus:ring-giki-blue rounded"
                                />
                                <span className="text-sm">{course}</span>
                            </label>
                        ))}
                    </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                    {selectedSubjects.length} subject(s) selected
                </p>
            </div>

            {/* Proficiency Level */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Teaching Proficiency</h3>
                    <button
                        onClick={handleSaveProficiency}
                        disabled={saving === "proficiency"}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                        {saving === "proficiency" ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{saving === "proficiency" ? "Saving..." : "Save Level"}</span>
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {PROFICIENCY_LEVELS.map((level) => (
                        <button
                            key={level}
                            onClick={() => setProficiencyLevel(level)}
                            className={`px-4 py-3 rounded-lg font-medium transition-all ${proficiencyLevel === level
                                    ? "bg-giki-blue text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
