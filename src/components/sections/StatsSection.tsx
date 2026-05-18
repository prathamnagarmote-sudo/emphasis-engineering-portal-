"use client";

import { motion, useInView } from 'framer-motion';
import { FC, useEffect, useRef, useState } from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: 2000, suffix: '+', label: 'Engineers Mentored' },
  { icon: BookOpen, value: 10, suffix: '+', label: 'Countries Served' },
  { icon: GraduationCap, value: 10, suffix: '+', label: 'Years of Practice' },
  { icon: TrendingUp, value: 100, suffix: '%', label: 'First-Attempt Pass Rate' },
];

const AnimatedCounter: FC<{ target: number; suffix: string; duration?: number }> = ({
  target,
  suffix,
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection: FC = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center"
              >
                <stat.icon className="w-8 h-8 text-primary" />
              </motion.div>
              <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
