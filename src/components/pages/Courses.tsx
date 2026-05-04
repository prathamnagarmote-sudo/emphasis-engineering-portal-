"use client";

import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star, Clock, Users, Play, Lock, Check, ShoppingCart,
  ArrowRight, Shield, ChevronDown, BookOpen, Award, Zap,
  Quote, TrendingUp, FileText, Video, MessageSquare,
  Trophy, Globe, Calendar, ChevronRight, Target, Layers,
  BarChart, Lightbulb, CheckCircle, Trash2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Course } from '@/types';
import Button from '@/components/ui/Button';
import PageHero from '@/components/ui/PageHero';

/* ─── Filter categories ─── */
const FILTERS = [
  { id: 'All', label: 'All Courses' },
  { id: 'Chartered Engineer Masterclass-IMECH', label: 'IMechE CEng' },
  { id: 'Chartered Engineer Masterclass-IET', label: 'IET CEng' },
  { id: 'MICE', label: 'ICE MICE' },
  { id: 'Canadian PEng', label: 'Canadian P.Eng' },
];

const INCLUDED = [
  'Expert-led video modules',
  'Competency framework templates',
  'Mock professional review',
  'Lifetime access',
];

const FAQS = [
  { q: 'How long do I have access after purchase?', a: 'Lifetime - you own the course forever including all future updates.' },
  { q: 'What experience level is required?', a: 'Each course states its level. Most are open to engineers with 2+ years of experience in their discipline.' },
  { q: 'Is there a money-back guarantee?', a: 'Yes. 30-day no-questions-asked refund if you are not satisfied.' },
  { q: 'Can the course be purchased by my employer?', a: 'Absolutely. Contact us for bulk/corporate licensing and invoice-based payment.' },
  { q: 'Do the courses include mentorship?', a: 'The courses include structured video coaching. One-to-one mentorship is available as a separate service.' },
];

const HOW_IT_WORKS = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Choose Your Pathway",
    description: "Select the licensing body that matches your engineering discipline and target country.",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Learn at Your Pace",
    description: "Access structured video modules led by Dr. Maxwell Oyom - practical and exam-focused.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Build Your Application",
    description: "Use our proven competency templates to craft a strong, submission-ready application.",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Mock Review & Feedback",
    description: "Get detailed expert feedback on your draft before the real submission.",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Get Licensed",
    description: "Walk into your professional review with confidence. 95% first-attempt pass rate.",
  },
];

const ROADMAPS = [
  {
    title: "UK CEng (IMechE / IET)",
    flag: "https://flagcdn.com/gb.svg",
    timeline: "6–18 months",
    steps: [
      { label: "Academic qualification check", covered: true },
      { label: "Initial Professional Development (IPD)", covered: true },
      { label: "Competency Evidence Report (CER)", covered: true },
      { label: "Professional Review Interview (PRI)", covered: true },
      { label: "CEng Registration", covered: false },
    ],
  },
  {
    title: "ICE MICE",
    flag: "🏗️",
    timeline: "8–14 months",
    steps: [
      { label: "Academic accreditation review", covered: true },
      { label: "Experience & competency mapping", covered: true },
      { label: "Technical Report submission", covered: true },
      { label: "Professional Review", covered: true },
      { label: "MICE Registration", covered: false },
    ],
  },
  {
    title: "Canadian P.Eng",
    flag: "https://flagcdn.com/ca.svg",
    timeline: "12–24 months",
    steps: [
      { label: "Academic credential assessment", covered: true },
      { label: "Work experience verification (4 yrs)", covered: true },
      { label: "Technical Exam (NPPE)", covered: true },
      { label: "Good Character References", covered: false },
      { label: "P.Eng License granted", covered: false },
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Nicky W.",
    role: "Chartered Engineer",
    country: "CEng, MIET",
    quote: "After struggling with UK-SPEC evidence, Max's roadmap and DAP review finally secured my CEng. His precision during PRI preparation was the deciding factor. Thanks, Emphasis Engineering!",
    rating: 5,
  },
  {
    name: "Alaa E.",
    role: "Chartered Engineer",
    country: "CEng, MIET",
    quote: "I couldn't define my personal contribution until Max's report structuring feedback clarified my technical impact. His deep knowledge turned a stalled application into MIET success.",
    rating: 5,
  },
  {
    name: "Viji S.",
    role: "Chartered Engineer",
    country: "CEng, MIET",
    quote: "Max's patience and mock interview grading were life-saving. I transitioned from project history to evidence-based mastery, passing my IET professional review on the first attempt.",
    rating: 5,
  },
];

const levelColor = (level: string) => {
  if (level.toLowerCase().includes('beginner')) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
  if (level.toLowerCase().includes('intermediate')) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  return { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' };
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariant: any = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as any } },
};

/* ═══════════════════════════════════════
   COURSE CARD
═══════════════════════════════════════ */
const CourseCard: FC<{ course: Course; index: number; onPreview: (c: Course) => void }> = ({
  course, index, onPreview,
}) => {
  const router = useRouter();
  const { isPurchased, addToCart, isInCart, removeFromCart } = useCart();
  const { formatPrice, currency, convertPrice } = useCurrency();
  const purchased = isPurchased(course.id);
  const inCart = isInCart(course.id);
  const savings = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
  const lc = levelColor(course.level);

  const [isBuying, setIsBuying] = useState(false);

  const handlePurchase = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (purchased) return;
    
    setIsBuying(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: course.id,
            title: course.title,
            price: convertPrice(course.price),
            type: 'course'
          }],
          currency: currency.code
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      alert(err.message);
      setIsBuying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] as any }}
      whileHover={{ y: -6 }}
      onClick={() => router.push(`/courses/${course.id}`)}
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#061F33]/55 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onPreview(course);
            }}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl"
          >
            <Play className="w-6 h-6 text-primary ml-1" />
          </motion.button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {index === 0 && (
            <span className="px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" /> Bestseller
            </span>
          )}
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${lc.bg} ${lc.text} ${lc.border}`}>
            {course.level}
          </span>
        </div>
        {savings > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-full">
            Save {savings}%
          </div>
        )}
        {purchased && (
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> Enrolled
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <img src={course.instructorImage} alt={course.instructor} className="w-7 h-7 rounded-full object-cover border-2 border-primary/20" />
          <span className="text-xs text-gray-500 font-medium">{course.instructor}</span>
        </div>
        <h3 className="font-bold text-secondary text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{course.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.lessons} lessons</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students.toLocaleString()}</span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-secondary mb-2 uppercase tracking-wide">What's included</p>
          <ul className="space-y-1.5">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1" />

        <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(course.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700">{course.rating}</span>
            <span className="text-xs text-gray-400">({course.reviews.toLocaleString()})</span>
          </div>
          <div className="text-right">
            <span className="text-gray-400 text-xs line-through mr-1">{formatPrice(course.originalPrice)}</span>
            <span className="text-primary font-extrabold text-xl">{formatPrice(course.price)}</span>
          </div>
        </div>

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {purchased ? (
            <Button onClick={() => onPreview(course)} className="flex-1">
              <Play className="w-4 h-4 mr-1.5" /> Watch Now
            </Button>
          ) : (
            <>
              <Button onClick={handlePurchase} disabled={isBuying} className="flex-1 text-sm">
                {isBuying ? "Processing..." : "Buy Now"}
              </Button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (inCart) {
                    removeFromCart(course.id);
                  } else {
                    addToCart({ id: course.id, title: course.title, price: course.price, type: 'course', thumbnail: course.thumbnail });
                  }
                }}
                className={`h-11 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${inCart
                  ? 'px-4 border-red-100 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'w-11 border-gray-200 text-gray-500 hover:border-primary hover:text-primary hover:bg-primary/5'
                  }`}
                title={inCart ? 'Remove from cart' : 'Add to cart'}
              >
                {inCart ? (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span className="text-xs font-bold">Remove</span>
                  </>
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════
   FAQ ITEM
═══════════════════════════════════════ */
const FAQItem: FC<{ q: string; a: string; index: number }> = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-secondary text-sm">{q}</span>
        <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 ml-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════════════════════════════════
   SECTION: HOW IT WORKS  ← white bg
═══════════════════════════════════════ */
const HowItWorksSection: FC = () => (
  <section className="py-24 bg-white relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(63,159,163,0.07),transparent_60%)]" />

    <div className="relative max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
          <Zap className="w-3 h-3" /> Simple Process
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-secondary">
          How It <span className="text-primary">Works</span>
        </h2>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
          From enrolment to licensed engineer - a clear, proven 5-step journey
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
        {/* Connector line */}
        <div className="hidden lg:block absolute top-11 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] as any }}
            className="relative flex flex-col items-center text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, boxShadow: "0 12px 32px rgba(63,159,163,0.3)" }}
              className="relative w-[88px] h-[88px] rounded-2xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center text-white shadow-lg mb-5 z-10"
            >
              {step.icon}
              <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {i + 1}
              </span>
            </motion.div>
            {i < HOW_IT_WORKS.length - 1 && (
              <ChevronRight className="hidden lg:block absolute top-8 -right-3 w-5 h-5 text-primary/30 z-20" />
            )}
            <h3 className="font-bold text-secondary text-sm mb-2">{step.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════
   SECTION: MENTOR VIDEO  ← dark bg
═══════════════════════════════════════ */
const MentorVideoSection: FC = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-24 bg-[#061F33] relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-400/8 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-6">
            <Award className="w-3 h-3" /> From the Instructor
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
            Why Our Courses{" "}
            <span className="text-primary">Get You Licensed</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8 text-lg">
            Most engineers fail licensing not because of lack of skill - but because they don't
            know how to present their competence in the format these bodies expect. Our courses
            bridge exactly that gap.
          </p>

          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { icon: <Lightbulb className="w-5 h-5" />, title: "Insider Knowledge", desc: "Built by a CEng who has sat on professional review panels" },
              { icon: <Layers className="w-5 h-5" />, title: "Structured System", desc: "Step-by-step frameworks, not generic advice" },
              { icon: <BarChart className="w-5 h-5" />, title: "Proven Results", desc: "95% first-attempt pass rate across all programmes" },
            ].map((pt, i) => (
              <motion.div
                key={i}
                variants={itemVariant}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  {pt.icon}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm mb-0.5">{pt.title}</div>
                  <div className="text-gray-400 text-sm">{pt.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.ul>
        </motion.div>

        {/* Video card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any, delay: 0.1 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-[#061F33]">
            {playing ? (
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  decoding="async"
                  src="https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto,w_800/v1776348873/photo-1581092160607-ee22621dd758_sdbfrr.jpg"
                  alt="Dr. Maxwell Oyom"
                  className="w-full h-full object-cover brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061F33]/80 via-transparent to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setPlaying(true)}
                    className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/50"
                  >
                    <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
                    <Play className="w-8 h-8 text-white ml-1 relative z-10" />
                  </motion.button>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">Why Our Courses Work</p>
                    <p className="text-gray-400 text-xs">4 min message from Dr. Maxwell</p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto,w_80/v1776348635/Chartered-Engineer-2.jpg_jrvafx.webp"
                      className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                      alt="Dr. Maxwell"
                    />
                    <div>
                      <div className="text-white font-semibold text-sm">Dr. Maxwell Oyom</div>
                      <div className="text-gray-400 text-xs">CEng, FIET - Founder & Lead Instructor</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="absolute -bottom-5 -left-5 bg-white px-5 py-4 rounded-2xl shadow-2xl"
          >
            <div className="text-2xl font-bold text-primary">10K+</div>
            <div className="text-gray-500 text-xs mt-0.5">Engineers trained globally</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="absolute -top-5 -right-5 bg-white px-5 py-4 rounded-2xl shadow-2xl"
          >
            <div className="text-2xl font-bold text-green-600">95%</div>
            <div className="text-gray-500 text-xs mt-0.5">First-attempt pass rate</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   SECTION: ROADMAPS  ← white bg
═══════════════════════════════════════ */
const RoadmapSection: FC = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(63,159,163,0.06),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
            <Globe className="w-3 h-3" /> Country Roadmaps
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary">
            Your Licensing <span className="text-primary">Roadmap</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            Every licensing body has different requirements. We map them out so you never get lost.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {ROADMAPS.map((rm, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(i)}
              className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${active === i
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-gray-100 text-gray-600 hover:border-primary/40 hover:text-primary border border-gray-200'
                }`}
            >
              {rm.flag.startsWith('http') ? (
                <img src={rm.flag} alt="flag" className="w-4 h-auto rounded-sm inline-block mr-1.5 object-contain" />
              ) : (
                <span className="mr-1.5">{rm.flag}</span>
              )}
              {rm.title}
            </motion.button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          {/* Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as any }}
              className="bg-gray-50 rounded-3xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-secondary">{ROADMAPS[active].title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
                  <Calendar className="w-4 h-4 text-primary" />
                  {ROADMAPS[active].timeline}
                </div>
              </div>

              <div className="space-y-3">
                {ROADMAPS[active].steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border ${step.covered
                      ? 'bg-primary/5 border-primary/20'
                      : 'bg-white border-gray-100'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${step.covered ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                      {i + 1}
                    </div>
                    <span className={`text-sm font-medium flex-1 ${step.covered ? 'text-secondary' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                    {step.covered && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Course covers
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  95% pass rate on first attempt
                </div>
                <Link href="#courses">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-primary shadow-md cursor-pointer flex items-center gap-2"
                  >
                    Enroll <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="relative hidden lg:block"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                decoding="async"
                src="https://res.cloudinary.com/dwk1cnlw2/image/upload/f_auto,q_auto,w_700/v1776348931/photo-1573164713988-8665fc963095_rpbldx.jpg"
                alt="Engineer planning"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061F33]/50 via-transparent to-transparent rounded-3xl" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-secondary font-bold text-sm">Structured. Clear. Proven.</div>
                  <div className="text-gray-500 text-xs">Used by 10,000+ engineers worldwide</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════
   SECTION: TESTIMONIALS  ← dark bg
═══════════════════════════════════════ */
const TestimonialsSection: FC = () => (
  <section className="py-24 bg-[#061F33] relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(63,159,163,0.08),transparent_60%)]" />

    <div className="relative max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
          <Star className="w-3 h-3 fill-primary text-primary" /> Success Stories
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Trusted by <span className="text-primary">10,000+ Engineers</span>
        </h2>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto text-lg">
          Real results from real engineers who followed the pathway
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid md:grid-cols-3 gap-6"
      >
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            variants={itemVariant}
            whileHover={{ y: -6 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/8 transition-all"
          >
            <div className="flex mb-4">
              {[...Array(t.rating)].map((_, j) => (
                <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <Quote className="w-7 h-7 text-primary/30 mb-3" />
            <p className="text-gray-300 leading-relaxed text-sm mb-6">"{t.quote}"</p>
            <div className="pt-4 border-t border-white/10">
              <div className="font-bold text-white text-sm">{t.name}</div>
              <div className="text-gray-500 text-xs mt-0.5">{t.role}</div>
              <div className="text-primary text-xs mt-1 font-medium">{t.country}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
const Courses: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const { isPurchased } = useCart();
  
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filtered = selectedCategory === 'All'
    ? courses
    : courses.filter((c: any) => c.category === selectedCategory);

  return (
    <div className="pt-20">

      {/* ① HERO - dark blue (untouched) */}
      <PageHero
        badge="Accredited Engineering Masterclasses"
        heading={
          <>
            Structured Pathways to
            <br />
            <span className="text-gradient">Engineering Licensure</span>
          </>
        }
        subtitle="Expert-led video masterclasses covering UK CEng (IMechE, IET, ICE) and Canadian P.Eng - with templates, mock reviews, and lifetime access."
        primaryCta={{ label: "Explore All Courses", href: "#courses" }}
        secondaryCta={{ label: "Book Free Consultation", href: "/contact" }}
      />

      {/* ② URGENCY BANNER - continues the dark tone */}
      <div className="bg-secondary px-4 py-3 text-center text-white text-sm font-medium">
        🔥 <strong>Limited-time offer:</strong> Save up to 22% on all masterclasses - ends soon.
        <Link href="/contact" className="ml-3 underline font-bold hover:no-underline">
          Book a free consultation →
        </Link>
      </div>

      {/* ③ FILTER TABS - sticky, white - first light section */}
      <section id="courses" className="py-5 bg-white sticky top-20 z-40 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-2 justify-center">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedCategory(f.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${selectedCategory === f.id
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {f.label}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === f.id ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                {f.id === 'All' ? courses.length : courses.filter((c: any) => c.category === f.id).length}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ④ COURSE GRID - light gray */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid md:grid-cols-2 xl:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {loading ? (
                [...Array(2)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-3xl p-6 h-96 border border-gray-100 shadow-lg">
                    <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
                  </div>
                ))
              ) : filtered.map((course: any, idx: number) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={idx}
                  onPreview={(c: any) => { setSelectedCourse(c); setActiveVideo(0); }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ⑤ HOW IT WORKS - white */}
      <HowItWorksSection />

      {/* ⑥ MENTOR VIDEO - dark blue */}
      <MentorVideoSection />

      {/* ⑦ ROADMAPS - white */}
      <RoadmapSection />

      {/* ⑧ TESTIMONIALS - dark blue */}
      <TestimonialsSection />

      {/* ⑨ GUARANTEE - white */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border-2 border-primary/20 bg-primary/5 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-secondary mb-2">Our Quality Guarantee</h3>
              <p className="text-gray-600">
                We stand fully behind the quality of our services. Every candidate we have supported has successfully achieved their intended outcome, giving us a 100% success rate to date. If our courses, tests, or support do not meet the standard we promise, we offer a moneyback guarantee under fairuse terms. Final registration decisions remain with external institutions.
              </p>
            </div>
            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-primary shadow-lg shadow-primary/25 cursor-pointer whitespace-nowrap"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ⑩ FAQ - light gray */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">FAQ</span>
            <h2 className="text-3xl font-bold text-secondary mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know before enrolling.</p>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ⑪ FINAL CTA - dark blue */}
      <section className="py-24 bg-[#061F33] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(63,159,163,0.1),transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Not sure which course is right for you?
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              Book a free 30-minute consultation with Dr. Maxwell Oyom and get a personalised roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-primary shadow-xl shadow-primary/30 cursor-pointer"
                >
                  Book Free Consultation <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
              <Link href="/services">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-white border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Explore Services
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelectedCourse(null); setActiveVideo(0); }}
          >
            <motion.div
              className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
              onClick={e => e.stopPropagation()}
            >
              {isPurchased(selectedCourse.id) ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={`https://player.vimeo.com/video/${selectedCourse.videos?.[activeVideo]?.vimeoId || ''}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="h-[380px] flex flex-col items-center justify-center bg-[#061F33] text-white gap-4">
                  <Lock className="w-12 h-12 text-primary" />
                  <p className="text-xl font-semibold">Purchase to unlock all {selectedCourse.lessons} lessons</p>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="mt-2 px-8 py-3 bg-primary rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Close & Buy
                  </button>
                </div>
              )}
              {isPurchased(selectedCourse.id) && (
                <div className="p-6 max-h-64 overflow-y-auto">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Course Contents</p>
                  <div className="space-y-2">
                    {selectedCourse.videos?.map((video, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveVideo(i)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${activeVideo === i
                          ? 'bg-primary/10 border border-primary text-primary'
                          : 'hover:bg-gray-50 text-secondary'
                          }`}
                      >
                        <Play className={`w-4 h-4 flex-shrink-0 ${activeVideo === i ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">{video.title}</span>
                        <span className="ml-auto text-xs text-gray-400">{video.duration}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;