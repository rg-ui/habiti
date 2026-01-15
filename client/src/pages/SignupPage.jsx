import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, AlertCircle, Check } from 'lucide-react';
import api from '../utils/api';

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.post('/auth/signup', { username, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
            {/* Background blobs */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-100/50 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full max-w-sm p-8 glass-panel rounded-3xl relative z-10 border border-white/60 shadow-2xl shadow-indigo-500/10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white mb-6 shadow-lg shadow-purple-500/30">
                        <UserPlus size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Create Account</h2>
                    <p className="text-slate-400 mt-2 text-sm font-medium">Start your journey to better habits.</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium border border-red-100/50"
                    >
                        <AlertCircle size={16} />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            className="input-field bg-white/60"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className="input-field bg-white/60"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p className="text-[10px] text-slate-400 mt-2 ml-1 font-medium tracking-wide">MUST BE AT LEAST 6 CHARACTERS</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating Account...' : 'Get Started'}
                        {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-400 text-sm font-medium">
                    Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">Login</Link>
                </p>
            </motion.div>
        </div>
    );
}
