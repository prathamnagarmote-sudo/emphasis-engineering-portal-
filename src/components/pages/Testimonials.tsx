"use client";

import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Quote, ChevronLeft, ChevronRight, Award, Users,
  TrendingUp, CheckCircle, Sparkles, Globe, BarChart3,
  Target, Zap, ArrowRight, Play, BookOpen, Timer,
} from 'lucide-react';
import { testimonials } from '@/data/mockData';
import PageHero from '@/components/ui/PageHero';
import Link from 'next/link';

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.92,
  }),
};

/* ─── Data ─── */
const SUCCESS_METRICS = [
  {
    value: '2,000+',
    label: 'Engineers Supported',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Star className="w-6 h-6" />,
    value: '4.9/5',
    label: 'Average Rating',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: '100%',
    label: 'First-Attempt Pass Rate',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    value: '10+',
    label: 'Countries Reached',
    color: 'from-violet-500 to-purple-500',
  },
];

const JOURNEY_STEPS = [
  { icon: <Target      className="w-5 h-5" />, step: '01', title: 'Choose Your Path',   desc: 'Select your licensing body and target country' },
  { icon: <BookOpen    className="w-5 h-5" />, step: '02', title: 'Learn & Practice',   desc: 'Access structured courses and mock exams' },
  { icon: <BarChart3   className="w-5 h-5" />, step: '03', title: 'Get Expert Review',  desc: 'Submit for mentorship and feedback' },
  { icon: <CheckCircle className="w-5 h-5" />, step: '04', title: 'Pass & Get Licensed',desc: 'Walk into your exam with confidence' },
];

const Testimonials: FC = () => {
  const [data, setData] = useState<any[]>(testimonials);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(res => res.json())
      .then(items => {
        if (Array.isArray(items) && items.length > 0) {
          setData(items.map(i => ({
            id: i._id,
            name: i.name,
            role: i.role,
            company: i.company,
            image: i.image,
            review: i.quote,
            rating: i.rating,
            linkedIn: i.linkedInUrl
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return data.length - 1;
      if (next >= data.length) return 0;
      return next;
    });
  };

  const currentTestimonial = data[activeIndex] || data[0];

  return (
    <div className="pt-20">

      {/* ① HERO - untouched */}
      <PageHero
        badge="Real Stories, Real Success"
        heading={
          <>
            Trusted by{' '}
            <span className="text-gradient">2,000+</span>
            <br />
            Engineers Worldwide
          </>
        }
        subtitle="Join thousands of successful engineers who have achieved their licensing goals with our expert guidance."
        primaryCta={{ label: 'Start Your Journey', href: '/courses' }}
        secondaryCta={{ label: 'Book Free Consultation', href: '/contact' }}
      />

      {/* ② FEATURED CAROUSEL - white bg */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(63,159,163,0.07),transparent_60%)]" />

        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
              <Sparkles className="w-3 h-3" /> Featured Story
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Our Community <span className="text-primary">Success Stories</span>
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full mx-auto mt-4" />
          </motion.div>

          {/* Carousel */}
          <div className="relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 280, damping: 30 },
                  opacity: { duration: 0.35 },
                  scale: { duration: 0.35 },
                }}
              >
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
                  
                  {/* Decorative glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                  {/* Quote icon */}
                  <Quote className="absolute top-6 left-6 w-16 h-16 text-primary/10" />

                  <div className="relative z-10">
                    {/* Top section: Avatar + Info */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                      
                      {/* Avatar with rotating ring */}
                      <div className="relative shrink-0">
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'conic-gradient(from 0deg, #3F9FA3, #06D6A0, #3F9FA3)',
                            padding: '4px',
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        >
                          <div className="w-full h-full rounded-full bg-white" />
                        </motion.div>
                        
                        <img
                          src={currentTestimonial.image}
                          alt={currentTestimonial.name}
                          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                        />

                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                          className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-br from-primary to-teal-500 rounded-full flex items-center justify-center shadow-xl"
                        >
                          <Award className="w-7 h-7 text-white" />
                        </motion.div>
                      </div>

                      {/* User info */}
                      <div className="text-center md:text-left flex-1">
                        <h3 className="text-3xl font-bold text-secondary mb-2">
                          {currentTestimonial.name}
                        </h3>
                        <p className="text-gray-600 text-lg mb-1">
                          {currentTestimonial.role}
                        </p>
                        <p className="text-primary font-bold text-lg mb-4">
                          {currentTestimonial.company}
                        </p>

                        {/* Star rating */}
                        <div className="flex justify-center md:justify-start gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200 }}
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  i < currentTestimonial.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review text */}
                    <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                      "{currentTestimonial.review}"
                    </blockquote>

                    {/* Verified badge */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Verified Licensed Engineer
                      </div>
                      {currentTestimonial.linkedIn && (
                        <a href={currentTestimonial.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#0077B5] hover:text-[#005582] font-bold text-sm transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                          View LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <motion.button
                whileHover={{ scale: 1.08, backgroundColor: '#3F9FA3', color: '#fff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(-1)}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-md transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {data.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setDirection(index > activeIndex ? 1 : -1);
                      setActiveIndex(index);
                    }}
                    whileHover={{ scale: 1.3 }}
                    className={`rounded-full transition-all ${
                      index === activeIndex
                        ? 'bg-primary w-8 h-2.5'
                        : 'bg-gray-300 w-2.5 h-2.5 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.08, backgroundColor: '#3F9FA3', color: '#fff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(1)}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-md transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* ③ SUCCESS METRICS - dark blue */}
      <section className="py-20 bg-[#061F33] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(63,159,163,0.12),transparent_60%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Our Impact in <span className="text-primary">Numbers</span>
            </h2>
            <div className="w-20 h-1 bg-primary/40 rounded-full mx-auto mt-4" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {SUCCESS_METRICS.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariant}
                whileHover={{ y: -6, scale: 1.02 }}
                className="text-center p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm"
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {stat.icon}
                  <span className="sr-only">{stat.label}</span>
                </motion.div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ④ ALL TESTIMONIALS GRID - white */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(63,159,163,0.06),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
              <Users className="w-3 h-3" /> More Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Join Our Growing <span className="text-primary">Community</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-4">
              Read what our successful students have to say about their transformation journey
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data.map((testimonial, index) => (
              <motion.div
                key={testimonial.id || index}
                variants={itemVariant}
                whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
                className="group bg-gray-50 border border-gray-100 rounded-3xl p-7 relative overflow-hidden transition-all cursor-pointer"
                onClick={() => testimonial.linkedIn && window.open(testimonial.linkedIn, '_blank')}
              >

                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Quote icon */}
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />

                  {/* Review text */}
                  <p className="text-gray-700 mb-6 line-clamp-4 leading-relaxed text-sm">
                    "{testimonial.review}"
                  </p>

                  {/* User info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-secondary group-hover:text-primary transition-colors text-sm truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">{testimonial.role}</p>
                      <p className="text-xs text-primary font-semibold truncate">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Rating + LinkedIn */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < testimonial.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <motion.a
                      href={testimonial.linkedIn || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-[#0077B5] hover:text-[#005582] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ⑤ HOW IT WORKS - dark blue */}
      <section className="py-24 bg-[#061F33] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(63,159,163,0.1),transparent_60%)]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
              <Zap className="w-3 h-3" /> Your Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              How We Help You <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto text-lg">
              A proven 4-step system used by 2,000+ engineers worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[13%] right-[13%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {JOURNEY_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
                className="relative flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-teal-600 flex items-center justify-center text-white shadow-xl mb-5 z-10"
                >
                  {step.icon}
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-white text-secondary text-[10px] font-bold flex items-center justify-center border-2 border-gray-100">
                    {i + 1}
                  </span>
                </motion.div>
                {i < JOURNEY_STEPS.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-5 h-5 text-primary/30 z-20" />
                )}
                <h3 className="font-bold text-white text-sm mb-2">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑥ VIDEO TESTIMONIAL - white */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(63,159,163,0.06),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-5">
              <Play className="w-3 h-3" /> Video Testimonial
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
              Hear From Our <span className="text-primary">Successful Engineers</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              Watch real engineers share their journey from application to licensing success.
              Every story is unique, but they all share one thing - the right guidance.
            </p>

            <ul className="space-y-4">
              {[
                'Real stories from licensed engineers',
                'Unscripted, honest testimonials',
                'Practical tips you can apply today',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: video placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gray-900">
              <video 
                src="https://res.cloudinary.com/dwk1cnlw2/video/upload/v1778093353/EE_Testimonial_YT_1_asbaqn.mp4"
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                controls
                playsInline
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ⑦ CTA - dark blue */}
      <section className="py-24 bg-[#061F33] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(63,159,163,0.15),transparent_60%)]" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 border border-white/20 rounded-full mb-6 backdrop-blur-sm"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Write Your Success Story?
            </h3>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who have achieved their engineering licensure goals with our expert guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-primary shadow-xl shadow-primary/30 cursor-pointer"
                >
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-white border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Book Free Consultation
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;