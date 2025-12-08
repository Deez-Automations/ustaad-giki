import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import MentorSearch from "@/components/features/MentorSearch";
import SmartSchedule from "@/components/features/SmartSchedule";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <MentorSearch />
            <SmartSchedule />
            <Testimonials />

            {/* Enhanced Footer */}
            <footer className="relative bg-gradient-to-br from-giki-blue via-blue-900 to-giki-blue text-white py-16 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-3 gap-12 mb-12">
                        {/* Brand */}
                        <div>
                            <h3 className="text-3xl font-black bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-4">
                                USTAAD GIKI
                            </h3>
                            <p className="text-blue-100 leading-relaxed">
                                Empowering GIKIans through peer-to-peer mentorship and smart academic solutions.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-bold text-lg mb-4 text-blue-300">Quick Links</h4>
                            <ul className="space-y-2 text-blue-100">
                                <li><a href="/mentors" className="hover:text-white transition-colors">Find a Mentor</a></li>
                                <li><a href="/auth/register" className="hover:text-white transition-colors">Join as Student</a></li>
                                <li><a href="/auth/mentor-register" className="hover:text-white transition-colors">Become a Mentor</a></li>
                                <li><a href="/timetable" className="hover:text-white transition-colors">Timetable Manager</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-bold text-lg mb-4 text-blue-300">Get in Touch</h4>
                            <p className="text-blue-100 mb-2">📧 support@ustaadgiki.com</p>
                            <p className="text-blue-100 mb-4">📍 GIKI Campus, Topi, KPK</p>
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                                    <span className="text-xl">📘</span>
                                </div>
                                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                                    <span className="text-xl">📸</span>
                                </div>
                                <div className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                                    <span className="text-xl">🐦</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-8 border-t border-white/10 text-center text-blue-200">
                        <p className="text-sm">
                            © 2025 USTAAD GIKI. Built with ❤️ for Ghulam Ishaq Khan Institute of Engineering Sciences and Technology.
                        </p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </footer>
        </main>
    );
}
