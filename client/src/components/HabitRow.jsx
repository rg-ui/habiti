import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MoreHorizontal, Edit3, Trash2, X } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

export default function HabitRow({ habit, onToggle, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

    // Generate last 14 days
    const days = Array.from({ length: 14 }).map((_, i) => subDays(new Date(), 13 - i));

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-slate-900/40 border border-white/5 rounded-2xl hover:bg-slate-900/60 transition-colors group mb-4"
        >
            {/* Habit Info */}
            <div className="flex items-center gap-4 mb-4 md:mb-0 min-w-[200px]">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-white/5"
                    style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                >
                    {habit.emoji || habit.title.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="font-bold text-slate-200 text-lg leading-tight">{habit.title}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{habit.identity_goal || 'Daily Goal'}</p>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
                {days.map((day, i) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const isCompleted = habit.completedDates?.includes(dateStr);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={dateStr} className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-medium text-slate-600 uppercase">
                                {format(day, 'EE')}
                            </span>
                            <button
                                onClick={() => isToday && onToggle(habit.id)}
                                disabled={!isToday}
                                className={`
                                    w-10 h-14 rounded-xl flex items-center justify-center transition-all duration-300 relative overflow-hidden
                                    ${isCompleted
                                        ? 'shadow-[0_0_15px_-3px_var(--shadow-color)] scale-100'
                                        : 'bg-slate-800/50 border border-white/5 hover:bg-slate-800'
                                    }
                                    ${isToday && !isCompleted ? 'ring-2 ring-teal-500/50 ring-offset-2 ring-offset-slate-950 animate-pulse' : ''}
                                    ${!isToday ? 'cursor-default' : 'cursor-pointer'}
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
                                        <Check size={18} strokeWidth={3} />
                                    </motion.div>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4 ml-6 pl-6 border-l border-white/5 relative">
                <div className="text-center">
                    <p className="text-2xl font-bold text-white">{habit.streak || 0}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Streak</p>
                </div>

                {/* Menu Button */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <>
                            {/* Backdrop to close menu */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowMenu(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="absolute right-0 top-full mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 min-w-[160px] py-2"
                            >
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        onEdit(habit);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    <Edit3 size={16} />
                                    Edit Habit
                                </button>
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        onDelete && onDelete(habit);
                                    }}
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

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center justify-between w-full pt-4 mt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{habit.streak || 0}</span>
                    <span className="text-xs text-slate-500 uppercase font-bold">day streak</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(habit)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Edit3 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete && onDelete(habit)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
