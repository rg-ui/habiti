

import React, { useState, useEffect } from 'react';
import { Plus, X, Target, Zap, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import HabitRow from '../components/HabitRow';
import UserAvatar from '../components/UserAvatar';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
    const [habits, setHabits] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newHabit, setNewHabit] = useState({ title: '', description: '', identity_goal: '', color: '#14b8a6', goal_frequency: 'daily' });
    const [user, setUser] = useState({ username: 'Friend', is_pro: false });

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
            setHabits(processedHabits);
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
            setNewHabit({ title: '', description: '', identity_goal: '', color: '#14b8a6', goal_frequency: 'daily' });
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
        <div className="max-w-7xl mx-auto pb-20">
            {/* Sprint Header */}
            <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
                    <p className="text-slate-300 font-medium">
                        You have <span className="text-teal-400 font-bold">{habits.length} active habits</span> this sprint.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* "Sprint" Progress Chart Placeholder */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-xl border border-white/5">
                        <div className="flex items-end gap-1 h-8">
                            {[40, 70, 50, 90, 60, 80, 100].map((h, i) => (
                                <div key={i} className="w-2 bg-teal-500 rounded-t-sm opacity-50" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        <div className="ml-2 text-right">
                            <span className="block text-xs text-slate-300 font-bold uppercase">Consistency</span>
                            <span className="block text-sm font-bold text-white">82%</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">New Habit</span>
                    </button>
                </div>
            </header>

            {/* Habits List (The Sprint Look) */}
            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {habits.map(habit => (
                        <HabitRow
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
                        className="py-32 flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-black/50 border border-white/5">
                            <Target size={40} className="text-slate-700" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No active sprints</h3>
                        <p className="text-slate-300 max-w-sm mx-auto mb-8">Create your first habit to start tracking your sprint progress.</p>
                        <button onClick={() => setShowModal(true)} className="text-teal-400 font-bold hover:text-teal-300 transition-colors flex items-center gap-2 text-lg">
                            Create Habit <Plus size={20} />
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-slate-950 border border-white/10 rounded-3xl shadow-2xl shadow-black max-w-md w-full p-8 relative overflow-hidden"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">New Habit Sprint</h2>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 text-red-500 text-sm rounded-xl border border-red-500/20 flex items-center gap-3">
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            <form onSubmit={handleCreateHabit} className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Identity Goal</label>
                                    <input
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm font-medium placeholder:text-slate-700"
                                        value={newHabit.identity_goal}
                                        onChange={e => setNewHabit({ ...newHabit, identity_goal: e.target.value })}
                                        placeholder="e.g. Become a Runner"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Habit Name</label>
                                    <input
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-lg font-bold placeholder:text-slate-700"
                                        value={newHabit.title}
                                        onChange={e => setNewHabit({ ...newHabit, title: e.target.value })}
                                        placeholder="e.g. 5k Run"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Color Theme</label>
                                        <div className="h-12 flex items-center bg-slate-900/50 rounded-xl px-2 border border-white/10">
                                            <input
                                                type="color"
                                                className="w-full h-8 bg-transparent cursor-pointer rounded-lg"
                                                value={newHabit.color}
                                                onChange={e => setNewHabit({ ...newHabit, color: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Frequency</label>
                                        <select
                                            className="w-full h-12 bg-slate-900/50 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-amber-500 transition-colors text-sm font-medium appearance-none"
                                            value={newHabit.goal_frequency}
                                            onChange={e => setNewHabit({ ...newHabit, goal_frequency: e.target.value })}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98] mt-4">
                                    Create Sprint
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
