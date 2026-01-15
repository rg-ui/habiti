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
            className="glass-card p-5 rounded-2xl relative group bg-white hover:bg-white/80 transition-all duration-300 border border-slate-100/50 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.02)] hover:shadow-xl hover:shadow-indigo-500/5"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    {habit.identity_goal && (
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{habit.identity_goal}</span>
                        </div>
                    )}
                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{habit.title}</h3>
                    <p className="text-slate-400 text-sm font-medium line-clamp-1">{habit.description || 'Daily commitment'}</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(habit); }}
                    className="text-slate-200 hover:text-indigo-500 transition-colors bg-transparent hover:bg-indigo-50 p-2 rounded-xl"
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="mt-8 flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Flame size={16} className={`${streak > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                        <span className={`text-2xl font-bold ${streak > 0 ? 'text-slate-800' : 'text-slate-300'}`}>{streak}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 pl-6">Day streak</span>
                </div>

                <button
                    onClick={() => onToggle(habit.id)}
                    className={`
                      relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                      ${isCompletedToday
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 rotate-0'
                            : 'bg-slate-50 text-slate-200 hover:bg-indigo-50 hover:text-indigo-300 hover:scale-105'
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
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-50 overflow-hidden rounded-b-2xl">
                <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-30"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                />
            </div>
        </motion.div>
    );
}
