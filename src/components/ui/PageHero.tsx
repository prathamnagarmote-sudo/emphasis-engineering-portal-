"use client";

import { FC, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Floating particle dots ───────────────────────────────────────────────────
const Particles: FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-primary/30 rounded-full"
        style={{
          left: `${(i * 5.1 + 3) % 100}%`,
          top: `${(i * 7.3 + 10) % 100}%`,
        }}
        animate={{
          y: [0, -28, 0],
          x: [0, (i % 2 === 0 ? 10 : -10), 0],
          opacity: [0.25, 0.75, 0.25],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 3 + (i % 4),
          repeat: Infinity,
          delay: (i * 0.18) % 2,
        }}
      />
    ))}
  </div>
);

// ─── Animated background orbs (shared with About) ────────────────────────────
const Orbs: FC = () => (
  <div className="absolute inset-0">
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
      transition={{ duration: 6, repeat: Infinity }}
      className="absolute top-10 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
      transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      className="absolute bottom-10 right-10 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl"
    />
  </div>
);

// ─── Prop types ───────────────────────────────────────────────────────────────
export interface PageHeroProps {
  /** Small pill badge label above the heading */
  badge: string;
  /** Main heading (h1). Can include JSX for gradient spans etc. */
  heading: ReactNode;
  /** Subtitle paragraph */
  subtitle: string;
  /** Optional primary CTA button */
  primaryCta?: { label: string; href: string };
  /** Optional secondary CTA button */
  secondaryCta?: { label: string; href: string };
  /** Show scroll-indicator mouse at the bottom (default true) */
  showScrollIndicator?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
const PageHero: FC<PageHeroProps> = ({
  badge,
  heading,
  subtitle,
  primaryCta,
  secondaryCta,
  showScrollIndicator = true,
}) => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <section className="py-32 bg-gradient-to-br from-secondary via-secondary-light to-secondary relative overflow-hidden min-h-[520px] flex items-center">
      <Particles />
      <Orbs />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <motion.div
          style={{ y: heroY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as any }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-5 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold mb-6 border border-primary/30 backdrop-blur-sm"
          >
            {badge}
          </motion.span>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {heading}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg md:text-xl leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          {(primaryCta || secondaryCta) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-4 mt-10"
            >
              {primaryCta && (
                <Link href={primaryCta.href}>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(20,184,166,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3 bg-primary text-white rounded-full font-semibold flex items-center gap-2 shadow-lg"
                  >
                    {primaryCta.label} <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3 bg-white/10 border border-white/25 text-white rounded-full font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    {secondaryCta.label}
                  </motion.button>
                </Link>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <img 
            src="https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775721626/logo-nobackground-500_prbht7.png" 
            alt="Scroll down" 
            className="w-16 h-auto opacity-70 hover:opacity-100 transition-opacity"
          />
        </motion.div>
      )}
    </section>
  );
};

export default PageHero;
