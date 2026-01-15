import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, BarChart2, Book, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-[#f8fafc]">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] bg-gradient-to-tr from-[#d4af37]/5 to-amber-100/20 rounded-full blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 border border-white/50">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-800 font-bold text-xl">H</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 tracking-tight hidden sm:block">Habiti</span>
                </div>
                <div className="flex items-center gap-4 sm:gap-8">
                    <Link to="/login" className="text-slate-500 hover:text-indigo-600 font-semibold transition-colors text-sm">
                        Log in
                    </Link>
                    <Link to="/signup" className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all text-sm">
                        Start Building
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="text-center max-w-5xl mx-auto mb-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-xs font-bold text-indigo-600 bg-white/60 backdrop-blur-md rounded-full border border-indigo-100/50 shadow-sm uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            Become who you want to be
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold text-slate-900 leading-[1.05] mb-8 tracking-tight">
                            Not just a tracker.<br />
                            A <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500">better version of you.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                            A calm, intelligent companion that helps you build identity through consistent action. No gamification, just <span className="text-slate-800 font-semibold underline decoration-amber-400/50 decoration-4 underline-offset-4">growth</span>.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/signup" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-3xl font-bold text-lg shadow-2xl shadow-slate-900/20 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
                                Begin Your Journey
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard Preview (Abstract) */}
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
                    className="relative max-w-6xl mx-auto"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-amber-500/20 rounded-[3rem] blur-[100px] opacity-30 transform scale-95 translate-y-12"></div>
                    <div className="relative bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden aspect-[16/10] flex items-center justify-center group">

                        {/* Abstract UI Representation */}
                        <div className="absolute inset-0 flex flex-col p-8 opacity-50 blur-[2px] scale-95 group-hover:blur-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700">
                            <div className="flex gap-8 h-full">
                                <div className="w-64 bg-white/50 rounded-3xl h-full hidden md:block"></div>
                                <div className="flex-1 flex flex-col gap-6">
                                    <div className="h-32 bg-white/60 rounded-3xl w-full"></div>
                                    <div className="flex-1 grid grid-cols-3 gap-6">
                                        <div className="bg-white/60 rounded-3xl"></div>
                                        <div className="bg-white/60 rounded-3xl"></div>
                                        <div className="bg-white/60 rounded-3xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center relative z-10 bg-white/80 p-10 rounded-[3rem] shadow-2xl backdrop-blur-xl border border-white group-hover:scale-105 transition-transform duration-500">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
                                <ShieldCheck size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Designed for Focus.</h3>
                            <p className="text-slate-500 font-medium">Calm. Minimal. Powerful.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div id="features" className="mt-40 grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <CheckCircle className="w-8 h-8 text-indigo-600" />,
                            title: "Identity-Based Habits",
                            desc: "Don't just run. Become a Runner. Anchor your habits to the identity you are building."
                        },
                        {
                            icon: <BarChart2 className="w-8 h-8 text-amber-500" />,
                            title: "Deep Insights",
                            desc: "Understand your patterns with analytics that focus on consistency, not just streaks."
                        },
                        {
                            icon: <Book className="w-8 h-8 text-emerald-500" />,
                            title: "Reflective Journaling",
                            desc: "Connect your feelings to your actions. See how your mood influences your success."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15, duration: 0.6 }}
                            className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all group"
                        >
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white/30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 font-medium">© 2026 Habiti. Built for growth.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors font-medium">Privacy</a>
                        <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors font-medium">Terms</a>
                        <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors font-medium">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
