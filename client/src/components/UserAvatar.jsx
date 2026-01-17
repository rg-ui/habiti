import React from 'react';
import { motion } from 'framer-motion';

const gradients = [
    'from-teal-400 to-teal-600',
    'from-emerald-400 to-emerald-600',
    'from-cyan-400 to-blue-600',
    'from-violet-400 to-purple-600',
    'from-rose-400 to-pink-600',
];

export default function UserAvatar({ username = 'User', size = 'md', className = '' }) {
    const gradientIndex = username.length % gradients.length;
    const gradient = gradients[gradientIndex];

    const initial = username.charAt(0).toUpperCase();

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-14 h-14 text-xl',
        xl: 'w-16 h-16 text-2xl'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
                ${sizeClasses[size]} 
                rounded-2xl 
                bg-gradient-to-br ${gradient} 
                flex items-center justify-center 
                text-slate-950 font-bold 
                shadow-lg
                border border-white/10
                ${className}
            `}
        >
            <span className="drop-shadow-sm">{initial}</span>
        </motion.div>
    );
}
