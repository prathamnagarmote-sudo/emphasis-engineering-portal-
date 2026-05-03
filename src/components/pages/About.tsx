"use client";

import { FC, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Globe,
  MapPin,
  TrendingUp,
  Shield,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { aboutData } from "@/data/aboutData";

// ─── 3D TILT CARD COMPONENT ──────────────────────────────────────────────────

const TiltCard: FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full rounded-3xl ${className}`}
    >
      <div
        style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
};

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────

const AnimatedCounter: FC<{ value: string; duration?: number }> = ({
  value,
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const increment = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, numericValue, duration]);

  return (
    <div ref={ref}>
      {count >= 1000 ? count.toLocaleString() : count}
      {suffix}
    </div>
  );
};

// ─── MAIN ABOUT PAGE ─────────────────────────────────────────────────────────

const About: FC = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // For Timeline
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(timelineProgress, [0, 1], ["0%", "100%"]);

  const [activeService, setActiveService] = useState("uk");
  const servicesList = [
    { id: "uk", data: aboutData.services.uk, icon: MapPin },
    { id: "us", data: aboutData.services.us, icon: Globe },
    { id: "canada", data: aboutData.services.canada, icon: Target },
  ];

  return (
    <div className="bg-[#020813] text-white overflow-hidden min-h-screen">
      {/* ═══════════════════════════════════════════
          1. CINEMATIC HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        {/* Deep ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#3F9FA3]/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10s]" />
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[150px] mix-blend-screen" />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-[#3F9FA3] shadow-[0_0_10px_#3F9FA3]" />
            <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">
              Our Story
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Empowering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3F9FA3] via-cyan-300 to-blue-500 drop-shadow-lg">
              Next Generation
            </span>{" "}
            <br />
            of Engineers.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            {aboutData.hero.description}
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          2. BENTO GRID (STORY & STATS)
      ═══════════════════════════════════════════ */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Story Card (Span 2) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 relative p-10 sm:p-14 rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#3F9FA3]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-display">
                {aboutData.story.title}
              </h2>
              <div className="space-y-6 text-gray-400 leading-relaxed text-lg relative z-10">
                <p>{aboutData.whoWeAre[0]}</p>
                <p>{aboutData.whoWeAre[1]}</p>
                <p>{aboutData.whoWeAre[3]}</p>
              </div>
            </motion.div>

            {/* Stats Column */}
            <div className="flex flex-col gap-6">
              {aboutData.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex-1 relative p-8 rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl group flex flex-col justify-center items-center text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-2 font-display">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-[#3F9FA3] font-semibold tracking-widest uppercase text-xs">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. INTERACTIVE GLOBAL SERVICES
      ═══════════════════════════════════════════ */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Global <span className="text-[#3F9FA3]">Licensure</span> Pathways.
            </h2>
            <p className="text-gray-400 mt-4 text-lg">
              Tailored professional registration support for engineers worldwide.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">

            {/* Tabs (Left) */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {servicesList.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 border text-left ${activeService === service.id
                      ? "bg-[#3F9FA3]/10 border-[#3F9FA3]/50 text-white"
                      : "bg-white/[0.02] border-white/5 text-gray-500 hover:bg-white/[0.05] hover:text-gray-300"
                    }`}
                >
                  <service.icon
                    className={`w-6 h-6 ${activeService === service.id ? "text-[#3F9FA3]" : "opacity-50"
                      }`}
                  />
                  <span className="font-semibold text-lg">{service.data.title.split('–')[0]}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Content (Right) */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative p-10 sm:p-14 rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 backdrop-blur-3xl overflow-hidden"
                >
                  {/* Big glowing background letter/shape */}
                  <div className="absolute -right-20 -bottom-20 text-[20rem] font-bold text-white/[0.02] pointer-events-none select-none leading-none">
                    {servicesList.find((s) => s.id === activeService)?.data.title.charAt(0)}
                  </div>

                  <h3 className="text-3xl font-bold mb-10 relative z-10">
                    {servicesList.find((s) => s.id === activeService)?.data.title}
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                    {servicesList
                      .find((s) => s.id === activeService)
                      ?.data.points.map((point, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-[#3F9FA3] flex-shrink-0 mt-1" />
                          <span className="text-gray-300 leading-relaxed">
                            {point}
                          </span>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. EDITORIAL FOUNDER PROFILE
      ═══════════════════════════════════════════ */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#061F33]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[3rem] overflow-hidden aspect-[4/5] lg:aspect-auto lg:h-[700px] border border-white/10"
            >
              <img
                src={aboutData.founder.image}
                alt={aboutData.founder.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020813] via-transparent to-transparent" />

            </motion.div>

            {/* Text Side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm text-[#3F9FA3] font-bold tracking-widest uppercase mb-4">
                Leadership
              </h2>
              <h3 className="text-5xl font-display font-bold mb-2">
                {aboutData.founder.name}
              </h3>
              <p className="text-xl text-gray-400 mb-8">{aboutData.founder.title}</p>

              <div className="w-16 h-1 bg-gradient-to-r from-[#3F9FA3] to-transparent rounded-full mb-8" />

              <p className="text-gray-300 text-lg leading-relaxed mb-10">
                {aboutData.founder.bio}
              </p>

              <div className="flex items-center gap-4">
                <a
                  href={aboutData.founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-[#0077B5] hover:border-transparent transition-all"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. 3D TILT VISION & MISSION
      ═══════════════════════════════════════════ */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 perspective-1000">

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <TiltCard className="h-full">
                <div className="h-full p-12 rounded-[2.5rem] bg-gradient-to-br from-[#0A2E4C] to-[#04111D] border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />
                  <Eye className="w-12 h-12 text-blue-400 mb-8" />
                  <h3 className="text-3xl font-display font-bold mb-6">Our Vision</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    To be the global gold standard for engineering professional registration support, ensuring every qualified engineer achieves the recognition they deserve across international borders.
                  </p>
                </div>
              </TiltCard>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <TiltCard className="h-full">
                <div className="h-full p-12 rounded-[2.5rem] bg-gradient-to-br from-[#0F3536] to-[#051515] border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#3F9FA3]/20 blur-[80px] rounded-full pointer-events-none" />
                  <Target className="w-12 h-12 text-[#3F9FA3] mb-8" />
                  <h3 className="text-3xl font-display font-bold mb-6">Our Mission</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    To empower engineers with precise, assessor-aligned guidance that simplifies the path to licensure and chartership, grounded in regulatory excellence and real-world success.
                  </p>
                </div>
              </TiltCard>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. GLOWING SCROLL TIMELINE
      ═══════════════════════════════════════════ */}
      <section className="py-32 relative" ref={timelineRef}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              The Journey So Far
            </h2>
          </div>

          <div className="relative">
            {/* Background dull line */}
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-1 bg-white/5 md:-translate-x-1/2 rounded-full" />

            {/* Bright animated glowing line */}
            <motion.div
              style={{ height: lineHeight }}
              className="absolute left-[27px] md:left-1/2 top-0 w-1 bg-gradient-to-b from-[#3F9FA3] to-blue-500 md:-translate-x-1/2 rounded-full shadow-[0_0_15px_#3F9FA3]"
            />

            <div className="space-y-24">
              {aboutData.timeline.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`relative flex items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                  >
                    {/* Empty Space for Desktop */}
                    <div className="hidden md:block w-1/2" />

                    {/* Glowing Node */}
                    <div className="absolute left-0 md:left-1/2 w-14 h-14 bg-[#020813] border-4 border-[#3F9FA3] rounded-full md:-translate-x-1/2 shadow-[0_0_20px_rgba(63,159,163,0.4)] flex items-center justify-center z-10">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>

                    {/* Content Card */}
                    <div
                      className={`w-full pl-20 md:pl-0 md:w-1/2 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:text-left"
                        }`}
                    >
                      <span className="text-3xl font-display font-bold text-[#3F9FA3] block mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-2xl font-semibold text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative border-t border-white/5 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(63,159,163,0.1),transparent_50%)]" />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Ready to accelerate your career?</h2>
          <Link href="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-full bg-white text-[#020813] font-bold text-lg hover:bg-gray-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              View Our Services
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;