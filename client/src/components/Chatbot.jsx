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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            // Initial greeting
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
        // Convert markdown-like formatting to JSX
        return content.split('\n').map((line, i) => {
            // Bold text
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
                        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-900 rounded-2xl shadow-2xl shadow-teal-500/30 flex items-center justify-center z-50"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles size={28} />
                        </motion.div>
                        {/* Notification dot */}
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center text-slate-900">
                                        <Bot size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Habit Coach</h3>
                                        <span className="text-xs text-teal-400 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                                            Always here for you
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
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
                                className="mx-4 mt-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl"
                            >
                                <div className="flex items-start gap-3">
                                    <Quote size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-white text-sm italic">"{dailyQuote.quote}"</p>
                                        <p className="text-amber-400 text-xs mt-1">— {dailyQuote.author}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-teal-500 text-slate-900 rounded-br-sm'
                                            : 'bg-white/5 text-slate-200 rounded-bl-sm border border-white/5'
                                        }`}>
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles size={14} className="text-teal-400" />
                                                <span className="text-xs font-bold text-teal-400">AI Coach</span>
                                            </div>
                                        )}
                                        <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'font-medium' : ''}`}>
                                            {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                                        </div>
                                        {msg.userData && (
                                            <div className="mt-3 pt-3 border-t border-white/10 flex gap-3">
                                                <span className="text-xs text-slate-400">
                                                    ✅ {msg.userData.todayCompleted}/{msg.userData.totalHabits}
                                                </span>
                                                <span className="text-xs text-slate-400">
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
                                    <p className="text-xs text-slate-500 mb-3">Quick actions:</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {QUICK_ACTIONS.map((action, i) => (
                                            <motion.button
                                                key={i}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleQuickAction(action)}
                                                className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-left text-sm text-slate-300 transition-colors"
                                            >
                                                <span>{action.icon}</span>
                                                <span>{action.label}</span>
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
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                                            className="w-2 h-2 bg-teal-400 rounded-full"
                                        />
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                                            className="w-2 h-2 bg-teal-400 rounded-full"
                                        />
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                                            className="w-2 h-2 bg-teal-400 rounded-full"
                                        />
                                    </div>
                                    <span className="text-xs">Thinking...</span>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/5 bg-slate-900/50">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                                    disabled={loading}
                                />
                                <motion.button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-teal-500 text-slate-900 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </motion.button>
                            </form>
                            <p className="text-[10px] text-slate-600 text-center mt-2">
                                Personalized advice based on your habits
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
