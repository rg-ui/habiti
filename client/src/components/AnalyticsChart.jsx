import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AnalyticsChart = ({ data }) => {
    // data expected: [{ title: 'Habit A', completion_count: 5 }, ...]

    // Fresh Teal & Mint Palette
    const colors = ['#14b8a6', '#34d399', '#0ea5e9', '#8b5cf6', '#f43f5e'];

    return (
        <div className="h-80 w-full bg-slate-900/50 border border-white/5 p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-200 mb-4">Habit Completion Rates</h3>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                        <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                        <YAxis dataKey="title" type="category" width={100} stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                        <Tooltip
                            cursor={{ fill: '#ffffff10' }}
                            contentStyle={{ backgroundColor: '#1A1A1A', borderRadius: '12px', border: '1px solid #333', color: '#fff' }}
                        />
                        <Bar dataKey="completion_count" fill="#14b8a6" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                    No data available
                </div>
            )}
        </div>
    );
};

export default AnalyticsChart;
