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
            <header className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30"
                >
                    <Trophy size={40} className="text-white" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white mb-2">Achievements</h1>
                <p className="text-slate-400">Your badges of honor. Keep building habits to unlock more!</p>

                {/* Progress */}
                <div className="inline-flex items-center gap-4 mt-6 px-6 py-3 bg-white/5 rounded-2xl">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{achievements.total_earned}</p>
                        <p className="text-xs text-slate-500 uppercase">Earned</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                        <p className="text-2xl font-bold text-slate-500">{achievements.total_available}</p>
                        <p className="text-xs text-slate-500 uppercase">Total</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <button
                        onClick={checkForNewAchievements}
                        disabled={checking}
                        className="px-4 py-2 bg-teal-500 text-slate-900 rounded-xl font-bold text-sm hover:bg-teal-400 transition-colors disabled:opacity-50"
                    >
                        {checking ? 'Checking...' : 'Check for New'}
                    </button>
                </div>
            </header>

            {/* Earned Achievements */}
            {achievements.earned.length > 0 && (
                <section className="mb-16">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Sparkles size={20} className="text-amber-400" />
                        Your Badges
                    </h2>

                    {Object.entries(earnedGroups).map(([category, badges]) => (
                        <div key={category} className="mb-8">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                                {CATEGORY_NAMES[category] || category}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {badges.map((badge, i) => (
                                    <motion.div
                                        key={badge.badge_type}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        onClick={() => setSelectedBadge(badge)}
                                        className="glass-card p-6 rounded-2xl text-center cursor-pointer group"
                                    >
                                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                                            {BADGE_ICONS[badge.badge_type] || '🏆'}
                                        </div>
                                        <p className="font-bold text-white text-sm">{badge.badge_name}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {new Date(badge.earned_at).toLocaleDateString()}
                                        </p>
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
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Lock size={20} className="text-slate-500" />
                        Locked Badges
                    </h2>

                    {Object.entries(availableGroups).map(([category, badges]) => (
                        <div key={category} className="mb-8">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                                {CATEGORY_NAMES[category] || category}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {badges.map((badge) => (
                                    <motion.div
                                        key={badge.badge_type}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setSelectedBadge({ ...badge, locked: true })}
                                        className="bg-slate-900/50 p-6 rounded-2xl text-center cursor-pointer border border-white/5 opacity-60 hover:opacity-80 transition-opacity"
                                    >
                                        <div className="text-4xl mb-3 grayscale">
                                            {BADGE_ICONS[badge.badge_type] || '🏆'}
                                        </div>
                                        <p className="font-bold text-slate-500 text-sm">{badge.name}</p>
                                        <p className="text-xs text-slate-600 mt-1">???</p>
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
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-950 border border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative"
                        >
                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white text-2xl"
                            >
                                ×
                            </button>

                            <div className={`text-6xl mb-6 ${selectedBadge.locked ? 'grayscale' : ''}`}>
                                {BADGE_ICONS[selectedBadge.badge_type] || '🏆'}
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">
                                {selectedBadge.badge_name || selectedBadge.name}
                            </h2>

                            <p className="text-slate-400 mb-6">
                                {selectedBadge.badge_description || selectedBadge.desc}
                            </p>

                            {selectedBadge.locked ? (
                                <div className="px-4 py-3 bg-white/5 rounded-xl">
                                    <Lock size={16} className="inline-block mr-2 text-slate-500" />
                                    <span className="text-slate-400">Keep going to unlock this badge!</span>
                                </div>
                            ) : (
                                <div className="px-4 py-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
                                    <span className="text-teal-400">
                                        Earned on {new Date(selectedBadge.earned_at).toLocaleDateString()}
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={() => setSelectedBadge(null)}
                                className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
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
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: 3 }}
                                className="text-6xl mb-6"
                            >
                                🎉
                            </motion.div>

                            <h2 className="text-2xl font-bold text-white mb-4">
                                New Badge{newBadges.length > 1 ? 's' : ''} Earned!
                            </h2>

                            <div className="space-y-3 mb-6">
                                {newBadges.map(badge => (
                                    <div key={badge.badge_type} className="bg-white/20 rounded-xl p-4">
                                        <span className="text-3xl mr-2">{badge.icon}</span>
                                        <span className="font-bold text-white">{badge.badge_name}</span>
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
