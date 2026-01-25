import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lock, Check, ArrowRight, Sun, Dumbbell, Brain, Heart, Target, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CATEGORY_ICONS = {
    'Morning Routine': Sun,
    'Health & Fitness': Dumbbell,
    'Productivity': Brain,
    'Mental Health': Heart,
    'Challenges': Target,
    'default': Sparkles
};

const CATEGORY_COLORS = {
    'Morning Routine': { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
    'Health & Fitness': { bg: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/30', text: 'text-red-400' },
    'Productivity': { bg: 'from-indigo-500/20 to-purple-500/20', border: 'border-indigo-500/30', text: 'text-indigo-400' },
    'Mental Health': { bg: 'from-pink-500/20 to-purple-500/20', border: 'border-pink-500/30', text: 'text-pink-400' },
    'Challenges': { bg: 'from-teal-500/20 to-emerald-500/20', border: 'border-teal-500/30', text: 'text-teal-400' },
};

export default function TemplatesPage() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [applying, setApplying] = useState(false);
    const [user, setUser] = useState({ is_pro: false });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/templates');
            setTemplates(res.data);
        } catch (err) {
            console.error('Failed to fetch templates');
        } finally {
            setLoading(false);
        }
    };

    const applyTemplate = async (template) => {
        if (template.locked) {
            navigate('/subscription');
            return;
        }

        setApplying(true);
        try {
            await api.post(`/templates/${template.id}/use`);
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to apply template');
            alert(err.response?.data?.error || 'Failed to apply template');
        } finally {
            setApplying(false);
        }
    };

    const groupedTemplates = templates.reduce((acc, template) => {
        const cat = template.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(template);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <header className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-full border border-teal-500/20 mb-6"
                >
                    <Sparkles size={16} className="text-teal-400" />
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">Quick Start</span>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Habit Templates</h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Pre-built habit bundles to help you achieve your goals faster. Just pick one and start your journey.
                </p>
            </header>

            {/* Templates by Category */}
            {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => {
                const CategoryIcon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
                const colors = CATEGORY_COLORS[category] || { bg: 'from-slate-500/20 to-slate-600/20', border: 'border-slate-500/30', text: 'text-slate-400' };

                return (
                    <motion.section
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}>
                                <CategoryIcon size={20} className={colors.text} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">{category}</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryTemplates.map(template => (
                                <motion.div
                                    key={template.id}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className={`relative glass-card p-6 rounded-3xl cursor-pointer group ${template.locked ? 'opacity-80' : ''}`}
                                    onClick={() => setSelectedTemplate(template)}
                                >
                                    {/* Premium Badge */}
                                    {template.is_premium && (
                                        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded-full border border-amber-500/30">
                                            <Crown size={12} className="text-amber-400" />
                                            <span className="text-[10px] font-bold text-amber-400">PRO</span>
                                        </div>
                                    )}

                                    {/* Lock Overlay */}
                                    {template.locked && (
                                        <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                                            <div className="text-center">
                                                <Lock size={32} className="mx-auto mb-2 text-slate-400" />
                                                <p className="text-sm text-slate-400 font-medium">Upgrade to Pro</p>
                                            </div>
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
                                    <p className="text-slate-400 text-sm mb-4">{template.description}</p>

                                    {/* Habit Preview */}
                                    <div className="space-y-2 mb-4">
                                        {template.habits.slice(0, 3).map((habit, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
                                                <span className="text-sm text-slate-300">{habit.title}</span>
                                            </div>
                                        ))}
                                        {template.habits.length > 3 && (
                                            <span className="text-xs text-slate-500">+{template.habits.length - 3} more</span>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <span className="text-xs text-slate-500">{template.habits.length} habits</span>
                                        <div className="flex items-center gap-1 text-teal-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                            Use Template <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                );
            })}

            {/* Template Detail Modal */}
            <AnimatePresence>
                {selectedTemplate && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-950 border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full p-8 relative"
                        >
                            <button
                                onClick={() => setSelectedTemplate(null)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-white"
                            >
                                ×
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles size={24} className="text-teal-400" />
                                <h2 className="text-2xl font-bold text-white">{selectedTemplate.name}</h2>
                                {selectedTemplate.is_premium && (
                                    <span className="px-2 py-1 bg-amber-500/20 rounded-full border border-amber-500/30 text-xs font-bold text-amber-400">
                                        PRO
                                    </span>
                                )}
                            </div>

                            <p className="text-slate-400 mb-6">{selectedTemplate.description}</p>

                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Included Habits</h3>
                            <div className="space-y-3 mb-8">
                                {selectedTemplate.habits.map((habit, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: habit.color }} />
                                        <div>
                                            <p className="text-white font-medium">{habit.title}</p>
                                            <p className="text-xs text-slate-500">{habit.identity_goal}</p>
                                        </div>
                                        {habit.is_challenge && (
                                            <span className="ml-auto px-2 py-1 bg-red-500/20 rounded-full text-xs text-red-400">
                                                {habit.challenge_days} days
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => applyTemplate(selectedTemplate)}
                                disabled={applying}
                                className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${selectedTemplate.locked
                                        ? 'bg-amber-500 text-slate-900 hover:bg-amber-400'
                                        : 'bg-teal-500 text-slate-900 hover:bg-teal-400'
                                    }`}
                            >
                                {applying ? (
                                    'Creating Habits...'
                                ) : selectedTemplate.locked ? (
                                    <>
                                        <Lock size={18} />
                                        Upgrade to Pro
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        Use This Template
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
