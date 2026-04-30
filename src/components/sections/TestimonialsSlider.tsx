"use client";

import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials as rawTestimonials, Testimonial } from "@/data/testimonials";

const Linkedin = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GlassCard: FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  const url = (testimonial as any).linkedInUrl || (testimonial.platform === 'LinkedIn' ? '#' : null);
  
  const CardContent = (
    <div className="group relative w-[320px] sm:w-[400px] h-full flex-shrink-0 rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:z-10"
         style={{
           background: "rgba(255, 255, 255, 0.03)",
           backdropFilter: "blur(20px)",
           WebkitBackdropFilter: "blur(20px)",
           border: "1px solid rgba(255, 255, 255, 0.08)",
           boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
         }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: "radial-gradient(circle at center, rgba(63,159,163,0.15) 0%, transparent 70%)" }} />
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[#3F9FA3] rounded-full blur-md opacity-40 group-hover:opacity-100 transition-opacity" />
            <img src={testimonial.image} alt={testimonial.name} className="relative w-12 h-12 rounded-full object-cover border border-white/20" />
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-semibold text-sm sm:text-base truncate">{testimonial.name}</h4>
            <p className="text-[#3F9FA3] text-[10px] sm:text-xs font-medium tracking-wide uppercase mt-0.5 truncate">
              {testimonial.role}
            </p>
          </div>
        </div>
        {url && (
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-white group-hover:bg-[#0077B5] group-hover:border-transparent transition-all">
            <Linkedin className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex gap-1 mb-4 relative z-10">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < (testimonial.rating || 5) ? "text-[#3F9FA3] fill-[#3F9FA3]" : "text-white/20"}`} />
        ))}
      </div>
      <div className="relative z-10">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/5 -rotate-12" />
        <p className="text-gray-300 leading-relaxed text-sm relative z-10 line-clamp-4">"{testimonial.quote || (testimonial as any).review}"</p>
      </div>
    </div>
  );

  if (url && url !== '#') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
        {CardContent}
      </a>
    );
  }

  return CardContent;
};

const TestimonialsSlider: FC = () => {
  const [data, setData] = useState<Testimonial[]>(rawTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials?t=" + Date.now())
      .then(res => res.json())
      .then(items => {
        if (Array.isArray(items) && items.length > 0) {
          const transformed = items.map(item => ({
            ...item,
            id: item._id,
            quote: item.quote,
            platform: item.platform || "Direct",
            date: item.date || "",
            category: item.category || "General",
            featured: item.featured || false,
            linkedInUrl: item.linkedInUrl || ""
          }));
          setData(transformed);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Testimonials fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Split testimonials into 3 rows to avoid repetition if possible
  const getRowItems = (rowIndex: number) => {
    if (data.length === 0) return [];
    
    // Distribute testimonials uniquely across 3 rows
    const count = data.length;
    const baseItemsPerRow = Math.floor(count / 3);
    
    let rowData = [];
    if (rowIndex === 0) {
      rowData = data.slice(0, baseItemsPerRow);
    } else if (rowIndex === 1) {
      rowData = data.slice(baseItemsPerRow, baseItemsPerRow * 2);
    } else {
      rowData = data.slice(baseItemsPerRow * 2);
    }

    // Ensure we have at least 15 items for a smooth marquee loop (repeat row items if necessary)
    const repeatedData = [];
    while (repeatedData.length < 15) {
      repeatedData.push(...rowData);
    }

    return repeatedData;
  };

  const row1 = getRowItems(0);
  const row2 = getRowItems(1);
  const row3 = getRowItems(2);

  return (
    <section className="relative py-32 bg-[#020813] overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[50vw] h-[50vw] bg-[#3F9FA3]/10 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[150px] translate-x-1/3 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-[#3F9FA3] animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-[#3F9FA3] uppercase">Proof of Excellence</span>
        </motion.div>
        
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-display text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight">
          Thousands of engineers <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3F9FA3] to-blue-400">got licensed with us.</span>
        </motion.h2>
      </div>

      <div className="relative flex flex-col gap-6 w-full group overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
        <div className="flex w-[max-content] animate-marquee-left hover:[animation-play-state:paused] gap-6">
          {row1.map((t, i) => <div key={`r1-${i}`} className="transition-opacity duration-500 group-hover:opacity-40 hover:!opacity-100"><GlassCard testimonial={t} /></div>)}
        </div>
        <div className="flex w-[max-content] animate-marquee-right hover:[animation-play-state:paused] gap-6" style={{ transform: "translateX(-50%)" }}>
          {row2.map((t, i) => <div key={`r2-${i}`} className="transition-opacity duration-500 group-hover:opacity-40 hover:!opacity-100"><GlassCard testimonial={t} /></div>)}
        </div>
        <div className="flex w-[max-content] animate-marquee-left-fast hover:[animation-play-state:paused] gap-6">
          {row3.map((t, i) => <div key={`r3-${i}`} className="transition-opacity duration-500 group-hover:opacity-40 hover:!opacity-100"><GlassCard testimonial={t} /></div>)}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee-left { animation: marquee-left 60s linear infinite; }
        .animate-marquee-left-fast { animation: marquee-left 50s linear infinite; }
        .animate-marquee-right { animation: marquee-right 70s linear infinite; }
      `}</style>
    </section>

  );
};

export default TestimonialsSlider;
