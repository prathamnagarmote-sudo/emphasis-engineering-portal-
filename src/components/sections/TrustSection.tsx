"use client";

// src/components/sections/TrustSection.tsx

import { ElementType, FC, useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  Globe2,
  Users,
  Award,
  BadgeCheck,
  BookOpen,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Stat {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  icon: ElementType;
}

interface AccreditationBody {
  abbr: string;
  full: string;
  region: string;
  flag: string;
}

interface FeaturePoint {
  icon: ElementType;
  title: string;
  body: string;
}

interface OutcomeCard {
  name: string;
  role: string;
  journey?: string;
  flag?: string;
  credential: string;
  body: string;
  months?: string;
  excerpt: string;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  {
    value: 2000,
    suffix: "+",
    label: "Engineers Guided",
    sublabel: "Across all major pathways",
    icon: Users,
  },
  {
    value: 100,
    suffix: "%",
    label: "First-Attempt Pass Rate",
    sublabel: "100% Success recorded to date",
    icon: TrendingUp,
  },
  {
    value: 10,
    suffix: "+",
    label: "Countries Served",
    sublabel: "International licensing expertise",
    icon: Globe2,
  },
  {
    value: 10,
    suffix: "+",
    label: "Years of Practice",
    sublabel: "Founded in the UK, 2014",
    icon: Award,
  },
];

const ACCREDITATION_BODIES: AccreditationBody[] = [
  {
    abbr: "IET",
    full: "Institution of Engineering & Technology",
    region: "United Kingdom",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  {
    abbr: "ICE",
    full: "Institution of Civil Engineers",
    region: "United Kingdom",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  {
    abbr: "IMechE",
    full: "Institution of Mechanical Engineers",
    region: "United Kingdom",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  {
    abbr: "NCEES",
    full: "National Council of Examiners for Engineering",
    region: "United States",
    flag: "https://flagcdn.com/w40/us.png",
  },
  {
    abbr: "Engineers Canada",
    full: "National Engineering Regulatory Body",
    region: "Canada",
    flag: "https://flagcdn.com/w40/ca.png",
  },
  {
    abbr: "PEO",
    full: "Professional Engineers Ontario",
    region: "Canada",
    flag: "https://flagcdn.com/w40/ca.png",
  },
];

const FEATURE_POINTS: FeaturePoint[] = [
  {
    icon: ShieldCheck,
    title: "Outcome Guarantee",
    body: "If you don't achieve your credential within the agreed timeline, we extend mentorship at zero additional cost — no questions asked.",
  },
  {
    icon: BookOpen,
    title: "Pathway-Specific Curricula",
    body: "Every programme is built around the exact competency frameworks of your target licensing body. Nothing generic, nothing approximated.",
  },
  {
    icon: Zap,
    title: "Active Mentor Network",
    body: "All mentors are currently chartered or licensed engineers — actively practising in their field, not retired academics.",
  },
  {
    icon: Clock,
    title: "Async-First Flexibility",
    body: "Designed for working engineers. All materials, reviews, and mentor feedback are delivered asynchronously around your schedule.",
  },
];

const OUTCOME_CARDS: OutcomeCard[] = [
  {
    name: "Alaa E.",
    role: "Chartered Engineer",
    credential: "CEng, MIET",
    body: "I couldn't define my personal contribution until Max's report structuring feedback clarified my technical impact. His deep knowledge turned a stalled application into MIET success.",
    excerpt: "His deep knowledge turned a stalled application into MIET success.",
  },
  {
    name: "Amr S.",
    role: "Chartered Engineer",
    credential: "CEng, MIET",
    body: "My presentation lacked focus until Max applied the STAR technique. His CEng roadmap and strategic coaching ensured my leadership was visible and validated by reviewers.",
    excerpt: "His CEng roadmap and strategic coaching ensured my leadership was visible.",
  },
  {
    name: "Viji S.",
    role: "Chartered Engineer",
    credential: "CEng, MIET",
    body: "Max's patience and mock interview grading were life-saving. I transitioned from project history to evidence-based mastery, passing my IET professional review on the first attempt.",
    excerpt: "Passing my IET professional review on the first attempt.",
  },
];

// ─── COUNTER HOOK ─────────────────────────────────────────────────────────────

function useCounter(target: number, duration = 2000, delay = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      const start = performance.now();
      const ease = (x: number) => 1 - Math.pow(1 - x, 4);
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setCount(Math.round(target * ease(p)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [started, target, duration, delay]);

  return { count, ref };
}

// ─── ANIMATION HELPERS ────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as any },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.55, delay, ease: "easeOut" as any },
});

// ─── EYEBROW LABEL ────────────────────────────────────────────────────────────

const Eyebrow: FC<{ text: string }> = ({ text }) => (
  <motion.div {...fadeIn(0)} className="inline-flex items-center gap-2.5 mb-4">
    <div
      className="h-px w-8"
      style={{ background: "linear-gradient(90deg, transparent, #3F9FA3)" }}
    />
    <span
      className="font-bold tracking-[0.2em] uppercase"
      style={{ fontSize: "0.7rem", color: "#2d7a7d" }}
    >
      {text}
    </span>
    <div
      className="h-px w-8"
      style={{ background: "linear-gradient(90deg, #3F9FA3, transparent)" }}
    />
  </motion.div>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────

const StatCard: FC<Stat & { delay: number; index: number }> = ({
  value,
  suffix,
  prefix,
  label,
  sublabel,
  icon: Icon,
  delay,
  index,
}) => {
  const { count, ref } = useCounter(value, 2200, index * 130);
  const formatted =
    value >= 1000 ? count.toLocaleString("en-US") : count.toString();

  return (
    <motion.div
      ref={ref}
      {...fadeUp(delay)}
      className="relative flex flex-col items-center text-center px-6 py-9 rounded-3xl overflow-hidden group"
      style={{
        background: "#ffffff",
        border: "1.5px solid #e8eef2",
        boxShadow: "0 4px 24px rgba(63,159,163,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Teal top accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-3xl"
        style={{
          background: "linear-gradient(90deg, #3F9FA3, #6ecdd1)",
        }}
      />

      {/* Soft teal glow bg on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(63,159,163,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Icon */}
      <div
        className="relative flex items-center justify-center w-12 h-12 rounded-2xl mb-5"
        style={{
          background: "linear-gradient(135deg, rgba(63,159,163,0.12), rgba(110,205,209,0.08))",
          border: "1.5px solid rgba(63,159,163,0.20)",
        }}
      >
        <Icon size={20} color="#3F9FA3" strokeWidth={1.8} />
      </div>

      {/* Number */}
      <div
        className="relative font-black tabular-nums leading-none"
        style={{
          fontSize: "clamp(2.2rem, 4.5vw, 3rem)",
          letterSpacing: "-0.04em",
          background: "linear-gradient(135deg, #1a3a4a 0%, #2d6b70 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {prefix}
        {formatted}
        <span
          style={{
            background: "linear-gradient(135deg, #3F9FA3, #6ecdd1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {suffix}
        </span>
      </div>

      {/* Label */}
      <div
        className="relative mt-3 font-bold"
        style={{ fontSize: "0.9rem", color: "#1a3040" }}
      >
        {label}
      </div>

      {/* Sublabel */}
      <div
        className="relative mt-1.5 leading-snug px-2"
        style={{ fontSize: "0.74rem", color: "#6b8a99", fontWeight: 500 }}
      >
        {sublabel}
      </div>
    </motion.div>
  );
};

// ─── ACCREDITATION ITEM ───────────────────────────────────────────────────────

const AccreditationItem: FC<AccreditationBody & { delay: number }> = ({
  abbr,
  full,
  region,
  flag,
  delay,
}) => (
  <motion.div
    {...fadeUp(delay)}
    className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300"
    style={{
      background: "#ffffff",
      border: "1.5px solid #e8eef2",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}
  >
    <div
      className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl"
      style={{
        background: "linear-gradient(135deg, rgba(63,159,163,0.12), rgba(110,205,209,0.08))",
        border: "1.5px solid rgba(63,159,163,0.22)",
      }}
    >
      <CheckCircle2 size={17} color="#3F9FA3" strokeWidth={2} />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="font-bold"
          style={{ fontSize: "0.92rem", color: "#1a3040" }}
        >
          {abbr}
        </span>
        <img src={flag} alt="flag" className="w-5 h-auto rounded-sm object-contain" />
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(63,159,163,0.10)",
            border: "1px solid rgba(63,159,163,0.20)",
            fontSize: "0.62rem",
            color: "#2d7a7d",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {region}
        </span>
      </div>
      <div
        className="mt-1 truncate"
        style={{ fontSize: "0.73rem", color: "#6b8a99", fontWeight: 500 }}
      >
        {full}
      </div>
    </div>

    <BadgeCheck
      size={16}
      color="#3F9FA3"
      strokeWidth={2}
      className="flex-shrink-0"
    />
  </motion.div>
);

// ─── FEATURE POINT ────────────────────────────────────────────────────────────

const FeaturePoint: FC<FeaturePoint & { delay: number }> = ({
  icon: Icon,
  title,
  body,
  delay,
}) => (
  <motion.div {...fadeUp(delay)} className="flex gap-4">
    <div
      className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl mt-0.5"
      style={{
        background: "linear-gradient(135deg, rgba(63,159,163,0.13), rgba(110,205,209,0.07))",
        border: "1.5px solid rgba(63,159,163,0.22)",
      }}
    >
      <Icon size={17} color="#3F9FA3" strokeWidth={1.8} />
    </div>
    <div>
      <div
        className="font-bold mb-1.5"
        style={{ fontSize: "0.95rem", color: "#1a3040" }}
      >
        {title}
      </div>
      <div
        className="leading-[1.70]"
        style={{ fontSize: "0.83rem", color: "#4a6b7a", fontWeight: 500 }}
      >
        {body}
      </div>
    </div>
  </motion.div>
);

// ─── OUTCOME CARD ─────────────────────────────────────────────────────────────

const OutcomeCard: FC<OutcomeCard & { delay: number; featured?: boolean }> = ({
  name,
  role,
  journey,
  flag,
  credential,
  body,
  months,
  excerpt,
  delay,
  featured,
}) => (
  <motion.div
    {...fadeUp(delay)}
    className="relative flex flex-col p-7 rounded-3xl h-full overflow-hidden"
    style={{
      background: featured
        ? "linear-gradient(145deg, #0d2d3d 0%, #0a2030 100%)"
        : "#ffffff",
      border: featured ? "1.5px solid #3F9FA3" : "1.5px solid #e8eef2",
      boxShadow: featured
        ? "0 8px 40px rgba(63,159,163,0.25), 0 2px 8px rgba(0,0,0,0.15)"
        : "0 4px 20px rgba(0,0,0,0.06)",
    }}
  >
    {/* Featured top glow line */}
    {featured && (
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-3xl"
        style={{
          background: "linear-gradient(90deg, transparent, #3F9FA3, #6ecdd1, transparent)",
        }}
      />
    )}

    {/* Credential pill */}
    <div className="flex items-center justify-between mb-5">
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
        style={{
          background: featured
            ? "rgba(63,159,163,0.20)"
            : "rgba(63,159,163,0.10)",
          border: `1.5px solid ${featured ? "rgba(63,159,163,0.45)" : "rgba(63,159,163,0.22)"}`,
        }}
      >
        <BadgeCheck
          size={13}
          color="#3F9FA3"
          strokeWidth={2.5}
        />
        <span
          className="font-bold"
          style={{
            fontSize: "0.73rem",
            color: featured ? "#6ecdd1" : "#2d7a7d",
          }}
        >
          {credential} · {body}
        </span>
      </div>
      <img src={flag} alt="flag" className="w-5 h-auto rounded-sm object-contain" />
    </div>

    {/* Quote */}
    <blockquote
      className="flex-1 italic leading-[1.75] mb-6"
      style={{
        fontSize: "0.875rem",
        color: featured ? "rgba(255,255,255,0.82)" : "#3a5a6a",
        fontWeight: 500,
      }}
    >
      "{excerpt}"
    </blockquote>

    {/* Divider */}
    <div
      className="mb-5 h-px"
      style={{
        background: featured
          ? "rgba(255,255,255,0.10)"
          : "#edf2f5",
      }}
    />

    {/* Footer */}
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #3F9FA3, #2d7a7d)",
            fontSize: "0.75rem",
          }}
        >
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <div
            className="font-bold"
            style={{
              fontSize: "0.83rem",
              color: featured ? "#ffffff" : "#1a3040",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: "0.70rem",
              color: featured ? "rgba(255,255,255,0.50)" : "#6b8a99",
              fontWeight: 500,
            }}
          >
            {role} · {journey}
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
        style={{
          background: featured ? "rgba(255,255,255,0.08)" : "#f0f6f8",
          border: `1px solid ${featured ? "rgba(255,255,255,0.12)" : "#d8eaee"}`,
        }}
      >
        <Clock
          size={11}
          color={featured ? "rgba(255,255,255,0.50)" : "#6b8a99"}
          strokeWidth={2}
        />
        <span
          style={{
            fontSize: "0.68rem",
            color: featured ? "rgba(255,255,255,0.50)" : "#6b8a99",
            fontWeight: 600,
          }}
        >
          {months} months
        </span>
      </div>
    </div>
  </motion.div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const TrustSection: FC = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#f0f6f8" }}
    >
      {/* ── BACKGROUND DECORATION ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large soft teal orb top-right */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-15%",
            width: "65vw",
            height: "65vw",
            maxWidth: 750,
            maxHeight: 750,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(63,159,163,0.10) 0%, transparent 65%)",
          }}
        />
        {/* Mid orb bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-10%",
            width: "55vw",
            height: "55vw",
            maxWidth: 650,
            maxHeight: 650,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(63,159,163,0.07) 0%, transparent 65%)",
          }}
        />
        {/* Centre accent orb */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
            width: "40vw",
            height: "40vw",
            maxWidth: 500,
            maxHeight: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(63,159,163,0.05) 0%, transparent 65%)",
          }}
        />
        {/* Subtle line pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(63,159,163,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(63,159,163,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BLOCK 1 — STATS
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Section header */}
        <div className="text-center mb-16">
          <Eyebrow text="Proven at Scale" />
          <motion.h2
            {...fadeUp(0.08)}
            className="font-extrabold leading-[1.08]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              letterSpacing: "-0.03em",
              color: "#0d2233",
            }}
          >
            Numbers That Hold Up{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3F9FA3 0%, #2d7a7d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              to Scrutiny
            </span>
          </motion.h2>
          <motion.p
            {...fadeUp(0.16)}
            className="mt-4 max-w-lg mx-auto leading-relaxed"
            style={{
              fontSize: "clamp(0.92rem, 1.5vw, 1.05rem)",
              color: "#4a6b7a",
              fontWeight: 500,
            }}
          >
            Every metric is drawn from verified programme outcomes across our
            active client base — not projections, not estimates.
          </motion.p>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={0.08 + i * 0.09}
              index={i}
            />
          ))}
        </div>

        {/* Delta callout */}
        <motion.div {...fadeUp(0.44)} className="mt-8 flex justify-center">
          <div
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl"
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(63,159,163,0.25)",
              boxShadow: "0 4px 20px rgba(63,159,163,0.10)",
            }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
              style={{
                background: "rgba(63,159,163,0.10)",
                border: "1.5px solid rgba(63,159,163,0.20)",
              }}
            >
              <TrendingUp size={14} color="#3F9FA3" strokeWidth={2} />
            </div>
            <span style={{ fontSize: "0.83rem", color: "#4a6b7a", fontWeight: 500 }}>
              Our{" "}
              <span style={{ color: "#1a3040", fontWeight: 700 }}>
                100% pass rate
              </span>{" "}
              vs{" "}
              <span style={{ color: "#1a3040", fontWeight: 700 }}>
                61% industry average
              </span>{" "}
              —{" "}
              <span style={{ color: "#3F9FA3", fontWeight: 800 }}>
                +33 percentage points
              </span>{" "}
              across all programmes
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          className="w-full h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(63,159,163,0.30) 30%, rgba(63,159,163,0.55) 50%, rgba(63,159,163,0.30) 70%, transparent)",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BLOCK 2 — ACCREDITATIONS + WHY US
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-20">
        <div className="text-center mb-16">
          <Eyebrow text="Institutional Alignment" />
          <motion.h2
            {...fadeUp(0.08)}
            className="font-extrabold leading-[1.08]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              letterSpacing: "-0.03em",
              color: "#0d2233",
            }}
          >
            Aligned to the Bodies{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3F9FA3 0%, #2d7a7d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              That Matter
            </span>
          </motion.h2>
          <motion.p
            {...fadeUp(0.16)}
            className="mt-4 max-w-xl mx-auto leading-relaxed"
            style={{
              fontSize: "clamp(0.92rem, 1.5vw, 1.05rem)",
              color: "#4a6b7a",
              fontWeight: 500,
            }}
          >
            Our programmes are structured to the exact competency standards
            set by each licensing authority — nothing approximated.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Accreditation list */}
          <div className="flex flex-col gap-3">
            {ACCREDITATION_BODIES.map((b, i) => (
              <AccreditationItem
                key={b.abbr}
                {...b}
                delay={0.06 + i * 0.07}
              />
            ))}
          </div>

          {/* Why us panel */}
          <motion.div
            {...fadeIn(0.1)}
            className="flex flex-col justify-center rounded-3xl p-8"
            style={{
              background: "linear-gradient(145deg, #0d2d3d 0%, #0a2030 100%)",
              border: "1.5px solid rgba(63,159,163,0.22)",
              boxShadow: "0 8px 40px rgba(13,45,61,0.20)",
            }}
          >
            {/* Panel header */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex items-center justify-center w-11 h-11 rounded-2xl flex-shrink-0"
                style={{
                  background: "rgba(63,159,163,0.15)",
                  border: "1.5px solid rgba(63,159,163,0.30)",
                }}
              >
                <Zap size={18} color="#3F9FA3" strokeWidth={1.8} />
              </div>
              <div>
                <div
                  className="font-bold text-white"
                  style={{ fontSize: "1.05rem", letterSpacing: "-0.01em" }}
                >
                  Why Engineers Choose Us
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: 500,
                  }}
                >
                  Structural advantages built into every programme
                </div>
              </div>
            </div>

            {/* Feature points — white text on dark */}
            <div className="flex flex-col gap-6">
              {FEATURE_POINTS.map((fp, i) => (
                <motion.div
                  key={fp.title}
                  {...fadeUp(0.12 + i * 0.08)}
                  className="flex gap-4"
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl mt-0.5"
                    style={{
                      background: "rgba(63,159,163,0.12)",
                      border: "1.5px solid rgba(63,159,163,0.25)",
                    }}
                  >
                    <fp.icon size={16} color="#3F9FA3" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div
                      className="font-bold text-white mb-1.5"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {fp.title}
                    </div>
                    <div
                      className="leading-[1.68]"
                      style={{
                        fontSize: "0.80rem",
                        color: "rgba(255,255,255,0.55)",
                        fontWeight: 500,
                      }}
                    >
                      {fp.body}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {[
                "No hidden requirements",
                "Framework-mapped",
                "Mentor-reviewed",
              ].map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(63,159,163,0.10)",
                    border: "1px solid rgba(63,159,163,0.22)",
                  }}
                >
                  <CheckCircle2 size={11} color="#3F9FA3" strokeWidth={2.5} />
                  <span
                    className="font-semibold text-white"
                    style={{ fontSize: "0.71rem" }}
                  >
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          className="w-full h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(63,159,163,0.30) 30%, rgba(63,159,163,0.55) 50%, rgba(63,159,163,0.30) 70%, transparent)",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BLOCK 3 — OUTCOME CARDS → BRIDGE TO TESTIMONIALS
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28">
        <div className="text-center mb-16">
          <Eyebrow text="Engineer Stories" />
          <motion.h2
            {...fadeUp(0.08)}
            className="font-extrabold leading-[1.08]"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              letterSpacing: "-0.03em",
              color: "#0d2233",
            }}
          >
            Real Engineers.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3F9FA3 0%, #2d7a7d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Verified Results.
            </span>
          </motion.h2>
          <motion.p
            {...fadeUp(0.16)}
            className="mt-4 max-w-lg mx-auto leading-relaxed"
            style={{
              fontSize: "clamp(0.92rem, 1.5vw, 1.05rem)",
              color: "#4a6b7a",
              fontWeight: 500,
            }}
          >
            Every story below is from an engineer who came to us stuck — and
            left fully licensed. No curated edge cases.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {OUTCOME_CARDS.map((card, i) => (
            <OutcomeCard
              key={card.name}
              {...card}
              delay={0.08 + i * 0.1}
              featured={i === 1}
            />
          ))}
        </div>

        {/* Bridge cue into TestimonialsSlider */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col items-center gap-4"
        >
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{
              background: "#ffffff",
              border: "1.5px solid #e0ecf0",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#3F9FA3" }}
            />
            <span
              style={{
                fontSize: "0.80rem",
                color: "#4a6b7a",
                fontWeight: 600,
              }}
            >
              Read full testimonials from our engineer community below
            </span>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#3F9FA3" }}
            />
          </div>

          {/* Animated thread */}
          <motion.div
            className="flex flex-col items-center gap-1"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" as any }}
          >
            <div
              className="w-px h-10"
              style={{
                background:
                  "linear-gradient(180deg, #3F9FA3, rgba(63,159,163,0.10))",
              }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#3F9FA3" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── BOTTOM WAVE TRANSITION into TestimonialsSlider ── */}
      <div className="relative z-10 -mb-px">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
          style={{ height: 80, display: "block" }}
        >
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#04090F"
          />
        </svg>
      </div>
    </section>
  );
};

export default TrustSection;