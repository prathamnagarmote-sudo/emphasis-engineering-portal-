"use client";

import { FC, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, User, BookOpen, TrendingUp, Sparkles, ArrowUpRight, ChevronRight } from "lucide-react";

interface Blog {
  blogId: string;
  service: string;
  title: string;
  desc: string;
  img: string;
  author: string;
  date: string;
  readTime: string;
  tags?: string[];
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.13, delayChildren: 0.05 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as any },
  },
};

const FloatingOrb: FC<{
  size: number;
  x: string;
  y: string;
  color: string;
  delay?: number;
}> = ({ size, x, y, color, delay = 0 }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: color,
      filter: "blur(80px)",
    }}
    animate={{
      y: [0, -30, 0],
      scale: [1, 1.08, 1],
      opacity: [0.5, 0.75, 0.5],
    }}
    transition={{
      duration: 7 + delay,
      repeat: Infinity,
      delay,
      ease: "easeInOut" as any,
    }}
  />
);

const MagneticArrow: FC = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative flex items-center gap-1.5 text-primary font-bold text-xs tracking-wide"
    >
      <motion.span
        animate={{ x: hovered ? 3 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        Read article
      </motion.span>
      <motion.span
        animate={{ x: hovered ? 5 : 0, opacity: hovered ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <ArrowUpRight className="w-3.5 h-3.5" />
      </motion.span>
    </motion.span>
  );
};

const ScrollProgressLine: FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="absolute top-0 left-0 right-0 h-px bg-gray-100 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary via-teal-400 to-primary origin-left"
        style={{ scaleX }}
      />
    </div>
  );
};

const BlogCard: FC<{ post: Blog; index: number }> = ({ post, index }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);

  return (
    <motion.article
      ref={cardRef}
      variants={cardVariant}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[28px] overflow-hidden flex flex-col cursor-pointer border border-gray-100/80"
      style={{
        boxShadow: hovered
          ? "0 32px 64px -12px rgba(6,31,51,0.18), 0 0 0 1px rgba(63,159,163,0.15)"
          : "0 4px 24px -4px rgba(6,31,51,0.08)",
        transition: "box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
      onClick={() => (window.location.href = `/blog/${post.blogId}`)}
    >
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={post.img}
          alt={post.title}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          className="absolute top-4 left-4"
          initial={{ x: -8, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          <span className="px-3.5 py-1.5 bg-primary text-white text-[11px] font-bold rounded-full tracking-wide shadow-lg shadow-primary/30">
            {post.service}
          </span>
        </motion.div>
        {index === 0 && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ x: 8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="px-3 py-1.5 bg-amber-400 text-amber-900 text-[11px] font-bold rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-400/30">
              <TrendingUp className="w-3 h-3" /> Featured
            </span>
          </motion.div>
        )}
        <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 relative">
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {post.tags?.slice(0, 2).map((tag: string, j: number) => (
            <motion.span
              key={j}
              whileHover={{ scale: 1.05 }}
              className="px-2.5 py-0.5 bg-primary/8 text-primary text-[11px] rounded-lg font-semibold tracking-wide"
            >
              #{tag}
            </motion.span>
          ))}
        </div>
        <h3 className="font-bold text-secondary text-[15px] leading-snug mb-2.5 line-clamp-2 group-hover:text-primary transition-colors duration-300 flex-1">
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-5">
          {post.desc}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3.5 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-300" /> {post.author}
            </span>
            <span className="w-px h-3 bg-gray-200" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-300" /> {post.readTime}
            </span>
          </div>
          <MagneticArrow />
        </div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-teal-400 origin-left"
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
      />
    </motion.article>
  );
};

const BlogPreviewSection: FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setBlogs(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch blog preview:", err);
      }
    };
    fetchBlogs();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative py-28 bg-white overflow-hidden"
    >
      <ScrollProgressLine />
      <FloatingOrb size={500} x="60%" y="-10%" color="rgba(63,159,163,0.08)" delay={0} />
      <FloatingOrb size={400} x="-5%" y="40%" color="rgba(6,31,51,0.05)" delay={2} />
      <FloatingOrb size={300} x="80%" y="60%" color="rgba(63,159,163,0.06)" delay={4} />
      <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(6,31,51,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,31,51,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-[0.12em] uppercase mb-5">
              <Sparkles className="w-3 h-3" /> From the Blog
            </motion.div>
            <div className="overflow-hidden">
              <motion.h2 initial={{ y: 60, opacity: 0 }} animate={isInView ? { y: 0, opacity: 1 } : {}} className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-secondary leading-[1.08] tracking-tight">Engineering Insights</motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2 initial={{ y: 60, opacity: 0 }} animate={isInView ? { y: 0, opacity: 1 } : {}} className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight"><span className="bg-gradient-to-r from-primary via-teal-400 to-primary bg-clip-text text-transparent" style={{ backgroundSize: "200%" }}>& Expert Guides</span></motion.h2>
            </div>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-gray-400 mt-5 text-lg max-w-xl leading-relaxed">Practical articles from licensed engineers — helping you navigate licensure pathways with confidence.</motion.p>
          </div>
          <motion.div initial={{ opacity: 0, x: 24 }} animate={isInView ? { opacity: 1, x: 0 } : {}}>
            <Link href="/blog">
              <div className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border-2 border-primary/25 text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors duration-300 cursor-pointer text-sm">
                View All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate={isInView ? "show" : "hidden"} className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {blogs.map((post, i) => (
            <BlogCard key={post.blogId} post={post} index={i} />
          ))}
        </motion.div>

        <motion.div className="rounded-[32px] relative overflow-hidden mt-20" style={{ background: "linear-gradient(135deg, #061F33 0%, #0d3654 60%, #0f4470 100%)" }}>
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2.5 justify-center md:justify-start mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-primary font-bold text-sm tracking-wide">Expert Engineering Insights</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight">Stay Ahead in Your <br /> <span className="bg-gradient-to-r from-primary to-teal-300 bg-clip-text text-transparent">Engineering Career</span></h3>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">Weekly insights, strategy guides, and success stories from licensed engineers across the globe.</p>
            </div>
            <Link href="/blog" className="shrink-0">
              <div className="group relative px-8 py-4 bg-primary rounded-2xl text-white font-bold flex items-center gap-3 overflow-hidden cursor-pointer shadow-lg shadow-primary/30">
                Explore the Blog <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;