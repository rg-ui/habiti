import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AnalyticsChart from '../components/AnalyticsChart';
import { TrendingUp, Award, Calendar, Lock, Brain, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    const [data, setData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [correlations, setCorrelations] = useState([]);
    const [user, setUser] = useState({ is_pro: false });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/analytics/progress');
                setData(res.data);

                if (user.is_pro) {
                    const weeklyRes = await api.get('/analytics/weekly');
                    setWeeklyData(weeklyRes.data);

                    const corrRes = await api.get('/analytics/correlations');
                    setCorrelations(corrRes.data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user.is_pro]);

    // Calculate total completions
    const totalCompletions = data.reduce((acc, curr) => acc + parseInt(curr.completion_count), 0);
    const mostActive = data.length > 0 ? data.reduce((prev, current) => (parseInt(prev.completion_count) > parseInt(current.completion_count)) ? prev : current) : null;

    const ProFeatureLock = ({ title, description, icon: Icon }) => (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 opacity-80">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
                <div className="bg-amber-100 p-3 rounded-full mb-3 text-amber-600">
                    <Lock size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Unlock {title}</h3>
                <p className="text-slate-500 text-sm mb-4 max-w-xs">{description}</p>
                <Link to="/subscription" className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg text-sm transition-colors shadow-sm">
                    Upgrade to Pro
                </Link>
            </div>
            {/* Background elements to look 'busy' */}
            <div className="flex items-center gap-2 mb-4 opacity-30 blur-sm">
                <Icon size={24} className="text-slate-400" />
                <span className="font-bold text-slate-400">Hidden Data</span>
            </div>
            <div className="h-32 bg-slate-200/50 rounded-xl blur-sm"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Progress Analytics</h1>
                <p className="text-slate-500 mt-1">Visualize your consistency and growth.</p>
            </header>

            {/* Basic Stats Row */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden"
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
                    <div className="flex items-center gap-3 mb-4 text-emerald-600">
                        <Award size={24} />
                        <span className="font-bold">Most Consistent</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800 line-clamp-1">
                            {mostActive ? mostActive.title : 'N/A'}
                        </p>
                        <p className="text-slate-500 font-medium mt-1">
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
                    <div className="flex items-center gap-3 mb-4 text-amber-500">
                        <Calendar size={24} />
                        <span className="font-bold">Current Streak</span>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-800">
                            {mostActive ? Math.min(mostActive.completion_count, 7) : 0} Days
                        </p>
                        <p className="text-slate-500 font-medium mt-1">
                            Keep the momentum going!
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
                    <h3 className="text-lg font-bold text-slate-700 mb-6 px-2">Completion Overview</h3>
                    <AnalyticsChart data={data} />
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
                                <BarChart3 size={20} className="text-indigo-600" />
                                <h3 className="text-lg font-bold text-slate-700">Weekly Performance</h3>
                            </div>
                            <div className="flex items-end justify-between h-48 px-2">
                                {weeklyData.map((d, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                                        <div className="w-full max-w-[40px] bg-indigo-100 rounded-t-lg relative group h-full flex items-end">
                                            <div
                                                className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500"
                                                style={{ height: `${Math.min(100, d.completed_count * 10)}%` }} // Scaling factor
                                            />
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {d.completed_count} tasks
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500">{d.day_name}</span>
                                    </div>
                                ))}
                                {weeklyData.length === 0 && <p className="text-slate-400 text-sm m-auto">No data for this week</p>}
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
                            <Brain size={20} className="text-purple-600" />
                            <h3 className="text-lg font-bold text-slate-700">Mood x Productivity</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {correlations.map((c, i) => (
                                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl mr-2">{
                                            c.mood === 'Happy' ? '😄' :
                                                c.mood === 'Sad' ? '😔' :
                                                    c.mood === 'Energetic' ? '⚡' :
                                                        c.mood === 'Relaxed' ? '😌' : '😐'
                                        }</span>
                                        <span className="font-semibold text-slate-700 capitalize">{c.mood}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-slate-800">{c.avg_completion}</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Habits</div>
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
