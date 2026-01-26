import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MoreHorizontal, Edit3, Trash2, Flame } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

export default function HabitRow({ habit, onToggle, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

    // Generate days - 7 on mobile, 14 on desktop
    const isMobile = window.innerWidth < 768;
    const dayCount = isMobile ? 7 : 14;
    const days = Array.from({ length: dayCount }).map((_, i) => subDays(new Date(), dayCount - 1 - i));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-4 md:p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all group"
        >
            {/* Main Content */}
            <div className="flex items-center gap-3 mb-4">
                {/* Habit Color Indicator - Clean geometric square */}
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 border"
                    style={{
                        backgroundColor: `${habit.color}15`,
                        borderColor: `${habit.color}30`,
                        color: habit.color
                    }}
                >
                    {habit.emoji || habit.title.charAt(0).toUpperCase()}
                </div>

                {/* Habit Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-200 text-sm md:text-base leading-tight truncate">
                        {habit.title}
                    </h3>
                    <p className="text-zinc-600 text-xs truncate">
                        {habit.identity_goal || 'Daily habit'}
                    </p>
                </div>

                {/* Streak - Minimal */}
                {habit.streak > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800/50 flex-shrink-0">
                        <Flame size={12} className="text-amber-500" />
                        <span className="text-xs font-semibold text-zinc-400">{habit.streak}</span>
                    </div>
                )}

                {/* Menu Button */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 min-w-[140px] py-1 overflow-hidden"
                            >
                                <button
                                    onClick={() => { setShowMenu(false); onEdit(habit); }}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                                >
                                    <Edit3 size={14} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => { setShowMenu(false); onDelete && onDelete(habit); }}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>

            {/* Heatmap Grid - Clean geometric circles */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {days.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.completedDates?.includes(dateStr);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={dateStr} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                            <span className="text-[10px] font-medium text-zinc-600">
                                {format(day, 'EE').charAt(0)}
                            </span>
                            <button
                                onClick={() => isToday && onToggle(habit.id)}
                                disabled={!isToday}
                                className={`
                                    w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all duration-200 border
                                    ${isCompleted
                                        ? 'border-transparent'
                                        : 'bg-zinc-900 border-zinc-800'
                                    }
                                    ${isToday && !isCompleted ? 'border-teal-500/50 bg-teal-500/5' : ''}
                                    ${!isToday ? 'cursor-default' : 'cursor-pointer hover:border-zinc-600'}
                                `}
                                style={{
                                    backgroundColor: isCompleted ? habit.color : undefined,
                                }}
                            >
                                {isCompleted && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <Check size={14} className="text-white" strokeWidth={2.5} />
                                    </motion.div>
                                )}
                                {isToday && !isCompleted && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                )}
                            </button>
                            <span className="text-[9px] text-zinc-700">
                                {format(day, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
