"use client";

import { FC, useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Lock,
  Play,
  ShoppingCart,
  Star,
  Users,
  Video,
  Award,
  Target,
  Zap,
  BookOpen,
  TrendingUp,
  Shield,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Quote,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import Button from "@/components/ui/Button";

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
};

/* ─── Static Data ─── */
const COURSE_BENEFITS = [
  { icon: <Award className="w-5 h-5" />, title: "Expert-Led Training", desc: "Learn from licensed professional engineers" },
  { icon: <Target className="w-5 h-5" />, title: "Structured Pathway", desc: "Step-by-step competency frameworks" },
  { icon: <CheckCircle className="w-5 h-5" />, title: "Mock Reviews", desc: "Practice professional review sessions" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "95% Pass Rate", desc: "Proven first-attempt success" },
];

const TESTIMONIALS = [
  {
    name: "Nicky W.",
    role: "Chartered Engineer",
    quote: "After struggling with UK-SPEC evidence, Max's roadmap and DAP review finally secured my CEng. His precision during PRI preparation was the deciding factor. Thanks, Emphasis Engineering!",
    rating: 5,
  },
  {
    name: "Alaa E.",
    role: "Chartered Engineer",
    quote: "I couldn't define my personal contribution until Max's report structuring feedback clarified my technical impact. His deep knowledge turned a stalled application into MIET success.",
    rating: 5,
  },
  {
    name: "Viji S.",
    role: "Chartered Engineer",
    quote: "Max's patience and mock interview grading were life-saving. I transitioned from project history to evidence-based mastery, passing my IET professional review on the first attempt.",
    rating: 5,
  },
];

const CourseDetail: FC<{ id?: string }> = ({ id: propId }) => {
  const params = useParams<{ id: string }>();
  const id = propId || params?.id;

  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, purchaseItem, isInCart, isPurchased } = useCart();
  const { formatPrice } = useCurrency();
  const playerRef = useRef<HTMLDivElement>(null);

  const [openSection, setOpenSection] = useState<number>(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"info" | "curriculum" | "resources">("info");
  const [vimeoId, setVimeoId] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isProcessingMockPayment, setIsProcessingMockPayment] = useState(false);

  useEffect(() => {
    const handlePageShow = () => setIsProcessingMockPayment(false);
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const decodedId = decodeURIComponent(id || '');
        const res = await fetch(`/api/courses/${decodedId}`);
        if (!res.ok) {
          router.replace('/courses');
          return;
        }
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Failed to fetch course", err);
        router.replace('/courses');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCourse();
  }, [id, router]);

  useEffect(() => {
    if (course) {
      const all = course.curriculum?.flatMap((section: any) => section.lessons) || [];
      const firstFreeIndex = all.findIndex((lesson: any) => lesson.free);
      setSelectedLessonIndex(firstFreeIndex >= 0 ? firstFreeIndex : 0);
    }
  }, [course?.id]);

  const sections = course?.curriculum || [];
  const allLessons = sections.flatMap((section: any) => section.lessons);
  const totalVideos = allLessons.length;
  const freePreview = allLessons.find((lesson: any) => lesson.free) || allLessons[0];
  const purchased = course ? isPurchased(course.id) : false;
  const inCart = course ? isInCart(course.id) : false;
  const savings = course ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;
  const selectedLesson = allLessons[selectedLessonIndex] || freePreview;
  const isAdmin = session?.user && (session.user as any).role === "admin";
  const selectedLessonLocked = !!selectedLesson && !purchased && !selectedLesson.free && !isAdmin;

  // Fetch secure vimeoId if needed
  useEffect(() => {

    const loadVideo = async () => {
      if (!selectedLesson) return;

      console.log(`[VideoPlayer] Loading lesson: ${selectedLesson.id}`);
      console.log(`[VideoPlayer] Status - Free: ${selectedLesson.free}, Purchased: ${purchased}, Admin: ${isAdmin}`);

      setIsVideoLoading(true);
      setVimeoId(null);
      setError(false);

      try {
        const isAccessible = selectedLesson.free || purchased || isAdmin;

        if (!isAccessible) {
          console.log(`[VideoPlayer] Access Denied for ${selectedLesson.id}`);
          setIsVideoLoading(false);
          return;
        }

        // If vimeoId is already provided in the lesson object, use it immediately
        if (selectedLesson.vimeoId) {
          console.log(`[VideoPlayer] Using provided vimeoId: ${selectedLesson.vimeoId}`);
          setVimeoId(selectedLesson.vimeoId);
          setIsVideoLoading(false);
          return;
        }

        console.log(`[VideoPlayer] Fetching secure ID for ${selectedLesson.id}...`);
        const res = await fetch(`/api/lessons/${selectedLesson.id}`);


        if (res.ok) {
          const data = await res.json();
          console.log(`[VideoPlayer] Success! VimeoID: ${data.vimeoId}`);
          setVimeoId(data.vimeoId || selectedLesson.vimeoId || null);
          if (!data.vimeoId && !selectedLesson.vimeoId) {
            console.error(`[VideoPlayer] API returned success but null vimeoId`);
            setError(true);
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          console.error(`[VideoPlayer] API Error ${res.status}:`, errData.message);

          if (res.status === 403) {
            // Backend says locked, but frontend thought it was accessible!
            console.warn(`[VideoPlayer] Sync Mismatch! Backend says Locked. Forcing UI Lock.`);
            setVimeoId(null);
          } else if (selectedLesson.vimeoId) {
            console.log(`[VideoPlayer] API failed, falling back to static vimeoId`);
            setVimeoId(selectedLesson.vimeoId);
            setError(false);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("[VideoPlayer] Network Error:", err);
        if (selectedLesson.vimeoId && selectedLesson.free) {
          console.log(`[VideoPlayer] Network error, falling back to static vimeoId for free lesson`);
          setVimeoId(selectedLesson.vimeoId);
          setError(false);
        } else {
          setError(true);
        }
      } finally {
        setIsVideoLoading(false);
      }
    };

    loadVideo();

    // Scroll to player when lesson changes
    if (playerRef.current && selectedLessonIndex !== undefined) {
      playerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedLesson, purchased, selectedLessonIndex]);

  const { currency, convertPrice } = useCurrency();

  const handlePurchase = async () => {
    if (!course) return;

    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsProcessingMockPayment(true);

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
      setIsProcessingMockPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-secondary font-medium">Loading Course Details...</p>
      </div>
    );
  }

  if (!course) return null;

  return (

    <div className="pt-20 bg-gray-50 min-h-screen">

      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061F33] via-[#0a2f4b] to-[#061F33] py-16">
        {/* Animated background glows */}
        <motion.div
          className="absolute -top-12 -right-8 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-16 left-20 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-12 items-start">

            {/* Left: Course info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
                <Zap className="w-3 h-3" />
                {course.category}
              </span>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                {course.title}
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
                {course.description}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold">{course.rating}</span>
                  <span className="text-gray-400">({course.reviews.toLocaleString()})</span>
                </motion.div>

                <span className="inline-flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4 text-primary" />
                  {course.students.toLocaleString()} enrolled
                </span>

                <span className="inline-flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4 text-primary" />
                  {course.duration}
                </span>

                <span className="inline-flex items-center gap-2 text-gray-300">
                  <Video className="w-4 h-4 text-primary" />
                  {totalVideos} videos
                </span>
              </div>

              {/* Instructor card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <img
                  src={course.instructorImage}
                  alt={course.instructor}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/40"
                />
                <div>
                  <p className="text-white font-semibold">{course.instructor}</p>
                  <p className="text-gray-400 text-sm">CEng, FIET - Lead Instructor</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Price card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
              className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-8 shadow-2xl sticky top-24"
            >
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold text-white">{formatPrice(course.price)}</span>
                  <span className="text-gray-400 line-through text-lg">{formatPrice(course.originalPrice)}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  Save {savings}%
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {purchased ? (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full py-4 text-base" onClick={() => setActiveTab("curriculum")}>
                      <Play className="w-5 h-5 mr-2" />
                      Continue Learning
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className="w-full py-4 text-base shadow-lg shadow-primary/30"
                        onClick={handlePurchase}
                        disabled={isProcessingMockPayment}
                      >
                        {isProcessingMockPayment ? "Processing Payment..." : "Buy Course Now"}
                      </Button>
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addToCart({ id: course.id, title: course.title, price: course.price, type: "course", thumbnail: course.thumbnail })}
                      disabled={inCart}
                      className={`w-full py-4 rounded-xl border-2 font-semibold transition-all ${inCart
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                        }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {inCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                        {inCart ? "Added to Cart" : "Add to Cart"}
                      </span>
                    </motion.button>
                  </>
                )}
              </div>

              {/* What's included */}
              <div className="pt-6 border-t border-white/20">
                <p className="text-white font-semibold mb-4 text-sm">This course includes:</p>
                <ul className="space-y-3 text-sm">
                  {[
                    "Full lifetime access",
                    `${totalVideos} on-demand video lessons`,
                    "Downloadable resources & templates",
                    "Mobile and desktop access",
                    "Certificate of completion",
                  ].map((item: any, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Money-back guarantee */}
              <div className="mt-6 pt-6 border-t border-white/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">Our Quality Guarantee</p>
                  <p className="text-white/60 text-xs mt-0.5">
                    100% success rate to date. Moneyback guarantee under fairuse terms.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-[1.6fr_1fr] gap-10">

        {/* Left column */}
        <div className="space-y-8">

          {/* Video player */}
          <motion.div
            ref={playerRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden bg-black shadow-2xl border border-gray-200 scroll-mt-24"
          >
            <div className="aspect-video relative bg-black">
              <AnimatePresence mode="wait">
                {isVideoLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400 text-sm animate-pulse">Loading secure content...</p>
                    </div>
                  </motion.div>
                ) : selectedLessonLocked ? (
                  <motion.div
                    key="locked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#061F33] to-[#0a2f4b] text-white px-6 text-center z-10"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                      <Lock className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Content Locked</h3>
                    <p className="text-gray-300 text-sm mb-8 max-w-md">
                      This lesson is part of the premium curriculum. Enroll now to unlock full access.
                    </p>
                    <Button
                      onClick={handlePurchase}
                      disabled={isProcessingMockPayment}
                    >
                      {isProcessingMockPayment ? "Verifying Payment..." : "Buy Course to Unlock"}
                    </Button>
                  </motion.div>
                ) : vimeoId ? (
                  <motion.div
                    key={vimeoId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full"
                  >
                    <iframe
                      src={`https://player.vimeo.com/video/${vimeoId}`}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                      allowFullScreen
                    />
                  </motion.div>
                ) : (error || (!vimeoId && !selectedLessonLocked)) ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white px-6 text-center z-10"
                  >
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                      <Video className="w-10 h-10 text-red-400 opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Sorry, we're having trouble</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">
                      We couldn't load the video link for this lesson. (ID: {selectedLesson?.id})
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedLessonIndex(selectedLessonIndex)}
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        Try refreshing
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="text-white/50 hover:text-white text-sm"
                      >
                        Force Reload
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Video title bar */}
            {selectedLesson && (
              <div className="bg-gray-900 px-6 py-4 border-t border-gray-800">
                <p className="text-white font-semibold">{selectedLesson.title}</p>
                <p className="text-gray-400 text-sm">{selectedLesson.duration}</p>
              </div>
            )}
          </motion.div>

          {/* Tab navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-2 inline-flex gap-2 shadow-sm"
          >
            {[
              { key: "info", label: "Overview", icon: <BookOpen className="w-4 h-4" /> },
              { key: "curriculum", label: "Curriculum", icon: <Video className="w-4 h-4" /> },
              { key: "resources", label: "Resources", icon: <FileText className="w-4 h-4" /> },
            ].map((tab: any) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.key as "info" | "curriculum" | "resources")}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === tab.key
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl border border-gray-100 p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-secondary mb-6">What You'll Learn</h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {COURSE_BENEFITS.map((benefit: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-secondary text-sm mb-1">{benefit.title}</p>
                        <p className="text-xs text-gray-500">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-bold text-secondary mb-4">Course Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100">
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Instructor</p>
                      <div className="flex items-center gap-3">
                        <img
                          src={course.instructorImage}
                          alt={course.instructor}
                          className="w-10 h-10 rounded-full border-2 border-primary/20"
                        />
                        <div>
                          <p className="font-semibold text-secondary text-sm">{course.instructor}</p>
                          <p className="text-xs text-gray-500">Licensed Professional Engineer</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-5 border border-gray-100">
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Level</p>
                      <p className="font-semibold text-secondary">{course.level}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "curriculum" && (
              <motion.div
                key="curriculum"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl border border-gray-100 p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-secondary mb-2">Course Content</h2>
                <p className="text-sm text-gray-500 mb-6">
                  {sections.length} sections • {totalVideos} videos • {course.duration} total
                </p>

                <div className="space-y-3">
                  {sections.map((section: any, sectionIndex: number) => (
                    <div
                      key={section.section}
                      className="rounded-2xl border border-gray-100 overflow-hidden"
                    >
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                        onClick={() => setOpenSection(openSection === sectionIndex ? -1 : sectionIndex)}
                        className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {sectionIndex + 1}
                          </div>
                          <span className="font-semibold text-secondary">{section.section}</span>
                        </div>
                        <motion.div
                          animate={{ rotate: openSection === sectionIndex ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-primary" />
                        </motion.div>
                      </motion.button>

                      <AnimatePresence initial={false}>
                        {openSection === sectionIndex && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 space-y-2">
                              {section.lessons.map((lesson: any, lessonIndex: number) => {
                                const isLocked = !lesson.free && !purchased;
                                return (
                                  <motion.button
                                    type="button"
                                    key={`${section.section}-${lesson.title}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: lessonIndex * 0.05 }}
                                    whileHover={{ x: 4, backgroundColor: "rgba(63,159,163,0.05)" }}
                                    onClick={() => {
                                      const flatIndex =
                                        sections
                                          .slice(0, sectionIndex)
                                          .reduce((sum: number, sectionItem: any) => sum + sectionItem.lessons.length, 0) + lessonIndex;
                                      setSelectedLessonIndex(flatIndex);
                                    }}
                                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${selectedLessonIndex ===
                                      sections
                                        .slice(0, sectionIndex)
                                        .reduce((sum: number, sectionItem: any) => sum + sectionItem.lessons.length, 0) + lessonIndex
                                      ? "bg-primary/10 border border-primary/20"
                                      : isLocked
                                        ? "text-gray-400 bg-gray-50/50"
                                        : "text-gray-700"
                                      }`}
                                  >
                                    {isLocked ? (
                                      <Lock className="w-4 h-4 shrink-0" />
                                    ) : (
                                      <Play className="w-4 h-4 text-primary shrink-0" />
                                    )}
                                    <span className="text-sm flex-1">{lesson.title}</span>
                                    <span className="text-xs text-gray-400">{lesson.duration}</span>
                                    {lesson.free && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                                        FREE
                                      </span>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "resources" && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl border border-gray-100 p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-secondary mb-2">Downloadable Resources</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Templates, checklists, and study packs to support your success.
                </p>

                <div className="space-y-4">
                  {(course.downloadableResources || []).map((resource: any, i: number) => (
                    <motion.div
                      key={resource.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ x: 4 }}
                      className="rounded-2xl border border-gray-100 p-5 flex items-center gap-4 bg-gray-50"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        {resource.type === 'PDF' ? (
                          <FileText className="w-6 h-6 text-primary" />
                        ) : resource.type === 'XLS' || resource.type === 'XLSX' || resource.type === 'CSV' ? (
                          <div className="text-primary font-bold text-lg">X</div>
                        ) : (
                          <Download className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-secondary mb-1">{resource.title}</p>
                        <p className="text-sm text-gray-500 mb-1">{resource.description}</p>
                        <p className="text-xs text-gray-400">{resource.type} • {resource.fileSize}</p>
                      </div>
                      <motion.a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${(purchased || isAdmin)
                          ? "border-primary text-primary hover:bg-primary/5"
                          : "border-gray-200 text-gray-400 pointer-events-none opacity-50"
                          }`}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </motion.a>
                    </motion.div>
                  ))}
                </div>

                {!purchased && (
                  <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <p className="text-sm text-amber-700 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Resources unlock after purchase. Preview videos are available before buying.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Student testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl border border-gray-100 p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-secondary mb-6">What Students Say</h2>
            <div className="space-y-4">
              {TESTIMONIALS.map((testimonial: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <Quote className="w-8 h-8 text-primary/20 mb-3" />
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-secondary text-sm">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(testimonial.rating)].map((_: any, j: number) => (
                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">

          {/* Progress tracker (if purchased) */}
          {purchased && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-lg"
            >
              <h3 className="font-bold text-secondary mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Your Progress
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-secondary">12%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "12%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-primary to-teal-500 rounded-full"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">3 of 24 lessons completed</p>
            </motion.div>
          )}

          {/* Course features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-lg"
          >
            <h3 className="font-bold text-secondary mb-5">Course Features</h3>
            <ul className="space-y-4">
              {[
                { icon: <Video className="w-5 h-5" />, text: `${totalVideos} HD video lessons` },
                { icon: <FileText className="w-5 h-5" />, text: "Downloadable resources" },
                { icon: <Award className="w-5 h-5" />, text: "Certificate on completion" },
                { icon: <Users className="w-5 h-5" />, text: "Community access" },
                { icon: <Clock className="w-5 h-5" />, text: "Lifetime access" },
              ].map((item: any, i: number) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-3 text-sm text-gray-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {item.icon}
                  </div>
                  {item.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CTA card */}
          {!purchased && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary to-teal-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <Zap className="w-10 h-10 mb-4" />
                <h3 className="text-xl font-bold mb-2">Limited Time Offer</h3>
                <p className="text-white/90 text-sm mb-6">
                  Save {savings}% on this course. Offer ends soon!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePurchase}
                  className="w-full py-3 bg-white text-primary rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
                >
                  Enroll Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </aside>
      </section>
      {/* Mock Payment Overlay */}
      <AnimatePresence>
        {isProcessingMockPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center"
            >
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600 mb-6">Processing your order. Please do not refresh the page...</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Encrypted by Stripe</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseDetail;