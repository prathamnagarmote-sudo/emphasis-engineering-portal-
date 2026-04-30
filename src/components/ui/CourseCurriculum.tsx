"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp, Play, Lock, Clock, CheckCircle,
  BookOpen, Info,
} from "lucide-react";
import { CurriculumSection, CurriculumLesson } from "@/types";

// ─── Vimeo Player Modal ────────────────────────────────────────────────────────
// ─── Vimeo Player Modal ────────────────────────────────────────────────────────
const VimeoModal: FC<{
  lesson: CurriculumLesson;
  isPurchased: boolean;
  onClose: () => void;
}> = ({ lesson, isPurchased, onClose }) => {
  const [vimeoId, setVimeoId] = useState<string | null>(lesson.vimeoId || null);
  const [loading, setLoading] = useState(false);

  useState(() => {
    const fetchSecureId = async () => {
      if (!lesson.vimeoId && lesson.id && isPurchased) {
        setLoading(true);
        try {
          const res = await fetch(`/api/lessons/${lesson.id}`);
          if (res.ok) {
            const data = await res.json();
            setVimeoId(data.vimeoId);
          }
        } catch (err) {
          console.error("Secure video fetch error:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSecureId();
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#0d0d0d] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Play className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight line-clamp-1">{lesson.title}</p>
              <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3" /> {lesson.duration}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all text-lg font-bold"
          >
            ×
          </button>
        </div>

        {/* Vimeo embed or Loading */}
        <div className="relative bg-black" style={{ paddingTop: "56.25%" }}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : vimeoId ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <Lock className="w-12 h-12 text-primary/40 mb-4" />
              <p className="text-white font-medium">Video Content Locked</p>
              <p className="text-gray-500 text-sm">Please ensure you are logged in and have purchased this course.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Locked Lesson Modal ───────────────────────────────────────────────────────
const LockedModal: FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
        <Lock className="w-9 h-9 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-secondary mb-2">Lesson Locked</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-7">
        Purchase this course to unlock all lessons and watch them at any time,
        on any device — with lifetime access.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 transition-all"
        >
          Maybe Later
        </button>
        <motion.a
          href="/courses"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-2.5 bg-primary rounded-xl text-white text-sm font-semibold shadow-md shadow-primary/25 inline-flex items-center gap-2"
        >
          Buy Now <CheckCircle className="w-4 h-4" />
        </motion.a>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Section Row ──────────────────────────────────────────────────────────────
const SectionAccordion: FC<{
  section: CurriculumSection;
  sectionIndex: number;
  isPurchased: boolean;
  onPlayLesson: (lesson: CurriculumLesson) => void;
  onLockedClick: () => void;
  defaultOpen?: boolean;
}> = ({ section, isPurchased, onPlayLesson, onLockedClick, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const totalMins = section.lessons.reduce((acc, l) => {
    const [m, s] = l.duration.split(":").map(Number);
    return acc + m + (s || 0) / 60;
  }, 0);
  const displayTime = totalMins < 60
    ? `${Math.round(totalMins)} min`
    : `${Math.floor(totalMins / 60)}h ${Math.round(totalMins % 60)}m`;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      {/* Section header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-teal-50/60 hover:bg-teal-50 transition-colors text-left gap-3"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-primary font-bold text-sm md:text-base leading-snug">
            {section.section}
          </span>
          <button
            className="text-gray-400 hover:text-primary transition-colors shrink-0"
            title="Section overview"
            onClick={(e) => e.stopPropagation()}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-gray-400 text-xs hidden sm:block">
            {section.lessons.length} {section.lessons.length === 1 ? "lesson" : "lessons"} · {displayTime}
          </span>
          <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.25 }}>
            <ChevronUp className="w-5 h-5 text-primary" />
          </motion.div>
        </div>
      </button>

      {/* Lessons */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
            className="overflow-hidden"
          >
            {section.lessons.map((lesson, li) => {
              const canPlay = isPurchased || lesson.free;
              return (
                <motion.div
                  key={li}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: li * 0.04 }}
                  onClick={() => canPlay ? onPlayLesson(lesson) : onLockedClick()}
                  className={`flex items-center gap-4 px-5 py-3.5 border-t border-gray-100 cursor-pointer group transition-colors
                    ${canPlay ? "hover:bg-primary/5" : "hover:bg-gray-50"}`}
                >
                  {/* Icon */}
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all
                    ${canPlay
                      ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {canPlay ? (
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Title */}
                  <span className={`flex-1 text-sm leading-snug transition-colors line-clamp-1
                    ${canPlay
                      ? "text-gray-800 group-hover:text-primary"
                      : "text-gray-500"
                    }`}
                  >
                    {lesson.title}
                  </span>

                  {/* Free badge */}
                  {lesson.free && !isPurchased && (
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                      Free
                    </span>
                  )}

                  {/* Duration + lock */}
                  <div className="shrink-0 flex items-center gap-2 text-gray-400 text-xs">
                    <span>{lesson.duration}</span>
                    {!canPlay && <Lock className="w-3 h-3" />}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
interface CourseCurriculumProps {
  curriculum: CurriculumSection[];
  isPurchased: boolean;
  totalLessons?: number;
  totalDuration?: string;
}

const CourseCurriculum: FC<CourseCurriculumProps> = ({
  curriculum,
  isPurchased,
  totalLessons,
  totalDuration,
}) => {
  const [activeLesson, setActiveLesson] = useState<CurriculumLesson | null>(null);
  const [showLockedModal, setShowLockedModal] = useState(false);

  const lessonCount = totalLessons ?? curriculum.reduce((a, s) => a + s.lessons.length, 0);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Course Content
        </h3>
        <div className="text-gray-500 text-sm">
          {curriculum.length} sections · {lessonCount} lessons
          {totalDuration && ` · ${totalDuration}`}
        </div>
      </div>

      {/* Accordion sections */}
      <div className="space-y-3">
        {curriculum.map((section, i) => (
          <SectionAccordion
            key={i}
            section={section}
            sectionIndex={i}
            isPurchased={isPurchased}
            onPlayLesson={setActiveLesson}
            onLockedClick={() => setShowLockedModal(true)}
            defaultOpen={i === 0}
          />
        ))}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeLesson && (
          <VimeoModal
            lesson={activeLesson}
            isPurchased={isPurchased}
            onClose={() => setActiveLesson(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLockedModal && (
          <LockedModal onClose={() => setShowLockedModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default CourseCurriculum;
