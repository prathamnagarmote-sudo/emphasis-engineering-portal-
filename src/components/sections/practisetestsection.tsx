"use client";

import { FC, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { CheckCircle, ArrowRight, Timer, Award, TrendingUp, Zap, BookOpen, Target } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  { icon: <Timer className="w-4 h-4" />, text: "Timed full-length mock exams" },
  { icon: <Target className="w-4 h-4" />, text: "Competency-based evaluation" },
  { icon: <Zap className="w-4 h-4" />, text: "Instant feedback & scoring" },
  { icon: <BookOpen className="w-4 h-4" />, text: "Exam-level difficulty simulation" },
];

const STATS_CARDS = [
  { icon: Timer, label: "Avg. Time", value: "2.4h", color: "from-blue-500 to-cyan-500", pos: "top-4 left-4" },
  { icon: TrendingUp, label: "Improvement", value: "+34%", color: "from-emerald-500 to-teal-500", pos: "top-4 right-4" },
  { icon: Award, label: "Pass Rate", value: "95%", color: "from-amber-500 to-orange-500", pos: "bottom-4 left-4" },
  { icon: Zap, label: "Instant Feedback", value: "Real-time", color: "from-violet-500 to-purple-500", pos: "bottom-4 right-4" },
];

const EXAM_QUESTIONS = [
  { q: "Structural load calculations", status: "correct", time: "2:34" },
  { q: "Thermodynamics principles", status: "correct", time: "3:12" },
  { q: "Material stress analysis", status: "review", time: "4:45" },
  { q: "Fluid mechanics theory", status: "correct", time: "2:58" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariant = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any } },
};

const PracticeTestsSection: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useTransform(mouseX, [0, 1000], [0, 100]);
  const glowY = useTransform(mouseY, [0, 1000], [0, 100]);

  return (
    <section 
      className="relative py-32 bg-[#061F33] overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
    >
      {/* ── DYNAMIC BACKGROUND ───────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(63,159,163,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]" />
        
        {/* Interactive glow follows mouse */}
        <motion.div
          className="absolute w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none"
          style={{
            left: glowX,
            top: glowY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />

        {/* Animated grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        
        {/* ── SECTION HEADER ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
            Detailed Assessment
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight max-w-3xl mx-auto">
            Train Like It's The
            <span className="block mt-2 bg-gradient-to-r from-primary via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Real Exam Day
            </span>
          </h2>

          <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            Industry-standard simulation platform trusted by 10,000+ engineers preparing 
            for licensing exams worldwide
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT: FEATURE LIST ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="lg:sticky lg:top-24"
          >
            {/* Features */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="space-y-4 mb-10"
            >
              {FEATURES.map((feat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariant}
                  whileHover={{ x: 8, backgroundColor: "rgba(63,159,163,0.08)" }}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary">
                    {feat.icon}
                  </div>
                  <span className="text-gray-300 font-medium">{feat.text}</span>
                  <CheckCircle className="w-5 h-5 text-primary/60 ml-auto" />
                </motion.div>
              ))}
            </motion.div>

            {/* Stats banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl"
            >
              {[
                { label: "Questions", value: "5,000+" },
                { label: "Students", value: "10K+" },
                { label: "Countries", value: "45+" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Link href="/practice-tests">
                <motion.div
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 60px rgba(63,159,163,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-5 bg-gradient-to-r from-primary to-teal-500 rounded-2xl text-white font-semibold shadow-2xl shadow-primary/30 cursor-pointer overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  
                  <span className="relative flex items-center justify-center gap-3">
                    Start Free Practice Test
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: INTERACTIVE DASHBOARD ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any, delay: 0.15 }}
            className="relative"
          >
            {/* Main exam card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl shadow-2xl">
              
              {/* Header with tabs */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">PE Structural Exam</div>
                      <div className="text-gray-500 text-xs">Morning Session</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">In Progress</span>
                  </div>
                </div>

                {/* Tab switcher */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                  {["Overview", "Questions", "Analytics"].map((tab, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i)}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === i
                          ? "bg-white/10 text-white shadow-lg"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content area */}
              <div className="p-6">
                {activeTab === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Score ring */}
                    <div className="flex items-center justify-center py-8">
                      <div className="relative">
                        <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                          <motion.circle
                            cx="60" cy="60" r="52"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="326.7"
                            initial={{ strokeDashoffset: 326.7 }}
                            animate={{ strokeDashoffset: 326.7 * (1 - 0.82) }}
                            transition={{ duration: 1.5, ease: "easeOut" as any, delay: 0.3 }}
                          />
                          <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3F9FA3" />
                              <stop offset="100%" stopColor="#06D6A0" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-4xl font-bold text-white">82%</div>
                          <div className="text-gray-400 text-sm">Current Score</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress stats */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Answered", value: "98/120", color: "text-green-400" },
                        { label: "Correct", value: "80", color: "text-primary" },
                        { label: "Time Left", value: "42m", color: "text-amber-400" },
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
                        >
                          <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                          <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {EXAM_QUESTIONS.map((q, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-sm font-bold">
                            {i + 1}
                          </div>
                          <span className="text-gray-300 text-sm">{q.q}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-xs">{q.time}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            q.status === "correct" ? "bg-green-400" : "bg-amber-400"
                          }`} />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {[
                      { label: "Strength", value: 92, color: "bg-green-500" },
                      { label: "Speed", value: 78, color: "bg-primary" },
                      { label: "Accuracy", value: 85, color: "bg-blue-500" },
                    ].map((metric, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">{metric.label}</span>
                          <span className="text-white font-semibold">{metric.value}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${metric.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Floating stat cards */}
            {STATS_CARDS.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className={`absolute ${card.pos} w-40`}
              >
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{card.value}</div>
                  <div className="text-gray-400 text-xs mt-1">{card.label}</div>
                </div>
              </motion.div>
            ))}

            {/* Bottom glow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-primary/30 blur-3xl rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PracticeTestsSection;