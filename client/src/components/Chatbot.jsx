import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const fetchTips = async () => {
        setLoading(true);
        try {
            const response = await api.get('/chat/tips');
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching tips:", error);
            setMessages([{ role: 'assistant', content: "Sorry, I couldn't connect to the server right now." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        if (!isOpen) {
            if (messages.length === 0) fetchTips();
        }
        setIsOpen(!isOpen);
    };

    const [inputValue, setInputValue] = useState("");

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setLoading(true);

        try {
            const response = await api.post('/chat/ask', { message: userMessage.content });
            // The backend should return an array of messages or a single message object
            // If it returns an array, we spread it. If single object, we add it.
            const botResponse = Array.isArray(response.data) ? response.data : [response.data];
            setMessages(prev => [...prev, ...botResponse]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble processing that right now. Try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleOpen}
                className="fixed bottom-24 md:bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/30 z-50 flex items-center justify-center border border-white/10"
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-[7rem] md:bottom-24 right-0 md:right-6 w-full md:w-96 md:max-w-[calc(100vw-3rem)] h-[calc(100vh-12rem)] md:h-[500px] md:max-h-[calc(100vh-100px)] bg-slate-900/95 md:bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-indigo-500 flex items-center justify-center shadow-lg">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Habiti AI</h3>
                                <p className="text-xs text-slate-400">Personalized Habit Coach</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-teal-600 text-white rounded-br-none'
                                            : 'bg-white/10 text-slate-200 rounded-bl-none border border-white/5'
                                            }`}
                                    >
                                        <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-4 rounded-2xl rounded-bl-none border border-white/5 flex gap-1">
                                        <motion.div
                                            animate={{ y: [-5, 5, -5] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="w-2 h-2 bg-teal-400 rounded-full"
                                        />
                                        <motion.div
                                            animate={{ y: [-5, 5, -5] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: 0.1 }}
                                            className="w-2 h-2 bg-indigo-400 rounded-full"
                                        />
                                        <motion.div
                                            animate={{ y: [-5, 5, -5] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                            className="w-2 h-2 bg-purple-400 rounded-full"
                                        />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <form
                                onSubmit={handleSend}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask for advice..."
                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-colors placeholder:text-slate-600"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || loading}
                                    className="p-2 bg-teal-500 text-white rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
