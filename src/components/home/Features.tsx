"use client";

import { motion } from "framer-motion";
import { Target, Zap, Shield, Users, Clock, Star, Award, TrendingUp } from "lucide-react";

const features = [
    {
        icon: Target,
        title: "Targeted Learning",
        description: "Get help specifically for your courses and topics",
        color: "from-blue-500 to-blue-700",
        delay: 0.1,
    },
    {
        icon: Zap,
        title: "Instant Connect",
        description: "Average response time under 10 minutes",
        color: "from-yellow-500 to-orange-600",
        delay: 0.2,
    },
    {
        icon: Shield,
        title: "Verified Mentors<",
        description: "All mentors are GIKI students with proven track records",
        color: "from-green-500 to-emerald-700",
        delay: 0.3,
    },
    {
        icon: Users,
        title: "Peer Community",
        description: "Learn from seniors who've aced the same courses",
        color: "from-purple-500 to-pink-600",
        delay: 0.4,
    },
    {
        icon: Clock,
        title: "Smart Scheduling",
        description: "AI-powered timetable sync finds common free slots",
        color: "from-cyan-500 to-blue-600",
        delay: 0.5,
    },
    {
        icon: Award,
        title: "Quality Assured",
        description: "Rating system ensures top-tier mentorship quality",
        color: "from-amber-500 to-yellow-600",
        delay: 0.6,
    },
];

export default function Features() {
    return (
        <section className="relative py-24 px-4 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-giki-blue/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-giki-gold/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-2 bg-giki-blue/10 text-giki-blue rounded-full text-sm font-semibold mb-4">
                        WHY CHOOSE USTAAD
                    </span>
                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-giki-blue to-giki-gold mb-4">
                        Built for Excellence
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to excel in your academic journey at GIKI
                    </p>
                </motion.div>

                {/* Features grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: feature.delay }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative"
                        >
                            <div className="h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                {/* Icon */}
                                <div className="relative mb-6">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-giki-blue transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Decorative corner */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-giki-gold/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-20 bg-gradient-to-r from-giki-blue to-blue-700 rounded-3xl p-12 text-white shadow-2xl"
                >
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="flex items-center justify-center mb-3">
                                <TrendingUp className="w-8 h-8 mr-2" />
                                <div className="text-5xl font-black">95%</div>
                            </div>
                            <div className="text-blue-100">Grade Improvement</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center mb-3">
                                <Users className="w-8 h-8 mr-2" />
                                <div className="text-5xl font-black">500+</div>
                            </div>
                            <div className="text-blue-100">Active Students</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center mb-3">
                                <Star className="w-8 h-8 mr-2 fill-current" />
                                <div className="text-5xl font-black">4.9</div>
                            </div>
                            <div className="text-blue-100">Average Rating</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center mb-3">
                                <Clock className="w-8 h-8 mr-2" />
                                <div className="text-5xl font-black">24/7</div>
                            </div>
                            <div className="text-blue-100">Availability</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
