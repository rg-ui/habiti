import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, Quote, Zap, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import chatbotIcon from '../assets/chatbot_icon.png';

const QUICK_ACTIONS = [
    { icon: '💪', label: 'Motivate me', message: 'I need some motivation' },
    { icon: '📊', label: 'My progress', message: 'How am I doing?' },
    { icon: '🎯', label: 'Start a habit', message: 'How do I start a new habit?' },
    { icon: '😰', label: "I'm struggling", message: "I'm struggling with my habits" },
    { icon: '🔥', label: 'Streak tips', message: 'How can I maintain my streak?' },
    { icon: '🌅', label: 'Morning routine', message: 'Tips for morning routine' },
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dailyQuote, setDailyQuote] = useState(null);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Prevent body scroll when chatbot is open on mobile
    useEffect(() => {
        if (isOpen && window.innerWidth < 768) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const fetchDailyQuote = async () => {
        try {
            const res = await api.get('/chat/daily-quote');
            setDailyQuote(res.data);
        } catch (err) {
            console.error('Failed to fetch quote');
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        if (messages.length === 0) {
            fetchDailyQuote();
            const hour = new Date().getHours();
            const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
            setMessages([{
                role: 'assistant',
                content: `${greeting}! 👋 I'm your personal habit coach.\n\nI can help you with motivation, track your progress, and give you personalized advice.\n\nWhat would you like to talk about?`,
                timestamp: new Date()
            }]);
        }
    };

    const handleSend = async (messageText) => {
        const text = messageText || input.trim();
        if (!text || loading) return;

        setShowQuickActions(false);
        const userMessage = { role: 'user', content: text, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat/ask', { message: text });
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: res.data.response,
                userData: res.data.userData,
                timestamp: new Date()
            }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting. Please try again!",
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (action) => {
        handleSend(action.message);
    };

    const formatMessage = (content) => {
        return content.split('\n').map((line, i) => {
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-600">$1</strong>');
            return (
                <span key={i} dangerouslySetInnerHTML={{ __html: line }} className="block" />
            );
        });
    };

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpen}
                        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full md:rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center z-40 overflow-hidden border-2 border-white"
                    >
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-full h-full p-2"
                        >
                            <img src={chatbotIcon} alt="AI Coach" className="w-full h-full object-cover" />
                        </motion.div>
                        <span className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-white animate-pulse z-50" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window - Full screen on mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] bg-white/95 backdrop-blur-xl md:border md:border-slate-200 md:rounded-3xl shadow-2xl overflow-hidden z-[100] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 md:p-5 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border-b border-slate-100 safe-area-top">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm p-1">
                                        <img src={chatbotIcon} alt="AI Coach" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm md:text-base">Habit Coach</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">Online & Ready</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-900 tap-target"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Daily Quote Card */}
                        {dailyQuote && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mx-3 md:mx-4 mt-3 md:mt-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-amber-100 rounded-lg">
                                        <Quote size={14} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-slate-800 text-sm italic font-medium leading-relaxed">"{dailyQuote.quote}"</p>
                                        <p className="text-amber-600 text-xs mt-2 font-bold uppercase tracking-wide">— {dailyQuote.author}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 scrollbar-hide bg-slate-50/50">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-sm'
                                        : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100'
                                        }`}>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles size={14} className="text-emerald-500" />
                                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">AI Coach</span>
                                            </div>
                                        )}
                                        <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'font-medium' : ''}`}>
                                            {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                                        </div>
                                        {msg.userData && (
                                            <div className="mt-3 pt-3 border-t border-slate-100 flex gap-3">
                                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                    ✅ {msg.userData.todayCompleted}/{msg.userData.totalHabits}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                    🔥 {msg.userData.streak} streak
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Quick Actions */}
                            {showQuickActions && messages.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="pt-2"
                                >
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3 px-1">Suggested actions</p>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {QUICK_ACTIONS.map((action, i) => (
                                            <motion.button
                                                key={i}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleQuickAction(action)}
                                                className="flex items-center gap-3 p-3 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 rounded-xl text-left transition-all shadow-sm hover:shadow-md group"
                                            >
                                                <span className="text-lg group-hover:scale-110 transition-transform">{action.icon}</span>
                                                <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-700 truncate">{action.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Loading indicator */}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-3 p-2"
                                >
                                    <div className="flex gap-1.5 p-3 bg-white rounded-2xl rounded-bl-sm border border-slate-100 shadow-sm">
                                        {[0, 0.1, 0.2].map((delay, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ y: [0, -6, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay }}
                                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-100 bg-white safe-area-bottom">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-slate-50 border-0 rounded-2xl px-5 py-4 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all shadow-inner"
                                    disabled={loading}
                                    style={{ fontSize: '16px' }}
                                />
                                <motion.button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    whileTap={{ scale: 0.95 }}
                                    className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-200 flex items-center justify-center hover:shadow-lg transition-all"
                                >
                                    <Send size={18} />
                                </motion.button>
                            </form>
                            <div className="flex items-center justify-center gap-1.5 mt-3 opacity-60">
                                <Sparkles size={10} className="text-emerald-500" />
                                <p className="text-[10px] text-slate-400 font-medium">
                                    AI-powered habit coaching
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
