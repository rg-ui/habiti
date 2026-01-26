import React from 'react';
import { Lock, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Inline Pro Lock - for small elements
export const ProBadge = ({ size = 'sm' }) => (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full border border-amber-400/30 ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
        <Crown size={size === 'sm' ? 10 : 12} className="text-amber-400" />
        <span className="text-amber-400 font-bold">PRO</span>
    </span>
);

// Overlay Lock - for locked features
export const ProOverlay = ({ title, children }) => (
    <div className="relative group">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Link
                to="/subscription"
                className="flex flex-col items-center gap-2 p-4 text-center"
            >
                <div className="p-3 bg-amber-400/20 rounded-full border border-amber-400/30">
                    <Lock size={20} className="text-amber-400" />
                </div>
                <span className="text-white font-bold text-sm">{title || 'Unlock with Pro'}</span>
                <span className="text-amber-400 text-xs font-medium flex items-center gap-1">
                    Upgrade <ArrowRight size={12} />
                </span>
            </Link>
        </div>
        <div className="opacity-50 pointer-events-none blur-[1px]">
            {children}
        </div>
    </div>
);

// Full Card Lock - for entire sections
export const ProFeatureCard = ({
    icon: Icon,
    title,
    description,
    features = [],
    gradient = 'from-amber-400 to-orange-500'
}) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 p-6 md:p-8 border border-amber-500/20 shadow-2xl"
    >
        {/* Animated Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-[80px] animate-pulse pointer-events-none" />

        <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
                <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg text-white`}
                >
                    <Icon size={28} strokeWidth={2} />
                </motion.div>
                <ProBadge size="md" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">{description}</p>

            {features.length > 0 && (
                <ul className="space-y-2 mb-6">
                    {features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                            <Sparkles size={14} className="text-amber-400" />
                            {feature}
                        </li>
                    ))}
                </ul>
            )}

            <Link
                to="/subscription"
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r ${gradient} text-slate-900 font-bold rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5`}
            >
                <Crown size={16} /> Unlock Pro Feature
            </Link>
        </div>
    </motion.div>
);

// Habit Limit Banner - shows when user hits limit
export const HabitLimitBanner = ({ currentCount, maxCount = 3 }) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 rounded-2xl p-4 md:p-6 mb-6"
    >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-400/20 rounded-xl">
                    <Lock size={24} className="text-amber-400" />
                </div>
                <div>
                    <h4 className="text-white font-bold">Habit Limit Reached</h4>
                    <p className="text-slate-400 text-sm">
                        You're using {currentCount}/{maxCount} habits. Upgrade to Pro for unlimited habits.
                    </p>
                </div>
            </div>
            <Link
                to="/subscription"
                className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold text-sm rounded-xl shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
                <Crown size={16} /> Go Unlimited
            </Link>
        </div>
    </motion.div>
);

// Streak Freeze Card
export const StreakFreezeCard = ({ isPro, freezesLeft = 0, onUseFreeze }) => {
    if (!isPro) {
        return (
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                            <span className="text-2xl">🧊</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-sm">Streak Freeze</span>
                                <ProBadge />
                            </div>
                            <p className="text-slate-400 text-xs">Protect your streaks on off days</p>
                        </div>
                    </div>
                    <Link to="/subscription" className="text-amber-400 text-xs font-bold hover:underline">
                        Unlock →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                        <span className="text-2xl">🧊</span>
                    </div>
                    <div>
                        <span className="text-white font-bold text-sm">Streak Freeze</span>
                        <p className="text-slate-400 text-xs">{freezesLeft} freezes available this month</p>
                    </div>
                </div>
                <button
                    onClick={onUseFreeze}
                    disabled={freezesLeft <= 0}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${freezesLeft > 0
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    Use Freeze
                </button>
            </div>
        </div>
    );
};

// Export Data Button
export const ExportDataButton = ({ isPro }) => {
    if (!isPro) {
        return (
            <Link
                to="/subscription"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-sm hover:bg-white/10 transition-all"
            >
                <span>📊 Export Data</span>
                <ProBadge />
            </Link>
        );
    }

    return (
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-500/30 rounded-xl text-teal-400 text-sm font-medium hover:bg-teal-500/30 transition-all">
            📊 Export Data
        </button>
    );
};

export default {
    ProBadge,
    ProOverlay,
    ProFeatureCard,
    HabitLimitBanner,
    StreakFreezeCard,
    ExportDataButton
};
