import React, { useState, useEffect } from 'react';
import { Check, Star, Shield, Sparkles, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

export default function SubscriptionPage() {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [user, setUser] = useState({ is_pro: false });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const features = [
        "Unlimited Habits",
        "Deep Analytics & Trends",
        "Weekly Progress Reports",
        "Mood & Context Correlations",
        "Priority Support",
        "Support Independent Development"
    ];

    const freeFeatures = [
        "Track up to 5 habits",
        "Basic journaling",
        "7-day history",
        "Basic analytics"
    ];

    return (
        <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-6 pb-24">
            <div className="text-center mb-10 md:mb-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full border border-amber-500/20 mb-6"
                >
                    <Crown size={16} className="text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Level Up Your Life</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight">
                    Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Identity.</span>
                </h1>
                <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Habiti Pro gives you the insights and tools to build who you want to be, faster.
                </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8 md:mb-12">
                <div className="bg-slate-900/50 p-1.5 rounded-2xl flex border border-white/5 w-full max-w-sm md:w-auto">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${billingCycle === 'monthly'
                            ? 'bg-teal-500 shadow-lg shadow-teal-500/20 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`flex-1 md:flex-none px-4 md:px-8 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${billingCycle === 'yearly'
                            ? 'bg-teal-500 shadow-lg shadow-teal-500/20 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Yearly <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide whitespace-nowrap ${billingCycle === 'yearly' ? 'bg-slate-950/30 text-slate-950' : 'bg-emerald-500/20 text-emerald-400'}`}>Save 20%</span>
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
                {/* Free Tier */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 md:p-8 rounded-[2rem] relative md:top-8 order-2 md:order-1"
                >
                    <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
                    <p className="text-slate-400 text-sm mb-6 md:mb-8 font-medium">Essential tracking for daily consistency.</p>
                    <div className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8 tracking-tight">
                        ₹0 <span className="text-base font-medium text-slate-500">/ forever</span>
                    </div>

                    <ul className="space-y-4 mb-8 md:mb-10">
                        {freeFeatures.map((feature, i) => (
                            <li key={i} className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                                <div className="bg-white/5 p-1 rounded-full border border-white/10">
                                    <Check size={14} className="text-slate-500" strokeWidth={3} />
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        className={`w-full py-3 md:py-4 rounded-2xl font-bold transition-all text-sm uppercase tracking-wide ${user.is_pro
                                ? 'bg-white/5 text-slate-500 cursor-default border border-white/5'
                                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
                            }`}
                        disabled={!user.is_pro}
                    >
                        {user.is_pro ? 'Basic Plan' : 'Current Plan'}
                    </button>
                </motion.div>

                {/* Pro Tier */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative p-1 rounded-[2.5rem] bg-gradient-to-b from-amber-400 to-amber-600 shadow-2xl shadow-amber-500/20 order-1 md:order-2"
                >
                    <div className="bg-slate-950 rounded-[2.3rem] p-6 md:p-8 h-full relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3" />

                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                                Pro <Star size={18} className="fill-amber-400 text-amber-400" />
                            </h3>
                            {billingCycle === 'yearly' && (
                                <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-300/50 shadow-lg shadow-amber-500/20 uppercase tracking-wider">
                                    Best Value
                                </span>
                            )}
                            {user.is_pro && (
                                <span className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <Check size={12} /> Active
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm mb-6 md:mb-8 font-medium relative z-10">Master your habits with deep insights.</p>

                        <div className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-white tracking-tight relative z-10">
                            {billingCycle === 'monthly' ? '₹29' : '₹299'}
                            <span className="text-base font-medium text-slate-500">
                                / {billingCycle === 'monthly' ? 'month' : 'year'}
                            </span>
                        </div>

                        <ul className="space-y-4 mb-8 md:mb-10 relative z-10">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-200 text-sm font-medium">
                                    <div className="p-1 bg-amber-400/20 rounded-full border border-amber-400/20 flex-shrink-0">
                                        <Check size={14} className="text-amber-400" strokeWidth={3} />
                                    </div>
                                    <span className="truncate">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Payment Section */}
                        {!user.is_pro && (
                            <div className="mt-8 bg-white/5 p-6 rounded-3xl backdrop-blur-md border border-white/5 relative z-10">
                                <h4 className="text-xs font-bold text-amber-400 mb-4 text-center uppercase tracking-widest">Scan to Pay</h4>
                                <div className="bg-white p-4 rounded-2xl w-40 h-40 md:w-48 md:h-48 mx-auto mb-4 shadow-lg shrink-0">
                                    <img src="/assets/payment-qr.jpg" alt="UPI QR Code" className="w-full h-full object-contain" onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="%23f0f0f0" width="200" height="200"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dy=".3em">QR Code</text></svg>';
                                    }} />
                                </div>
                                <div className="text-center overflow-hidden">
                                    <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wide font-bold">UPI ID</p>
                                    <div className="flex items-center justify-center gap-2 bg-black/40 p-3 rounded-xl border border-white/5 transition-all hover:bg-black/60 cursor-pointer overflow-x-auto">
                                        <code className="text-xs md:text-sm font-mono text-amber-400 tracking-wide select-all whitespace-nowrap">7439250914@kotak811</code>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            className={`w-full mt-8 py-3 md:py-4 rounded-2xl font-bold transition-all shadow-xl relative z-10 uppercase text-sm tracking-wide ${user.is_pro
                                    ? 'bg-emerald-500 text-white cursor-default shadow-emerald-500/20'
                                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 hover:scale-[1.02] active:scale-95 shadow-amber-500/20'
                                }`}
                            disabled={user.is_pro}
                        >
                            {user.is_pro ? '✓ Pro Member' : 'Confirm Payment'}
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="mt-12 md:mt-20 text-center pb-8 md:pb-0">
                <p className="text-slate-500 text-sm flex items-center justify-center gap-3 font-medium">
                    <Shield size={16} className="text-teal-500" /> Secure UPI Payment & Instant Activation
                </p>
            </div>
        </div>
    );
}
