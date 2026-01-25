import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, Flame, Clock, Trophy, ChevronDown, Volume2, VolumeX, Sparkles } from 'lucide-react';
import api from '../utils/api';

const TIMER_MODES = {
    focus: { duration: 25 * 60, label: 'Focus', color: '#14b8a6', icon: Brain },
    shortBreak: { duration: 5 * 60, label: 'Short Break', color: '#10b981', icon: Coffee },
    longBreak: { duration: 15 * 60, label: 'Long Break', color: '#6366f1', icon: Coffee },
};

// Animated background particles
const Particles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/20"
                initial={{ x: Math.random() * 400, y: Math.random() * 400, opacity: 0 }}
                animate={{
                    y: [null, -100],
                    opacity: [0, 0.5, 0],
                }}
                transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                }}
                style={{ left: `${Math.random() * 100}%`, top: `${50 + Math.random() * 50}%` }}
            />
        ))}
    </div>
);

export default function FocusPage() {
    const [mode, setMode] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(TIMER_MODES.focus.duration);
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [stats, setStats] = useState({ today_minutes: 0, week_minutes: 0, total_sessions: 0, focus_streak: 0 });
    const [habits, setHabits] = useState([]);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [showHabitDropdown, setShowHabitDropdown] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showCelebration, setShowCelebration] = useState(false);
    const audioRef = useRef(null);
    const tickRef = useRef(null);

    useEffect(() => {
        fetchStats();
        fetchHabits();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/focus/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to fetch focus stats');
        }
    };

    const fetchHabits = async () => {
        try {
            const res = await api.get('/habits');
            setHabits(res.data);
        } catch (err) {
            console.error('Failed to fetch habits');
        }
    };

    useEffect(() => {
        let interval = null;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleTimerComplete = useCallback(async () => {
        setIsRunning(false);

        if (soundEnabled && audioRef.current) {
            audioRef.current.play().catch(() => { });
        }

        if (mode === 'focus') {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);

            try {
                await api.post('/focus/session', {
                    duration_minutes: TIMER_MODES.focus.duration / 60,
                    habit_id: selectedHabit?.id || null,
                    session_type: 'focus'
                });
                setSessions(prev => prev + 1);
                fetchStats();
            } catch (err) {
                console.error('Failed to log session');
            }
        }

        if (mode === 'focus') {
            const nextMode = sessions > 0 && (sessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
            setMode(nextMode);
            setTimeLeft(TIMER_MODES[nextMode].duration);
        } else {
            setMode('focus');
            setTimeLeft(TIMER_MODES.focus.duration);
        }
    }, [mode, sessions, selectedHabit, soundEnabled]);

    const toggleTimer = () => setIsRunning(!isRunning);
    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(TIMER_MODES[mode].duration);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(TIMER_MODES[newMode].duration);
        setIsRunning(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((TIMER_MODES[mode].duration - timeLeft) / TIMER_MODES[mode].duration) * 100;
    const currentConfig = TIMER_MODES[mode];
    const ModeIcon = currentConfig.icon;
    const circumference = 2 * Math.PI * 150;

    return (
        <div className="max-w-4xl mx-auto pb-20 relative">
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" />

            {/* Celebration Modal */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="text-center"
                        >
                            <motion.div
                                className="text-8xl mb-6"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ duration: 0.5, repeat: 3 }}
                            >
                                🎉
                            </motion.div>
                            <h2 className="text-4xl font-bold text-white mb-2">Session Complete!</h2>
                            <p className="text-teal-400 text-xl">Great focus! Time for a break.</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="text-center mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-indigo-500/10 rounded-full border border-teal-500/20 mb-4"
                >
                    <Sparkles size={16} className="text-teal-400" />
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Deep Work Mode</span>
                </motion.div>
                <h1 className="text-4xl font-bold text-white mb-2">Focus Timer</h1>
                <p className="text-slate-400">Stay focused, take breaks, be productive.</p>
            </header>

            {/* Mode Selector */}
            <div className="flex justify-center gap-2 mb-8">
                {Object.entries(TIMER_MODES).map(([key, config]) => (
                    <motion.button
                        key={key}
                        onClick={() => switchMode(key)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 rounded-2xl font-medium transition-all relative overflow-hidden ${mode === key
                                ? 'text-white shadow-lg'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}
                        style={{
                            backgroundColor: mode === key ? config.color : undefined,
                            boxShadow: mode === key ? `0 10px 30px -10px ${config.color}` : undefined
                        }}
                    >
                        {config.label}
                    </motion.button>
                ))}
            </div>

            {/* Timer Display */}
            <div className="relative mx-auto w-80 h-80 mb-8">
                <Particles />

                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-full blur-[60px] opacity-30"
                    style={{ backgroundColor: currentConfig.color }}
                    animate={{
                        scale: isRunning ? [1, 1.1, 1] : 1,
                        opacity: isRunning ? [0.2, 0.4, 0.2] : 0.2,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Progress Ring */}
                <svg className="w-full h-full -rotate-90 relative z-10">
                    {/* Background ring */}
                    <circle
                        cx="160"
                        cy="160"
                        r="150"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="8"
                    />
                    {/* Progress ring */}
                    <motion.circle
                        cx="160"
                        cy="160"
                        r="150"
                        fill="none"
                        stroke={currentConfig.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - progress / 100)}
                        style={{
                            filter: `drop-shadow(0 0 10px ${currentConfig.color})`,
                        }}
                    />
                    {/* Glowing dot at progress end */}
                    <motion.circle
                        cx={160 + 150 * Math.cos((progress / 100) * 2 * Math.PI - Math.PI / 2)}
                        cy={160 + 150 * Math.sin((progress / 100) * 2 * Math.PI - Math.PI / 2)}
                        r="6"
                        fill={currentConfig.color}
                        style={{
                            filter: `drop-shadow(0 0 15px ${currentConfig.color})`,
                        }}
                        animate={{
                            scale: isRunning ? [1, 1.3, 1] : 1,
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                    />
                </svg>

                {/* Timer Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <motion.div
                        animate={{ rotate: isRunning ? 360 : 0 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    >
                        <ModeIcon size={32} style={{ color: currentConfig.color }} className="mb-4" />
                    </motion.div>
                    <motion.span
                        className="text-7xl font-bold text-white font-mono tracking-tight"
                        key={timeLeft}
                        initial={{ scale: 1.1, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.1 }}
                    >
                        {formatTime(timeLeft)}
                    </motion.span>
                    <span className="text-slate-400 mt-2 font-medium">{currentConfig.label}</span>
                </div>
            </div>

            {/* Habit Selector */}
            <div className="flex justify-center gap-4 mb-8">
                <div className="relative">
                    <button
                        onClick={() => setShowHabitDropdown(!showHabitDropdown)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-slate-300 hover:bg-white/10 transition-colors border border-white/10"
                    >
                        {selectedHabit ? (
                            <>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedHabit.color }} />
                                {selectedHabit.title}
                            </>
                        ) : (
                            'Link to habit'
                        )}
                        <ChevronDown size={16} />
                    </button>

                    <AnimatePresence>
                        {showHabitDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowHabitDropdown(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 min-w-[200px] py-2 overflow-hidden"
                                >
                                    <button
                                        onClick={() => { setSelectedHabit(null); setShowHabitDropdown(false); }}
                                        className="w-full px-4 py-2 text-left text-slate-400 hover:bg-white/5"
                                    >
                                        No habit
                                    </button>
                                    {habits.map(habit => (
                                        <button
                                            key={habit.id}
                                            onClick={() => { setSelectedHabit(habit); setShowHabitDropdown(false); }}
                                            className="w-full px-4 py-2 text-left text-white hover:bg-white/5 flex items-center gap-2"
                                        >
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                                            {habit.title}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-3 rounded-xl transition-all ${soundEnabled ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-500'}`}
                >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-6 mb-12">
                <motion.button
                    onClick={resetTimer}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                >
                    <RotateCcw size={24} />
                </motion.button>

                <motion.button
                    onClick={toggleTimer}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-8 rounded-full text-white font-bold shadow-2xl transition-all"
                    style={{
                        backgroundColor: isRunning ? '#ef4444' : currentConfig.color,
                        boxShadow: `0 20px 40px -10px ${isRunning ? '#ef4444' : currentConfig.color}`,
                    }}
                >
                    <motion.div
                        animate={isRunning ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        {isRunning ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
                    </motion.div>
                </motion.button>

                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-4 bg-white/5 rounded-2xl text-center border border-white/5 min-w-[80px]"
                >
                    <span className="text-2xl font-bold text-white block">{sessions}</span>
                    <span className="text-xs text-slate-500">sessions</span>
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: Clock, value: stats.today_minutes, label: 'Today (min)', color: 'teal' },
                    { icon: Brain, value: `${Math.round(stats.week_minutes / 60)}h`, label: 'This Week', color: 'indigo' },
                    { icon: Trophy, value: stats.total_sessions, label: 'Total Sessions', color: 'amber' },
                    { icon: Flame, value: stats.focus_streak, label: 'Day Streak', color: 'orange' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative p-6 rounded-2xl text-center overflow-hidden group"
                        style={{
                            background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <stat.icon size={24} className={`mx-auto mb-2 text-${stat.color}-400`} />
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
