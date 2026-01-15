import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Save, Smile, Frown, Meh, Calendar, PenLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

export default function JournalPage() {
    const [entries, setEntries] = useState([]);
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('neutral');
    const [isSaving, setIsSaving] = useState(false);

    const fetchEntries = async () => {
        try {
            const res = await api.get('/journal');
            // Sort entries newest first
            const sorted = res.data.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));
            setEntries(sorted);

            const today = format(new Date(), 'yyyy-MM-dd');
            const todayEntry = res.data.find(e => e.entry_date.split('T')[0] === today);
            if (todayEntry) {
                setContent(todayEntry.content);
                setMood(todayEntry.mood);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.post('/journal', {
                date: format(new Date(), 'yyyy-MM-dd'),
                content,
                mood
            });
            await fetchEntries();
            // Optional: sleek toast notification here
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    const moodOptions = [
        { value: 'happy', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { value: 'neutral', icon: Meh, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
        { value: 'sad', icon: Frown, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' }
    ];

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-8">

            {/* Left: Writing Area */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col glass-panel rounded-3xl p-8 relative overflow-hidden"
            >
                {/* Decorative background gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />

                <header className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                            <PenLine className="text-indigo-600" /> Daily Reflection
                        </h1>
                        <p className="text-slate-500 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
                    </div>
                </header>

                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white/50 p-2 rounded-2xl flex gap-2">
                        {moodOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setMood(option.value)}
                                className={`p-3 rounded-xl transition-all duration-300 ${mood === option.value
                                    ? `${option.bg} ${option.color} ${option.border} border-2 shadow-sm scale-110`
                                    : 'text-slate-400 hover:bg-slate-50'
                                    }`}
                            >
                                <option.icon size={24} strokeWidth={mood === option.value ? 2.5 : 2} />
                            </button>
                        ))}
                    </div>
                    {/* Placeholder for Habit Link - waiting for API support or props */}
                    <div className="flex-1"></div>
                </div>

                <textarea
                    className="flex-1 w-full bg-transparent border-none resize-none focus:ring-0 outline-none text-lg text-slate-700 font-serif leading-loose placeholder:text-slate-300"
                    placeholder="Clear your mind. What's on your thoughts today?"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                ></textarea>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`
                            px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all duration-300 shadow-lg
                            ${isSaving ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30 active:scale-95'}
                        `}
                    >
                        {isSaving ? <CheckIcon className="animate-in zoom-in" /> : <Save size={20} />}
                        {isSaving ? 'Saved' : 'Save Entry'}
                    </button>
                </div>
            </motion.div>

            {/* Right: History Timeline */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full md:w-80 lg:w-96 flex flex-col gap-4"
            >
                <h2 className="text-xl font-bold text-slate-800 px-2">Recent Entries</h2>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4">
                    <AnimatePresence>
                        {entries.length > 0 ? (
                            entries.map((entry, idx) => {
                                const MoodIcon = moodOptions.find(m => m.value === entry.mood)?.icon || Meh;
                                return (
                                    <motion.div
                                        key={entry.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-default group"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 font-bold text-xs shadow-inner">
                                                    {format(new Date(entry.entry_date), 'dd')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{format(new Date(entry.entry_date), 'MMM')}</span>
                                                    <span className="text-sm font-semibold text-slate-700">{format(new Date(entry.entry_date), 'EEEE')}</span>
                                                </div>
                                            </div>
                                            <MoodIcon size={20} className={
                                                entry.mood === 'happy' ? 'text-emerald-500' :
                                                    entry.mood === 'sad' ? 'text-rose-500' : 'text-amber-500'
                                            } />
                                        </div>
                                        <div className="pl-12">
                                            <p className="text-slate-600 font-serif text-sm line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                                {entry.content}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 opacity-50">
                                <Calendar size={48} className="mx-auto mb-3 text-slate-300" />
                                <p>No entries yet.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

function CheckIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
