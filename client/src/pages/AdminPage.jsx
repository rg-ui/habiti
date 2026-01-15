import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Shield, Search } from 'lucide-react';

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setError(null);
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
            setError(err.response?.data?.error || err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const togglePremium = async (userId, currentStatus) => {
        try {
            const res = await api.put(`/admin/users/${userId}/premium`, {
                is_pro: !currentStatus
            });
            // Update local state
            setUsers(users.map(u => u.id === userId ? { ...u, is_pro: res.data.is_pro } : u));
        } catch (err) {
            console.error('Failed to update user', err);
            alert('Failed to update premium status');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading users...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                        <Shield size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
                </div>
                <p className="text-slate-500 ml-14">Manage user roles and subscription statuses.</p>
            </header>

            {error && (
                <div className="glass-panel border-l-4 border-l-red-500 text-red-600 p-4 rounded-xl flex items-center gap-3">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            <div className="glass-panel rounded-3xl overflow-hidden pb-4">
                <div className="p-6 border-b border-white/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40">
                    <h2 className="font-bold text-lg text-slate-800">User Database</h2>
                    <div className="relative w-full sm:w-auto min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by username or ID..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-8 py-5">ID</th>
                                <th className="px-8 py-5">Identity</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">Plan</th>
                                <th className="px-8 py-5 text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-8 py-5 font-mono text-xs text-slate-400 group-hover:text-indigo-400">#{user.id}</td>
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-slate-800 text-base">{user.username}</div>
                                        <div className="text-xs text-slate-400">Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {user.is_admin ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                                                <Shield size={12} strokeWidth={3} /> ADMIN
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                                                USER
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        {user.is_pro ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fff8e1] text-[#b38f00] border border-[#ffe082]">
                                                PRO
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200">
                                                FREE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {!user.is_admin && (
                                            <button
                                                onClick={() => togglePremium(user.id, user.is_pro)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${user.is_pro
                                                    ? 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-red-500 hover:border-red-200'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                                                    }`}
                                            >
                                                {user.is_pro ? 'Downgrade Plan' : 'Grant Premium'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Search size={24} className="opacity-50" />
                                        </div>
                                        <p>No users found matching "{searchTerm}"</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
