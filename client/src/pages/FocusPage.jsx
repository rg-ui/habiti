import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, Flame, Clock, Trophy, ChevronDown } from 'lucide-react';
import api from '../utils/api';

const TIMER_MODES = {
    focus: { duration: 25 * 60, label: 'Focus', color: 'teal', icon: Brain },
    shortBreak: { duration: 5 * 60, label: 'Short Break', color: 'emerald', icon: Coffee },
    longBreak: { duration: 15 * 60, label: 'Long Break', color: 'indigo', icon: Coffee },
};

export default function FocusPage() {
    const [mode, setMode] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(TIMER_MODES.focus.duration);
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [stats, setStats] = useState({ today_minutes: 0, week_minutes: 0, total_sessions: 0, focus_streak: 0 });
    const [habits, setHabits] = useState([]);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [showHabitDropdown, setShowHabitDropdown] = useState(false);
    const audioRef = useRef(null);

    // Fetch stats and habits
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

    // Timer logic
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

        // Play notification sound
        if (audioRef.current) {
            audioRef.current.play().catch(() => { });
        }

        // Log session if it was focus mode
        if (mode === 'focus') {
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

        // Auto switch to break
        if (mode === 'focus') {
            const nextMode = sessions > 0 && (sessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
            setMode(nextMode);
            setTimeLeft(TIMER_MODES[nextMode].duration);
        } else {
            setMode('focus');
            setTimeLeft(TIMER_MODES.focus.duration);
        }
    }, [mode, sessions, selectedHabit]);

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

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Hidden audio element for notification */}
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" />

            {/* Header */}
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-2">Focus Timer</h1>
                <p className="text-slate-400">Stay focused, take breaks, be productive.</p>
            </header>

            {/* Mode Selector */}
            <div className="flex justify-center gap-2 mb-12">
                {Object.entries(TIMER_MODES).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => switchMode(key)}
                        className={`px-6 py-3 rounded-2xl font-medium transition-all ${mode === key
                                ? `bg-${config.color}-500 text-white shadow-lg shadow-${config.color}-500/30`
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {config.label}
                    </button>
                ))}
            </div>

            {/* Timer Display */}
            <motion.div
                key={mode}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative mx-auto w-80 h-80 mb-12"
            >
                {/* Progress Ring */}
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="160"
                        cy="160"
                        r="140"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="12"
                    />
                    <motion.circle
                        cx="160"
                        cy="160"
                        r="140"
                        fill="none"
                        stroke={mode === 'focus' ? '#14b8a6' : mode === 'shortBreak' ? '#10b981' : '#6366f1'}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 140}
                        strokeDashoffset={2 * Math.PI * 140 * (1 - progress / 100)}
                        initial={{ strokeDashoffset: 2 * Math.PI * 140 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 140 * (1 - progress / 100) }}
                    />
                </svg>

                {/* Timer Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ModeIcon size={32} className={`text-${currentConfig.color}-400 mb-4`} />
                    <span className="text-6xl font-bold text-white font-mono tracking-tight">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-slate-400 mt-2 font-medium">{currentConfig.label}</span>
                </div>
            </motion.div>

            {/* Habit Selector */}
            <div className="flex justify-center mb-8">
                <div className="relative">
                    <button
                        onClick={() => setShowHabitDropdown(!showHabitDropdown)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-slate-300 hover:bg-white/10 transition-colors"
                    >
                        <span>{selectedHabit ? selectedHabit.title : 'Link to habit (optional)'}</span>
                        <ChevronDown size={16} />
                    </button>

                    <AnimatePresence>
                        {showHabitDropdown && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowHabitDropdown(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 min-w-[200px] py-2"
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
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-16">
                <button
                    onClick={resetTimer}
                    className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                    <RotateCcw size={24} />
                </button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className={`p-6 rounded-3xl text-white font-bold shadow-xl transition-all ${isRunning
                            ? 'bg-red-500 shadow-red-500/30'
                            : `bg-${currentConfig.color}-500 shadow-${currentConfig.color}-500/30`
                        }`}
                >
                    {isRunning ? <Pause size={32} /> : <Play size={32} />}
                </motion.button>
                <div className="p-4 bg-white/5 rounded-2xl text-slate-400 flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{sessions}</span>
                    <span className="text-xs">sessions</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-2xl text-center"
                >
                    <Clock size={24} className="mx-auto mb-2 text-teal-400" />
                    <p className="text-3xl font-bold text-white">{stats.today_minutes}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold">Today (min)</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-2xl text-center"
                >
                    <Brain size={24} className="mx-auto mb-2 text-indigo-400" />
                    <p className="text-3xl font-bold text-white">{Math.round(stats.week_minutes / 60)}h</p>
                    <p className="text-xs text-slate-500 uppercase font-bold">This Week</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-2xl text-center"
                >
                    <Trophy size={24} className="mx-auto mb-2 text-amber-400" />
                    <p className="text-3xl font-bold text-white">{stats.total_sessions}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold">Total Sessions</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 rounded-2xl text-center"
                >
                    <Flame size={24} className="mx-auto mb-2 text-orange-400" />
                    <p className="text-3xl font-bold text-white">{stats.focus_streak}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold">Day Streak</p>
                </motion.div>
            </div>
        </div>
    );
}
