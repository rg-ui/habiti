import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, CheckCircle, ArrowRight, Flame, BookOpen, Target, Zap } from 'lucide-react';

import logo from '../assets/logo.png';

// 3D Crystal/Gem Component
const Crystal = ({ size = 'large', className = '', delay = 0 }) => {
    const sizeClasses = {
        large: 'w-80 h-80',
        medium: 'w-16 h-16',
        small: 'w-12 h-12',
    };

    return (
        <motion.div
            className={`${sizeClasses[size]} ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay }}
        >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                <defs>
                    <linearGradient id="crystalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#166534" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="crystalGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#064e3b" stopOpacity="1" />
                        <stop offset="50%" stopColor="#166534" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#4ade80" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="crystalGrad3" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#166534" stopOpacity="1" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {/* Main crystal body */}
                <motion.polygon
                    points="100,10 180,60 180,140 100,190 20,140 20,60"
                    fill="url(#crystalGrad1)"
                    filter="url(#glow)"
                    animate={{
                        rotateY: [0, 5, 0, -5, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Top facet */}
                <polygon
                    points="100,10 180,60 100,85 20,60"
                    fill="url(#crystalGrad3)"
                    opacity="0.9"
                />
                {/* Left facet */}
                <polygon
                    points="20,60 100,85 100,190 20,140"
                    fill="url(#crystalGrad2)"
                    opacity="0.85"
                />
                {/* Right facet */}
                <polygon
                    points="180,60 180,140 100,190 100,85"
                    fill="#166534"
                    opacity="0.7"
                />
                {/* Highlight lines */}
                <line x1="100" y1="10" x2="100" y2="85" stroke="#86efac" strokeWidth="0.5" opacity="0.6" />
                <line x1="20" y1="60" x2="100" y2="85" stroke="#86efac" strokeWidth="0.5" opacity="0.4" />
                <line x1="180" y1="60" x2="100" y2="85" stroke="#bbf7d0" strokeWidth="0.5" opacity="0.3" />
            </svg>
        </motion.div>
    );
};

// Small Gem Component
const SmallGem = ({ className = '', variant = 1, delay = 0 }) => {
    const colors = variant === 1
        ? { primary: '#4ade80', secondary: '#166534', highlight: '#bbf7d0' }
        : { primary: '#22c55e', secondary: '#064e3b', highlight: '#86efac' };

    return (
        <motion.div
            className={`${className}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay }}
        >
            <motion.svg
                viewBox="0 0 60 60"
                className="w-full h-full"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <polygon
                    points="30,5 55,30 30,55 5,30"
                    fill={colors.primary}
                    opacity="0.8"
                />
                <polygon
                    points="30,5 55,30 30,30"
                    fill={colors.highlight}
                    opacity="0.5"
                />
                <polygon
                    points="5,30 30,55 30,30"
                    fill={colors.secondary}
                    opacity="0.9"
                />
            </motion.svg>
        </motion.div>
    );
};

// Dashed Border Hexagon
const DashedHexagon = ({ className = '' }) => (
    <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
    >
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
                points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="none"
                stroke="#4ade80"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.4"
            />
        </svg>
    </motion.div>
);

// Floating UI Card - Habit Tracker List
const HabitTrackerCard = () => {
    const habits = [
        { name: 'Morning Run', streak: 12, status: 'done', icon: '🏃', color: '#4ade80' },
        { name: 'Read 30 mins', streak: 8, status: 'pending', icon: '📚', color: '#eab308' },
        { name: 'Meditate', streak: 21, status: 'done', icon: '🧘', color: '#22c55e' },
        { name: 'Journal Entry', streak: 45, status: 'done', icon: '✍️', color: '#10b981' },
    ];

    return (
        <motion.div
            className="absolute left-0 bottom-20 w-[340px] bg-[#ffffff]/95 backdrop-blur-xl rounded-2xl border border-[#e5e7eb] shadow-2xl overflow-hidden"
            initial={{ opacity: 0, x: -50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#e5e7eb]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-slate-900 text-xs font-bold">
                        <Flame size={16} />
                    </div>
                    <span className="text-slate-900 font-medium">Today's Habits</span>
                </div>
                <button className="px-4 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors font-medium">
                    Add Habit
                </button>
            </div>

            {/* Table Header */}
            <div className="px-4 py-2 grid grid-cols-3 text-xs text-slate-500 border-b border-[#e5e7eb]/50">
                <span>Habit</span>
                <span>Streak</span>
                <span>Status</span>
            </div>

            {/* Habit Rows */}
            <div className="p-2">
                {habits.map((habit, idx) => (
                    <motion.div
                        key={idx}
                        className="px-2 py-2.5 grid grid-cols-3 items-center hover:bg-[#e5e7eb]/30 rounded-lg transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + idx * 0.1 }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{habit.icon}</span>
                            <span className="text-slate-700 text-sm">{habit.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Flame size={14} className="text-orange-400" />
                            <span className="text-slate-900 text-sm font-semibold">{habit.streak} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {habit.status === 'done' ? (
                                <span className="px-2 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs rounded-full font-medium flex items-center gap-1">
                                    <CheckCircle size={12} /> Done
                                </span>
                            ) : (
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium">
                                    Pending
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

// Floating UI Card - Weekly Stats
const WeeklyStatsCard = () => (
    <motion.div
        className="absolute right-0 top-10 w-[160px] bg-[#ffffff]/95 backdrop-blur-xl rounded-xl border border-[#e5e7eb] shadow-xl p-4"
        initial={{ opacity: 0, x: 50, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
    >
        <h4 className="text-slate-900 font-semibold mb-3 text-sm">Weekly Stats</h4>
        <div className="space-y-2 text-xs">
            <div className="flex justify-between">
                <span className="text-slate-500">Completed</span>
                <span className="text-slate-900">28</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-500">Missed</span>
                <span className="text-slate-900">4</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-500">Journals</span>
                <span className="text-slate-900">7</span>
            </div>
        </div>
        {/* Circular progress */}
        <div className="mt-4 flex justify-center">
            <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                    />
                    <motion.path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#4ade80"
                        strokeWidth="3"
                        strokeDasharray="88, 100"
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: "88, 100" }}
                        transition={{ duration: 1.5, delay: 1 }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-slate-900 text-sm font-bold">88%</span>
                </div>
            </div>
        </div>
    </motion.div>
);

// Floating Badge - Daily Habits
const DailyHabitsBadge = () => (
    <motion.div
        className="absolute left-16 top-32 px-4 py-2 bg-[#ffffff]/90 backdrop-blur-xl rounded-full border border-[#e5e7eb] shadow-lg flex items-center gap-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
    >
        <div className="w-6 h-6 rounded-full border-2 border-[#4ade80] flex items-center justify-center">
            <Target size={12} className="text-[#4ade80]" />
        </div>
        <span className="text-slate-900 text-sm font-medium">5 Daily Habits</span>
        <ChevronDown className="w-4 h-4 text-slate-600" />
    </motion.div>
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

    return (
        <div className="min-h-screen relative overflow-hidden font-sans" style={{ backgroundColor: '#ffffff' }}>
            {/* Background gradient overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f9fafb]/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#f9fafb] to-transparent" />
            </div>

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Cursor glow effect */}
            <div
                className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 opacity-10 blur-[100px]"
                style={{
                    background: 'radial-gradient(circle, rgba(74, 222, 128, 0.5) 0%, transparent 70%)',
                    left: mousePosition.x - 200,
                    top: mousePosition.y - 200,
                    transition: 'left 0.3s ease-out, top 0.3s ease-out',
                }}
            />

            {/* Navigation */}
            <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-50">
                <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.img
                        src={logo}
                        alt="Habiti Logo"
                        className="w-8 h-8 object-contain"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <span className="text-xl font-bold text-slate-900 tracking-tight">habiti</span>
                </motion.div>

                {/* Center Nav Links - REMOVED */}
                {/* 
                <motion.div
                    className="hidden md:flex items-center gap-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {['Features', 'Pricing', 'About', 'Blog'].map((item, i) => (
                        <a
                            key={item}
                            href="#"
                            className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </motion.div>
                */}

                {/* Right Nav */}
                <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors text-sm">
                        Log in
                    </Link>
                    <Link to="/signup" className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg font-semibold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                        Get Started
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-12 pb-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">

                    {/* Right Side - Content */}
                    <div className="relative z-10 lg:pl-8 order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Label */}
                            <motion.span
                                className="inline-block text-emerald-600 text-sm font-semibold mb-6 tracking-wide uppercase"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Build better habits
                            </motion.span>

                            {/* Main Headline */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 text-slate-900 tracking-tight">
                                Transform your{' '}
                                <span className="text-emerald-500">daily habits</span>{' '}
                                into your best self
                            </h1>

                            {/* Description */}
                            <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
                                Habiti combines smart tracking, journaling, and insights to help you build lasting habits—so you grow consistently, one day at a time.
                            </p>

                            {/* CTA Button */}
                            <Link to="/signup">
                                <motion.button
                                    className="px-8 py-4 bg-emerald-500 text-white rounded-lg font-bold text-lg shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 transition-all flex items-center gap-2"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Your Journey
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Left Side - Visual Elements (Image) */}
                    <div className="relative h-[450px] lg:h-[600px] w-full flex items-center justify-center order-2 lg:order-1 scale-[0.8] sm:scale-100 origin-center transition-transform">
                        {/* Floating small gems */}
                        <SmallGem className="absolute left-0 sm:-left-4 top-8 w-16 h-16" variant={1} delay={0.3} />
                        <SmallGem className="absolute left-10 sm:left-20 top-0 w-12 h-12" variant={2} delay={0.5} />

                        {/* Main Crystal */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -mt-10">
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                    rotateZ: [0, 2, 0, -2, 0]
                                }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Crystal size="large" delay={0.2} />
                            </motion.div>
                        </div>

                        {/* Floating UI Cards */}
                        <DailyHabitsBadge />
                        <WeeklyStatsCard />
                        <HabitTrackerCard />

                        {/* Bottom gem */}
                        <motion.div
                            className="absolute right-10 sm:right-20 bottom-16"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <SmallGem className="w-14 h-14" variant={1} delay={1.2} />
                        </motion.div>
                    </div>
                </div>

                {/* Testimonial Section */}
                <motion.div
                    className="mt-20 relative"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Loved by Habit Builders</h2>
                        <p className="text-slate-600">Join our community of achievers.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Sarah Chen",
                                role: "Product Designer",
                                streak: "45-day streak",
                                quote: "Habiti transformed how I approach my daily routines. The journaling feature helped me stay accountable and the streak tracking keeps me motivated every single day."
                            },
                            {
                                name: "Ram",
                                role: "Software Engineer",
                                streak: "32-day streak",
                                quote: "The focus timer is a game changer for my coding sessions. I've never been this productive before. Highly recommend it to anyone looking to improve focus."
                            },
                            {
                                name: "Umang",
                                role: "Student",
                                streak: "18-day streak",
                                quote: "Simple, beautiful, and effective. I love the visual graphs for my progress. It makes building new habits feel like a game that I want to win."
                            },
                            {
                                name: "Inzamam",
                                role: "Entrepreneur",
                                streak: "60-day streak",
                                quote: "Managing multiple ventures is stressful, but Habiti helps me stay grounded with daily journaling and mindfulness habits. It's an essential part of my morning."
                            }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-6 bg-[#f9fafb]/50 rounded-2xl border border-[#e5e7eb]/80 hover:border-[#4ade80]/30 transition-colors">
                                <div className="flex-1">
                                    <p className="text-slate-600 italic leading-relaxed mb-4 text-sm md:text-base">
                                        "{testimonial.quote}"
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-emerald-600 font-bold text-sm">{testimonial.name}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-500 text-xs">{testimonial.role}</span>
                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full uppercase tracking-wide">
                                            {testimonial.streak}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Features Section */}
                <div className="mt-32 grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Target className="w-8 h-8" />,
                            title: "Smart Habit Tracking",
                            desc: "Track your daily habits with beautiful visualizations. Build streaks and watch your consistency grow over time.",
                        },
                        {
                            icon: <BookOpen className="w-8 h-8" />,
                            title: "Daily Journaling",
                            desc: "Reflect on your day with guided journaling prompts. Capture thoughts, wins, and learnings all in one place.",
                        },
                        {
                            icon: <Zap className="w-8 h-8" />,
                            title: "Focus Timer",
                            desc: "Built-in Pomodoro timer to help you stay focused. Track your deep work sessions and boost productivity.",
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15, duration: 0.6 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="group relative p-8 bg-[#f9fafb]/50 rounded-2xl border border-[#e5e7eb]/50 shadow-xl overflow-hidden hover:border-[#4ade80]/30 transition-all duration-300"
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4ade80]/0 to-[#4ade80]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <motion.div
                                className="w-16 h-16 bg-gradient-to-br from-[#4ade80] to-[#22c55e] rounded-xl flex items-center justify-center mb-6 text-[#ffffff] shadow-lg shadow-[#4ade80]/20"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                            >
                                {feature.icon}
                            </motion.div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Section */}
                <motion.div
                    className="mt-24 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {[
                        { value: '10K+', label: 'Active Users' },
                        { value: '500K+', label: 'Habits Tracked' },
                        { value: '98%', label: 'Completion Rate' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            className="text-center"
                            whileHover={{ scale: 1.1 }}
                        >
                            <p className="text-3xl md:text-4xl font-bold text-emerald-500">
                                {stat.value}
                            </p>
                            <p className="text-slate-500 text-sm font-medium mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    className="mt-32 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        Ready to build better habits?
                    </h2>
                    <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto">
                        Join thousands who are transforming their daily routines and becoming their best selves.
                    </p>
                    <Link to="/signup">
                        <motion.button
                            className="px-12 py-5 bg-emerald-500 text-white rounded-xl font-bold text-lg shadow-2xl shadow-emerald-500/30"
                            whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.5)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Get Started Free <ArrowRight className="inline ml-2" size={20} />
                        </motion.button>
                    </Link>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[#e5e7eb]/50 bg-[#f9fafb]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 font-medium">© 2026 Habiti. Built for growth.</p>
                    <div className="flex gap-8">
                        <a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Terms</a>
                        <a href="mailto:habiti.connect@gmail.com" className="text-slate-500 hover:text-emerald-600 transition-colors font-medium">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
