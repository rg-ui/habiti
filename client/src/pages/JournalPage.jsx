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
        <div className="max-w-7xl mx-auto min-h-[calc(100vh-6rem)] md:h-[calc(100vh-6rem)] flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-6 pb-24 md:pb-4">

            {/* Left: Writing Area */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-[2] flex flex-col bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-black/40 group min-h-[60vh] md:min-h-0"
            >
                {/* Ambient Glows */}
                <div className="absolute top-[-20%] left-[-10%] w-64 md:w-96 h-64 md:h-96 bg-teal-500/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none group-hover:bg-teal-500/30 transition-colors duration-700" />
                <div className="absolute bottom-[-20%] right-[-10%] w-64 md:w-96 h-64 md:h-96 bg-indigo-500/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-700" />

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 mb-6 md:mb-8 relative z-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-4 mb-1 md:mb-2">
                            Daily Reflection
                        </h1>
                        <p className="text-teal-200/60 font-medium text-base md:text-lg tracking-wide">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
                    </div>

                    <div className="w-full md:w-auto bg-black/20 backdrop-blur-md p-1.5 rounded-2xl flex justify-between md:justify-start gap-1 border border-white/5">
                        {moodOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setMood(option.value)}
                                className={`flex-1 md:flex-none p-2.5 md:p-3 rounded-xl transition-all duration-300 relative group/icon flex justify-center items-center ${mood === option.value
                                    ? 'bg-gradient-to-br from-teal-500/20 to-teal-900/40 text-teal-300 shadow-inner'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                    }`}
                            >
                                <option.icon size={24} strokeWidth={mood === option.value ? 2.5 : 1.5} className="relative z-10 md:w-7 md:h-7" />
                                {mood === option.value && (
                                    <motion.div
                                        layoutId="activeMood"
                                        className="absolute inset-0 bg-teal-400/10 rounded-xl blur-sm"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="flex-1 relative z-10 group/textarea min-h-[30vh] md:min-h-0">
                    <textarea
                        className="w-full h-full bg-transparent border-none resize-none focus:ring-0 outline-none text-lg md:text-2xl text-slate-200 font-serif leading-relaxed placeholder:text-slate-600/50 selection:bg-teal-500/30 p-0"
                        placeholder="Clear your mind. What's on your thoughts today?"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-6 relative z-10 pt-6 border-t border-white/5 gap-4 md:gap-0">
                    <span className="text-slate-500 text-xs md:text-sm font-medium w-full md:w-auto text-center md:text-left">
                        {content.length > 0 ? `${content.split(/\s+/).filter(w => w.length > 0).length} words` : 'Start writing...'}
                    </span>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`
                            w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all duration-300 shadow-lg border border-white/10
                            ${isSaving
                                ? 'bg-emerald-500/80 shadow-emerald-500/20 cursor-wait'
                                : 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:scale-[1.02] hover:shadow-teal-500/30 active:scale-95'
                            }
                        `}
                    >
                        {isSaving ? <CheckIcon className="animate-in zoom-in" /> : <Save size={20} />}
                        <span className="tracking-wide">{isSaving ? 'Saved' : 'Save Entry'}</span>
                    </button>
                </div>
            </motion.div>

            {/* Right: History Timeline */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-none md:flex-1 w-full md:max-w-md flex flex-col gap-4 md:gap-6"
            >
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Recent Entries</h2>
                    <div className="p-2 bg-white/5 rounded-lg border border-white/5 text-slate-400">

                        <Calendar size={18} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-4">
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
                                        className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 hover:border-teal-500/30 hover:bg-slate-800/60 transition-all duration-300 group cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/5 group-hover:border-teal-500/30 transition-colors">
                                                    <span className="text-xs font-bold text-teal-400 uppercase">{format(new Date(entry.entry_date), 'MMM')}</span>
                                                    <span className="text-lg font-bold text-white">{format(new Date(entry.entry_date), 'dd')}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-medium text-slate-400 mb-0.5">{format(new Date(entry.entry_date), 'EEEE')}</span>
                                                    <span className="text-xs text-slate-500">{format(new Date(entry.entry_date), 'h:mm a')}</span>
                                                </div>
                                            </div>
                                            <div className={`p-2 rounded-xl bg-white/5 ${entry.mood === 'happy' ? 'text-emerald-400' :
                                                entry.mood === 'sad' ? 'text-rose-400' : 'text-amber-400'
                                                }`}>
                                                <MoodIcon size={18} />
                                            </div>
                                        </div>
                                        <p className="text-slate-300 font-serif text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300 border-l-2 border-white/5 pl-4 group-hover:border-teal-500/30">
                                            {entry.content}
                                        </p>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="text-center py-20 opacity-50 flex flex-col items-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500">
                                    <PenLine size={24} />
                                </div>
                                <p className="text-slate-400 font-medium">No entries yet. Start writing!</p>
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
