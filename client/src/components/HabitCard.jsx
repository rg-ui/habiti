import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, MoreHorizontal, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function HabitCard({ habit, onToggle, onEdit }) {
    // Determine if completed today
    const today = format(new Date(), 'yyyy-MM-dd');
    const isCompletedToday = habit.completedDates?.includes(today);

    // Calculate fake streak/progress
    const streak = habit.streak || 0;
    const progress = habit.progress || 0; // 0 to 100

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-5 rounded-2xl relative group bg-slate-900 border border-white/5 shadow-lg shadow-black/20 hover:border-amber-500/20 hover:shadow-amber-500/10 transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    {habit.identity_goal && (
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{habit.identity_goal}</span>
                        </div>
                    )}
                    <h3 className="font-bold text-slate-200 text-lg leading-tight mb-1">{habit.title}</h3>
                    <p className="text-slate-500 text-sm font-medium line-clamp-1">{habit.description || 'Daily commitment'}</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(habit); }}
                    className="text-slate-600 hover:text-amber-500 transition-colors bg-transparent hover:bg-amber-500/10 p-2 rounded-xl"
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="mt-8 flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Flame size={16} className={`${streak > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-700'}`} />
                        <span className={`text-2xl font-bold ${streak > 0 ? 'text-slate-900' : 'text-slate-600'}`}>{streak}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 pl-6">Day streak</span>
                </div>

                <button
                    onClick={() => onToggle(habit.id)}
                    className={`
                      relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border
                      ${isCompletedToday
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 border-amber-400/50'
                            : 'bg-slate-800/50 border-white/5 text-slate-600 hover:bg-slate-800 hover:text-amber-400 hover:border-amber-500/30'
                        }
                    `}
                >
                    <AnimatePresence mode="wait">
                        {isCompletedToday ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                            >
                                <Check size={26} strokeWidth={3} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="circle"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="w-4 h-4 rounded-full border-2 border-current"
                            />
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Minimal Progress Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/50 overflow-hidden rounded-b-2xl">
                <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-50"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                />
            </div>
        </motion.div>
    );
}
