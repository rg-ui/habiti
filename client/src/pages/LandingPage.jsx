import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, BarChart2, Book, ArrowRight, ShieldCheck, Sparkles, Zap, Timer, Trophy, Star } from 'lucide-react';

import logo from '../assets/logo.png';

// Floating particles component
const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-teal-400/30"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                        x: [null, Math.random() * window.innerWidth],
                        y: [null, Math.random() * window.innerHeight],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 10 + Math.random() * 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
};

// Animated gradient orb
const GlowOrb = ({ color, size, top, left, delay = 0 }) => (
    <motion.div
        className={`absolute ${size} rounded-full blur-[100px] opacity-30`}
        style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            top,
            left
        }}
        animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
            duration: 8,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
    />
);

export default function LandingPage() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const stats = [
        { value: '10K+', label: 'Active Users' },
        { value: '500K+', label: 'Habits Tracked' },
        { value: '98%', label: 'Success Rate' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden font-sans bg-slate-950 text-slate-200">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <GlowOrb color="#14b8a6" size="w-[800px] h-[800px]" top="-20%" left="60%" delay={0} />
                <GlowOrb color="#6366f1" size="w-[600px] h-[600px]" top="50%" left="-10%" delay={2} />
                <GlowOrb color="#f59e0b" size="w-[400px] h-[400px]" top="70%" left="70%" delay={4} />
                <FloatingParticles />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            {/* Cursor glow effect */}
            <div
                className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-20 blur-[100px]"
                style={{
                    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%)',
                    left: mousePosition.x - 250,
                    top: mousePosition.y - 250,
                    transition: 'left 0.3s ease-out, top 0.3s ease-out',
                }}
            />

            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-50">
                <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.img
                        src={logo}
                        alt="Habiti Logo"
                        className="w-12 h-12 object-contain drop-shadow-lg"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <span className="text-2xl font-bold text-white tracking-tight hidden sm:block font-sans">habiti</span>
                </motion.div>
                <motion.div
                    className="flex items-center gap-4 sm:gap-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/login" className="text-slate-300 hover:text-teal-400 font-semibold transition-colors text-sm">
                        Log in
                    </Link>
                    <Link to="/signup" className="group relative px-6 py-3 bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 rounded-2xl font-bold shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 transition-all text-sm overflow-hidden">
                        <span className="relative z-10">Start Free</span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500"
                            initial={{ x: '100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
                <div className="text-center max-w-5xl mx-auto mb-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Animated Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 px-5 py-2.5 mb-10 text-xs font-bold text-teal-400 bg-teal-500/10 backdrop-blur-md rounded-full border border-teal-500/20 shadow-lg shadow-teal-500/10"
                            animate={{
                                boxShadow: ['0 0 20px rgba(20, 184, 166, 0.2)', '0 0 40px rgba(20, 184, 166, 0.4)', '0 0 20px rgba(20, 184, 166, 0.2)']
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <motion.span
                                className="w-2 h-2 rounded-full bg-teal-400"
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="uppercase tracking-widest">Become who you want to be</span>
                            <Sparkles size={14} />
                        </motion.div>

                        {/* Main Headline with Gradient Animation */}
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white leading-[1.05] mb-8 tracking-tight">
                            Not just a tracker.<br />
                            <motion.span
                                className="inline-block text-transparent bg-clip-text"
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, #14b8a6, #6366f1, #f59e0b, #14b8a6)',
                                    backgroundSize: '300% 100%',
                                }}
                                animate={{
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            >
                                A better version of you.
                            </motion.span>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                            A calm, intelligent companion that helps you build identity through consistent action.
                            <span className="text-white font-semibold"> No gamification gimmicks, just real growth.</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/signup">
                                <motion.button
                                    className="group relative w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-3xl font-bold text-lg shadow-2xl overflow-hidden"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        Begin Your Journey
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.span>
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </motion.button>
                            </Link>
                            <Link to="/login" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2">
                                Already have an account? <span className="text-teal-400">Sign in →</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Row */}
                <motion.div
                    className="flex justify-center gap-8 md:gap-16 mb-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            className="text-center"
                            whileHover={{ scale: 1.1 }}
                        >
                            <motion.p
                                className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                            >
                                {stat.value}
                            </motion.p>
                            <p className="text-slate-500 text-sm font-medium mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* App Preview with Glow */}
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3, ease: "circOut" }}
                    className="relative max-w-5xl mx-auto"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-amber-500/20 rounded-[3rem] blur-[80px] opacity-50 animate-pulse" />

                    <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                        {/* Browser chrome */}
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-slate-950/50">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-4 py-1.5 bg-slate-800/50 rounded-lg text-xs text-slate-400 font-mono">
                                    habiti.app
                                </div>
                            </div>
                        </div>

                        {/* App content preview */}
                        <div className="p-8 aspect-[16/9] flex items-center justify-center">
                            <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
                                {[...Array(4)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="aspect-square rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/5 flex items-center justify-center"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 + i * 0.1 }}
                                        whileHover={{ scale: 1.05, borderColor: 'rgba(20, 184, 166, 0.5)' }}
                                    >
                                        {[Timer, Trophy, BarChart2, Star][i] &&
                                            React.createElement([Timer, Trophy, BarChart2, Star][i], {
                                                size: 32,
                                                className: ['text-teal-400', 'text-amber-400', 'text-indigo-400', 'text-emerald-400'][i]
                                            })
                                        }
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div id="features" className="mt-32 grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <CheckCircle className="w-8 h-8" />,
                            title: "Identity-Based Habits",
                            desc: "Don't just run. Become a Runner. Anchor your habits to the identity you are building.",
                            gradient: "from-teal-500 to-emerald-500"
                        },
                        {
                            icon: <Timer className="w-8 h-8" />,
                            title: "Focus Timer",
                            desc: "Built-in Pomodoro timer to help you stay focused. Track your deep work sessions.",
                            gradient: "from-indigo-500 to-purple-500"
                        },
                        {
                            icon: <Trophy className="w-8 h-8" />,
                            title: "Achievements & Badges",
                            desc: "Earn badges for your consistency. Celebrate your wins and stay motivated.",
                            gradient: "from-amber-500 to-orange-500"
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15, duration: 0.6 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative p-8 bg-slate-900/50 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden"
                        >
                            {/* Hover glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                            <motion.div
                                className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}
                                whileHover={{ rotate: 10, scale: 1.1 }}
                            >
                                {feature.icon}
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    className="mt-32 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to transform your life?
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                        Join thousands who are building better habits and becoming their best selves.
                    </p>
                    <Link to="/signup">
                        <motion.button
                            className="px-12 py-5 bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 rounded-3xl font-bold text-lg shadow-2xl shadow-teal-500/30"
                            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(20, 184, 166, 0.5)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Get Started Free <Zap className="inline ml-2" size={20} />
                        </motion.button>
                    </Link>
                </motion.div>
            </main >

            {/* Footer */}
            < footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur-xl" >
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 font-medium">© 2026 Habiti. Built for growth.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors font-medium">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors font-medium">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors font-medium">Contact</a>
                    </div>
                </div>
            </footer >
        </div >
    );
}
