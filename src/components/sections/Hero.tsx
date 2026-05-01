"use client";

import { ElementType, FC, useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Globe2, Award, Users } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TRUST_ORGS = [
  { name: "IET", full: "Institution of Engineering & Technology" },
  { name: "ICE", full: "Institution of Civil Engineers" },
  { name: "IMechE", full: "Institution of Mechanical Engineers" },
  { name: "NCEES", full: "National Council of Examiners for Engineering" },
  { name: "PEO", full: "Professional Engineers Ontario" },
];

const STATS = [
  { icon: Users, value: 2000, suffix: "+", label: "Engineers Mentored" },
  { icon: Globe2, value: 10, suffix: "+", label: "Countries Served" },
  { icon: Award, value: 100, suffix: "%", label: "First-Attempt Pass Rate" },
];

// ─── ANIMATION HELPERS ────────────────────────────────────────────────────────

const fadeUp = (delay = 0, duration = 0.55) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: [0.22, 1, 0.36, 1] as any },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, delay, ease: "easeOut" as any },
});

// ─── COUNTER HOOK ─────────────────────────────────────────────────────────────

function useCounter(
  target: number,
  duration: number = 2000,
  startDelay: number = 0
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const startValue = 0;

      const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = Math.round(
          startValue + (target - startValue) * easedProgress
        );

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [hasStarted, target, duration, startDelay]);

  return { count, ref };
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const BackgroundOrbs: FC = () => (
  <>
    <div
      className="absolute pointer-events-none"
      style={{
        top: "-8%",
        right: "-5%",
        width: "52vw",
        height: "52vw",
        maxWidth: 700,
        maxHeight: 700,
        background:
          "radial-gradient(circle, rgba(63,159,163,0.13) 0%, transparent 68%)",
        filter: "blur(2px)",
      }}
    />
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: "-10%",
        left: "-8%",
        width: "48vw",
        height: "48vw",
        maxWidth: 640,
        maxHeight: 640,
        background:
          "radial-gradient(circle, rgba(14,43,69,0.9) 0%, transparent 70%)",
      }}
    />
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 80% 45% at 50% 105%, rgba(63,159,163,0.10) 0%, transparent 65%)",
      }}
    />
  </>
);

const TextureOverlay: FC = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.025]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
      `,
      backgroundSize: "72px 72px",
    }}
  />
);

const AccentRule: FC = () => (
  <motion.div
    className="flex items-center gap-3 justify-center mt-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.38, duration: 0.5 }}
  >
    <motion.div
      className="h-px rounded-full"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(63,159,163,0.5), #3F9FA3)",
        width: 48,
      }}
      initial={{ scaleX: 0, originX: "right" }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.42, duration: 0.55, ease: [0.22, 1, 0.36, 1] as any }}
    />
    <div
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: "#3F9FA3" }}
    />
    <motion.div
      className="h-px rounded-full"
      style={{
        background:
          "linear-gradient(90deg, #3F9FA3, rgba(63,159,163,0.5), transparent)",
        width: 48,
      }}
      initial={{ scaleX: 0, originX: "left" }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.42, duration: 0.55, ease: [0.22, 1, 0.36, 1] as any }}
    />
  </motion.div>
);

// ─── ANIMATED STAT CARD ───────────────────────────────────────────────────────

const StatCard: FC<{
  icon: ElementType;
  value: number;
  suffix: string;
  label: string;
  delay: number;
  index: number;
}> = ({ icon: Icon, value, suffix, label, delay, index }) => {
  const { count, ref } = useCounter(value, 2200, index * 150);

  // Format: add comma for thousands
  const formatted =
    value >= 1000 ? count.toLocaleString("en-US") : count.toString();

  return (
    <motion.div
      ref={ref}
      {...fadeUp(delay)}
      className="flex flex-col items-center gap-1 px-8 py-5"
      style={{
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg mb-1"
        style={{
          background: "rgba(63,159,163,0.12)",
          border: "1px solid rgba(63,159,163,0.22)",
        }}
      >
        <Icon size={15} color="#3F9FA3" strokeWidth={2} />
      </div>

      {/* Animated number */}
      <div className="flex items-baseline gap-0.5">
        <span
          className="font-extrabold text-white tabular-nums"
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatted}
        </span>
        <span
          className="font-bold"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
            color: "#3F9FA3",
            lineHeight: 1,
          }}
        >
          {suffix}
        </span>
      </div>

      {/* Label */}
      <span
        className="font-medium tracking-wide text-center"
        style={{
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.42)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginTop: 2,
        }}
      >
        {label}
      </span>
    </motion.div>
  );
};

// ─── FLOATING REVIEW CARD ─────────────────────────────────────────────────────

import { testimonials } from "@/data/mockData";
import { Star } from "lucide-react";

const FloatingReviewCard: FC<{
  testimonial: any;
  positionClass: string;
  delay: number;
  yOffset: number;
}> = ({ testimonial, positionClass, delay, yOffset }) => (
  <motion.div
    className={`absolute hidden xl:flex flex-col gap-2 p-2 xl:p-3 rounded-2xl w-[180px] xl:w-[200px] 2xl:w-[240px] z-0 shadow-2xl ${positionClass}`}
    style={{
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)",
    }}
    initial={{ opacity: 0, scale: 0.8, y: 50 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
  >
    <motion.div
      animate={{ y: [0, yOffset, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay % 2 }}
    >
      <div className="flex items-center gap-2 xl:gap-3 mb-2">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-8 h-8 xl:w-10 xl:h-10 rounded-full border border-white/20 object-cover"
        />
        <div className="flex flex-col">
          <span className="text-white text-[10px] xl:text-xs font-semibold">{testimonial.name}</span>
          <span className="text-[#3F9FA3] text-[8px] xl:text-[10px] leading-tight">{testimonial.company}</span>
        </div>
      </div>
      <div className="flex gap-0.5 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-white/70 text-[9px] xl:text-[11px] leading-relaxed line-clamp-3 italic">
        "{testimonial.review}"
      </p>
    </motion.div>
  </motion.div>
);

// ─── TRUST BADGE ──────────────────────────────────────────────────────────────

const TrustBadge: FC<{
  name: string;
  full: string;
  delay: number;
}> = ({ name, full, delay }) => (
  <motion.div
    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
    style={{
      background: "rgba(255,255,255,0.055)",
      border: "1px solid rgba(255,255,255,0.10)",
    }}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" as any }}
  >
    <CheckCircle2 size={13} color="#3F9FA3" strokeWidth={2.5} />
    <div className="flex items-baseline gap-2">
      <span
        className="font-bold text-white"
        style={{ fontSize: "0.82rem", letterSpacing: "0.02em" }}
      >
        {name}
      </span>
      <span
        className="hidden sm:inline text-xs"
        style={{ color: "rgba(255,255,255,0.38)" }}
      >
        {full}
      </span>
    </div>
  </motion.div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const Hero: FC = () => {
  const [heroTestimonials, setHeroTestimonials] = useState<any[]>(testimonials);


  useEffect(() => {
    async function fetchHeroTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        const items = await res.json();
        if (Array.isArray(items) && items.length >= 4) {
          const transformed = items.map(item => ({
            ...item,
            review: item.quote // Map DB quote to the 'review' prop used in Hero
          }));
          setHeroTestimonials(transformed);
        }
      } catch (err) {
        console.error("Failed to fetch hero testimonials:", err);
      }
    }
    fetchHeroTestimonials();
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden">

      {/* ── BACKGROUND PHOTO ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=2200&q=80')",
          transform: "scale(1.04)",
          transformOrigin: "center",
        }}
      />

      {/* ── OVERLAYS ── */}
      <div className="absolute inset-0 bg-[#060F1A]/70" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#071B2B]/60 via-[#0B2236]/55 to-[#040D16]/75" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#040D16]/50 via-transparent to-[#040D16]/40" />

      {/* ── TEXTURE + ORBS ── */}
      <TextureOverlay />
      <BackgroundOrbs />

      {/* ── FLOATING REVIEWS (Desktop Only) ── */}
      <FloatingReviewCard testimonial={heroTestimonials[0]} positionClass="top-[15%] left-[1%] 2xl:left-[4%]" delay={0.6} yOffset={15} />
      <FloatingReviewCard testimonial={heroTestimonials[1]} positionClass="bottom-[10%] left-[1%] 2xl:left-[6%]" delay={0.8} yOffset={-12} />
      <FloatingReviewCard testimonial={heroTestimonials[2]} positionClass="top-[20%] right-[1%] 2xl:right-[4%]" delay={0.7} yOffset={10} />
      <FloatingReviewCard testimonial={heroTestimonials[3]} positionClass="bottom-[15%] right-[1%] 2xl:right-[3%]" delay={0.9} yOffset={-15} />


      {/* ── CONTENT ── */}
      <div className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 pb-12 pointer-events-none">
        <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl w-full pointer-events-auto">

          {/* ── STATUS BADGE ── */}
          <motion.div
            {...fadeIn(0)}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10"
            style={{
              background: "rgba(63,159,163,0.10)",
              border: "1px solid rgba(63,159,163,0.28)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3F9FA3] opacity-70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3F9FA3]" />
            </span>
            <span
              className="text-[#6ecdd1] font-semibold tracking-wide"
              style={{ fontSize: "0.78rem", letterSpacing: "0.08em" }}
            >
              GLOBAL ENGINEERING LICENSURE PLATFORM
            </span>
          </motion.div>

          {/* ── HEADLINE ── */}
          <motion.h1
            {...fadeUp(0.1)}
            className="font-extrabold text-white leading-[1.06] tracking-tight"
            style={{
              fontSize: "clamp(2.9rem, 8vw, 6.4rem)",
              textShadow: "0 2px 32px rgba(0,0,0,0.5)",
              letterSpacing: "-0.02em",
            }}
          >
            Chartered.{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #3F9FA3 0%, #7ee0e4 45%, #3F9FA3 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient-shift 5s linear infinite",
                filter: "drop-shadow(0 0 28px rgba(63,159,163,0.35))",
              }}
            >
              Licensed.
            </span>
            <br />
            <span className="text-white">Recognised Globally.</span>
          </motion.h1>

          {/* ── ACCENT RULE ── */}
          <AccentRule />

          {/* ── SUBTEXT ── */}
          <motion.p
            {...fadeUp(0.32)}
            className="mt-7 max-w-2xl mx-auto leading-[1.75]"
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.18rem)",
              color: "rgba(255,255,255,0.72)",
              textShadow: "0 1px 10px rgba(0,0,0,0.35)",
            }}
          >
            Expert-led mentoring and structured programs to guide engineers
            through the{" "}
            <span className="text-white font-semibold">UK CEng</span>,{" "}
            <span className="text-white font-semibold">Canadian P.Eng</span>,
            and{" "}
            <span className="text-white font-semibold">US PE</span> licensure
            pathways — from first application to final approval.
          </motion.p>

          {/* ── CTA BUTTONS ── */}
          <motion.div
            {...fadeUp(0.42)}
            className="flex gap-3 justify-center mt-11 flex-wrap"
          >
            <Link href="/services">
              <motion.div
                className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-semibold text-white cursor-pointer overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #3F9FA3 0%, #2d7a7d 100%)",
                  boxShadow:
                    "0 4px 28px rgba(63,159,163,0.45), 0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.18)",
                  fontSize: "0.95rem",
                }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span>Find Your Licensing Path</span>
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </motion.div>
            </Link>

            <Link href="/courses">
              <motion.div
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-medium text-white cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  fontSize: "0.95rem",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
                whileHover={{
                  scale: 1.04,
                  y: -2,
                  backgroundColor: "rgba(255,255,255,0.13)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                Explore Courses
              </motion.div>
            </Link>
          </motion.div>

          {/* ── STATS ROW ── */}
          <motion.div
            {...fadeUp(0.52)}
            className="inline-flex items-stretch justify-center mt-14 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {STATS.map((stat, i) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={0.56 + i * 0.08}
                index={i}
              />
            ))}
          </motion.div>

          {/* ── TRUST STRIP ── */}
          <motion.div {...fadeUp(0.68)} className="mt-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="h-px flex-1 max-w-[60px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.15))",
                }}
              />
              <span
                className="text-[10px] font-semibold tracking-[0.22em] uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Trusted by engineers from
              </span>
              <div
                className="h-px flex-1 max-w-[60px]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.15), transparent)",
                }}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2.5">
              {TRUST_ORGS.map((org, i) => (
                <TrustBadge
                  key={org.name}
                  name={org.name}
                  full={org.full}
                  delay={0.72 + i * 0.07}
                />
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── KEYFRAMES ── */}
      <style>{`
        @keyframes gradient-shift {
          0%   { background-position: 0% center; }
          50%  { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </section>
  );
};

export default Hero;