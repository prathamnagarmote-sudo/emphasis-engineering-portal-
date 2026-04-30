"use client";

import { FC } from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
}

const SectionTitle: FC<SectionTitleProps> = ({
  subtitle,
  title,
  description,
  centered = true,
  light = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      {subtitle && (
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${light ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary'}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${light ? 'text-white' : 'text-secondary'}`}>
        {title}
      </h2>
      {description && (
        <p className={`max-w-2xl ${centered ? 'mx-auto' : ''} text-lg ${light ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
