"use client";

import { useParams, useRouter } from 'next/navigation';
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Share2,
  ExternalLink,
  Briefcase,
  Globe,
  Link2,
  ChevronRight,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Bookmark,
  Share
} from "lucide-react";
import { useState, useEffect } from "react";

interface Blog {
  blogId: string;
  service: string;
  title: string;
  desc: string;
  img: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

const BlogDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        // Fetch the main blog
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        setBlog(data);

        // Fetch related blogs (same service)
        const relatedRes = await fetch(`/api/blogs?service=${data.service}`);
        const relatedData = await relatedRes.json();
        setRelatedBlogs(relatedData.filter((b: Blog) => b.blogId !== data.blogId).slice(0, 2));
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  const serviceBadgeColors: Record<string, { pill: string; dot: string; bg: string; text: string }> = {
    "US PE":         { pill: "bg-blue-50 text-blue-700 border-blue-100",      dot: "bg-blue-500",    bg: "from-blue-600 to-blue-800", text: "text-blue-600" },
    IMECHE:          { pill: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500", bg: "from-emerald-600 to-emerald-800", text: "text-emerald-600" },
    IET:             { pill: "bg-violet-50 text-violet-700 border-violet-100",  dot: "bg-violet-500",  bg: "from-violet-600 to-violet-800", text: "text-violet-600" },
    ICE:             { pill: "bg-orange-50 text-orange-700 border-orange-100",  dot: "bg-orange-500",  bg: "from-orange-600 to-orange-800", text: "text-orange-600" },
    "Canadian PEng": { pill: "bg-rose-50 text-rose-700 border-rose-100",        dot: "bg-rose-500",    bg: "from-rose-600 to-rose-800", text: "text-rose-600" },
    "P.Eng.":        { pill: "bg-rose-50 text-rose-700 border-rose-100",        dot: "bg-rose-500",    bg: "from-rose-600 to-rose-800", text: "text-rose-600" },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.desc,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className="pt-40 pb-20 flex justify-center items-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-[#3F9FA3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl max-w-md mx-4">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been moved.</p>
          <button onClick={() => router.push("/blog")} className="px-8 py-3 bg-[#3F9FA3] text-white rounded-xl font-bold hover:bg-[#2d7a7d] transition-all">
            Back to Journal
          </button>
        </div>
      </div>
    );
  }

  const badge = serviceBadgeColors[blog.service];

  return (
    <div className="bg-white min-h-screen">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#3F9FA3] z-[100] origin-left" style={{ scaleX }} />

      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-8">
            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${badge?.pill}`}>
              {blog.service}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{blog.readTime} Read</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold text-[#061F33] mb-8 leading-[1.1]">
            {blog.title}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto mb-12">
            {blog.desc}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#061F33] font-bold text-lg border border-gray-100">
              {blog.author.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#061F33]">{blog.author}</p>
              <p className="text-xs text-gray-400">{blog.date}</p>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-[0.03]">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 mb-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
          <img src={blog.img} className="w-full h-full object-cover" alt={blog.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[64px_1fr] xl:grid-cols-[64px_1fr_288px] gap-10 xl:gap-20">
          {/* Left Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-40 flex flex-col items-center gap-6">
              <button onClick={() => alert("Bookmarks feature coming soon!")} className="p-3 rounded-full hover:bg-gray-50 transition-colors text-gray-400 hover:text-[#3F9FA3]" title="Bookmark"><Bookmark className="w-5 h-5" /></button>
              <button onClick={handleCopy} className="p-3 rounded-full hover:bg-gray-50 transition-colors text-gray-400 hover:text-[#3F9FA3]" title={copied ? "Copied!" : "Copy Link"}><Link2 className="w-5 h-5" /></button>
              <div className="w-px h-12 bg-gray-100" />
              <button onClick={handleShare} className="p-3 rounded-full hover:bg-gray-50 transition-colors text-gray-400 hover:text-[#3F9FA3]" title="Share"><Share className="w-5 h-5" /></button>
            </div>
          </aside>

          {/* Main Content */}
          <article className="min-w-0">
            <div 
              className="prose prose-lg prose-slate max-w-none prose-headings:text-[#061F33] prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-[1.8] prose-strong:text-[#061F33] prose-a:text-[#3F9FA3] prose-a:no-underline hover:prose-a:underline blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap gap-2">
              {blog.tags?.map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-gray-50 text-gray-500 text-xs font-bold rounded-xl border border-gray-100">#{tag}</span>
              ))}
            </div>

            <div className="mt-20 p-10 bg-gray-50 rounded-[2.5rem] flex items-center gap-8 border border-gray-100">
              <div className="w-24 h-24 rounded-3xl bg-[#061F33] flex items-center justify-center text-white text-3xl font-bold shadow-xl">{blog.author.charAt(0)}</div>
              <div>
                <p className="text-xs font-black text-[#3F9FA3] uppercase tracking-[0.2em] mb-2">Written By</p>
                <h4 className="text-2xl font-bold text-[#061F33] mb-2">{blog.author}</h4>
                <p className="text-gray-500 leading-relaxed">An experienced professional with deep expertise in {blog.service} certification pathways and engineering excellence.</p>
              </div>
            </div>
          </article>

          {/* Right Sidebar */}
          <aside className="hidden xl:block">
            <div className="sticky top-40 space-y-12">
              <div>
                <h5 className="text-xs font-black text-[#061F33] uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#3F9FA3]" />Related Reads</h5>
                <div className="space-y-8">
                  {relatedBlogs.map((r) => (
                    <div key={r.blogId} className="group cursor-pointer" onClick={() => { router.push(`/blog/${r.blogId}`); window.scrollTo(0,0); }}>
                      <div className="aspect-video rounded-2xl overflow-hidden mb-3 border border-gray-100">
                        <img src={r.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={r.title} />
                      </div>
                      <h6 className="text-sm font-bold text-[#061F33] group-hover:text-[#3F9FA3] transition-colors leading-snug">{r.title}</h6>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 bg-[#061F33] rounded-3xl text-white shadow-xl">
                <h5 className="text-lg font-bold mb-4">Need personalized guidance?</h5>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">Book a free consultation with our {blog.service} experts today.</p>
                <button onClick={() => router.push("/contact")} className="w-full py-3 bg-[#3F9FA3] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#2d7a7d] transition-all">Book Session</button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <button onClick={() => router.push("/blog")} className="flex items-center gap-3 text-sm font-bold text-[#061F33] hover:text-[#3F9FA3] transition-colors group">
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#3F9FA3] transition-colors"><ArrowLeft className="w-4 h-4" /></div>
            Back to Journal
          </button>
          <div className="flex items-center gap-4">
             <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Share Article</span>
             <button onClick={handleShare} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#3F9FA3] hover:border-[#3F9FA3] transition-all"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;