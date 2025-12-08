"use client";

import { useState } from "react";
import { TimeSlotData } from "@/actions/timetable-actions";
import { Plus, Edit, Trash2 } from "lucide-react";
import TimeSlotModal from "./TimeSlotModal";

interface CalendarBuilderProps {
    initialTimeSlots: TimeSlotData[];
    onSave: (timeSlots: TimeSlotData[]) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
];

export default function CalendarBuilder({ initialTimeSlots, onSave }: CalendarBuilderProps) {
    const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>(initialTimeSlots);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState<TimeSlotData | null>(null);
    const [selectedDay, setSelectedDay] = useState<string>("");

    const handleAddSlot = (day: string) => {
        setSelectedDay(day);
        setEditingSlot(null);
        setIsModalOpen(true);
    };

    const handleEditSlot = (slot: TimeSlotData) => {
        setEditingSlot(slot);
        setIsModalOpen(true);
    };

    const handleDeleteSlot = (index: number) => {
        const updated = timeSlots.filter((_, i) => i !== index);
        setTimeSlots(updated);
    };

    const handleSaveSlot = (slot: TimeSlotData) => {
        if (editingSlot) {
            // Edit existing
            const index = timeSlots.findIndex(
                s => s.day === editingSlot.day && s.startTime === editingSlot.startTime
            );
            const updated = [...timeSlots];
            updated[index] = slot;
            setTimeSlots(updated);
        } else {
            // Add new
            setTimeSlots([...timeSlots, slot]);
        }
        setIsModalOpen(false);
    };

    const getSlotForDayAndTime = (day: string, time: string) => {
        return timeSlots.find(slot => {
            return slot.day === day && slot.startTime <= time && slot.endTime > time;
        });
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-giki-blue">Interactive Timetable Builder</h2>
                <button
                    onClick={() => onSave(timeSlots)}
                    className="px-6 py-2 bg-giki-gold text-white rounded-lg font-bold hover:bg-opacity-90 transition-all"
                >
                    Save Timetable
                </button>
            </div>

            {/* Weekly Grid */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-8 border-b border-gray-200">
                    {/* Time Column Header */}
                    <div className="p-4 bg-gray-50 font-semibold text-gray-700 text-center border-r border-gray-200">
                        Time
                    </div>
                    {/* Day Headers */}
                    {DAYS.map(day => (
                        <div key={day} className="p-4 bg-gray-50 font-semibold text-gray-700 text-center border-r last:border-r-0 border-gray-200">
                            {day}
                            <button
                                onClick={() => handleAddSlot(day)}
                                className="ml-2 text-giki-blue hover:text-giki-gold transition-colors"
                                title={`Add class on ${day}`}
                            >
                                <Plus className="w-4 h-4 inline" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Time Rows */}
                <div className="max-h-[600px] overflow-y-auto">
                    {TIME_SLOTS.map(time => (
                        <div key={time} className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            {/* Time Label */}
                            <div className="p-3 text-sm font-mono text-gray-600 text-center border-r border-gray-100">
                                {time}
                            </div>
                            {/* Day Cells */}
                            {DAYS.map(day => {
                                const slot = getSlotForDayAndTime(day, time);
                                return (
                                    <div
                                        key={`${day}-${time}`}
                                        className="p-2 border-r last:border-r-0 border-gray-100 relative min-h-[60px]"
                                    >
                                        {slot && slot.startTime === time && (
                                            <div
                                                className="absolute inset-0 p-2 m-1 rounded-lg text-white text-xs font-medium shadow-sm cursor-pointer group hover:shadow-md transition-all"
                                                style={{ backgroundColor: slot.color }}
                                                onClick={() => handleEditSlot(slot)}
                                            >
                                                <div className="font-bold">{slot.title}</div>
                                                {slot.location && (
                                                    <div className="text-white/80 text-xs mt-1">{slot.location}</div>
                                                )}
                                                <div className="text-white/70 text-xs mt-1">{slot.startTime} - {slot.endTime}</div>

                                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditSlot(slot);
                                                        }}
                                                        className="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const index = timeSlots.indexOf(slot);
                                                            handleDeleteSlot(index);
                                                        }}
                                                        className="p-1 bg-white/20 rounded hover:bg-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Time Slot Modal */}
            {isModalOpen && (
                <TimeSlotModal
                    slot={editingSlot}
                    defaultDay={selectedDay}
                    onSave={handleSaveSlot}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
