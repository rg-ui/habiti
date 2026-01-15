import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AnalyticsChart = ({ data }) => {
    // data expected: [{ title: 'Habit A', completion_count: 5 }, ...]

    // Custom blue colors
    const colors = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#10B981'];

    return (
        <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Habit Completion Rates</h3>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="title" type="category" width={100} />
                        <Tooltip
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="completion_count" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                    No data available
                </div>
            )}
        </div>
    );
};

export default AnalyticsChart;
