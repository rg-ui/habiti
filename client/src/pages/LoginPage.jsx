import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';
import logo from '../assets/logo.png';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Clear session on load to ensure fresh login
    React.useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen min-h-[100dvh] flex items-center justify-center relative overflow-hidden bg-slate-950 px-4 py-8">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm p-6 md:p-8 glass-panel rounded-3xl relative z-10 border border-white/5 shadow-2xl shadow-black/50"
            >
                <div className="text-center mb-8 md:mb-10">
                    <Link to="/">
                        <img src={logo} alt="Habiti" className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 drop-shadow-lg object-contain" />
                    </Link>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 mt-2 text-sm font-medium">Continue building your best self.</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-900/20 text-red-400 p-3 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium border border-red-900/30"
                    >
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                            autoCapitalize="none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input-field pr-12"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-teal-400 to-teal-500 text-slate-950 font-bold rounded-xl shadow-xl shadow-teal-500/20 active:shadow-teal-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full"
                            />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <p className="mt-6 md:mt-8 text-center text-slate-400 text-sm font-medium">
                    New here? <Link to="/signup" className="text-teal-400 font-bold active:text-teal-300 transition-colors">Create account</Link>
                </p>

                <Link to="/" className="block mt-4 text-center text-slate-600 text-xs hover:text-slate-400 transition-colors">
                    ← Back to home
                </Link>
            </motion.div>
        </div>
    );
}
