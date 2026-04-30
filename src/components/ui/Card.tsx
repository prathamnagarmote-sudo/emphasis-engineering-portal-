"use client";

import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: FC<CardProps> = ({ children, className = '', hover = true, onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.01 } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${hover ? 'cursor-pointer hover:shadow-xl' : ''} transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
