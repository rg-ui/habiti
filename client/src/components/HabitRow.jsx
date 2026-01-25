import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MoreHorizontal, Edit3, Trash2, X, Flame } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

export default function HabitRow({ habit, onToggle, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

    // Generate days - 9 on mobile, 14 on desktop
    const isMobile = window.innerWidth < 768;
    const dayCount = isMobile ? 9 : 14;
    const days = Array.from({ length: dayCount }).map((_, i) => subDays(new Date(), dayCount - 1 - i));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="p-4 md:p-6 bg-slate-900/40 border border-white/5 rounded-2xl md:rounded-3xl active:bg-slate-900/60 md:hover:bg-slate-900/60 transition-colors group"
        >
            {/* Main Content - Clickable area on mobile */}
            <div className="flex items-center gap-3 md:gap-4 mb-4">
                {/* Habit Icon */}
                <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl shadow-lg border border-white/5 flex-shrink-0"
                    style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                >
                    {habit.emoji || habit.title.charAt(0).toUpperCase()}
                </div>

                {/* Habit Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-200 text-base md:text-lg leading-tight truncate">{habit.title}</h3>
                    <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider truncate">{habit.identity_goal || 'Daily Goal'}</p>
                </div>

                {/* Streak Badge - Always visible */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20 flex-shrink-0">
                    <Flame size={14} className="text-amber-400" />
                    <span className="text-sm font-bold text-amber-400">{habit.streak || 0}</span>
                </div>

                {/* Desktop Menu */}
                <div className="relative hidden md:block">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-colors tap-target"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="absolute right-0 top-full mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 min-w-[160px] py-2"
                            >
                                <button
                                    onClick={() => { setShowMenu(false); onEdit(habit); }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    <Edit3 size={16} />
                                    Edit Habit
                                </button>
                                <button
                                    onClick={() => { setShowMenu(false); onDelete && onDelete(habit); }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Delete Habit
                                </button>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="flex items-center gap-1 md:gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {days.map((day, i) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.completedDates?.includes(dateStr);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={dateStr} className="flex flex-col items-center gap-1 md:gap-2 flex-shrink-0">
                            <span className="text-[9px] md:text-[10px] font-medium text-slate-600 uppercase">
                                {format(day, 'EE').charAt(0)}
                            </span>
                            <button
                                onClick={() => isToday && onToggle(habit.id)}
                                disabled={!isToday}
                                className={`
                                    w-8 h-10 md:w-10 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden
                                    ${isCompleted
                                        ? 'shadow-[0_0_15px_-3px_var(--shadow-color)] scale-100'
                                        : 'bg-slate-800/50 border border-white/5'
                                    }
                                    ${isToday && !isCompleted ? 'ring-2 ring-teal-500/50 ring-offset-2 ring-offset-slate-950' : ''}
                                    ${!isToday ? 'cursor-default opacity-80' : 'cursor-pointer active:scale-95'}
                                `}
                                style={{
                                    backgroundColor: isCompleted ? habit.color : undefined,
                                    '--shadow-color': habit.color
                                }}
                            >
                                {isCompleted && (
                                    <motion.div
                                        initial={{ scale: 0.5 }}
                                        animate={{ scale: 1 }}
                                        className="text-white"
                                    >
                                        <Check size={14} className="md:w-[18px] md:h-[18px]" strokeWidth={3} />
                                    </motion.div>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Actions Row */}
            <div className="flex md:hidden items-center justify-between pt-3 mt-3 border-t border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                    {habit.streak > 0 ? `${habit.streak} day streak 🔥` : 'Start your streak!'}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(habit)}
                        className="p-2.5 text-slate-400 active:text-white active:bg-white/10 rounded-lg transition-colors tap-target"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete && onDelete(habit)}
                        className="p-2.5 text-red-400 active:text-red-300 active:bg-red-500/10 rounded-lg transition-colors tap-target"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
