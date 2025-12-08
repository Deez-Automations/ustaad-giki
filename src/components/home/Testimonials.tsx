"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
    {
        name: "Ahmed Hassan",
        role: "CS Senior • CGPA 3.8",
        image: "👨‍💻",
        quote: "Ustaad helped me ace Data Structures. My mentor explained linked lists better than any YouTube video!",
        rating: 5,
        color: "from-blue-500 to-cyan-600",
    },
    {
        name: "Fatima Khan",
        role: "EE Junior • Dean's List",
        image: "👩‍🎓",
        quote: "The SOS feature saved my semester. Got help 30 mins before my Circuit Theory mid. Life saver!",
        rating: 5,
        color: "from-purple-500 to-pink-600",
    },
    {
        name: "Ali Raza",
        role: "ME Sophomore",
        image: "🧑‍🔬",
        quote: "Smart scheduling found free slots with my mentor automatically. No more endless WhatsApp messages!",
        rating: 5,
        color: "from-green-500 to-emerald-600",
    },
];

export default function Testimonials() {
    return (
        <section className="relative py-24 px-4 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-giki-blue/20 rounded-full blur-3xl" />
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
                    <span className="inline-block px-4 py-2 bg-blue-100 text-giki-blue rounded-full text-sm font-semibold mb-4">
                        STUDENT SUCCESS STORIES
                    </span>
                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-giki-blue to-blue-500 mb-4">
                        Hear From Our
                        Students
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Real stories from real GIKIans who transformed their grades
                    </p>
                </motion.div>

                {/* Testimonials grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="relative group"
                        >
                            <div className="h-full bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                                {/* Quote icon */}
                                <div className="absolute top-6 right-6 opacity-10">
                                    <Quote className="w-16 h-16 text-giki-blue" />
                                </div>

                                {/* Rating stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-700 text-lg mb-6 leading-relaxed relative z-10">
                                    "{testimonial.quote}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-3xl shadow-lg`}>
                                        {testimonial.image}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">{testimonial.name}</div>
                                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                                    </div>
                                </div>

                                {/* Gradient overlay on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA at bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <p className="text-2xl font-bold text-gray-700 mb-6">
                        Ready to boost your grades?
                    </p>
                    <motion.a
                        href="/auth/register"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-12 py-4 bg-gradient-to-r from-giki-blue to-blue-700 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all"
                    >
                        Get Started for Free
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
