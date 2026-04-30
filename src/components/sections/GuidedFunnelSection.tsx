"use client";

import { FC, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Briefcase,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  MapPin,
  Clock,
  BookOpen,
  Users,
  ExternalLink,
  Calendar,
} from "lucide-react";

/* ─── Types ─── */
type Path = "student" | "professional" | null;

/* ─── Student / Graduate content ─── */
const STUDENT_JOURNEY = [
  { label: "Industrial Placement / Early-Career Role", icon: Briefcase },
  { label: "Required Years of Experience (Country-Specific)", icon: Clock },
  { label: "Emphasis Engineering Mentorship Programme", icon: Users },
  { label: "Working Professional Pathway", icon: ArrowRight },
];

const STUDENT_SUPPORT = [
  "Structured professional development mentoring",
  "Competency-based career planning (UK-SPEC / PEO aligned)",
  "Guidance through university or early career",
  "Support securing relevant industrial placement (especially Canada P.Eng)",
  "Continuous mentoring while you gain experience",
];

/* ─── Professional routes ─── */
const PRO_ROUTES = [
  {
    id: "IMECHE",
    label: "UK CEng – IMechE",
    flag: "🇬🇧",
    color: "from-teal-500 to-cyan-600",
    border: "border-teal-200",
    bg: "bg-teal-50",
    text: "text-teal-700",
    desc: "Mechanical engineers pursuing Chartered Engineer status under UK-SPEC via IMechE.",
    path: "/services/IMECHE",
  },
  {
    id: "IET",
    label: "UK CEng – IET",
    flag: "🇬🇧",
    color: "from-purple-500 to-violet-600",
    border: "border-purple-200",
    bg: "bg-purple-50",
    text: "text-purple-700",
    desc: "Electrical & technology engineers pursuing CEng through the Institution of Engineering and Technology.",
    path: "/services/IET",
  },
  {
    id: "ICE",
    label: "UK CEng – ICE",
    flag: "🇬🇧",
    color: "from-orange-500 to-amber-600",
    border: "border-orange-200",
    bg: "bg-orange-50",
    text: "text-orange-700",
    desc: "Civil engineers pursuing Chartered Engineer status through the Institution of Civil Engineers.",
    path: "/services/ICE",
  },
  {
    id: "CANADIAN PEng",
    label: "Canada P.Eng",
    flag: "🇨🇦",
    color: "from-rose-500 to-red-600",
    border: "border-rose-200",
    bg: "bg-rose-50",
    text: "text-rose-700",
    desc: "Engineers pursuing Professional Engineer licensure in Canada through PEO and provincial bodies.",
    path: "/services/CANADIAN PEng",
  },
  {
    id: "US PE",
    label: "US PE",
    flag: "🇺🇸",
    color: "from-blue-500 to-indigo-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-700",
    desc: "UK Chartered Engineers pursuing US PE licensure through the NCEES Mutual Recognition Agreement.",
    path: "/services/US PE",
  },
];

/* ─── Animation variants ─── */
const fadeSlide = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as any } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
const GuidedFunnelSection: FC = () => {
  const router = useRouter();
  const [path, setPath] = useState<Path>(null);

  const reset = () => setPath(null);

  return (
    <section className="relative py-28 overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://res.cloudinary.com/dwk1cnlw2/image/upload/v1776349408/photo-1492724441997-5dc865305da7_zghcsd.jpg"
          alt="background"
          className="w-full h-full object-cover blur-lg scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/80 to-white/95" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
            <MapPin className="w-3.5 h-3.5" />
            Find Your Licensing Path
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary leading-tight">
            Where Are You{" "}
            <span className="text-primary">Right Now?</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            Tell us your current situation — we'll show you the exact next step.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ══ STEP 1 — Choose path ══ */}
          {path === null && (
            <motion.div key="choose" {...fadeSlide} className="grid md:grid-cols-2 gap-6">

              {/* Card — Student / Graduate */}
              <motion.button
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPath("student")}
                className="group relative p-8 bg-white/95 border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl text-left transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-2">Student / Graduate</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    University students and recent graduates building toward professional licensure.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm">
                    See my pathway <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.button>

              {/* Card — Working Professional */}
              <motion.button
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPath("professional")}
                className="group relative p-8 bg-secondary/95 border border-secondary-light rounded-3xl shadow-xl hover:shadow-2xl text-left transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5 group-hover:bg-white/20 transition-colors">
                    <Briefcase className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Working Professional</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Engineers with relevant industry experience ready to move directly toward licensure.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm">
                    Select my licence route <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.button>

            </motion.div>
          )}

          {/* ══ PATH 1 — Student / Graduate ══ */}
          {path === "student" && (
            <motion.div key="student" {...fadeSlide}>

              {/* Back */}
              <button onClick={reset} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-8 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <div className="grid lg:grid-cols-2 gap-10">

                {/* LEFT — Journey */}
                <div className="bg-white/95 rounded-3xl p-8 shadow-xl border border-gray-100">
                  <h3 className="text-xl font-bold text-secondary mb-2">Your Journey</h3>
                  <p className="text-gray-500 text-sm mb-8">
                    Students and recent graduates cannot yet apply for UK CEng, Canadian P.Eng, or US PE.
                    You must first build recognised professional experience.
                  </p>

                  {/* Flow steps */}
                  <div className="space-y-4">
                    {STUDENT_JOURNEY.map((step, i) => {
                      const Icon = step.icon;
                      const isLast = i === STUDENT_JOURNEY.length - 1;
                      return (
                        <div key={i} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isLast ? "bg-primary text-white" : "bg-primary/10"}`}>
                              <Icon className={`w-4 h-4 ${isLast ? "text-white" : "text-primary"}`} />
                            </div>
                            {!isLast && <div className="w-px h-6 bg-primary/20 mt-1" />}
                          </div>
                          <div className={`pt-2 font-medium text-sm ${isLast ? "text-primary" : "text-secondary"}`}>
                            {step.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-6 text-xs text-gray-400 leading-relaxed">
                    When you reach the required experience threshold, you transition seamlessly into the Working Professional pathway.
                  </p>
                </div>

                {/* RIGHT — How We Help */}
                <div className="flex flex-col gap-6">
                  <div className="bg-primary/5 border border-primary/15 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-secondary text-lg">How Emphasis Engineering Supports You</h3>
                    </div>
                    <ul className="space-y-3">
                      {STUDENT_SUPPORT.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-xs text-gray-400 leading-relaxed">
                      This approach mirrors formal mentoring frameworks used by institutions like the IET, with direct, practical guidance focused on future licensure success.
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="bg-secondary rounded-3xl p-6 text-center">
                    <h4 className="text-white font-bold text-lg mb-1">Emphasis Engineering Mentorship</h4>
                    <p className="text-gray-400 text-sm mb-5">
                      A new structured programme designed specifically for students and graduates. Book a free discovery call to learn how we can support your journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push("/contact")}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        Book a Free Discovery Call
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push("/contact")}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ══ PATH 2 — Working Professional ══ */}
          {path === "professional" && (
            <motion.div key="professional" {...fadeSlide}>

              {/* Back */}
              <button onClick={reset} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-8 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-secondary">Select Your Licence Route</h3>
                <p className="text-gray-500 mt-2 text-sm">
                  Selecting any route takes you directly to the relevant service page with support tailored to your chosen professional body.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {PRO_ROUTES.map((route) => (
                  <motion.button
                    key={route.id}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push(route.path)}
                    className={`group relative p-6 bg-white/95 border ${route.border} rounded-2xl shadow-lg hover:shadow-2xl text-left transition-all duration-300 overflow-hidden`}
                  >
                    {/* gradient top bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${route.color} rounded-t-2xl`} />

                    <div className="pt-2">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{route.flag}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${route.bg} ${route.text} border ${route.border}`}>
                          {route.id === "US PE" ? "US PE" : route.id === "CANADIAN PEng" ? "P.Eng" : "CEng"}
                        </span>
                      </div>
                      <h4 className="font-bold text-secondary text-base mb-2">{route.label}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4">{route.desc}</p>
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${route.text}`}>
                        View Service <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Bottom note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <p className="text-gray-400 text-sm">
                  Not sure which route is right for you?{" "}
                  <button
                    onClick={() => router.push("/contact")}
                    className="text-primary font-semibold hover:underline"
                  >
                    Book a free consultation →
                  </button>
                </p>
              </motion.div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
};

export default GuidedFunnelSection;