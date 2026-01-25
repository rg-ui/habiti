import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AnalyticsChart from '../components/AnalyticsChart';
import { TrendingUp, Award, Calendar, Lock, Brain, BarChart3, Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function AnalyticsPage() {
    const [data, setData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [correlations, setCorrelations] = useState([]);
    const [user, setUser] = useState({ is_pro: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api.get('/analytics/progress');
                setData(res.data);

                if (user.is_pro) {
                    try {
                        const weeklyRes = await api.get('/analytics/weekly');
                        setWeeklyData(weeklyRes.data);
                    } catch (err) {
                        console.log('Weekly data not available');
                    }

                    try {
                        const corrRes = await api.get('/analytics/correlations');
                        setCorrelations(corrRes.data);
                    } catch (err) {
                        console.log('Correlations not available');
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.is_pro]);

    // Calculate total completions
    const totalCompletions = data.reduce((acc, curr) => acc + parseInt(curr.completion_count || 0), 0);
    const mostActive = data.length > 0 ? data.reduce((prev, current) => (parseInt(prev.completion_count) > parseInt(current.completion_count)) ? prev : current) : null;
    const avgPerHabit = data.length > 0 ? (totalCompletions / data.length).toFixed(1) : 0;

    const ProFeatureLock = ({ title, description, icon: Icon }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-center shadow-2xl border border-teal-500/20 group"
        >
            {/* Animated Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-400/20 blur-[50px] rounded-full pointer-events-none animate-pulse" />

            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg shadow-teal-500/30 text-white"
                >
                    <Icon size={32} strokeWidth={2.5} />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h3>
                <p className="text-slate-400 text-sm font-medium mb-6 max-w-xs leading-relaxed">
                    {description}
                </p>

                <Link
                    to="/subscription"
                    className="px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-slate-900 text-sm font-bold rounded-xl shadow-xl hover:shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    Unlock Premium
                </Link>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto py-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400">Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Progress Analytics</h1>
                <p className="text-slate-400 mt-1">Visualize your consistency and growth.</p>
            </header>

            {/* Basic Stats Row */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-teal-500/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={100} />
                    </div>
                    <div className="flex items-center gap-3 mb-2 opacity-90 relative z-10">
                        <TrendingUp size={24} />
                        <span className="font-medium">Total Check-ins</span>
                    </div>
                    <p className="text-5xl font-bold relative z-10">{totalCompletions}</p>
                    <p className="text-sm opacity-75 mt-2 relative z-10">Lifetime completions</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-2xl"
                >
                    <div className="flex items-center gap-3 mb-4 text-emerald-400">
                        <Award size={24} />
                        <span className="font-bold">Most Consistent</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white line-clamp-1">
                            {mostActive ? mostActive.title : 'N/A'}
                        </p>
                        <p className="text-slate-400 font-medium mt-1">
                            {mostActive ? `${mostActive.completion_count} days completed` : 'Start tracking to see this'}
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-2xl"
                >
                    <div className="flex items-center gap-3 mb-4 text-amber-400">
                        <Target size={24} />
                        <span className="font-bold">Average Per Habit</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">
                            {avgPerHabit} completions
                        </p>
                        <p className="text-slate-400 font-medium mt-1">
                            Across {data.length} habits
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Main Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-6 rounded-2xl"
                >
                    <h3 className="text-lg font-bold text-white mb-6 px-2">Completion Overview</h3>
                    {data.length > 0 ? (
                        <AnalyticsChart data={data} />
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                            <BarChart3 size={48} className="mb-4 opacity-50" />
                            <p>No habit data yet. Create a habit to start tracking!</p>
                        </div>
                    )}
                </motion.div>

                {/* Weekly Report (Pro) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {user.is_pro ? (
                        <div className="glass-panel p-6 rounded-2xl h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart3 size={20} className="text-indigo-400" />
                                <h3 className="text-lg font-bold text-white">Weekly Performance</h3>
                            </div>
                            <div className="h-64 w-full">
                                {weeklyData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                            <XAxis dataKey="day_name" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                cursor={{ fill: '#ffffff05' }}
                                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                                            />
                                            <Bar dataKey="completed_count" radius={[4, 4, 0, 0]}>
                                                {weeklyData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill="#6366f1" />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                        <p>No data recorded for this week.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <ProFeatureLock
                            title="Weekly Reports"
                            description="Get detailed breakdowns of your daily performance and spot patterns in your week."
                            icon={BarChart3}
                        />
                    )}
                </motion.div>
            </div>

            {/* Mood Correlations (Pro) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
            >
                {user.is_pro ? (
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Brain size={20} className="text-purple-400" />
                            <h3 className="text-lg font-bold text-white">Mood × Productivity</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {correlations.map((c, i) => (
                                <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{
                                            c.mood === 'happy' ? '😄' :
                                                c.mood === 'sad' ? '😔' :
                                                    c.mood === 'energetic' ? '⚡' :
                                                        c.mood === 'relaxed' ? '😌' : '😐'
                                        }</span>
                                        <span className="font-semibold text-white capitalize">{c.mood}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-white">{c.avg_completion}</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Avg Habits</div>
                                    </div>
                                </div>
                            ))}
                            {correlations.length === 0 && (
                                <div className="col-span-full text-center py-8 text-slate-400">
                                    <p>Start journaling with moods to see how they affect your habits!</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <ProFeatureLock
                        title="Mood Context Patterns"
                        description="Understand how your mood impacts your consistency. Discover your most productive states."
                        icon={Brain}
                    />
                )}
            </motion.div>
        </div>
    );
}
