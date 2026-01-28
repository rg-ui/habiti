import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Get color based on value percentage
const getValueColor = (value, maxValue) => {
    const pct = (value / maxValue) * 100;
    if (pct < 33) return '#ef4444'; // Red
    if (pct < 66) return '#eab308'; // Yellow
    return '#22c55e'; // Green
};

const AnalyticsChart = ({ data }) => {
    // data expected: [{ title: 'Habit A', completion_count: 5 }, ...]

    // Transform data for horizontal bar chart with gradient colors
    const maxValue = Math.max(...data.map(d => parseInt(d.completion_count) || 0), 1);

    return (
        <div className="h-80 w-full p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e5e7eb, 0.5)' }}>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Habit Completion Rates</h3>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#eab308" />
                                <stop offset="100%" stopColor="#22c55e" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="#e5e7eb, 0.3)"
                        />
                        <XAxis
                            type="number"
                            stroke="#6b7280"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            dataKey="title"
                            type="category"
                            width={100}
                            stroke="#6b7280"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(163, 230, 53, 0.05)' }}
                            contentStyle={{
                                backgroundColor: '#f9fafb',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb, 0.5)',
                                color: '#fff',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
                            }}
                            labelStyle={{ color: '#10b981' }}
                        />
                        <Bar
                            dataKey="completion_count"
                            radius={[0, 8, 8, 0]}
                            fill="url(#barGradient)"
                        >
                            {data.map((entry, index) => {
                                const value = parseInt(entry.completion_count) || 0;
                                const color = getValueColor(value, maxValue);
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={color}
                                        style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
                                    />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                    No data available
                </div>
            )}
            {/* Color legend */}
            <div className="flex items-center justify-center gap-6 mt-2 text-xs">
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

export default AnalyticsChart;
