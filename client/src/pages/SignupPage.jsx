import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle, Eye, EyeOff, Check, X, Sparkles } from 'lucide-react';
import api from '../utils/api';
import logo from '../assets/logo.png';

// Small Gem Component
const SmallGem = ({ className = '', variant = 1, delay = 0 }) => {
    const colors = variant === 1
        ? { primary: '#4ade80', secondary: '#166534', highlight: '#bbf7d0' }
        : { primary: '#22c55e', secondary: '#064e3b', highlight: '#86efac' };

    return (
        <motion.div
            className={`${className}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay }}
        >
            <motion.svg
                viewBox="0 0 60 60"
                className="w-full h-full"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <polygon points="30,5 55,30 30,55 5,30" fill={colors.primary} opacity="0.8" />
                <polygon points="30,5 55,30 30,30" fill={colors.highlight} opacity="0.5" />
                <polygon points="5,30 30,55 30,30" fill={colors.secondary} opacity="0.9" />
            </motion.svg>
        </motion.div>
    );
};

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Password validation
    const passwordChecks = {
        length: password.length >= 6,
        match: password === confirmPassword && password.length > 0,
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError('Username can only contain letters, numbers, and underscores');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post('/auth/signup', { username, password });

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen min-h-[100dvh] flex items-center justify-center relative overflow-hidden px-4 py-8" style={{ backgroundColor: '#ffffff' }}>
            {/* Background gradient overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-[#22c55e]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-[#4ade80]/15 rounded-full blur-[120px]" />
            </div>

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Floating gems */}
            <SmallGem className="absolute top-24 right-10 w-12 h-12 hidden md:block" variant={1} delay={0.3} />
            <SmallGem className="absolute bottom-40 left-16 w-16 h-16 hidden md:block" variant={2} delay={0.5} />
            <SmallGem className="absolute top-48 left-20 w-10 h-10 hidden md:block" variant={1} delay={0.7} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm p-6 md:p-8 rounded-3xl relative z-10 border shadow-2xl"
                style={{
                    backgroundColor: 'rgba(26, 46, 26, 0.95)',
                    borderColor: '#e5e7eb, 0.5)',
                    backdropFilter: 'blur(20px)'
                }}
            >
                <div className="text-center mb-6 md:mb-10">
                    <Link to="/">
                        <motion.img
                            src={logo}
                            alt="Habiti"
                            className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 drop-shadow-lg object-contain"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                        />
                    </Link>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
                    <p className="text-slate-600 mt-2 text-sm font-medium">Start your journey to better habits.</p>
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

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 transition-all text-slate-900 placeholder:text-slate-600 font-medium"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid #e5e7eb, 0.5)'
                            }}
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
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
                                className="w-full px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 transition-all text-slate-900 placeholder:text-slate-600 font-medium"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    border: '1px solid #e5e7eb, 0.5)'
                                }}
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 transition-all text-slate-900 placeholder:text-slate-600 font-medium"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid #e5e7eb, 0.5)'
                            }}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Password Requirements */}
                    <div className="space-y-1.5 py-2">
                        <div className={`flex items-center gap-2 text-xs ${passwordChecks.length ? 'text-[#4ade80]' : 'text-slate-500'}`}>
                            {passwordChecks.length ? <Check size={14} /> : <X size={14} />}
                            At least 6 characters
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${passwordChecks.match ? 'text-[#4ade80]' : 'text-slate-500'}`}>
                            {passwordChecks.match ? <Check size={14} /> : <X size={14} />}
                            Passwords match
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading || !passwordChecks.length || !passwordChecks.match}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.02 }}
                        className="w-full py-4 font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            boxShadow: '0 10px 40px -10px rgba(163, 230, 53, 0.3)'
                        }}
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-[#ffffff] border-t-transparent rounded-full"
                            />
                        ) : (
                            <>
                                Get Started
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-slate-600 text-sm font-medium">
                    Already have an account? <Link to="/login" className="text-[#10b981] font-bold hover:text-[#bef264] transition-colors">Login</Link>
                </p>

                <Link to="/" className="block mt-4 text-center text-slate-600 text-xs hover:text-slate-600 transition-colors">
                    ← Back to home
                </Link>

                <div className="mt-8 flex justify-center gap-6 text-xs text-slate-500">
                    <a href="#" className="hover:text-slate-800 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-slate-800 transition-colors">Terms</a>
                    <a href="mailto:habiti.connect@gmail.com" className="hover:text-slate-800 transition-colors">Contact</a>
                </div>
            </motion.div>
        </div>
    );
}
