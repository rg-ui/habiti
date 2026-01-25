import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Shield, Search, Crown, User, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(null);

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
            setUpdating(userId);
            const res = await api.put(`/admin/users/${userId}/premium`, {
                is_pro: !currentStatus
            });
            // Update local state
            setUsers(users.map(u => u.id === userId ? { ...u, is_pro: res.data.is_pro } : u));
        } catch (err) {
            console.error('Failed to update user', err);
            setError('Failed to update premium status');
        } finally {
            setUpdating(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <Shield size={24} className="text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
                </div>
                <p className="text-slate-400 ml-14">Manage user roles and subscription statuses.</p>
            </header>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-panel border-l-4 border-l-red-500 text-red-400 p-4 rounded-xl flex items-center gap-3"
                    >
                        <AlertCircle size={18} />
                        <span className="font-medium">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-400 hover:text-red-300"
                        >
                            ×
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="glass-panel rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5">
                    <h2 className="font-bold text-lg text-white flex items-center gap-2">
                        <User size={18} className="text-slate-400" />
                        User Database
                        <span className="text-sm font-normal text-slate-500">({users.length} users)</span>
                    </h2>
                    <div className="relative w-full sm:w-auto min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by username or ID..."
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-8 py-5">ID</th>
                                <th className="px-8 py-5">Identity</th>
                                <th className="px-8 py-5">Role</th>
                                <th className="px-8 py-5">Plan</th>
                                <th className="px-8 py-5 text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(user => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-8 py-5 font-mono text-xs text-slate-500 group-hover:text-teal-400">#{user.id}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-indigo-500/20 flex items-center justify-center text-sm font-bold text-white border border-white/10">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-base">{user.username}</div>
                                                <div className="text-xs text-slate-500">Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {user.is_admin ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                                                <Shield size={12} strokeWidth={3} /> ADMIN
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-white/5">
                                                USER
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        {user.is_pro ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/20">
                                                <Crown size={12} /> PRO
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-500 border border-white/5">
                                                FREE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {!user.is_admin && (
                                            <button
                                                onClick={() => togglePremium(user.id, user.is_pro)}
                                                disabled={updating === user.id}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-wait ${user.is_pro
                                                    ? 'bg-white/5 text-slate-400 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                                                    : 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-teal-500/20'
                                                    }`}
                                            >
                                                {updating === user.id ? 'Updating...' : (user.is_pro ? 'Downgrade Plan' : 'Grant Premium')}
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/5">
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
