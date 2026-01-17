import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, BarChart2, Book, ArrowRight, ShieldCheck } from 'lucide-react';

import logo from '../assets/logo.png';

export default function LandingPage() {
    return (
        <div className="min-h-screen relative overflow-hidden font-sans bg-slate-950 text-slate-200">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] bg-gradient-to-tr from-slate-900 to-teal-900/10 rounded-full blur-[120px]" />
            </div>

            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Habiti Logo" className="w-12 h-12 object-contain drop-shadow-lg" />
                    <span className="text-2xl font-bold text-white tracking-tight hidden sm:block font-sans">habiti</span>
                </div>
                <div className="flex items-center gap-4 sm:gap-8">
                    <Link to="/login" className="text-slate-300 hover:text-teal-400 font-semibold transition-colors text-sm">
                        Log in
                    </Link>
                    <Link to="/signup" className="px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-slate-950 rounded-2xl font-bold shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 hover:scale-[1.02] active:scale-95 transition-all text-sm">
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-xs font-bold text-teal-400 bg-teal-500/10 backdrop-blur-md rounded-full border border-teal-500/20 shadow-sm uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                            Become who you want to be
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold text-white leading-[1.05] mb-8 tracking-tight">
                            Not just a tracker.<br />
                            A <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500">better version of you.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                            A calm, intelligent companion that helps you build identity through consistent action. No gamification, just <span className="text-white font-semibold underline decoration-teal-500/50 decoration-4 underline-offset-4">growth</span>.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/signup" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-3xl font-bold text-lg shadow-2xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-500/10 to-emerald-500/10 rounded-[3rem] blur-[100px] opacity-30 transform scale-95 translate-y-12"></div>
                    <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden aspect-[16/10] flex items-center justify-center group">

                        {/* Abstract UI Representation */}
                        <div className="absolute inset-0 flex flex-col p-8 opacity-50 blur-[2px] scale-95 group-hover:blur-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700">
                            <div className="flex gap-8 h-full">
                                <div className="w-64 bg-slate-800/50 rounded-3xl h-full hidden md:block border border-white/5"></div>
                                <div className="flex-1 flex flex-col gap-6">
                                    <div className="h-32 bg-slate-800/50 rounded-3xl w-full border border-white/5"></div>
                                    <div className="flex-1 grid grid-cols-3 gap-6">
                                        <div className="bg-slate-800/50 rounded-3xl border border-white/5"></div>
                                        <div className="bg-slate-800/50 rounded-3xl border border-white/5"></div>
                                        <div className="bg-slate-800/50 rounded-3xl border border-white/5"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center relative z-10 bg-slate-900/80 p-10 rounded-[3rem] shadow-2xl backdrop-blur-xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
                            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-teal-500/30 text-white">
                                <ShieldCheck size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Designed for Focus.</h3>
                            <p className="text-slate-300 font-medium">Calm. Minimal. Powerful.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div id="features" className="mt-40 grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <CheckCircle className="w-8 h-8 text-teal-500" />,
                            title: "Identity-Based Habits",
                            desc: "Don't just run. Become a Runner. Anchor your habits to the identity you are building."
                        },
                        {
                            icon: <BarChart2 className="w-8 h-8 text-indigo-500" />,
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
                            className="p-10 bg-slate-900/50 rounded-[2.5rem] border border-white/5 shadow-2xl shadow-black/20 hover:shadow-black/40 hover:-translate-y-1 transition-all group"
                        >
                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-slate-300 leading-relaxed font-medium">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 font-medium">© 2026 Habiti. Built for growth.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors font-medium">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors font-medium">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors font-medium">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
