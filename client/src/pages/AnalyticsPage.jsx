import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AnalyticsChart from '../components/AnalyticsChart';
import { TrendingUp, Award, Calendar, Lock, Brain, BarChart3, Flame, Target, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

// Semi-circular Gauge Chart Component
const GaugeChart = ({ value, maxValue = 10, label, size = 200 }) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius; // Semi-circle circumference
    const offset = circumference - (percentage / 100) * circumference;

    // Color based on value
    const getColor = (val) => {
        const pct = (val / maxValue) * 100;
        if (pct < 33) return '#ef4444'; // Red
        if (pct < 66) return '#eab308'; // Yellow
        return '#22c55e'; // Green
    };

    const color = getColor(value);

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size / 2 + 20} className="transform">
                {/* Background arc */}
                <path
                    d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                    fill="none"
                    stroke="#e5e7eb, 0.3)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Value arc */}
                <path
                    d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease',
                        filter: `drop-shadow(0 0 8px ${color}40)`
                    }}
                />
                {/* Center value */}
                <text
                    x={size / 2}
                    y={size / 2 - 10}
                    textAnchor="middle"
                    className="text-4xl font-bold"
                    fill="white"
                >
                    {value.toFixed(1)}
                </text>
                {/* Label */}
                <text
                    x={size / 2}
                    y={size / 2 + 15}
                    textAnchor="middle"
                    className="text-sm font-medium"
                    fill={color}
                >
                    {label}
                </text>
            </svg>
        </div>
    );
};

// Gradient Line Chart with color transitions
const GradientLineChart = ({ data, title, dataKey = 'value', xKey = 'date' }) => {
    // Get the color for a specific value
    const getValueColor = (value, max) => {
        const pct = (value / max) * 100;
        if (pct < 33) return '#ef4444';
        if (pct < 66) return '#eab308';
        return '#22c55e';
    };

    const maxValue = Math.max(...data.map(d => d[dataKey] || 0), 1);

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <Info size={16} className="text-slate-500" />
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#eab308" />
                                <stop offset="100%" stopColor="#22c55e" />
                            </linearGradient>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e5e7eb, 0.3)"
                        />
                        <XAxis
                            dataKey={xKey}
                            stroke="#6b7280"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#6b7280"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 'dataMax + 5']}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#f9fafb',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb, 0.5)',
                                color: '#fff',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
                            }}
                            labelStyle={{ color: '#10b981' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke="url(#colorGradient)"
                            strokeWidth={3}
                            fill="url(#areaGradient)"
                            dot={(props) => {
                                const { cx, cy, value } = props;
                                const color = getValueColor(value, maxValue);
                                return (
                                    <circle
                                        key={props.key}
                                        cx={cx}
                                        cy={cy}
                                        r={6}
                                        fill={color}
                                        stroke="#f9fafb"
                                        strokeWidth={2}
                                        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                                    />
                                );
                            }}
                            activeDot={{
                                r: 8,
                                fill: '#10b981',
                                stroke: '#f9fafb',
                                strokeWidth: 2
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {/* Color legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-slate-600">Low</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-slate-600">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-slate-600">High</span>
                </div>
            </div>
        </div>
    );
};

export default function AnalyticsPage() {
    const [data, setData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [correlations, setCorrelations] = useState([]);
    const [user, setUser] = useState({ is_pro: false });
    const [loading, setLoading] = useState(true);
    const [progressData, setProgressData] = useState([]);

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

                // Fetch real weekly progress data
                try {
                    const weeklyProgressRes = await api.get('/analytics/weekly-progress');
                    setProgressData(weeklyProgressRes.data);
                } catch (err) {
                    console.log('Weekly progress not available, using empty data');
                    // Fallback to empty data for the last 7 days if API fails
                    const today = new Date();
                    const emptyProgress = [];
                    for (let i = 6; i >= 0; i--) {
                        const date = new Date(today);
                        date.setDate(date.getDate() - i);
                        emptyProgress.push({
                            date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
                            value: 0
                        });
                    }
                    setProgressData(emptyProgress);
                }

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

    // Calculate stats
    const totalCompletions = data.reduce((acc, curr) => acc + parseInt(curr.completion_count || 0), 0);
    const mostActive = data.length > 0 ? data.reduce((prev, current) => (parseInt(prev.completion_count) > parseInt(current.completion_count)) ? prev : current) : null;
    const avgPerHabit = data.length > 0 ? (totalCompletions / data.length).toFixed(1) : 0;

    // Calculate consistency score (0-10)
    const consistencyScore = data.length > 0
        ? Math.min(((totalCompletions / (data.length * 7)) * 10), 10).toFixed(1)
        : 0;
    const scoreLabel = consistencyScore >= 7 ? 'Excellent' : consistencyScore >= 5 ? 'Good' : consistencyScore >= 3 ? 'Fair' : 'Needs Work';

    const ProFeatureLock = ({ title, description, icon: Icon }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl p-8 text-center shadow-2xl group"
            style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)', border: '1px solid rgba(163, 230, 53, 0.2)' }}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#10b981]/20 blur-[50px] rounded-full pointer-events-none animate-pulse" />
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-6 p-5 rounded-2xl text-slate-900"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #4ade80 100%)', boxShadow: '0 10px 40px -10px rgba(163, 230, 53, 0.4)' }}
                >
                    <Icon size={32} strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
                <p className="text-slate-600 text-sm font-medium mb-6 max-w-xs leading-relaxed">{description}</p>
                <Link
                    to="/subscription"
                    className="px-6 py-3 text-sm font-bold rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    style={{ backgroundColor: '#10b981', color: '#ffffff', boxShadow: '0 10px 40px -10px rgba(163, 230, 53, 0.4)' }}
                >
                    Unlock Premium
                </Link>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto py-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-600">Loading analytics...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Progress Analytics</h1>
                <p className="text-slate-600 mt-1">Visualize your consistency and growth.</p>
            </header>

            {/* Top Row - Gauge Charts */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Consistency Score Gauge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e5e7eb, 0.5)' }}
                >
                    <div className="flex items-center gap-2 mb-4 text-slate-600">
                        <TrendingUp size={18} />
                        <span className="text-sm font-medium">Consistency Score</span>
                    </div>
                    <GaugeChart
                        value={parseFloat(consistencyScore)}
                        maxValue={10}
                        label={scoreLabel}
                        size={180}
                    />
                </motion.div>

                {/* Total Check-ins */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl p-6 text-slate-900 shadow-xl relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #4ade80 100%)', boxShadow: '0 10px 40px -10px rgba(163, 230, 53, 0.3)' }}
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

                {/* Most Consistent Habit */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e5e7eb, 0.5)' }}
                >
                    <div className="flex items-center gap-3 mb-4 text-[#10b981]">
                        <Award size={24} />
                        <span className="font-bold">Most Consistent</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 line-clamp-1">
                        {mostActive ? mostActive.title : 'N/A'}
                    </p>
                    <p className="text-slate-600 font-medium mt-1">
                        {mostActive ? `${mostActive.completion_count} days completed` : 'Start tracking to see this'}
                    </p>
                </motion.div>
            </div>

            {/* Progress Line Chart */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl mb-8"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e5e7eb, 0.5)' }}
            >
                <GradientLineChart
                    data={progressData}
                    title="Weekly Progress"
                    dataKey="value"
                    xKey="date"
                />
            </motion.div>

            {/* Main Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel p-6 rounded-2xl"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e5e7eb, 0.5)' }}
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6 px-2">Completion Overview</h3>
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
                    transition={{ delay: 0.5 }}
                >
                    {user.is_pro ? (
                        <div className="p-6 rounded-2xl h-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e5e7eb, 0.5)' }}>
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Wellness Check-In</h3>
                                <Info size={16} className="text-slate-500" />
                            </div>
                            <GradientLineChart
                                data={weeklyData.map(d => ({
                                    date: d.day_name?.substring(0, 3) || d.date,
                                    value: parseInt(d.completed_count) || 0
                                }))}
                                title=""
                                dataKey="value"
                                xKey="date"
                            />
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
                transition={{ delay: 0.6 }}
                className="mb-8"
            >
                {user.is_pro ? (
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e5e7eb, 0.5)' }}>
                        <div className="flex items-center gap-3 mb-6">
                            <Brain size={20} className="text-purple-400" />
                            <h3 className="text-lg font-bold text-slate-900">Mood × Productivity</h3>
                        </div>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {correlations.map((c, i) => (
                                <div key={i} className="p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #e5e7eb, 0.5)' }}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{
                                            c.mood === 'happy' ? '😄' :
                                                c.mood === 'sad' ? '😔' :
                                                    c.mood === 'energetic' ? '⚡' :
                                                        c.mood === 'relaxed' ? '😌' : '😐'
                                        }</span>
                                        <span className="font-semibold text-slate-900 capitalize">{c.mood}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-slate-900">{c.avg_completion}</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Avg Habits</div>
                                    </div>
                                </div>
                            ))}
                            {correlations.length === 0 && (
                                <div className="col-span-full text-center py-8 text-slate-600">
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
