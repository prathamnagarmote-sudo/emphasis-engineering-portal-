"use client";

import { FC } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from 'next/link';

// ─── Reusable variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any, delay },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as any, delay },
  }),
};

const checkVariants = {
  hidden: { opacity: 0, x: -24 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as any,
      delay: 0.35 + i * 0.1,
    },
  }),
};

const iconPop = {
  hidden: { scale: 0, rotate: -80 },
  show: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 16,
      delay: 0.4 + i * 0.1,
    },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────
const FeaturedCourses: FC = () => {
  return (
    <section className="relative py-28 overflow-hidden">

      {/* ── BACKGROUND ───────────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        {/*
          KEY OPTIMISATION:
          • fetchpriority="high" tells the browser to grab this image ASAP
          • decoding="async" keeps the main thread free while decoding
          • The motion starts at scale(1.06) so even a partially-loaded image
            looks intentional — the slow zoom-out eases the eye away from
            any loading artefacts
        */}
        <motion.img
          fetchPriority="high"
          decoding="async"
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}          // animate (not whileInView) = fires immediately
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] as any }}
          src="https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto,w_1800/v1776348873/photo-1581092160607-ee22621dd758_sdbfrr.jpg"
          className="w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-[#061F33]/80" />
      </div>

      {/* ── CONTENT GRID ─────────────────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT ─────────────────────────────────────────────────────────────── */}
        <div>
          {/* Heading — first thing visible, no delay */}
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={0}
            viewport={{ once: true, margin: "-60px" }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Courses That Get You Licensed
          </motion.h2>

          {/* Paragraph — tiny offset so it cascades behind heading */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={0.1}
            viewport={{ once: true, margin: "-60px" }}
            className="text-gray-300 mt-4"
          >
            Structured, outcome-driven programs designed for real engineering licensing success.
          </motion.p>

          {/* Check list */}
          <ul className="mt-6 space-y-3">
            {[
              "Competency-based training",
              "Interview preparation",
              "Country-specific roadmap",
            ].map((item, i) => (
              <motion.li
                key={i}
                custom={i}
                variants={checkVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="flex items-center gap-2 text-gray-200"
              >
                <motion.span
                  custom={i}
                  variants={iconPop as any}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <CheckCircle className="text-primary w-5 h-5 shrink-0" />
                </motion.span>
                {item}
              </motion.li>
            ))}
          </ul>

          {/* CTA button */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={0.55}
            viewport={{ once: true, margin: "-60px" }}
          >
            <Link href="/courses">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 340, damping: 20 }}
                className="mt-8 px-8 py-4 bg-primary text-white rounded-xl flex items-center gap-2"
              >
                Explore All Courses
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" as any }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT ────────────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="show"
          custom={0.15}                               // very small delay — appears almost with left col
          viewport={{ once: true, margin: "-60px" }}
          className="relative"
        >
          {/*
            KEY OPTIMISATION:
            • Cloudinary f_auto,q_auto trims file size while keeping quality
            • The wrapper starts slightly blurred so a partially-loaded JPEG
              doesn't look broken — blur lifts as opacity rises
            • Floating animation starts immediately so the card already feels
              alive even before the image fully decodes
          */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" as any }}
          >
            {/* Soft glow — pure CSS, renders before image */}
            <div className="absolute -inset-2 rounded-3xl bg-primary/20 blur-2xl opacity-50 pointer-events-none" />

            <motion.img
              decoding="async"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as any, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, rotate: 0.4 }}
              src="https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto,w_900/v1776348931/photo-1573164713988-8665fc963095_rpbldx.jpg"
              className="relative rounded-3xl shadow-2xl w-full"
              alt="Engineering course"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── BOTTOM FADE ──────────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#061F33]" />
    </section>
  );
};

export default FeaturedCourses;