"use client";

import { useEffect, useState, ElementType, FC, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Check, ArrowLeft, ArrowRight, Briefcase, Building2, Code2, Target, Award,
  X, ChevronDown, Shield, Calendar, BookOpen, Star, Clock, Users, Zap, CheckCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import Button from '@/components/ui/Button';

const iconMap: Record<string, ElementType> = { Briefcase, Building2, Code2, Target, Award };

/* ═══════════════════════════════════════
   SCROLLABLE STEP DETAIL MODAL
═══════════════════════════════════════ */
/* ═══════════════════════════════════════
   SCROLLABLE STEP DETAIL MODAL
═══════════════════════════════════════ */
const StepDetailModal: FC<{
  phase: { step: number; title: string; description: string; content: string } | null;
  onClose: () => void;
  total: number;
  onNav: (dir: -1 | 1) => void;
}> = ({ phase, onClose, total, onNav }) => {
  if (!phase) return null;

  /* Split content into paragraphs for readable rendering */
  const paragraphs = phase.content
    ? phase.content.split('\n').map(l => l.trim()).filter(Boolean)
    : [phase.description];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop with enhanced blur */}
      <motion.div 
        className="absolute inset-0 bg-[#040D18]/80 backdrop-blur-md" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-[0_32px_80px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col border border-white/10"
        style={{ maxHeight: 'min(90vh, 760px)' }}
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow effect behind */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header - fixed */}
        <div
          className="relative flex items-center justify-between px-8 py-6 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #061F33, #0d3654)' }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #3F9FA3, #2d7a7d)' }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              <span className="relative">{phase.step}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] bg-primary/10 px-2 py-0.5 rounded-md">
                  Step {phase.step} of {total}
                </span>
              </div>
              <h3 className="text-white font-bold text-xl leading-tight tracking-tight">{phase.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 border border-white/10"
          >
            <X className="w-5 h-5 text-white/70 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>

        {/* Scrollable body with custom scrollbar */}
        <div className="flex-1 overflow-y-auto px-8 py-8 overscroll-contain relative z-10 scrollbar-hide">
          <div className="max-w-none">
            {paragraphs.map((p, i) => {
              // Detect bullet points
              if (p.startsWith('•') || p.startsWith('-')) {
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 mb-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 group hover:border-primary/20 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-gray-700 text-[15px] leading-relaxed font-medium">{p.replace(/^[•\-]\s*/, '')}</span>
                  </motion.div>
                );
              }
              // Detect numbered items
              if (/^\d+\./.test(p)) {
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 mb-5 bg-secondary/5 rounded-2xl p-5 border border-secondary/5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-secondary text-white text-sm font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                      {p.match(/^(\d+)/)?.[1]}
                    </div>
                    <span className="text-gray-700 text-[15px] leading-relaxed font-medium">{p.replace(/^\d+\.\s*/, '')}</span>
                  </motion.div>
                );
              }
              // Detect subheadings
              if (p.length < 70 && !p.endsWith('.') && !p.endsWith(',') && !p.endsWith(':') && i > 0) {
                return (
                  <h4 key={i} className="text-secondary font-black text-lg mt-8 mb-4 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    {p}
                  </h4>
                );
              }
              // Regular paragraph
              return (
                <p key={i} className="text-gray-600 text-[15px] leading-[1.8] mb-5 font-medium">
                  {p}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer nav - fixed */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100 flex-shrink-0 bg-white relative z-20">
          <button
            onClick={() => onNav(-1)}
            disabled={phase.step <= 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-secondary disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1">
              {[...Array(total)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i + 1 === phase.step ? 'w-6 bg-primary' : 'w-1.5 bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={phase.step >= total ? onClose : () => onNav(1)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              style={{ 
                background: 'linear-gradient(135deg, #3F9FA3, #2d7a7d)',
                boxShadow: '0 8px 20px rgba(63,159,163,0.3)'
              }}
            >
              {phase.step >= total ? 'Finish' : 'Next Step'} 
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════
   FAQ ACCORDION ITEM
═══════════════════════════════════════ */
const FAQItem: FC<{ q: string; a: string; index: number }> = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="border border-gray-200 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50/80 transition-colors"
      >
        <span className="font-semibold text-secondary text-sm pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed whitespace-pre-line">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
const ServiceDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isPurchased, addToCart, removeFromCart, isInCart } = useCart();
  const { formatPrice, currency, convertPrice } = useCurrency();
  const { data: session } = useSession();
  
  const scheduledIds = useMemo(() => {
    return (session?.user as any)?.scheduledServiceIds || [];
  }, [session]);
  
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [isBuying, setIsBuying] = useState<string | null>(null);

  useEffect(() => {
    const handlePageShow = () => setIsBuying(null);
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  useEffect(() => {
    async function fetchService() {
      try {
        const decodedId = decodeURIComponent(id || '');
        const res = await fetch(`/api/services/${decodedId}`);
        if (!res.ok) {
          router.replace('/services');
          return;
        }
        const data = await res.json();
        setService(data);
      } catch (err) {
        console.error("Failed to fetch service", err);
        router.replace('/services');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchService();
  }, [id, router]);

  if (loading) {
    return (
      <div className="pt-24 pb-24 min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-secondary font-medium">Loading Service Details...</p>
      </div>
    );
  }

  if (!service) return null;

  const Icon = iconMap[service.icon] || Briefcase;
  const steps = service.steps || service.phases || [];
  const selectedStep = activePhase !== null ? steps.find((s: any) => s.step === activePhase) ?? null : null;

  const handleAddToCart = (pkgId: string, title: string, price: number) => {
    addToCart({ id: pkgId, title: `${service.title} – ${title}`, price, type: 'service' });
  };

  const handleRemoveFromCart = (pkgId: string) => {
    removeFromCart(pkgId);
  };

  return (
    <div className="pt-20">

      {/* ── HERO ── */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #061F33 0%, #0d3654 50%, #061F33 100%)' }}
      >
        {/* Glow orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          <Link href="/services"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="flex items-start gap-5">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(63,159,163,0.2), rgba(63,159,163,0.08))',
                  border: '1px solid rgba(63,159,163,0.25)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Icon className="w-10 h-10 text-primary" />
              </motion.div>

              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {service.title}
                </h1>
                <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                  {service.description}
                </p>

                {/* Quick action */}
                <div className="flex gap-3 mt-8 flex-wrap">
                  <a href="#packages">
                    <motion.div
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm"
                      style={{ background: 'linear-gradient(135deg, #3F9FA3, #2d7a7d)', boxShadow: '0 4px 20px rgba(63,159,163,0.35)' }}
                    >
                      View Packages <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </a>
                  {service.calendlyLink && (
                    <a href={service.calendlyLink} target="_blank" rel="noopener noreferrer">
                      <motion.div
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white text-sm border border-white/20 bg-white/8 hover:bg-white/12 transition-colors"
                      >
                        <Calendar className="w-4 h-4" /> Book a Call
                      </motion.div>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                src={service.image || "https://images.unsplash.com/photo-1454165833767-02a522111d67?w=800&q=80"}
                alt={service.title}
                className="w-full max-w-md rounded-2xl object-cover aspect-[4/3] shadow-2xl"
                style={{ 
                  boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Star, val: '100%', label: 'Success Rate' },
              { icon: Users, val: '2,000+', label: 'Engineers Guided' },
              { icon: Clock, val: '4–6 mo', label: 'Avg. Timeline' },
              { icon: Zap, val: '24h', label: 'Response Time' },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="w-5 h-5 text-primary mb-1" />
                <span className="text-2xl font-extrabold text-secondary">{val}</span>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BENEFITS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-3">Why Choose This</span>
            <h2 className="text-3xl font-bold text-secondary">Key Benefits</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {service.features.map((feature: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col gap-4 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                {/* Gradient number badge */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm"
                    style={{ background: 'linear-gradient(135deg, #3F9FA3, #2d7a7d)', boxShadow: '0 4px 12px rgba(63,159,163,0.3)' }}
                  >
                    {i + 1}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>
                <span className="text-secondary text-sm font-semibold leading-relaxed">{feature}</span>
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEP-BY-STEP PROCESS ── */}
      {steps.length > 0 && (
        <section id="steps" className="py-24 bg-gray-50 scroll-mt-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-3">Your Journey</span>
              <h2 className="text-3xl font-bold text-secondary mb-3">Step-by-Step Process</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Click on any step to view full details, requirements, and guidance.</p>
            </div>

            {/* Timeline cards */}
            <div className="relative">
              {/* Vertical track */}
              <div
                className="absolute left-[27px] top-6 bottom-6 w-0.5 hidden md:block rounded-full"
                style={{ background: 'linear-gradient(to bottom, #3F9FA3, rgba(63,159,163,0.08))' }}
              />

              <div className="space-y-4">
                {steps.map((step: any, i: number) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.09, duration: 0.45 }}
                  >
                    <button
                      onClick={() => setActivePhase(step.step)}
                      className="w-full text-left group"
                    >
                      <div
                        className="flex items-start gap-5 bg-white rounded-2xl p-6 border-l-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                        style={{ borderLeftColor: 'rgba(63,159,163,0.25)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderLeftColor = '#3F9FA3')}
                        onMouseLeave={e => (e.currentTarget.style.borderLeftColor = 'rgba(63,159,163,0.25)')}
                      >
                        {/* Sweep glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/4 via-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Step circle */}
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-extrabold text-sm group-hover:scale-110 transition-transform duration-200 relative z-10 shadow-md"
                          style={{ background: 'linear-gradient(135deg, #3F9FA3, #2d7a7d)', boxShadow: '0 4px 14px rgba(63,159,163,0.35)' }}
                        >
                          {step.step}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 relative z-10">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-secondary text-base group-hover:text-primary transition-colors duration-200">
                              {step.title}
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/50 bg-primary/8 px-2 py-0.5 rounded-full">
                              Step {step.step}/{steps.length}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                          {(step.content || (step as any).content) && (
                            <span className="inline-flex items-center gap-1 mt-2.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              Read full guidance <ArrowRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary flex-shrink-0 mt-3.5 transition-colors duration-200 relative z-10" />
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable floating detail window */}
          <AnimatePresence>
            {selectedStep && (selectedStep.content || (selectedStep as any).content) && (
              <StepDetailModal
                phase={selectedStep as any}
                total={steps.length}
                onClose={() => setActivePhase(null)}
                onNav={(dir) => {
                  const next = (activePhase ?? 0) + dir;
                  if (next >= 1 && next <= steps.length) setActivePhase(next);
                }}
              />
            )}
          </AnimatePresence>
        </section>
      )}

      {/* ── PACKAGES ── */}
      <section id="packages" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-3">Pricing</span>
            <h2 className="text-3xl font-bold text-secondary mb-3">Choose Your Package</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Select the package that best fits your needs. All packages include access to our expert team.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.packages.map((pkg: any, i: number) => {
              const inCart = isInCart(pkg.id);
              const isPopular = pkg.popular;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`rounded-3xl p-8 border-2 transition-all duration-300 relative overflow-hidden flex flex-col ${isPopular
                    ? 'border-primary bg-gradient-to-b from-white to-primary/5 shadow-xl scale-105 z-10'
                    : 'border-gray-100 bg-white shadow-md hover:border-primary/30'
                    }`}
                >
                  {/* Popular badge */}
                  {isPopular && (
                    <div className="absolute top-5 right-5 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}

                  {/* Purchased badge */}
                  {isPurchased(pkg.id) && (
                    <div className="absolute top-5 left-5 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg z-20">
                      <CheckCircle className="w-3 h-3" /> Purchased
                    </div>
                  )}

                  <h3 className="font-bold text-secondary text-xl mb-2">{pkg.title}</h3>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-primary">{formatPrice(pkg.price)}</span>
                    <span className="text-gray-400 text-sm">/package</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((f: any, j: number) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-gray-600 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="flex flex-col gap-3">
                    {isPurchased(pkg.id) ? (
                      <div className="w-full">
                        {scheduledIds.includes(pkg.id) ? (
                           <div className="w-full py-4 rounded-xl font-bold text-sm bg-green-100 text-green-700 flex items-center justify-center gap-2 border border-green-200">
                             <CheckCircle className="w-4 h-4" />
                             Scheduled
                           </div>
                        ) : (
                          <a 
                            href={pkg.calendlyUrl || "https://cal.com/emphasis-engineering-cbfkch/30min"} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-full"
                            onClick={async () => {
                              try {
                                await fetch('/api/purchase/schedule', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ serviceId: pkg.id })
                                });
                                // Force a session update or just rely on state
                                router.refresh();
                              } catch (e) {
                                console.error("Failed to mark as scheduled", e);
                              }
                            }}
                          >
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="w-full py-4 rounded-xl font-bold text-sm bg-purple-600 text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                            >
                              <Calendar className="w-4 h-4" />
                              Schedule Now
                            </motion.button>
                          </a>
                        )}
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isBuying === pkg.id}
                        onClick={async () => {
                          if (!session?.user) {
                            router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
                            return;
                          }
                          try {
                            setIsBuying(pkg.id);
                            
                            const response = await fetch('/api/checkout', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                items: [{
                                  id: pkg.id,
                                  title: `${service.title} – ${pkg.title}`,
                                  price: convertPrice(pkg.price),
                                  type: 'service'
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
                          } finally {
                            setIsBuying(null);
                          }
                        }}
                        className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isPopular
                          ? 'text-white'
                          : 'bg-secondary text-white hover:bg-secondary/90'
                          }`}
                        style={isPopular ? { background: 'linear-gradient(135deg, #3F9FA3, #2d7a7d)', boxShadow: '0 4px 16px rgba(63,159,163,0.3)' } : {}}
                      >
                        {isBuying === pkg.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Buy Now"
                        )}
                      </motion.button>
                    )}

                    {!(session?.user && session.user.purchasedContent?.includes(pkg.id)) && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isBuying === pkg.id}
                        onClick={() => {
                          if (inCart) {
                            handleRemoveFromCart(pkg.id);
                          } else {
                            handleAddToCart(pkg.id, pkg.title, pkg.price);
                          }
                        }}
                        className={`w-full py-4 rounded-xl text-sm font-bold border-2 transition-all ${inCart
                          ? 'border-red-200 bg-red-50 text-red-500 hover:border-red-400 hover:bg-red-100'
                          : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5'
                          }`}
                      >
                        {inCart ? '✕ Remove from Cart' : 'Add to Cart'}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-400">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Quality guarantee</span>
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Lifetime access</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Flexible scheduling</span>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-3">FAQ</span>
              <h2 className="text-3xl font-bold text-secondary mb-3">Frequently Asked Questions</h2>
              <p className="text-gray-500">Everything you need to know about {service.title}.</p>
            </div>

            {/* Split FAQs: first 5 open-by-default hint, rest accordion */}
            <div className="space-y-2.5">
              {service.faqs.map((faq: any, i: number) => (
                <FAQItem key={i} q={faq.question} a={faq.answer} index={i} />
              ))}
            </div>

            {/* Bottom contact prompt */}
            <div className="mt-10 p-6 rounded-2xl bg-white border border-primary/15 text-center">
              <p className="text-secondary font-semibold mb-2">Still have questions?</p>
              <p className="text-gray-500 text-sm mb-4">Our expert team typically responds within 24 hours.</p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #3F9FA3, #2d7a7d)', boxShadow: '0 4px 14px rgba(63,159,163,0.3)' }}
              >
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="relative py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #040D18 0%, #061F33 40%, #0d3654 100%)' }}>
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/12 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Expert Support Available Now
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
              Ready to achieve
              <br />
              <span style={{ background: 'linear-gradient(135deg, #3F9FA3, #6ecdd1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {service.title}?
              </span>
            </h2>
            <p className="text-gray-400 mb-10 text-lg max-w-xl mx-auto">
              Book a free consultation and get a personalised roadmap from our expert team.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #3F9FA3, #2d7a7d)', boxShadow: '0 6px 30px rgba(63,159,163,0.4)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  Book Free Consultation <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
              {service.calendlyLink && (
                <a href={service.calendlyLink} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-white border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all"
                  >
                    <Calendar className="w-5 h-5" /> Schedule via Calendly
                  </motion.div>
                </a>
              )}
            </div>

            {/* Social proof mini strip */}
            <div className="flex items-center justify-center gap-6 mt-12 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-primary" /> Quality guarantee</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-primary" /> 4.8/5 rated service</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> 1,200+ engineers</span>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default ServiceDetail;