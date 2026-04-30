"use client";

import { FC, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── UK sub-routes ─── */
const UK_ROUTES = [
  {
    id: "IMECHE",
    label: "IMechE",
    full: "Institution of Mechanical Engineers",
    color: "bg-teal-500",
  },
  {
    id: "IET",
    label: "IET",
    full: "Institution of Engineering & Technology",
    color: "bg-purple-500",
  },
  {
    id: "ICE",
    label: "ICE",
    full: "Institution of Civil Engineers",
    color: "bg-orange-500",
  },
];

/* ─── Pathway data ─── */
const pathways = [
  {
    id: "uk",
    title: "UK Chartered Engineer (CEng)",
    desc: "IET · IMechE · ICE — choose your professional body",
    hasSubRoutes: true, // expands to show 3 bodies
    steps: [
      { label: "Competence", desc: "Demonstrate engineering capability via UK-SPEC" },
      { label: "Application", desc: "Submit structured competency report" },
      { label: "Interview", desc: "Professional review assessment (PRI)" },
      { label: "CEng", desc: "Achieve Chartered Engineer status" },
    ],
  },
  {
    id: "canada",
    title: "Canada P.Eng",
    desc: "Competency-Based Assessment + NPPE",
    link: "/services/CANADIAN PEng",
    hasSubRoutes: false,
    steps: [
      { label: "Experience", desc: "48 months of verified engineering experience" },
      { label: "CBA", desc: "Competency-based assessment across 34 areas" },
      { label: "NPPE", desc: "National Professional Practice Examination" },
      { label: "P.Eng", desc: "Become a licensed professional engineer" },
    ],
  },
  {
    id: "us",
    title: "US PE Licence",
    desc: "MRA Pathway for UK CEng holders · No FE/PE exam required",
    link: "/services/US PE",
    hasSubRoutes: false,
    steps: [
      { label: "Eligibility", desc: "CEng + IntPE status confirmed" },
      { label: "NCEES Record", desc: "Build your official professional profile" },
      { label: "Verification", desc: "Credential & experience verification" },
      { label: "PE Licence", desc: "Licensed in participating US states" },
    ],
  },
];

/* ─── Step indicator colours per pathway ─── */
const DOT_COLORS: Record<string, string> = {
  uk: "bg-teal-400",
  canada: "bg-rose-400",
  us: "bg-blue-400",
};

const PathwayFlowSection: FC = () => {
  const router = useRouter();
  const [expandedUK, setExpandedUK] = useState(false);

  return (
    <section className="relative py-28 bg-[#061F33] overflow-hidden">

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#061F33] via-[#0d3654] to-[#061F33]" />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-semibold mb-5">
            Global Pathways
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Engineering Licensing Pathways
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Follow structured, proven routes to become a licensed engineer globally.
          </p>
        </motion.div>

        {/* Pathway cards */}
        <div className="space-y-8">
          {pathways.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-xl"
            >
              {/* Card header */}
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                </div>

                {/* Explore button */}
                {item.hasSubRoutes ? (
                  /* UK — toggle sub-routes */
                  <button
                    onClick={() => setExpandedUK((p) => !p)}
                    className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors font-medium text-sm"
                  >
                    {expandedUK ? "Choose below" : "Explore"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expandedUK ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  /* Canada / US — direct link */
                  <Link href={item.link || "#"}
                    className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors font-medium text-sm group"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>

              {/* UK sub-route expansion */}
              <AnimatePresence>
                {item.hasSubRoutes && expandedUK && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" as any }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                      {UK_ROUTES.map((route) => (
                        <motion.button
                          key={route.id}
                          whileHover={{ y: -4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => router.push(`/services/${route.id}`)}
                          className="group flex flex-col items-start p-5 bg-white/8 hover:bg-white/12 border border-white/15 hover:border-primary/40 rounded-2xl text-left transition-all duration-250"
                        >
                          <div className={`w-2.5 h-2.5 rounded-full ${route.color} mb-3`} />
                          <span className="text-white font-bold text-lg">{route.label}</span>
                          <span className="text-gray-400 text-xs mt-1 leading-snug">{route.full}</span>
                          <span className="mt-3 flex items-center gap-1 text-primary text-xs font-semibold">
                            View service
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step flow */}
              <div className="relative mt-10">

                {/* Connector line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1, ease: "easeOut" as any }}
                  viewport={{ once: true }}
                  className="absolute top-6 left-0 h-[2px] bg-white/15"
                />

                {/* Dot overlay on connector */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 1.2, ease: "easeOut" as any, delay: 0.2 }}
                  viewport={{ once: true }}
                  className={`absolute top-6 left-0 h-[2px] ${DOT_COLORS[item.id]} opacity-50`}
                />

                <div className="flex justify-between relative z-10">
                  {item.steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="group relative flex flex-col items-center w-full"
                    >
                      {/* Step dot */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: i * 0.2, type: "spring", stiffness: 220 }}
                        viewport={{ once: true }}
                        className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg"
                      >
                        <span className="text-[#061F33] font-bold text-sm">{i + 1}</span>
                      </motion.div>

                      <span className="text-xs md:text-sm text-gray-300 mt-3 text-center px-1">
                        {step.label}
                      </span>

                      {/* Hover tooltip */}
                      <div className="absolute bottom-16 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-250 pointer-events-none z-20 w-max max-w-[160px]">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs px-3 py-2 rounded-lg shadow-xl text-center">
                          {step.desc}
                        </div>
                        {/* Arrow */}
                        <div className="w-2 h-2 bg-white/10 border-b border-r border-white/20 rotate-45 mx-auto -mt-1" />
                      </div>

                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <p className="text-gray-400 text-sm mb-4">Not sure which pathway suits you?</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
          >
            Book a Free Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default PathwayFlowSection;