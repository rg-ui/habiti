import React, { useState } from 'react';
import { Check, Star, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

import paymentQr from '../assets/payment-qr.jpg';

export default function SubscriptionPage() {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

    const features = [
        "Unlimited Habits",
        "Deep Analytics & Trends",
        "Weekly Progress Reports",
        "Mood & Context Correlations",
        "Priority Support",
        "Support Independent Development"
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="text-center mb-16">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3 block">Level Up Your Life</span>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-700">Identity.</span></h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Habiti Pro gives you the insights and tools to build who you want to be, faster.
                </p>
            </div>

            <div className="flex justify-center mb-12">
                <div className="bg-white p-1.5 rounded-2xl flex shadow-sm border border-slate-100">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Yearly <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${billingCycle === 'yearly' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>Save 20%</span>
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Free Tier */}
                <div className="glass-card p-8 rounded-[2rem] border border-slate-200/60 bg-white/50 relative top-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Basic</h3>
                    <p className="text-slate-400 text-sm mb-8 font-medium">Essential tracking for daily consistency.</p>
                    <div className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">₹0 <span className="text-base font-medium text-slate-400">/ forever</span></div>

                    <ul className="space-y-4 mb-10">
                        <li className="flex items-center gap-4 text-slate-600 text-sm font-medium">
                            <div className="bg-slate-100 p-1 rounded-full"><Check size={14} className="text-slate-600" strokeWidth={3} /></div> Track up to 3 habits
                        </li>
                        <li className="flex items-center gap-4 text-slate-600 text-sm font-medium">
                            <div className="bg-slate-100 p-1 rounded-full"><Check size={14} className="text-slate-600" strokeWidth={3} /></div> Basic journaling
                        </li>
                        <li className="flex items-center gap-4 text-slate-600 text-sm font-medium">
                            <div className="bg-slate-100 p-1 rounded-full"><Check size={14} className="text-slate-600" strokeWidth={3} /></div> 7-day history
                        </li>
                    </ul>

                    <button className="w-full py-4 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-sm uppercase tracking-wide">
                        Current Plan
                    </button>
                </div>

                {/* Pro Tier */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative p-1 rounded-[2.5rem] bg-gradient-to-b from-[#d4af37] to-slate-900 shadow-2xl shadow-[#d4af37]/20"
                >
                    <div className="bg-slate-900 rounded-[2.3rem] p-8 h-full relative overflow-hidden">

                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3" />

                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                                Pro <Star size={18} className="fill-[#d4af37] text-[#d4af37]" />
                            </h3>
                            {billingCycle === 'yearly' && (
                                <span className="bg-[#d4af37] text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full border border-[#d4af37]/50 shadow-lg shadow-[#d4af37]/20 uppercase tracking-wider">
                                    Best Value
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm mb-8 font-medium relative z-10">Master your habits with deep insights.</p>

                        <div className="text-4xl font-bold mb-10 text-white tracking-tight relative z-10">
                            {billingCycle === 'monthly' ? '₹29' : '₹299'}
                            <span className="text-base font-medium text-slate-500">
                                / {billingCycle === 'monthly' ? 'month' : 'year'}
                            </span>
                        </div>

                        <ul className="space-y-4 mb-10 relative z-10">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                                    <div className="p-1 bg-[#d4af37]/20 rounded-full border border-[#d4af37]/20">
                                        <Check size={14} className="text-[#d4af37]" strokeWidth={3} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 bg-white/5 p-6 rounded-3xl backdrop-blur-md border border-white/5 relative z-10">
                            <h4 className="text-xs font-bold text-[#d4af37] mb-4 text-center uppercase tracking-widest">Scan to Pay</h4>
                            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto mb-4 shadow-lg">
                                <img src={paymentQr} alt="UPI QR Code" className="w-full h-full object-contain" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wide font-bold">UPI ID</p>
                                <div className="flex items-center justify-center gap-2 bg-black/40 p-3 rounded-xl border border-white/5 transition-all hover:bg-black/60 cursor-pointer">
                                    <code className="text-sm font-mono text-[#d4af37] tracking-wide select-all">7439250914@kotak811</code>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#eacda3] text-slate-900 font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#d4af37]/20 relative z-10 uppercase text-sm tracking-wide">
                            Confirm Payment
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="mt-20 text-center">
                <p className="text-slate-400 text-sm flex items-center justify-center gap-3 font-medium opacity-60">
                    <Shield size={16} /> Secure UPI Payment & Instant Activation
                </p>
            </div>
        </div>
    );
}
