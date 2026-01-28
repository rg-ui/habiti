import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MoreHorizontal, Edit3, Trash2, Flame } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

export default function HabitRow({ habit, onToggle, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

    // Generate days - 14 days to match the reference look (2 weeks)
    const isMobile = window.innerWidth < 768;
    const dayCount = 14;
    const days = Array.from({ length: dayCount }).map((_, i) => subDays(new Date(), dayCount - 1 - i));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group relative"
        >
            {/* Top Row: Info & Stats */}
            <div className="flex items-center gap-4 mb-6">
                {/* Habit Color Indicator */}
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-105"
                    style={{
                        backgroundColor: `${habit.color}10`, // Very light wash
                        color: habit.color,
                        border: `1px solid ${habit.color}20`
                    }}
                >
                    {habit.emoji || habit.title.charAt(0).toUpperCase()}
                </div>

                {/* Habit Title & Goal */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight truncate">
                        {habit.title}
                    </h3>
                    <p className="text-slate-500 text-sm truncate font-medium mt-0.5">
                        {habit.identity_goal || 'Build consistency'}
                    </p>
                </div>

                {/* Streak Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:border-amber-200 group-hover:bg-amber-50 transition-colors">
                    <Flame size={16} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-amber-700 transition-colors">{habit.streak}</span>
                </div>

                {/* Menu Action */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-50 min-w-[150px] overflow-hidden"
                            >
                                <button
                                    onClick={() => { setShowMenu(false); onEdit(habit); }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    <Edit3 size={15} />
                                    Edit Habit
                                </button>
                                <button
                                    onClick={() => { setShowMenu(false); onDelete && onDelete(habit); }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>

            {/* Days Grid - Scrollable on mobile, flexible on desktop */}
            <div className="flex items-end justify-between gap-1 overflow-x-auto pb-2 -mx-2 px-2 md:mx-0 md:px-0 scrollbar-hide">
                {days.map((day, idx) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.completedDates?.includes(dateStr);
                    const isToday = isSameDay(day, new Date());
                    const isFuture = day > new Date();

                    return (
                        <div key={dateStr} className="flex flex-col items-center gap-2 flex-1 min-w-[40px]">
                            {/* Day Name (M, T, W...) */}
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                {format(day, 'EEEEE')}
                            </span>

                            {/* Checkbox */}
                            <button
                                onClick={() => isToday && onToggle(habit.id)}
                                disabled={!isToday}
                                className={`
                                    w-10 h-10 md:w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 relative group/box
                                    ${isCompleted
                                        ? 'shadow-md shadow-emerald-500/20'
                                        : 'bg-slate-100 border-2 border-transparent'
                                    }
                                    ${isToday && !isCompleted ? 'ring-2 ring-emerald-500 ring-offset-2 bg-white !border-slate-200 cursor-pointer hover:bg-emerald-50' : ''}
                                    ${!isToday && !isCompleted ? 'opacity-80' : ''}
                                `}
                                style={{
                                    backgroundColor: isCompleted ? (habit.color || '#10b981') : undefined,
                                }}
                            >
                                {isCompleted && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="text-white"
                                    >
                                        <Check size={20} strokeWidth={3} />
                                    </motion.div>
                                )}
                            </button>

                            {/* Date Number (12, 13...) */}
                            <span className={`text-[10px] font-bold ${isToday ? 'text-emerald-600' : 'text-slate-300'}`}>
                                {format(day, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
