import React, { useState, useEffect } from 'react';
import { Check, Star, Shield, Sparkles, Crown, Zap, TrendingUp, Clock, Users, Gift, Lock, ArrowRight, X, Heart, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

export default function SubscriptionPage() {
    // Monthly only - no yearly option
    const [user, setUser] = useState({ is_pro: false });
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
    const [showPromo, setShowPromo] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Countdown timer for urgency
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 23, minutes: 59, seconds: 59 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const proFeatures = [
        { icon: Zap, text: "Unlimited Habits", highlight: true },
        { icon: TrendingUp, text: "AI-Powered Analytics & Predictions" },
        { icon: Sparkles, text: "Personalized Coaching Tips" },
        { icon: Flame, text: "Advanced Streak Protection" },
        { icon: Heart, text: "Mood & Energy Correlations" },
        { icon: Clock, text: "Detailed Time Analytics" },
        { icon: Gift, text: "Early Access to New Features" },
        { icon: Star, text: "Priority 24/7 Support" }
    ];

    const freeFeatures = [
        { text: "Track up to 3 habits", locked: false },
        { text: "7-day history only", locked: true },
        { text: "Basic analytics", locked: true },
        { text: "No streak protection", locked: true },
        { text: "Limited journal entries", locked: true }
    ];

    const testimonials = [
        { name: "Priya S.", avatar: "🧘‍♀️", text: "Pro changed my life! Lost 12kg in 3 months.", rating: 5 },
        { name: "Rahul M.", avatar: "💪", text: "Best ₹9 I spend every month. Worth every paisa!", rating: 5 },
        { name: "Ananya K.", avatar: "📚", text: "The analytics helped me study 3x more effectively.", rating: 5 }
    ];

    const stats = [
        { value: "50K+", label: "Pro Members" },
        { value: "94%", label: "Success Rate" },
        { value: "4.9★", label: "App Rating" }
    ];

    return (
        <div className="max-w-5xl mx-auto py-4 md:py-8 px-4 md:px-6 pb-28">
            {/* Urgency Banner */}
            <AnimatePresence>
                {showPromo && !user.is_pro && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 rounded-2xl p-4 relative"
                        style={{
                            background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.15) 0%, rgba(74, 222, 128, 0.15) 100%)',
                            border: '1px solid rgba(163, 230, 53, 0.3)'
                        }}
                    >
                        <button onClick={() => setShowPromo(false)} className="absolute top-3 right-3 text-black/50 hover:text-black">
                            <X size={18} />
                        </button>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
                            <div className="flex items-center gap-2">
                                <Sparkles className="text-[#10b981] animate-pulse" size={20} />
                                <span className="text-sm md:text-base font-bold text-black">Special Launch Offer!</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                                <Clock size={16} className="text-[#10b981]" />
                                <span className="font-mono text-lg font-bold text-black">
                                    {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                                </span>
                            </div>
                            <span className="text-[#10b981] font-bold text-sm">Only ₹9/month!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                    style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 146, 60, 0.2) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}
                >
                    <Crown size={16} className="text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Join 50,000+ Achievers</span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-bold text-black mb-4 tracking-tight">
                    Transform Your Life for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">₹9/month</span>
                </h1>
                <p className="text-base md:text-lg text-slate-800 max-w-2xl mx-auto leading-relaxed">
                    That's less than a cup of chai. ☕ Invest in yourself today.
                </p>
            </div>

            {/* Social Proof Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4 mb-8 md:mb-12"
            >
                {stats.map((stat, i) => (
                    <div key={i} className="text-center p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e5e7eb, 0.5)' }}>
                        <div className="text-2xl md:text-3xl font-bold text-black mb-1">{stat.value}</div>
                        <div className="text-xs text-slate-800 font-medium">{stat.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* Simple Monthly Pricing */}
            <div className="flex justify-center mb-8">
                <div className="rounded-2xl px-6 py-3 flex items-center gap-3" style={{
                    background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.15) 0%, rgba(74, 222, 128, 0.15) 100%)',
                    border: '1px solid rgba(163, 230, 53, 0.3)'
                }}>
                    <Zap size={20} className="text-[#10b981]" />
                    <span className="text-black font-bold">Simple Pricing:</span>
                    <span className="text-[#10b981] font-bold text-lg">₹9/month</span>
                    <span className="text-slate-800 text-sm">• Cancel anytime</span>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
                {/* Free Tier - Dimmed */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-3xl relative opacity-60 order-2 md:order-1"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e5e7eb, 0.3)' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f9fafb]/80 rounded-3xl pointer-events-none" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Free</h3>
                    <p className="text-slate-700 text-sm mb-4">Limited features</p>
                    <div className="text-2xl font-bold text-slate-800 mb-6">₹0</div>
                    <ul className="space-y-3 mb-6">
                        {freeFeatures.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 text-sm">
                                {feature.locked ? (
                                    <Lock size={14} className="text-slate-800" />
                                ) : (
                                    <Check size={14} className="text-slate-700" />
                                )}
                                <span className={feature.locked ? 'line-through' : ''}>{feature.text}</span>
                            </li>
                        ))}
                    </ul>
                    <button disabled className="w-full py-3 rounded-xl font-bold text-sm cursor-not-allowed" style={{ backgroundColor: '#e5e7eb, 0.3)', color: '#5e7a5e' }}>
                        {user.is_pro ? 'Downgrade' : 'Current Plan'}
                    </button>
                    <p className="text-center text-xs text-slate-800 mt-3">You're missing out on 80% of features</p>
                </motion.div>

                {/* Pro Tier - Highlighted */}
                <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative order-1 md:order-2"
                >
                    {/* Popular Badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-1">
                            <Sparkles size={12} /> MOST POPULAR
                        </span>
                    </div>

                    <div className="p-1 rounded-[2rem] bg-gradient-to-b from-amber-400 via-orange-500 to-red-500 shadow-2xl shadow-amber-500/30">
                        <div className="rounded-[1.8rem] p-6 md:p-8 relative overflow-hidden" style={{ backgroundColor: '#f9fafb' }}>
                            {/* Animated Glow */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
                            <div className="absolute bottom-0 left-0 w-60 h-60 bg-orange-500 rounded-full blur-[80px] opacity-15" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-black flex items-center gap-2">
                                        Pro <Star size={18} className="fill-amber-400 text-amber-400" />
                                    </h3>
                                    {user.is_pro && (
                                        <span className="bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <Check size={12} /> Active
                                        </span>
                                    )}
                                </div>

                                <p className="text-slate-800 text-sm mb-6">Everything you need to succeed.</p>

                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-4xl md:text-5xl font-bold text-black">₹9</span>
                                    <span className="text-slate-800 text-sm">/month</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {proFeatures.map((feature, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + i * 0.05 }}
                                            className={`flex items-center gap-3 text-sm ${feature.highlight ? 'text-amber-600 font-semibold' : 'text-slate-800'}`}
                                        >
                                            <div className={`p-1.5 rounded-full ${feature.highlight ? 'bg-amber-400/30' : 'bg-amber-400/20'}`}>
                                                <feature.icon size={14} className="text-amber-500" />
                                            </div>
                                            {feature.text}
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* Payment Section */}
                                {!user.is_pro && (
                                    <div className="p-5 rounded-2xl mb-6" style={{
                                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                        border: '1px solid #e5e7eb, 0.5)'
                                    }}>
                                        <h4 className="text-xs font-bold text-amber-500 mb-4 text-center uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Zap size={14} /> Instant Activation via UPI
                                        </h4>
                                        <div className="bg-white p-3 rounded-2xl w-36 h-36 md:w-44 md:h-44 mx-auto mb-4 shadow-xl">
                                            <img src="/assets/payment-qr.jpg" alt="UPI QR Code" className="w-full h-full object-contain" onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="%23f0f0f0" width="200" height="200"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dy=".3em">QR Code</text></svg>';
                                            }} />
                                        </div>
                                        <p className="text-center text-xs text-slate-800 mb-2">Scan with any UPI app</p>
                                        <div className="flex items-center justify-center gap-2 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #e5e7eb, 0.5)' }}>
                                            <code className="text-xs font-mono text-amber-600 select-all">7439250914@kotak811</code>
                                        </div>
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: user.is_pro ? 1 : 1.02 }}
                                    whileTap={{ scale: user.is_pro ? 1 : 0.98 }}
                                    className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${user.is_pro
                                        ? 'bg-emerald-500 text-black cursor-default'
                                        : 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-black shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50'
                                        }`}
                                    disabled={user.is_pro}
                                >
                                    {user.is_pro ? (
                                        <>✓ You're a Pro Member</>
                                    ) : (
                                        <>Upgrade Now <ArrowRight size={16} /></>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Testimonials */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
            >
                <h3 className="text-center text-lg font-bold text-black mb-6">What Pro Members Say</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {testimonials.map((t, i) => (
                        <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px solid #e5e7eb, 0.5)' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{t.avatar}</span>
                                <div>
                                    <p className="text-black font-medium text-sm">{t.name}</p>
                                    <div className="flex gap-0.5">
                                        {[...Array(t.rating)].map((_, j) => (
                                            <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-800 text-sm leading-relaxed">"{t.text}"</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Trust Badges */}
            <div className="text-center">
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-slate-600 text-xs font-medium">
                    <span className="flex items-center gap-2"><Shield size={14} className="text-emerald-500" /> Secure Payment</span>
                    <span className="flex items-center gap-2"><Zap size={14} className="text-amber-500" /> Instant Activation</span>
                    <span className="flex items-center gap-2"><Heart size={14} className="text-red-500" /> Cancel Anytime</span>
                </div>
            </div>
        </div>
    );
}
