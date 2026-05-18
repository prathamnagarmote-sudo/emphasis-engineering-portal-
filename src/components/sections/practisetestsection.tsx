"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Timer,
  Award,
  TrendingUp,
  BookOpen,
  Target,
  Shield,
  BarChart3,
  Clock,
  CheckCircle2,
  Brain,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

/* ── Data ──────────────────────────────────────────────────────────── */

const CAPABILITIES = [
  {
    icon: Brain,
    title: "Adaptive Difficulty",
    desc: "Questions adjust to your performance level in real time",
  },
  {
    icon: Clock,
    title: "Timed Simulation",
    desc: "Practice under real exam conditions with countdown timers",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    desc: "Detailed breakdown by topic, time spent, and confidence level",
  },
  {
    icon: FileCheck,
    title: "Exam-Ready Reports",
    desc: "Know exactly where you stand before sitting the real exam",
  },
];

const HIGHLIGHTS = [
  { icon: BookOpen, label: "Practice Questions", color: "from-primary to-teal-500" },
  { icon: Target, label: "Competency Mapped", color: "from-amber-500 to-orange-500" },
  { icon: TrendingUp, label: "Score Improvement", color: "from-emerald-500 to-green-500" },
  { icon: Timer, label: "Real Exam Conditions", color: "from-violet-500 to-purple-500" },
];

/* ── Component ─────────────────────────────────────────────────────── */

const PracticeTestsSection: FC = () => {
  return (
    <section className="relative py-28 lg:py-36 bg-[#061F33] overflow-hidden">
      {/* ── Background ─────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(63,159,163,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(63,159,163,0.06),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Section Header ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold tracking-widest uppercase mb-8">
            <Shield className="w-3.5 h-3.5" />
            Exam Simulation Platform
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] max-w-4xl mx-auto">
            Prepare With{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Confidence
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-teal-400 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </h2>

          <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            Practice under real exam conditions with instant feedback, detailed 
            explanations, and competency-based scoring aligned to licensing body standards
          </p>
        </motion.div>

        {/* ── Main Content Grid ────────────────────────────────────── */}
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">

          {/* Left: Main Info Card (3 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-2xl">
              {/* Card header */}
              <div className="p-8 pb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-lg shadow-primary/20">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-xs font-medium">Available Now</span>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Professional Practice Test Simulation
                </h3>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed max-w-lg">
                  High-fidelity mock exams written by licensed professional engineers, 
                  aligned to real licensing body frameworks. Every question includes detailed 
                  explanations so you learn — not just score.
                </p>

                {/* Exam meta strip */}
                <div className="flex flex-wrap gap-6 mt-6 pb-8 border-b border-white/10">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Timer className="w-4 h-4 text-primary" />
                    <span className="text-sm">Timed Conditions</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm">Instant Scoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-sm">Detailed Explanations</span>
                  </div>
                </div>
              </div>

              {/* What's Covered */}
              <div className="p-8 pt-6">
                <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-4">
                  What You Get
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Exam-standard questions by licensed engineers",
                    "Detailed explanation for every answer",
                    "Competency-mapped to licensing frameworks",
                    "Fully responsive on all devices",
                  ].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-gray-300 text-sm font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <Link href="/practice-tests" className="block mt-8">
                  <motion.div
                    whileHover={{ scale: 1.01, boxShadow: "0 16px 48px rgba(63,159,163,0.35)" }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full px-8 py-4 bg-gradient-to-r from-primary to-teal-500 rounded-2xl text-white font-semibold shadow-xl shadow-primary/25 cursor-pointer overflow-hidden text-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-3 text-base">
                      Start Your Assessment
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right: Capabilities (2 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-2 space-y-4"
          >
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -3, backgroundColor: "rgba(63,159,163,0.06)" }}
                className="group p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:from-primary/25 group-hover:to-primary/10 transition-colors duration-300">
                    <cap.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-base mb-1">{cap.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{cap.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-teal-500/5 border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-white font-semibold text-sm">Written by Licensed Engineers</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every question is authored and reviewed by licensed Professional Engineers 
                and Chartered Engineers with real exam experience.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Bottom Highlights Bar ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20"
        >
          {HIGHLIGHTS.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden group transition-all duration-300 hover:border-primary/20"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg shrink-0`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-white font-semibold text-sm">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom ambient glow */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-1/2 h-40 bg-primary/15 blur-[80px] rounded-full pointer-events-none" />
    </section>
  );
};

export default PracticeTestsSection;