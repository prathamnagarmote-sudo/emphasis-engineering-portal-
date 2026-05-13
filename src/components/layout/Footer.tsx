"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Mail, Phone, MapPin, ArrowRight,
  CheckCircle, ChevronDown,
} from "lucide-react";

// ─── Social SVG icons ──────────────────────────────────────────────────────────
const LinkedIn = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const YouTube = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const Instagram = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);
const Facebook = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const XIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    heading: "Mentorship",
    links: [
      { label: "1-on-1 Mentoring",   href: "/services" },
      { label: "Document Review",    href: "/services" },
      { label: "Mock Interviews",    href: "/services" },
      { label: "Application Support", href: "/services" },
      { label: "Free Consultation",  href: "/contact" },
    ],
  },
  {
    heading: "Success Path",
    links: [
      { label: "UK CEng Roadmap",    href: "/services" },
      { label: "Canadian P.Eng",     href: "/services" },
      { label: "US PE Pathway",      href: "/services" },
      { label: "Success Stories",    href: "/testimonials" },
      { label: "Knowledge Hub",      href: "/blog" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Student Dashboard",  href: "/dashboard" },
      { label: "Practice Tests",     href: "/practice-tests" },
      { label: "Licensure Guide",    href: "/blog" },
      { label: "Help Center",        href: "/contact" },
      { label: "Verified Reviews",   href: "/testimonials" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Refund Policy",    href: "/refund-policy" },
      { label: "Cookie Policy",    href: "/cookie-policy" },
    ],
  },
];

const SOCIAL = [
  { Icon: LinkedIn,  href: "https://www.linkedin.com/company/emphasis-engineering-services/", label: "LinkedIn" },
  { Icon: YouTube,   href: "https://youtube.com/@emphasisengineering?si=TbWfDS1Qto4tZAeg",   label: "YouTube" },
  { Icon: Instagram, href: "https://www.instagram.com/emphasis.engineering?igsh=MWpycHVlanJ1YnQ3bw==", label: "Instagram" },
  { Icon: Facebook,  href: "https://www.facebook.com/emphasisengineering",                    label: "Facebook" },
  { Icon: XIcon,     href: "https://x.com/EmphasisEngr",                                     label: "X" },
];

const INSTITUTIONS = [
  { label: "IET", fullName: "Institution of Engineering & Technology", href: "https://www.theiet.org/" },
  { label: "ICE", fullName: "Institution of Civil Engineers", href: "https://www.ice.org.uk/" },
  { label: "IMechE", fullName: "Institution of Mechanical Engineers", href: "https://www.imeche.org/" },
  { label: "NCEES", fullName: "NCEES (FE/PE Exams)", href: "https://ncees.org/" },
  { label: "PEO", fullName: "Professional Engineers Ontario", href: "https://www.peo.on.ca/" }
];


// ─── Mobile accordion group ────────────────────────────────────────────────────
const MobileGroup: FC<{ heading: string; links: { label: string; href: string }[] }> = ({ heading, links }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-white font-semibold text-sm">{heading}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden pb-4 space-y-2"
          >
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} className="text-gray-400 hover:text-primary text-sm transition-colors block py-0.5">
                  {l.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Footer ───────────────────────────────────────────────────────────────
const Footer: FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative text-white overflow-hidden"
      style={{ background: "linear-gradient(180deg, #061F33 0%, #040e18 100%)" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-teal-400/5 blur-[120px] rounded-full pointer-events-none" />


      {/* ── MAIN FOOTER BODY ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-12">

          {/* ── Brand column (2 cols) ── */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">
                  Emphasis<span className="text-primary">Engineering</span>
                </span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              The world's leading professional engineering licensure platform.
              Helping engineers worldwide achieve CEng, P.Eng, and PE status.
            </p>

            {/* Contact */}
            <ul className="space-y-3 mb-8">
              {[
                { Icon: MapPin, text: "94 Grath Crescent, Whitby, Ontario L1N 6N8, Canada" },
                { Icon: Phone, text: "+1 647-495-2703" },
                { Icon: Mail,  text: "emphasis.engineering@gmail.com" },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm text-gray-400">
                  <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            {/* Social row */}
            <div className="flex items-center gap-2">
              {SOCIAL.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg bg-white/6 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* ── Nav groups (desktop) ── */}
          <div className="hidden lg:contents">
            {NAV_GROUPS.map((group) => (
              <div key={group.heading}>
                <h4 className="text-white font-semibold text-xs uppercase tracking-[0.18em] mb-5">
                  {group.heading}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        target={l.href.startsWith('http') ? '_blank' : undefined}
                        rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-gray-400 hover:text-primary text-sm transition-colors hover:translate-x-0.5 inline-block"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Nav groups (mobile accordion) ── */}
          <div className="lg:hidden lg:col-span-4">
            {NAV_GROUPS.map((group) => (
              <MobileGroup key={group.heading} heading={group.heading} links={group.links} />
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST BADGES ── */}
      <div className="relative border-t border-white/8 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="flex items-center gap-6 w-full max-w-2xl">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
              <span className="text-gray-500 text-[11px] uppercase tracking-[0.4em] font-black whitespace-nowrap">
                Official Institutions
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
              {INSTITUTIONS.map((inst) => (
                <motion.a
                  key={inst.label}
                  href={inst.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.15)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-5 py-2 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm group transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <CheckCircle className="w-3 h-3 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-200 text-[12px] font-bold group-hover:text-primary transition-colors leading-tight">
                      {inst.label}
                    </span>
                    <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap tracking-wide uppercase">
                      {inst.fullName}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="relative border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="space-y-1">
              <p>
                © {year} Emphasis Engineering Services Ltd. All rights reserved.
              </p>
              <p className="text-[10px] text-gray-600">
                International prices are converted from CAD based on live mid-market rates. Final checkout amount may vary slightly depending on your bank's specific exchange rate.
              </p>
            </div>
            <div className="flex items-center gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Refund Policy"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;