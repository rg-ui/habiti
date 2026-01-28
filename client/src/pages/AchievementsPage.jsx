import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, Sparkles, Star, Flame, Target, Brain, Clock, BookOpen, Zap, Crown, Medal } from 'lucide-react';
import api from '../utils/api';

const BADGE_ICONS = {
    // Streaks
    'streak_7': '🔥',
    'streak_30': '⚡',
    'streak_100': '💯',
    'streak_365': '👑',
    // Completions
    'complete_10': '🌱',
    'complete_100': '💪',
    'complete_500': '🏆',
    'complete_1000': '⭐',
    // Focus
    'focus_1hr': '⏱️',
    'focus_10hr': '🎯',
    'focus_50hr': '🧠',
    'focus_100hr': '🔮',
    // Journal
    'journal_7': '📝',
    'journal_30': '📖',
    // Challenges
    'challenge_21': '🎖️',
    'challenge_66': '🏅',
    // Special
    'early_adopter': '🚀',
    'pro_member': '💎',
};

const CATEGORY_NAMES = {
    streaks: 'Streaks',
    completions: 'Completions',
    focus: 'Deep Work',
    journal: 'Journaling',
    challenges: 'Challenges',
    special: 'Special',
};

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState({ earned: [], available: [] });
    const [loading, setLoading] = useState(true);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [checking, setChecking] = useState(false);
    const [newBadges, setNewBadges] = useState([]);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await api.get('/achievements');
            setAchievements(res.data);
        } catch (err) {
            console.error('Failed to fetch achievements');
        } finally {
            setLoading(false);
        }
    };

    const checkForNewAchievements = async () => {
        setChecking(true);
        try {
            const res = await api.post('/achievements/check');
            if (res.data.new_achievements?.length > 0) {
                setNewBadges(res.data.new_achievements);
                fetchAchievements(); // Refresh the list
            }
        } catch (err) {
            console.error('Failed to check achievements');
        } finally {
            setChecking(false);
        }
    };

    // Group badges by category
    const groupBadges = (badges) => {
        return badges.reduce((acc, badge) => {
            const cat = badge.category || 'special';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(badge);
            return acc;
        }, {});
    };

    const earnedGroups = groupBadges(achievements.earned);
    const availableGroups = groupBadges(achievements.available);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <header className="flex flex-col items-center justify-center pt-8 mb-16">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-orange-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-orange-500/20"
                >
                    <Trophy size={48} className="text-white" strokeWidth={1.5} />
                </motion.div>

                <h1 className="text-5xl font-bold text-orange-500 mb-3 tracking-tight">Achievements</h1>
                <p className="text-slate-600 text-lg font-medium">Your badges of honor. Keep building habits to unlock more!</p>

                {/* Pill Stats Container */}
                <div className="flex items-center gap-8 mt-10 px-8 py-4 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div className="text-center min-w-[80px]">
                        <p className="text-3xl font-bold text-black leading-none mb-1">{achievements.total_earned}</p>
                        <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">Earned</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100" />
                    <div className="text-center min-w-[80px]">
                        <p className="text-3xl font-bold text-slate-400 leading-none mb-1">{achievements.total_available}</p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Total</p>
                    </div>
                    <div className="w-px h-10 bg-slate-100" />
                    <button
                        onClick={checkForNewAchievements}
                        disabled={checking}
                        className="px-6 py-3 bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100 rounded-xl font-bold text-sm transition-all disabled:opacity-50 border border-emerald-100"
                    >
                        {checking ? 'Checking...' : 'Check'}
                    </button>
                </div>
            </header>

            {/* Earned Achievements */}
            {achievements.earned.length > 0 && (
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-black mb-10 flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <Sparkles size={24} className="text-orange-500" />
                        </div>
                        Your Collection
                    </h2>

                    {Object.entries(earnedGroups).map(([category, badges]) => (
                        <div key={category} className="mb-12">
                            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] mb-6 pl-1">
                                {CATEGORY_NAMES[category] || category}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {badges.map((badge, i) => (
                                    <motion.div
                                        key={badge.badge_type}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)" }}
                                        onClick={() => setSelectedBadge(badge)}
                                        className="bg-white border border-slate-100 p-8 rounded-[2rem] text-center cursor-pointer group transition-all duration-300 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]"
                                    >
                                        <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">
                                            {BADGE_ICONS[badge.badge_type] || '🏆'}
                                        </div>
                                        <p className="font-bold text-black text-lg mb-2">{badge.badge_name}</p>
                                        <div className="inline-block px-3 py-1 bg-slate-50 rounded-lg">
                                            <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                                                Earned
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Locked Achievements */}
            {achievements.available.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold text-black mb-10 flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <Lock size={24} className="text-slate-400" />
                        </div>
                        To Unlock
                    </h2>

                    {Object.entries(availableGroups).map(([category, badges]) => (
                        <div key={category} className="mb-12">
                            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] mb-6 pl-1">
                                {CATEGORY_NAMES[category] || category}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {badges.map((badge) => (
                                    <motion.div
                                        key={badge.badge_type}
                                        whileHover={{ scale: 1.02, backgroundColor: '#ffffff' }}
                                        onClick={() => setSelectedBadge({ ...badge, locked: true })}
                                        className="bg-white/50 border border-slate-100 p-8 rounded-[2rem] text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-200"
                                    >
                                        <div className="text-5xl mb-6 opacity-30 grayscale filter">
                                            {BADGE_ICONS[badge.badge_type] || '🏆'}
                                        </div>
                                        <p className="font-bold text-slate-400 text-lg mb-2">{badge.name}</p>
                                        <div className="inline-block px-3 py-1">
                                            <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">
                                                LOCKED
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Badge Detail Modal */}
            <AnimatePresence>
                {selectedBadge && (
                    <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-slate-100 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative"
                        >
                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl transition-colors"
                            >
                                ×
                            </button>

                            <div className={`text-6xl mb-6 ${selectedBadge.locked ? 'grayscale opacity-50' : 'filter drop-shadow-xl'}`}>
                                {BADGE_ICONS[selectedBadge.badge_type] || '🏆'}
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                {selectedBadge.badge_name || selectedBadge.name}
                            </h2>

                            <p className="text-slate-500 mb-8 leading-relaxed">
                                {selectedBadge.badge_description || selectedBadge.desc}
                            </p>

                            {selectedBadge.locked ? (
                                <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <Lock size={16} className="inline-block mr-2 text-slate-400" />
                                    <span className="text-slate-500 font-medium text-sm">Keep going to unlock this badge!</span>
                                </div>
                            ) : (
                                <div className="px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 font-medium text-sm">
                                    Earned on {new Date(selectedBadge.earned_at).toLocaleDateString()}
                                </div>
                            )}

                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="mt-8 w-full py-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-white font-bold transition-colors shadow-lg shadow-slate-900/20"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* New Badge Celebration Modal */}
            <AnimatePresence>
                {newBadges.length > 0 && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: 3 }}
                                className="text-6xl mb-6"
                            >
                                🎉
                            </motion.div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                New Badge{newBadges.length > 1 ? 's' : ''} Earned!
                            </h2>

                            <div className="space-y-3 mb-6">
                                {newBadges.map(badge => (
                                    <div key={badge.badge_type} className="bg-white/20 rounded-xl p-4">
                                        <span className="text-3xl mr-2">{badge.icon}</span>
                                        <span className="font-bold text-slate-900">{badge.badge_name}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setNewBadges([])}
                                className="w-full py-3 bg-white text-amber-600 rounded-xl font-bold hover:bg-white/90 transition-colors"
                            >
                                Awesome! 🎊
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
