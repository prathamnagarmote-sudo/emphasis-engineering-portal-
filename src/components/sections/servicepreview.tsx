"use client";

import { FC } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from 'next/link';

// ─── Only GPU-friendly props (transform + opacity) ────────────────────────────
// NO filter, NO blur animations - those force raster repaints and lag
const CHECKS = [
  "Country-specific licensing strategy",
  "Profile evaluation & roadmap",
  "Application + documentation support",
  "Interview preparation & mentoring",
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,   // tight stagger = feels fast
      delayChildren: 0.1,
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const ServicesPreview: FC = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-white">

      {/* ── BACKGROUND - static, no motion on it at all ──────────────────────
          Moving a full-width image on scroll = massive repaint.
          We just let it sit; the content animations carry the energy.       */}
      <div className="absolute inset-0">
        <img
          fetchPriority="high"
          decoding="async"
          src="https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto,w_1200/v1776412114/photo-1581092918056-0c4c3acd3789_k7pkot.jpg"
          className="w-full h-full object-cover opacity-20"
          alt=""
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

        {/* ── LEFT IMAGE ───────────────────────────────────────────────────── */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
        >
          {/* Card - NO backdrop-blur during animation, add after via CSS */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-2xl">

            {/* Image - static, no motion wrapper. Let the card animate it. */}
            <img
              decoding="async"
              src="https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto,w_700/v1776348635/Chartered-Engineer-2.jpg_jrvafx.webp"
              className="rounded-2xl mb-4 w-full"
              alt="Chartered Engineer"
            />

            <h3 className="text-gray-900 text-lg font-semibold">
              Global Licensing Support
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              UK • Canada • USA structured pathways
            </p>
          </div>

          {/* Floating stat card - simple fade+scale, no continuous loop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any, delay: 0.25 }}
            className="absolute -bottom-6 -right-6 bg-white px-6 py-4 rounded-xl shadow-xl"
          >
            <div className="text-sm text-gray-500">Success Rate</div>
            <div className="text-2xl font-bold text-primary">100%</div>
          </motion.div>
        </motion.div>

        {/* ── RIGHT CONTENT ─────────────────────────────────────────────────
            One parent handles the slide-in.
            Children stagger with variants - zero individual whileInView calls.  */}
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <span className="text-primary text-sm font-semibold">
            🌍 GLOBAL ENGINEERING PATHWAYS
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-4 text-gray-900 leading-tight">
            Not Just Services.
            <br />
            <span className="text-gradient">A Complete Licensing Strategy</span>
          </h2>

          <p className="text-gray-600 mt-6 max-w-lg text-lg">
            We don't offer random services - we guide engineers through
            structured, country-specific licensing systems.
          </p>

          {/* Staggered list - ONE whileInView on parent, variants handle children */}
          <motion.ul
            className="mt-8 space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {CHECKS.map((item, i) => (
              <motion.li
                key={i}
                variants={itemVariant}
                className="flex items-center gap-3 text-gray-700"
              >
                <CheckCircle className="text-primary w-5 h-5 shrink-0" />
                {item}
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any, delay: 0.3 }}
          >
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="mt-10 px-8 py-4 bg-secondary text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-secondary-light transition shadow-lg"
              >
                Explore Services
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesPreview;