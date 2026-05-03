"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { XCircle, CheckCircle, ArrowRight, TrendingDown, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

const mistakes = [
  { 
    title: "Applying without understanding requirements",
    detail: "70% rejected in first round",
    severity: "critical"
  },
  { 
    title: "Submitting weak competency reports",
    detail: "Most common failure point",
    severity: "high"
  },
  { 
    title: "Choosing the wrong licensing pathway",
    detail: "Costs 6-12 months extra time",
    severity: "high"
  },
  { 
    title: "Failing technical interviews",
    detail: "Unprepared for depth of questions",
    severity: "critical"
  },
];

const solutions = [
  { 
    title: "Clear roadmap based on your profile",
    detail: "Personalized 30-day action plan",
    impact: "high"
  },
  { 
    title: "Structured competency writing support",
    detail: "Template + 1-on-1 review sessions",
    impact: "critical"
  },
  { 
    title: "Correct country + pathway strategy",
    detail: "Save months of wasted effort",
    impact: "high"
  },
  { 
    title: "Interview preparation & mentoring",
    detail: "Mock sessions with licensed PEs",
    impact: "critical"
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const WhyFailSection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const leftGlowX = useTransform(mouseX, [0, 1000], [-20, 20]);
  const leftGlowY = useTransform(mouseY, [0, 800], [-20, 20]);
  const rightGlowX = useTransform(mouseX, [0, 1000], [20, -20]);
  const rightGlowY = useTransform(mouseY, [0, 800], [20, -20]);

  return (
    <section 
      className="relative py-32 overflow-hidden"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
    >
      {/* ── BACKGROUND ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-teal-50/30" />

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-red-200 to-orange-200 rounded-full mix-blend-multiply blur-3xl animate-pulse" 
          style={{ animationDuration: "8s" }} 
        />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-200 to-emerald-200 rounded-full mix-blend-multiply blur-3xl animate-pulse" 
          style={{ animationDuration: "10s", animationDelay: "2s" }} 
        />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply blur-3xl animate-pulse" 
          style={{ animationDuration: "12s", animationDelay: "4s" }} 
        />
      </div>

      {/* Interactive glows */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-red-300/40 blur-[100px] rounded-full pointer-events-none"
        style={{ x: leftGlowX, y: leftGlowY }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300/40 blur-[100px] rounded-full pointer-events-none"
        style={{ x: rightGlowX, y: rightGlowY }}
      />

      <div className="relative max-w-7xl mx-auto px-4">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wide uppercase mb-6">
            <AlertTriangle className="w-3 h-3" />
            Reality Check
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Why Engineers Fail -{" "}
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              And How We Fix It
            </span>
          </h2>
          
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            It's not about skill. It's about clarity, structure, and guidance at every critical step.
          </p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-wrap justify-center gap-8"
          >
            {[
              { value: "68%", label: "Fail First Attempt", trend: "down" },
              { value: "12mo", label: "Avg. Delay Due to Errors", trend: "down" },
              { value: "100%", label: "Our Success Rate", trend: "up" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-3xl font-bold ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.value}
                  </span>
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── COMPARISON GRID ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 relative">

          {/* Center divider with arrow - desktop only */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center shadow-2xl"
            >
              <ArrowRight className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* ── LEFT: PROBLEMS ──────────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="sticky top-24">
              <motion.div
                variants={cardVariant}
                className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 border-2 border-red-200/50 shadow-xl relative overflow-hidden"
              >
                {/* Top corner badge */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-2xl" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Common Mistakes</h3>
                      <p className="text-red-600 text-sm font-medium">What costs engineers time & money</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mistakes.map((item, i) => (
                      <motion.div
                        key={i}
                        variants={cardVariant}
                        whileHover={{ x: -4, backgroundColor: "rgba(254, 202, 202, 0.3)" }}
                        className="group relative p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-red-200/50 shadow-sm transition-all cursor-default"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5">
                            <XCircle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-red-600 font-medium">{item.detail}</div>
                              {item.severity === "critical" && (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                                  Critical
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── RIGHT: SOLUTIONS ────────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="sticky top-24">
              <motion.div
                variants={cardVariant}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-200/50 shadow-xl relative overflow-hidden"
              >
                {/* Top corner badge */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Our Approach</h3>
                      <p className="text-emerald-600 text-sm font-medium">Proven system for licensing success</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {solutions.map((item, i) => (
                      <motion.div
                        key={i}
                        variants={cardVariant}
                        whileHover={{ x: 4, backgroundColor: "rgba(167, 243, 208, 0.3)" }}
                        className="group relative p-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-emerald-200/50 shadow-sm transition-all cursor-default"
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-0.5">
                            <CheckCircle className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-emerald-600 font-medium">{item.detail}</div>
                              {item.impact === "critical" && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                                  High Impact
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
            {/* Animated shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
            />
            
            <div className="relative">
              <p className="text-lg font-medium mb-2">Ready to avoid these mistakes?</p>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                Get a free profile evaluation and personalized licensing roadmap
              </p>
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-teal-500 rounded-xl font-semibold shadow-lg shadow-primary/30 inline-flex items-center gap-2"
                >
                  Get Your Free Roadmap
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyFailSection;