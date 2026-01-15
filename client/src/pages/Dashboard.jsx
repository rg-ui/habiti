

import React, { useState, useEffect } from 'react';
import { Plus, X, Sun, Target, Sparkles, Quote } from 'lucide-react';
import api from '../utils/api';
import HabitCard from '../components/HabitCard';
import UserAvatar from '../components/UserAvatar';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
    "We are what we repeatedly do.",
    "Small steps every day.",
    "Focus on the identity, not the goal.",
    "Habits overlap identity.",
    "Progress, not perfection."
];

export default function Dashboard() {
    const [habits, setHabits] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newHabit, setNewHabit] = useState({ title: '', description: '', identity_goal: '', color: '#3B82F6', goal_frequency: 'daily' });
    const [user, setUser] = useState({ username: 'Friend', is_pro: false });
    const [stats, setStats] = useState({ total_completions: 0, current_streak: 0 });

    // Deterministic quote based on day
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const dailyQuote = QUOTES[dayOfYear % QUOTES.length];

    // Fetch user from local storage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchData = async () => {
        try {
            const [habitsRes, logsRes] = await Promise.all([
                api.get('/habits'),
                api.get('/habits/logs')
            ]);

            let totalC = 0;
            const processedHabits = habitsRes.data.map(habit => {
                const habitLogs = logsRes.data.filter(log => log.habit_id === habit.id);
                const dates = habitLogs.map(l => format(new Date(l.log_date), 'yyyy-MM-dd'));

                let streak = habitLogs.filter(l => l.completed).length;
                const progress = Math.min(100, (habitLogs.length / 7) * 100).toFixed(0);
                totalC += streak;

                return {
                    ...habit,
                    completedDates: dates,
                    streak: streak,
                    progress: progress
                };
            });

            setHabits(processedHabits);
            setStats({ total_completions: totalC, current_streak: 0 }); // Todo: calculate real streak
        } catch (err) {
            console.error("Failed to fetch data", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [error, setError] = useState(null);

    useEffect(() => {
        if (showModal) setError(null);
    }, [showModal]);

    const handleCreateHabit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await api.post('/habits', newHabit);
            setShowModal(false);
            setNewHabit({ title: '', description: '', identity_goal: '', color: '#3B82F6', goal_frequency: 'daily' });
            fetchData();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to create habit');
        }
    };

    const handleToggleHabit = async (habitId) => {
        try {
            const habit = habits.find(h => h.id === habitId);
            const today = format(new Date(), 'yyyy-MM-dd');
            const isCompleted = habit.completedDates.includes(today);

            await api.post(`/habits/${habitId}/check`, {
                date: today,
                completed: !isCompleted
            });

            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Premium Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8 relative">

                {/* Greeting & Avatar */}
                <div className="flex items-center gap-6">
                    <UserAvatar username={user.username} size="xl" />
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm font-bold text-indigo-500 mb-1 uppercase tracking-widest flex items-center gap-2"
                        >
                            <Sparkles size={14} />
                            {user.is_pro ? "Premium Member" : "Free Plan"}
                        </motion.div>
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Hello, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">{user.username}</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg mt-1 flex items-center gap-2">
                            Ready to build your legacy?
                        </p>
                    </div>
                </div>

                {/* Daily Wisdom Card (Gimic) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="hidden lg:flex flex-col items-start p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg shadow-indigo-100/50 max-w-sm"
                >
                    <Quote size={20} className="text-indigo-400 mb-2 fill-indigo-50" />
                    <p className="text-slate-600 italic font-medium">"{dailyQuote}"</p>
                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <Sun size={12} className="text-amber-400" /> Daily Wisdom
                    </div>
                </motion.div>

                {/* Mobile Action */}
                <button
                    onClick={() => setShowModal(true)}
                    className={`lg:hidden w-full flex items-center justify-center gap-2 px-6 py-4 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 active:scale-95 ${user.is_pro ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-amber-500/20' : 'bg-slate-900 shadow-slate-900/20'}`}
                >
                    <Plus size={20} strokeWidth={3} /> New Habit
                </button>
            </header>

            {/* Stats Row (Mini Gimic) */}
            <div className="flex gap-6 mb-10 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 min-w-max">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Target size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Habits</p>
                        <p className="text-xl font-bold text-slate-800">{habits.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 min-w-max">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Reps</p>
                        <p className="text-xl font-bold text-slate-800">{stats.total_completions}</p>
                    </div>
                </div>

                {/* Desktop Action */}
                <button
                    onClick={() => setShowModal(true)}
                    className="hidden lg:flex ml-auto items-center gap-3 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1 transition-all duration-300"
                >
                    <Plus size={20} />
                    <span>Create Habit</span>
                </button>
            </div>

            {/* Habits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {habits.map(habit => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onToggle={handleToggleHabit}
                            onEdit={(h) => console.log('Edit', h)}
                        />
                    ))}
                </AnimatePresence>

                {habits.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-24 bg-white/40 border border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center backdrop-blur-sm"
                    >
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rotate-3">
                            <Plus size={32} className="text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Start your journey</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mb-8 leading-relaxed">Small habits repeated daily transform your identity.</p>
                        <button onClick={() => setShowModal(true)} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors flex items-center gap-2">
                            Create first habit <Target size={16} />
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">New Habit</h2>
                                <p className="text-slate-500 text-sm">Build the identity you want.</p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                                    <X size={16} /> {error}
                                </div>
                            )}

                            <form onSubmit={handleCreateHabit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-2">
                                        <Target size={16} className="text-indigo-500" /> Identity Goal
                                    </label>
                                    <input
                                        className="input-field"
                                        value={newHabit.identity_goal}
                                        onChange={e => setNewHabit({ ...newHabit, identity_goal: e.target.value })}
                                        placeholder="e.g. I want to become a Runner"
                                        autoFocus
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Who do you want to become?</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Habit Title</label>
                                    <input
                                        className="input-field"
                                        value={newHabit.title}
                                        onChange={e => setNewHabit({ ...newHabit, title: e.target.value })}
                                        placeholder="e.g. Run 5k"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description (Optional)</label>
                                    <textarea
                                        className="input-field min-h-[80px]"
                                        value={newHabit.description}
                                        onChange={e => setNewHabit({ ...newHabit, description: e.target.value })}
                                        placeholder="Details about your habit..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                className="w-full h-12 rounded-xl cursor-pointer bg-transparent"
                                                value={newHabit.color}
                                                onChange={e => setNewHabit({ ...newHabit, color: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Frequency</label>
                                        <select
                                            className="input-field h-12 py-0"
                                            value={newHabit.goal_frequency}
                                            onChange={e => setNewHabit({ ...newHabit, goal_frequency: e.target.value })}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button type="submit" className="btn-primary w-full">
                                        Start Building Habit
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
