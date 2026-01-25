import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, Quote, Zap, ChevronRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

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
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-400">$1</strong>');
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
                        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-900 rounded-full md:rounded-2xl shadow-2xl shadow-teal-500/30 flex items-center justify-center z-40"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles size={24} className="md:w-7 md:h-7" />
                        </motion.div>
                        <span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
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
                        className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] bg-slate-950 md:border md:border-white/10 md:rounded-3xl shadow-2xl overflow-hidden z-[100] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 md:p-5 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-b border-white/5 safe-area-top">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center text-slate-900">
                                        <Bot size={20} className="md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm md:text-base">Habit Coach</h3>
                                        <span className="text-xs text-teal-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-teal-400 rounded-full animate-pulse" />
                                            Always here for you
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white tap-target"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Daily Quote Card */}
                        {dailyQuote && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mx-3 md:mx-4 mt-3 md:mt-4 p-3 md:p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl md:rounded-2xl"
                            >
                                <div className="flex items-start gap-2 md:gap-3">
                                    <Quote size={14} className="text-amber-400 mt-1 flex-shrink-0 md:w-4 md:h-4" />
                                    <div>
                                        <p className="text-white text-xs md:text-sm italic">"{dailyQuote.quote}"</p>
                                        <p className="text-amber-400 text-[10px] md:text-xs mt-1">— {dailyQuote.author}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-teal-500 text-slate-900 rounded-br-sm'
                                            : 'bg-white/5 text-slate-200 rounded-bl-sm border border-white/5'
                                        }`}>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles size={12} className="text-teal-400" />
                                                <span className="text-[10px] md:text-xs font-bold text-teal-400">AI Coach</span>
                                            </div>
                                        )}
                                        <div className={`text-xs md:text-sm leading-relaxed ${msg.role === 'user' ? 'font-medium' : ''}`}>
                                            {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                                        </div>
                                        {msg.userData && (
                                            <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/10 flex gap-3">
                                                <span className="text-[10px] md:text-xs text-slate-400">
                                                    ✅ {msg.userData.todayCompleted}/{msg.userData.totalHabits}
                                                </span>
                                                <span className="text-[10px] md:text-xs text-slate-400">
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
                                    <p className="text-[10px] md:text-xs text-slate-500 mb-2 md:mb-3">Quick actions:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {QUICK_ACTIONS.map((action, i) => (
                                            <motion.button
                                                key={i}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleQuickAction(action)}
                                                className="flex items-center gap-2 p-2.5 md:p-3 bg-white/5 active:bg-white/10 border border-white/5 rounded-xl text-left text-xs md:text-sm text-slate-300 transition-colors"
                                            >
                                                <span>{action.icon}</span>
                                                <span className="truncate">{action.label}</span>
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
                                    className="flex items-center gap-2 text-slate-400"
                                >
                                    <div className="flex gap-1">
                                        {[0, 0.1, 0.2].map((delay, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, delay }}
                                                className="w-1.5 h-1.5 md:w-2 md:h-2 bg-teal-400 rounded-full"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] md:text-xs">Thinking...</span>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 md:p-4 border-t border-white/5 bg-slate-900/50 safe-area-bottom">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                                    disabled={loading}
                                    style={{ fontSize: '16px' }}
                                />
                                <motion.button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-teal-500 text-slate-900 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed tap-target"
                                >
                                    <Send size={20} />
                                </motion.button>
                            </form>
                            <p className="text-[9px] md:text-[10px] text-slate-600 text-center mt-2">
                                Personalized advice based on your habits
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
