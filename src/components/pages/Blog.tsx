"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Calendar, BookOpen,
  ChevronRight, ArrowRight, Clock, TrendingUp, Users, Award, Globe,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ShareButtons from "@/components/ui/ShareButtons";

/* ── types ── */
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
  content?: string;
}

/* ── badge colours ── */
const SERVICE_COLORS: Record<string, string> = {
  "US PE": "bg-blue-50   text-blue-700   border-blue-200",
  IMECHE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  IET: "bg-violet-50 text-violet-700 border-violet-200",
  ICE: "bg-orange-50 text-orange-700 border-orange-200",
  "P.Eng.": "bg-rose-50   text-rose-700   border-rose-200",
};

const TAGS = [
  "Licensure", "CEng", "Chartership", "Strategy",
  "Canada", "US PE", "IET", "ICE", "Ethics", "Interview",
];

/* ── stats ── */
const STATS = [
  { icon: Users, value: "2,000+", label: "Engineers Guided" },
  { icon: Globe, value: "10+", label: "Countries Reached" },
  { icon: Award, value: "100%", label: "Success Rate" },
  { icon: TrendingUp, value: "10+", label: "Years Experience" },
];

/* ── services quick-links ── */
const SERVICES = [
  { label: "US PE", color: "bg-blue-500", desc: "Professional Engineer licensure pathway" },
  { label: "IET", color: "bg-violet-500", desc: "Chartered Engineer via IET" },
  { label: "ICE", color: "bg-orange-500", desc: "CEng MICE registration roadmap" },
  { label: "P.Eng.", color: "bg-rose-500", desc: "Canadian engineering licensure" },
];

/* ════════════════════════════════════════════
   TINY SHARED COMPONENTS
════════════════════════════════════════════ */
const Meta = ({ date, readTime, light = false }: { date: string; readTime: string; light?: boolean }) => (
  <div className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest ${light ? "text-gray-400" : "text-gray-400"}`}>
    <Calendar className="w-3 h-3 flex-shrink-0" />
    <span>{date}</span>
    <span className="w-1 h-1 rounded-full bg-current opacity-40 flex-shrink-0" />
    <Clock className="w-3 h-3 flex-shrink-0" />
    <span>{readTime}</span>
  </div>
);

const Badge = ({ service }: { service: string }) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${SERVICE_COLORS[service] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
    {service}
  </span>
);

const Avatar = ({ name, dark = false }: { name: string; dark?: boolean }) => (
  <div className="flex items-center gap-2.5">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0
      ${dark ? "bg-white/10 text-white border border-white/10" : "bg-[#061F33]/8 text-[#061F33]"}`}>
      {name.charAt(0)}
    </div>
    <span className={`text-xs font-bold ${dark ? "text-gray-300" : "text-gray-600"}`}>{name}</span>
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="w-1 h-6 rounded-full bg-[#3F9FA3]" />
    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{children}</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

/* ════════════════════════════════════════════
   CARD VARIANTS
════════════════════════════════════════════ */

const HeroCard = ({ blog, onClick }: { blog: Blog; onClick: () => void }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    onClick={onClick}
    className="group relative rounded-3xl overflow-hidden cursor-pointer bg-[#061F33] mb-8"
    style={{ minHeight: 480 }}
  >
    <div className="absolute inset-0">
      <img src={blog.img} alt={blog.title}
        className="w-full h-full object-cover opacity-30 group-hover:opacity-45
                   group-hover:scale-105 transition-all duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#061F33] via-[#061F33]/85 to-transparent" />
    </div>
    <div className="relative z-10 flex flex-col justify-end h-full p-10 lg:p-16 max-w-3xl" style={{ minHeight: 480 }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="px-3 py-1 bg-[#3F9FA3] text-white text-[10px] font-black uppercase tracking-widest rounded-md">
          Featured
        </span>
        <Badge service={blog.service} />
      </div>
      <Meta date={blog.date} readTime={blog.readTime} light />
      <h2 className="mt-4 mb-4 text-3xl lg:text-5xl font-black text-white leading-tight
                     group-hover:text-[#3F9FA3] transition-colors duration-300 line-clamp-2">
        {blog.title}
      </h2>
      <p className="text-gray-400 text-base leading-relaxed line-clamp-2 mb-8 max-w-xl">
        {blog.desc}
      </p>
      <div className="flex items-center justify-between gap-4">
        <Avatar name={blog.author} dark />
        <div className="flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
          <ShareButtons title={blog.title} url={typeof window !== "undefined" ? `${window.location.origin}/blog/${blog.blogId}` : ""} />
          <span className="flex items-center gap-2 text-[#3F9FA3] text-sm font-bold group-hover:gap-3 transition-all">
            Read Article <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  </motion.article>
);

const BlogCard = ({ blog, onClick, delay = 0 }: { blog: Blog; onClick: () => void; delay?: number }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    onClick={onClick}
    className="group bg-white rounded-2xl overflow-hidden border border-gray-100
               hover:border-[#3F9FA3]/30 hover:shadow-2xl hover:shadow-[#3F9FA3]/5
               hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
  >
    <div className="relative h-52 overflow-hidden flex-shrink-0 bg-gray-100">
      <img src={blog.img} alt={blog.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="absolute top-4 left-4"><Badge service={blog.service} /></div>
    </div>
    <div className="flex flex-col flex-1 p-7">
      <Meta date={blog.date} readTime={blog.readTime} />
      <h3 className="mt-3 mb-3 text-lg font-black text-[#061F33] leading-snug
                     group-hover:text-[#3F9FA3] transition-colors line-clamp-2">
        {blog.title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{blog.desc}</p>
      <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between gap-4">
        <Avatar name={blog.author} />
        <div onClick={(e) => e.stopPropagation()}>
          <ShareButtons title={blog.title} url={typeof window !== "undefined" ? `${window.location.origin}/blog/${blog.blogId}` : ""} />
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#3F9FA3] group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </motion.article>
);

const HorizontalCard = ({ blog, onClick, delay = 0 }: { blog: Blog; onClick: () => void; delay?: number }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    onClick={onClick}
    className="group bg-white rounded-2xl overflow-hidden border border-gray-100
               hover:border-[#3F9FA3]/30 hover:shadow-2xl hover:shadow-[#3F9FA3]/5
               hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-row"
  >
    <div className="relative w-40 lg:w-52 flex-shrink-0 overflow-hidden bg-gray-100">
      <img src={blog.img} alt={blog.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
    </div>
    <div className="flex flex-col flex-1 p-6">
      <div className="flex items-center gap-2 mb-3"><Badge service={blog.service} /></div>
      <Meta date={blog.date} readTime={blog.readTime} />
      <h3 className="mt-3 mb-2 text-base font-black text-[#061F33] leading-snug
                     group-hover:text-[#3F9FA3] transition-colors line-clamp-2">
        {blog.title}
      </h3>
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1">{blog.desc}</p>
      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
        <Avatar name={blog.author} />
        <div onClick={(e) => e.stopPropagation()}>
          <ShareButtons title={blog.title} url={typeof window !== "undefined" ? `${window.location.origin}/blog/${blog.blogId}` : ""} />
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#3F9FA3] group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </motion.article>
);

const WideCard = ({ blog, onClick, delay = 0 }: { blog: Blog; onClick: () => void; delay?: number }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    onClick={onClick}
    className="group col-span-1 md:col-span-2 lg:col-span-3 bg-[#061F33] rounded-2xl overflow-hidden
               border border-white/5 hover:shadow-2xl hover:shadow-[#061F33]/20
               hover:-translate-y-1 transition-all duration-300 cursor-pointer
               flex flex-col md:flex-row"
    style={{ minHeight: 220 }}
  >
    <div className="relative md:w-80 h-52 md:h-auto flex-shrink-0 overflow-hidden">
      <img src={blog.img} alt={blog.title}
        className="w-full h-full object-cover opacity-60 group-hover:opacity-80
                   group-hover:scale-105 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#061F33] hidden md:block" />
    </div>
    <div className="flex flex-col justify-center flex-1 p-8 lg:p-12">
      <div className="flex items-center gap-3 mb-4">
        <Badge service={blog.service} />
        <Meta date={blog.date} readTime={blog.readTime} light />
      </div>
      <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 leading-snug
                     group-hover:text-[#3F9FA3] transition-colors line-clamp-2">
        {blog.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 max-w-2xl">
        {blog.desc}
      </p>
      <div className="flex items-center justify-between gap-4">
        <Avatar name={blog.author} dark />
        <div className="flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
          <ShareButtons title={blog.title} url={typeof window !== "undefined" ? `${window.location.origin}/blog/${blog.blogId}` : ""} />
          <span className="flex items-center gap-2 text-[#3F9FA3] text-sm font-bold group-hover:gap-3 transition-all">
            Read Article <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  </motion.article>
);

const SmartGrid = ({
  blogs,
  onNavigate,
}: {
  blogs: Blog[];
  onNavigate: (id: string) => void;
}) => {
  if (blogs.length === 0) return null;

  const remainder = blogs.length % 3;
  const gridBlogs = remainder === 1 ? blogs.slice(0, -1) : blogs;
  const wideCard = remainder === 1 ? blogs[blogs.length - 1] : null;

  return (
    <>
      {gridBlogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {gridBlogs.map((blog, i) => (
            <BlogCard
              key={blog.blogId}
              blog={blog}
              delay={i * 0.04}
              onClick={() => onNavigate(blog.blogId)}
            />
          ))}
        </div>
      )}

      {wideCard && (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <WideCard
            blog={wideCard}
            delay={0.1}
            onClick={() => onNavigate(wideCard.blogId)}
          />
        </div>
      )}
    </>
  );
};

const StatsStrip = () => (
  <div className="bg-white border-y border-gray-100 py-12 my-0">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3F9FA3]/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#3F9FA3]" />
            </div>
            <div className="text-3xl font-black text-[#061F33]">{value}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ServicesStrip = ({ onFilter }: { onFilter: (tag: string) => void }) => (
  <div className="mb-16">
    <SectionLabel>Browse by Registration Type</SectionLabel>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {SERVICES.map(({ label, color, desc }) => (
        <button
          key={label}
          onClick={() => onFilter(label)}
          className="group text-left p-6 bg-white rounded-2xl border border-gray-100
                     hover:border-[#3F9FA3]/30 hover:shadow-xl hover:-translate-y-1
                     transition-all duration-300"
        >
          <div className={`w-10 h-10 rounded-xl ${color} mb-4 flex items-center justify-center`}>
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm font-black text-[#061F33] mb-1 group-hover:text-[#3F9FA3] transition-colors">
            {label}
          </div>
          <div className="text-xs text-gray-400 leading-relaxed">{desc}</div>
        </button>
      ))}
    </div>
  </div>
);

const ConsultBanner = ({ onNavigate }: { onNavigate: () => void }) => (
  <div className="my-16 rounded-3xl bg-gradient-to-br from-[#3F9FA3] to-[#2d7a7d] p-10 lg:p-14
                  flex flex-col lg:flex-row items-center justify-between gap-8">
    <div className="text-center lg:text-left">
      <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-2">Free Consultation</p>
      <h3 className="text-2xl lg:text-3xl font-black text-white mb-2">
        Not sure which registration path is right for you?
      </h3>
      <p className="text-white/70 text-sm max-w-xl">
        Our experts have helped 2,400+ engineers navigate complex licensure routes across 18 countries.
      </p>
    </div>
    <button
      onClick={onNavigate}
      className="flex-shrink-0 px-10 py-4 bg-white text-[#3F9FA3] rounded-xl
                 font-black text-sm uppercase tracking-widest hover:shadow-xl
                 hover:-translate-y-0.5 transition-all duration-300"
    >
      Book a Free Call
    </button>
  </div>
);

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return blogs.filter((b) => {
      const matchSearch = b.title.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q);
      const matchTag = !selectedTag || b.tags?.includes(selectedTag);
      return matchSearch && matchTag;
    });
  }, [search, selectedTag, blogs]);

  const isFiltering = !!(search || selectedTag);

  /* Editorial slices */
  const hero = filtered[0];
  const twoCol = filtered.slice(1, 3);
  const rest = filtered.slice(3);

  const navigate = (id: string) => router.push(`/blog/${id}`);

  if (loading) {
    return (
      <div className="pt-40 pb-20 flex justify-center items-center min-h-screen bg-gray-50/20">
        <div className="w-12 h-12 border-4 border-[#3F9FA3] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 bg-white">
      <PageHero
        badge="Expert Insights"
        heading={<>Engineering <span className="text-gradient">Journal</span></>}
        subtitle="Strategic guidance and professional roadmaps for global engineering registrations."
        primaryCta={{ label: "Browse Articles", href: "#articles" }}
        secondaryCta={{ label: "Contact Expert", href: "/contact" }}
      />

      <StatsStrip />

      <div id="articles" className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                           text-sm font-medium focus:outline-none focus:ring-2
                           focus:ring-[#3F9FA3]/20 focus:border-[#3F9FA3] transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!selectedTag ? "bg-[#061F33] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                  }`}
              >
                All
              </button>
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedTag === tag
                      ? "bg-[#3F9FA3] text-white border-[#3F9FA3]"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#3F9FA3] hover:text-[#3F9FA3]"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/40 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <AnimatePresence mode="wait">
            {filtered.length === 0 && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-[#061F33] mb-2">No articles found</h3>
                <p className="text-gray-500 mb-8">Try different keywords or clear your filters.</p>
                <button onClick={() => { setSearch(""); setSelectedTag(null); }}
                  className="px-6 py-3 bg-[#3F9FA3] text-white rounded-xl font-bold text-sm hover:bg-[#2d7a7d] transition-all">
                  Clear filters
                </button>
              </motion.div>
            )}

            {filtered.length > 0 && isFiltering && (
              <motion.div key="filtered" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SmartGrid blogs={filtered} onNavigate={navigate} />
              </motion.div>
            )}

            {filtered.length > 0 && !isFiltering && (
              <motion.div key="editorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ServicesStrip onFilter={(tag) => setSelectedTag(tag)} />
                {hero && (
                  <>
                    <SectionLabel>Featured Article</SectionLabel>
                    <HeroCard blog={hero} onClick={() => navigate(hero.blogId)} />
                  </>
                )}
                {twoCol.length > 0 && (
                  <div className="mb-8">
                    <SectionLabel>Latest Articles</SectionLabel>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                      {twoCol.map((blog, i) => (
                        <HorizontalCard key={blog.blogId} blog={blog} delay={i * 0.06} onClick={() => navigate(blog.blogId)} />
                      ))}
                    </div>
                  </div>
                )}
                <ConsultBanner onNavigate={() => router.push("/contact")} />
                {rest.length > 0 && (
                  <div>
                    <SectionLabel>More Articles</SectionLabel>
                    <SmartGrid blogs={rest} onNavigate={navigate} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-[#061F33] py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <BookOpen className="w-12 h-12 text-[#3F9FA3] mx-auto mb-8 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Professional Engineering <span className="text-gradient">Guidance</span>
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Get expert roadmaps and strategic support for your registration journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => router.push("/contact")}
              className="px-10 py-4 bg-[#3F9FA3] text-white rounded-xl font-bold text-sm
                         uppercase tracking-widest hover:bg-[#2d7a7d] transition-all shadow-xl shadow-[#3F9FA3]/20">
              Free Consultation
            </button>
            <button onClick={() => router.push("/services")}
              className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-xl
                         font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              Our Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;