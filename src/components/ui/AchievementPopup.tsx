"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Award } from "lucide-react";

/* ── Confetti particle ────────────────────────────────────────────── */
const ConfettiParticle = ({ delay, color }: { delay: number; color: string }) => {
  const left = Math.random() * 100;
  const size = 4 + Math.random() * 6;
  return (
    <motion.div
      className="absolute rounded-sm pointer-events-none z-0"
      style={{ left: `${left}%`, top: -10, width: size, height: size, backgroundColor: color, opacity: 0.9 }}
      initial={{ y: -10, rotate: 0, opacity: 1 }}
      animate={{ y: 400, rotate: 360 * (Math.random() > 0.5 ? 1 : -1), opacity: 0 }}
      transition={{ duration: 2.5 + Math.random() * 2, delay, ease: "easeIn" }}
    />
  );
};

/* ── Main Component ───────────────────────────────────────────────── */
export default function AchievementPopup() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Time in milliseconds to wait before showing again (2 minutes)
  const REAPPEAR_DELAY = 2 * 60 * 1000;
  const STORAGE_KEY = "achievement_popup_last_seen";

  useEffect(() => {
    setMounted(true);
    
    // Fetch dynamic achievements
    const fetchAchievements = async () => {
      try {
        const res = await fetch("/api/achievements");
        if (!res.ok) return;
        const data = await res.json();
        
        if (data && data.length > 0) {
          setAchievements(data);
          
          // Check if we should show the popup
          const lastSeen = localStorage.getItem(STORAGE_KEY);
          const now = Date.now();
          
          if (!lastSeen || now - parseInt(lastSeen) > REAPPEAR_DELAY) {
            // Wait slightly after load to show popup
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
          }
        }
      } catch (error) {
        console.error("Failed to load achievements", error);
      }
    };
    
    fetchAchievements();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!visible || !autoPlay || achievements.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % achievements.length), 4000);
    return () => clearInterval(t);
  }, [visible, autoPlay, achievements.length]);

  const closePopup = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const navigate = (dir: 1 | -1) => {
    setAutoPlay(false);
    setCurrent((c) => (c + dir + achievements.length) % achievements.length);
  };

  if (!mounted || achievements.length === 0) return null;

  const ach = achievements[current];
  const confettiColors = ["#3F9FA3", "#ffffff", "#fbbf24", "#60a5fa", "#a78bfa", "#f472b6"];

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="fixed inset-0 z-[200] bg-[#040D18]/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-lg pointer-events-auto overflow-hidden rounded-[36px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/10"
              style={{ background: "linear-gradient(160deg, #061F33 0%, #0a3050 50%, #061F33 100%)" }}
            >
              {/* Confetti */}
              <div className="absolute inset-x-0 top-0 h-48 overflow-hidden pointer-events-none z-0">
                {Array.from({ length: 40 }).map((_, i) => (
                  <ConfettiParticle
                    key={i}
                    delay={i * 0.05}
                    color={confettiColors[i % confettiColors.length]}
                  />
                ))}
              </div>

              {/* Glow orbs */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3F9FA3]/20 rounded-full blur-[80px] pointer-events-none z-0" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#3F9FA3]/15 rounded-full blur-[80px] pointer-events-none z-0" />

              {/* Close button (Top Right) */}
              <button
                onClick={closePopup}
                className="absolute top-5 right-5 z-[210] w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-all duration-300 border border-white/10 group cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white/80 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button>

              {/* Header badge */}
              <div className="px-10 pt-10 pb-4 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#3F9FA3]/20 border border-[#3F9FA3]/30 mb-4 shadow-lg shadow-[#3F9FA3]/10">
                  <Award className="w-4 h-4 text-[#3F9FA3]" />
                  <span className="text-[#3F9FA3] text-xs font-bold uppercase tracking-[0.2em]">
                    Student Achievement
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3F9FA3] animate-pulse" />
                </div>

                <h2 className="text-white text-3xl font-extrabold leading-tight mb-2 tracking-tight">
                  🎉 Congratulations!
                </h2>
                <p className="text-gray-300 text-sm font-medium">Our engineers keep raising the bar globally.</p>
              </div>

              {/* Card slide */}
              <div className="relative overflow-hidden min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="px-10 py-2 relative z-10 flex flex-col items-center justify-center h-full"
                  >
                    {/* Photo */}
                    <div className="flex justify-center mb-6">
                      <div className="relative group">
                        {/* Glow behind photo */}
                        <div 
                          className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                          style={{ backgroundColor: ach.color || '#3F9FA3', transform: 'scale(1.2)' }}
                        />
                        
                        {/* Blob border */}
                        <svg
                          viewBox="0 0 200 200"
                          className="absolute inset-0 w-full h-full"
                          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))", transform: 'scale(1.15)' }}
                        >
                          <defs>
                            <clipPath id={`blob-${ach.id}`}>
                              <path d="M47.3,-57.2C59.9,-46.2,67.9,-29.5,69.5,-12.5C71.1,4.5,66.4,21.8,57,35.3C47.6,48.8,33.6,58.4,17.4,63.6C1.2,68.8,-17.1,69.5,-31.7,62.6C-46.3,55.7,-57.1,41.2,-62.8,24.9C-68.5,8.6,-69,-9.5,-62.3,-24.6C-55.6,-39.7,-41.6,-51.8,-26.4,-61.8C-11.2,-71.8,5.2,-79.6,20,-76.3C34.8,-73,34.7,-68.2,47.3,-57.2Z" transform="translate(100 100)" />
                            </clipPath>
                          </defs>
                          <path
                            d="M47.3,-57.2C59.9,-46.2,67.9,-29.5,69.5,-12.5C71.1,4.5,66.4,21.8,57,35.3C47.6,48.8,33.6,58.4,17.4,63.6C1.2,68.8,-17.1,69.5,-31.7,62.6C-46.3,55.7,-57.1,41.2,-62.8,24.9C-68.5,8.6,-69,-9.5,-62.3,-24.6C-55.6,-39.7,-41.6,-51.8,-26.4,-61.8C-11.2,-71.8,5.2,-79.6,20,-76.3C34.8,-73,34.7,-68.2,47.3,-57.2Z"
                            transform="translate(100 100)"
                            fill="none"
                            stroke={ach.color || '#3F9FA3'}
                            strokeWidth="3.5"
                          />
                        </svg>
                        <div
                          className="w-36 h-36 rounded-full overflow-hidden relative z-10 border-4 border-transparent"
                          style={{ clipPath: `url(#blob-${ach.id})` }}
                        >
                          <img
                            src={ach.photo}
                            alt={ach.name}
                            className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ach.name)}&background=3F9FA3&color=fff&size=200`;
                            }}
                          />
                        </div>
                        {/* Badge */}
                        <div
                          className="absolute -bottom-2 -right-4 px-4 py-1.5 rounded-full flex items-center justify-center text-white text-xs font-black border-2 border-[#061F33] shadow-xl z-20"
                          style={{ background: `linear-gradient(135deg, ${ach.color || '#3F9FA3'}, #1a4f52)` }}
                        >
                          {ach.badge}
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="text-center w-full">
                      <h3 className="text-2xl font-black text-white mb-1.5 drop-shadow-md">{ach.name}</h3>
                      <div className="flex flex-wrap items-center justify-center gap-2 mb-4 bg-white/5 inline-flex px-4 py-1.5 rounded-full border border-white/5">
                        <span
                          className="text-sm font-black tracking-wide"
                          style={{ color: ach.color || '#3F9FA3' }}
                        >
                          {ach.credential}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-300 text-sm font-medium">{ach.location}</span>
                      </div>
                      <p className="text-gray-300 text-[15px] leading-relaxed max-w-sm mx-auto font-medium">
                        "{ach.detail}"
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation (Only show if multiple) */}
              {achievements.length > 1 && (
                <div className="flex items-center justify-between px-8 pb-8 pt-2 relative z-10">
                  <button
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5 text-white/70" />
                  </button>

                  {/* Dots */}
                  <div className="flex items-center gap-3">
                    {achievements.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setAutoPlay(false); setCurrent(i); }}
                        className={`rounded-full transition-all duration-300 shadow-md ${
                          i === current
                            ? "w-8 h-2.5 bg-[#3F9FA3]"
                            : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(1)}
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5 text-white/70" />
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-white/10 bg-black/20 px-8 py-5 flex items-center justify-between relative z-10 backdrop-blur-md">
                <p className="text-[#3F9FA3] text-sm font-bold tracking-wider uppercase text-opacity-80">
                  Emphasis Engineering
                </p>
                <button
                  onClick={closePopup}
                  className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-sm text-gray-300 hover:text-white transition-all font-semibold border border-white/10 hover:border-white/20 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
