"use client";

import { useState } from "react";
import { TimeSlotData } from "@/actions/timetable-actions";
import { X } from "lucide-react";

interface TimeSlotModalProps {
    slot?: TimeSlotData | null;
    defaultDay?: string;
    onSave: (slot: TimeSlotData) => void;
    onClose: () => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const COLORS = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Yellow", value: "#f59e0b" },
    { name: "Red", value: "#ef4444" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Teal", value: "#14b8a6" },
];

export default function TimeSlotModal({ slot, defaultDay, onSave, onClose }: TimeSlotModalProps) {
    const [formData, setFormData] = useState<TimeSlotData>({
        day: slot?.day || defaultDay || "Monday",
        startTime: slot?.startTime || "09:00",
        endTime: slot?.endTime || "10:30",
        title: slot?.title || "",
        location: slot?.location || "",
        color: slot?.color || "#3b82f6",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-giki-blue">
                        {slot ? "Edit Time Slot" : "Add Time Slot"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Day */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                        <select
                            value={formData.day}
                            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-giki-blue outline-none"
                            required
                        >
                            {DAYS.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-giki-blue outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-giki-blue outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course/Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-giki-blue outline-none"
                            placeholder="e.g., CS101 - Data Structures"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-giki-blue outline-none"
                            placeholder="e.g., Room 101, Lab 3"
                        />
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <div className="grid grid-cols-4 gap-2">
                            {COLORS.map(color => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                    className={`w-full h-10 rounded-lg transition-all ${formData.color === color.value
                                            ? "ring-2 ring-giki-blue ring-offset-2 scale-105"
                                            : "hover:scale-105"
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
