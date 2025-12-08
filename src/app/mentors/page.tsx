"use client";

import { useState, useEffect } from "react";
import { Search, Star, Filter } from "lucide-react";
import { searchMentors } from "@/actions/search-actions";
import { GIKI_COURSES_BY_DEPARTMENT, GIKI_DEPARTMENTS } from "@/lib/giki-courses";

interface Mentor {
    id: string;
    name: string;
    photo: string | null;
    department: string | null;
    subjects: string[];
    hourlyRate: number;
    rating: number;
    reviewCount: number;
    proficiencyLevel: string | null;
    bio: string | null;
}

export default function MentorSearchPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedDept, setSelectedDept] = useState("");
    const [minRate, setMinRate] = useState(500);
    const [maxRate, setMaxRate] = useState(1000);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadMentors();
    }, []);

    const loadMentors = async () => {
        setLoading(true);
        const result = await searchMentors({
            searchQuery,
            course: selectedCourse,
            minRate,
            maxRate,
        });
        if (result.mentors) {
            setMentors(result.mentors);
        }
        setLoading(false);
    };

    const handleSearch = () => {
        loadMentors();
    };

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCourse("");
        setSelectedDept("");
        setMinRate(500);
        setMaxRate(1000);
    };

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-giki-blue mb-2">Find Your Mentor</h1>
                <p className="text-gray-600">Connect with top-rated mentors from GIKI</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8"  >
                <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name or course..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
                    >
                        <Filter className="w-5 h-5" />
                        <span>Filters</span>
                    </button>
                    <button
                        onClick={handleSearch}
                        className="px-8 py-3 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                        Search
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="border-t border-gray-200 pt-4 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <select
                                    value={selectedDept}
                                    onChange={(e) => {
                                        setSelectedDept(e.target.value);
                                        setSelectedCourse("");
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent"
                                >
                                    <option value="">All Departments</option>
                                    {GIKI_DEPARTMENTS.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Course */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    disabled={!selectedDept}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-giki-blue focus:border-transparent disabled:bg-gray-100"
                                >
                                    <option value="">All Courses</option>
                                    {selectedDept && GIKI_COURSES_BY_DEPARTMENT[selectedDept as keyof typeof GIKI_COURSES_BY_DEPARTMENT]?.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Hourly Rate Slider */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hourly Rate: PKR {minRate} - {maxRate}
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="range"
                                    min="500"
                                    max="1000"
                                    value={minRate}
                                    onChange={(e) => setMinRate(parseInt(e.target.value))}
                                    className="flex-1"
                                />
                                <input
                                    type="range"
                                    min="500"
                                    max="1000"
                                    value={maxRate}
                                    onChange={(e) => setMaxRate(parseInt(e.target.value))}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <button
                            onClick={resetFilters}
                            className="text-sm text-giki-blue hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Results */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-giki-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading mentors...</p>
                </div>
            ) : mentors.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl">
                    <p className="text-gray-600 text-lg">No mentors found</p>
                    <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentors.map(mentor => (
                        <div key={mentor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="p-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    {mentor.photo ? (
                                        <img src={mentor.photo} alt={mentor.name} className="w-16 h-16 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-giki-blue to-giki-gold flex items-center justify-center text-white text-xl font-bold">
                                            {mentor.name[0]}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{mentor.name}</h3>
                                        <div className="flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.round(mentor.rating)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                            <span className="text-sm text-gray-600 ml-1">({mentor.reviewCount})</span>
                                        </div>
                                    </div>
                                </div>

                                {mentor.department && (
                                    <p className="text-sm text-gray-600 mb-2">{mentor.department}</p>
                                )}

                                {mentor.subjects.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {mentor.subjects.slice(0, 3).map((subject, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                                {subject.length > 20 ? subject.substring(0, 20) + "..." : subject}
                                            </span>
                                        ))}
                                        {mentor.subjects.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                +{mentor.subjects.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                {mentor.bio && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{mentor.bio}</p>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <div>
                                        <p className="text-sm text-gray-600">Hourly Rate</p>
                                        <p className="text-xl font-bold text-green-600">PKR {mentor.hourlyRate}</p>
                                    </div>
                                    <button className="px-6 py-2 bg-giki-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                                        Book Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
