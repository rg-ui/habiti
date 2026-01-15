import React from 'react';
import { motion } from 'framer-motion';

const gradients = [
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-fuchsia-500 to-pink-500',
    'from-cyan-500 to-blue-500',
];

export default function UserAvatar({ username = 'User', size = 'md', className = '' }) {
    // Deterministic gradient based on username length
    const gradientIndex = username.length % gradients.length;
    const gradient = gradients[gradientIndex];

    const initial = username.charAt(0).toUpperCase();

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-lg',
        lg: 'w-16 h-16 text-2xl',
        xl: 'w-24 h-24 text-4xl'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`
                ${sizeClasses[size]} 
                rounded-full 
                bg-gradient-to-br ${gradient} 
                flex items-center justify-center 
                text-white font-bold 
                shadow-lg shadow-indigo-500/20 
                border-2 border-white/50 
                relative overflow-hidden
                ${className}
            `}
        >
            {/* Glossy overlay effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-full pointer-events-none" />

            <span className="relative z-10 drop-shadow-sm">{initial}</span>

            {/* Optional status dot */}
            <div className="absolute bottom-0 right-0 w-[15%] h-[15%] rounded-full bg-emerald-400 border border-white shadow-sm" />
        </motion.div>
    );
}
