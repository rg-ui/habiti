import React, { useState, useEffect } from 'react';
import { Plus, X, Target, AlertCircle, Trash2, Edit3, Sparkles, Flame, TrendingUp, ChevronRight, Brain, Lock, Crown, Zap } from 'lucide-react';
import api from '../utils/api';
import HabitRow from '../components/HabitRow';
import { HabitLimitBanner, StreakFreezeCard, ProFeatureCard, ProBadge } from '../components/ProFeatureGate';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Animated gradient background
const GradientOrb = ({ color, size, position, delay = 0 }) => (
    <motion.div
        className={`absolute ${size} rounded-full blur-[100px] pointer-events-none`}
        style={{ ...position, background: color }}
        animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity, delay }}
    />
);

export default function Dashboard() {
    const [habits, setHabits] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [newHabit, setNewHabit] = useState({ title: '', description: '', identity_goal: '', color: '#14b8a6', goal_frequency: 'daily' });
    const [user, setUser] = useState({ username: 'Friend', is_pro: false });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [greeting, setGreeting] = useState('');

    // Pro feature states
    const [freezesAvailable, setFreezesAvailable] = useState(0);
    const [aiInsight, setAiInsight] = useState(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 17) setGreeting('Good afternoon');
        else setGreeting('Good evening');

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            // Fetch Pro features if user is pro
            if (userData.is_pro) {
                fetchProFeatures();
            }
        }
    }, []);

    const fetchProFeatures = async () => {
        try {
            const [freezeRes, insightRes] = await Promise.all([
                api.get('/pro/freezes'),
                api.get('/pro/insights/daily')
            ]);
            setFreezesAvailable(freezeRes.data.freezesAvailable);
            setAiInsight(insightRes.data);
        } catch (err) {
            console.log('Pro features not available:', err);
        }
    };

    const handleUseFreeze = async () => {
        try {
            const res = await api.post('/pro/freezes/use');
            setFreezesAvailable(res.data.freezesAvailable);
            alert('Streak freeze applied for today! Your streaks are protected.');
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to use freeze');
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [habitsRes, logsRes] = await Promise.all([
                api.get('/habits'),
                api.get('/habits/logs')
            ]);

            const processedHabits = habitsRes.data.map(habit => {
                const habitLogs = logsRes.data.filter(log => log.habit_id === habit.id);
                const dates = habitLogs.map(l => format(new Date(l.log_date), 'yyyy-MM-dd'));
                let streak = habitLogs.filter(l => l.completed).length;
                const progress = Math.min(100, (habitLogs.length / 7) * 100).toFixed(0);
                return { ...habit, completedDates: dates, streak, progress };
            });

            setHabits(processedHabits);
        } catch (err) {
            console.error("Failed to fetch data", err);
            setError('Failed to load habits. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);
    useEffect(() => { if (showModal) setError(null); }, [showModal]);

    const handleCreateHabit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editingHabit) {
                await api.put(`/habits/${editingHabit.id}`, newHabit);
            } else {
                await api.post('/habits', newHabit);
            }
            setShowModal(false);
            setEditingHabit(null);
            setNewHabit({ title: '', description: '', identity_goal: '', color: '#14b8a6', goal_frequency: 'daily' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save habit');
        }
    };

    const handleEditHabit = (habit) => {
        setEditingHabit(habit);
        setNewHabit({
            title: habit.title,
            description: habit.description || '',
            identity_goal: habit.identity_goal || '',
            color: habit.color || '#14b8a6',
            goal_frequency: habit.goal_frequency || 'daily'
        });
        setShowModal(true);
    };

    const handleDeleteHabit = async (habitId) => {
        try {
            await api.delete(`/habits/${habitId}`);
            setDeleteConfirm(null);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete habit');
        }
    };

    const handleToggleHabit = async (habitId) => {
        const habit = habits.find(h => h.id === habitId);
        const today = format(new Date(), 'yyyy-MM-dd');
        const isCompleted = habit.completedDates.includes(today);
        await api.post(`/habits/${habitId}/check`, { date: today, completed: !isCompleted });
        fetchData();
    };

    const FREE_HABIT_LIMIT = 3;
    const hasHitLimit = !user.is_pro && habits.length >= FREE_HABIT_LIMIT;

    const openNewHabitModal = () => {
        if (hasHitLimit) return; // Can't add more habits if limit reached
        setEditingHabit(null);
        setNewHabit({ title: '', description: '', identity_goal: '', color: '#14b8a6', goal_frequency: 'daily' });
        setShowModal(true);
    };

    const todayCompletions = habits.filter(h => h.completedDates.includes(format(new Date(), 'yyyy-MM-dd'))).length;
    const totalStreak = habits.reduce((acc, h) => acc + (h.streak || 0), 0);

    const colorPresets = ['#14b8a6', '#6366f1', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6'];

    return (
        <div className="max-w-7xl mx-auto pb-20 relative">
            {/* Background Orbs */}
            <GradientOrb color="rgba(20, 184, 166, 0.3)" size="w-[600px] h-[600px]" position={{ top: '-200px', right: '-200px' }} />
            <GradientOrb color="rgba(99, 102, 241, 0.2)" size="w-[400px] h-[400px]" position={{ bottom: '0', left: '-100px' }} delay={2} />

            {/* Header */}
            <header className="relative z-10 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"
                >
                    <div>
                        <motion.p
                            className="text-slate-400 text-lg mb-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {greeting}, <span className="text-white font-semibold">{user.username}</span> 👋
                        </motion.p>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Dashboard</span>
                        </h1>
                    </div>

                    {hasHitLimit ? (
                        <Link to="/subscription">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2"
                            >
                                <Crown size={20} />
                                Upgrade for More
                            </motion.div>
                        </Link>
                    ) : (
                        <motion.button
                            onClick={openNewHabitModal}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-bold rounded-2xl shadow-xl shadow-teal-500/20 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            New Habit
                        </motion.button>
                    )}
                </motion.div>
            </header>

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {[
                    { label: 'Active Habits', value: habits.length, icon: Target, color: 'teal', suffix: '' },
                    { label: 'Completed Today', value: todayCompletions, icon: Sparkles, color: 'emerald', suffix: `/${habits.length}` },
                    { label: 'Total Completions', value: totalStreak, icon: Flame, color: 'amber', suffix: '' },
                    { label: 'Consistency', value: habits.length > 0 ? Math.round(habits.reduce((acc, h) => acc + parseFloat(h.progress), 0) / habits.length) : 0, icon: TrendingUp, color: 'indigo', suffix: '%' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="relative p-5 rounded-2xl overflow-hidden group"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}
                    >
                        <div className={`absolute top-0 right-0 w-20 h-20 bg-${stat.color}-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-xl bg-${stat.color}-500/10`}>
                                <stat.icon size={18} className={`text-${stat.color}-400`} />
                            </div>
                            <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stat.value}<span className="text-lg text-slate-500">{stat.suffix}</span></p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Link to="/focus" className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 font-medium hover:bg-indigo-500/20 transition-colors">
                    <Sparkles size={18} />
                    Start Focus Session
                    <ChevronRight size={16} />
                </Link>
                <Link to="/templates" className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 font-medium hover:bg-amber-500/20 transition-colors">
                    <Target size={18} />
                    Browse Templates
                    <ChevronRight size={16} />
                </Link>
            </motion.div>

            {/* Habit Limit Banner for Free Users */}
            {hasHitLimit && (
                <HabitLimitBanner currentCount={habits.length} maxCount={FREE_HABIT_LIMIT} />
            )}

            {/* Pro Features Row */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                {/* Streak Freeze */}
                <StreakFreezeCard isPro={user.is_pro} freezesLeft={freezesAvailable} onUseFreeze={handleUseFreeze} />

                {/* AI Daily Insight - Pro Only */}
                {!user.is_pro ? (
                    <Link to="/subscription" className="block">
                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4 hover:border-purple-500/40 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-xl">
                                        <Brain size={20} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold text-sm">AI Daily Insight</span>
                                            <ProBadge />
                                        </div>
                                        <p className="text-slate-400 text-xs">Get personalized tips & predictions</p>
                                    </div>
                                </div>
                                <span className="text-amber-400 text-xs font-bold">Unlock →</span>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/20 rounded-xl">
                                <Brain size={20} className="text-purple-400" />
                            </div>
                            <span className="text-white font-bold text-sm">Today's AI Insight</span>
                            {aiInsight?.stats && (
                                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">
                                    {aiInsight.stats.completionRate}% done
                                </span>
                            )}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {aiInsight ? (
                                <>
                                    <span className="mr-1">{aiInsight.emoji}</span>
                                    {aiInsight.insight}
                                    <span className="block mt-1 text-purple-300 text-xs">{aiInsight.tip}</span>
                                </>
                            ) : (
                                "Loading your personalized insight..."
                            )}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 flex items-center gap-3"
                    >
                        <AlertCircle size={18} />
                        {error}
                        <button onClick={() => setError(null)} className="ml-auto">
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading */}
            {loading && (
                <div className="py-20 text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-slate-400">Loading your habits...</p>
                </div>
            )}

            {/* Habits List */}
            {!loading && (
                <div className="space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {habits.map((habit, i) => (
                            <motion.div
                                key={habit.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <HabitRow
                                    habit={habit}
                                    onToggle={handleToggleHabit}
                                    onEdit={handleEditHabit}
                                    onDelete={(h) => setDeleteConfirm(h)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {habits.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-24 flex flex-col items-center justify-center text-center"
                        >
                            <motion.div
                                className="w-24 h-24 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center mb-6 border border-teal-500/20"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <Target size={40} className="text-teal-400" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-2">No habits yet</h3>
                            <p className="text-slate-400 max-w-sm mx-auto mb-8">Create your first habit to start building the identity you want.</p>
                            <motion.button
                                onClick={openNewHabitModal}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-bold rounded-2xl shadow-xl shadow-teal-500/20"
                            >
                                Create Your First Habit <Plus size={20} className="inline ml-2" />
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-950 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
                        >
                            {/* Glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/20 rounded-full blur-[80px]" />

                            <button
                                onClick={() => { setShowModal(false); setEditingHabit(null); }}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {editingHabit ? 'Edit Habit' : '✨ New Habit'}
                                </h2>
                                <p className="text-slate-400 text-sm mb-6">
                                    {editingHabit ? 'Update your habit details' : 'What identity do you want to build?'}
                                </p>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-500/10 text-red-500 text-sm rounded-xl border border-red-500/20 flex items-center gap-3">
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}

                                <form onSubmit={handleCreateHabit} className="space-y-5">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Identity Goal</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-slate-600"
                                            value={newHabit.identity_goal}
                                            onChange={e => setNewHabit({ ...newHabit, identity_goal: e.target.value })}
                                            placeholder="e.g. Become a Runner"
                                            autoFocus={!editingHabit}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Habit Name *</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-slate-600"
                                            value={newHabit.title}
                                            onChange={e => setNewHabit({ ...newHabit, title: e.target.value })}
                                            placeholder="e.g. Run 5km"
                                            required
                                            autoFocus={!!editingHabit}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Color Theme</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {colorPresets.map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setNewHabit({ ...newHabit, color })}
                                                    className={`w-10 h-10 rounded-xl transition-all ${newHabit.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'hover:scale-105'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-bold rounded-xl shadow-xl shadow-teal-500/20 mt-4"
                                    >
                                        {editingHabit ? 'Save Changes' : 'Create Habit'} ✨
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-950 border border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center"
                        >
                            <motion.div
                                className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <Trash2 size={32} className="text-red-500" />
                            </motion.div>
                            <h2 className="text-xl font-bold text-white mb-2">Delete Habit?</h2>
                            <p className="text-slate-400 mb-6">
                                Delete <span className="text-white font-semibold">"{deleteConfirm.title}"</span>? This cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    onClick={() => handleDeleteHabit(deleteConfirm.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl transition-colors"
                                >
                                    Delete
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
