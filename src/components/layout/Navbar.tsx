"use client";

import { FC, useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, ChevronDown, LogOut, LayoutDashboard, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { services } from "@/data/services";
import { useSession, signOut } from "next-auth/react";
import { useCurrency, CURRENCIES, CurrencyCode } from "@/context/CurrencyContext";

// ─── Currency Switcher ─────────────────────────────────────────────────────────
const CurrencySwitcher = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.03)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all border border-gray-100 bg-white shadow-sm hover:shadow-md"
      >
        <img src={currency.flag} alt={currency.code} className="w-5 h-auto rounded-sm object-contain" loading="eager" />
        <span className="text-xs font-extrabold text-secondary tracking-tight">{currency.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-transparent" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 12, scale: 0.95, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute right-0 top-full mt-3 w-44 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-2 border border-gray-100 z-[101] overflow-hidden"
            >
              <div className="px-4 py-2 mb-1 border-b border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Currency</span>
                <span className="flex items-center gap-1 text-[9px] text-green-500 font-bold bg-green-50 px-1.5 py-0.5 rounded-full">
                  <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                  Live Rates
                </span>
              </div>
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-all group ${
                    currency.code === code ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={CURRENCIES[code].flag} alt={code} className="w-5 h-auto rounded-sm object-contain group-hover:scale-110 transition-transform duration-300" loading="eager" />
                    <span>{CURRENCIES[code].label}</span>
                  </div>
                  {currency.code === code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Auth Dropdown ─────────────────────────────────────────────────────────────
const AuthSection = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full flex-shrink-0" />;
  }

  if (session && session.user) {
    const initials = session.user.name
      ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
      : "U";
    const firstName = (session.user.name?.split(" ")[0] || "User").slice(0, 10);

    return (
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 hover:bg-gray-50 rounded-full p-1 pr-2 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <span className="hidden xl:block text-sm font-semibold text-gray-700 max-w-[80px] truncate">
            {firstName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100 mb-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{session.user.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{session.user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Link
        href="/login"
        className="hidden sm:flex px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className="hidden sm:flex px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-all shadow-sm"
      >
        Sign Up
      </Link>
    </div>
  );
};

// ─── Navbar ────────────────────────────────────────────────────────────────────
const Navbar: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Practice Tests", path: "/practice-tests" },
    { name: "Services", path: "/services" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775721626/logo-nobackground-500_prbht7.png"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="hidden xl:block font-display text-lg font-bold text-secondary leading-none">
                Emphasis<span className="text-primary">Engineering</span>
              </span>
            </Link>
            <div className="w-6 h-6" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-gray-200 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-md py-3" : "bg-white/80 py-4"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* ── Logo (never shrinks) */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775721626/logo-nobackground-500_prbht7.png"
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="hidden xl:block font-display text-lg font-bold text-secondary leading-none whitespace-nowrap">
              Emphasis<span className="text-primary">Engineering</span>
            </span>
          </Link>

          {/* ── Desktop Navigation (centered, takes available space) */}
          <div className="hidden lg:flex items-center gap-5 flex-1 justify-center">
            {navLinks.map((link) =>
              link.name === "Services" ? (
                <div key="services" className="relative">
                  <button
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                    className="flex items-center gap-1 text-gray-700 hover:text-primary text-sm font-medium transition-all whitespace-nowrap"
                  >
                    Services
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        isServicesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" as any }}
                        onMouseEnter={() => setIsServicesOpen(true)}
                        onMouseLeave={() => setIsServicesOpen(false)}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 border border-gray-100 backdrop-blur-md"
                      >
                        <Link
                          href="/services"
                          className="block px-4 py-2 text-gray-700 hover:bg-primary/5 hover:text-primary font-medium text-sm"
                        >
                          All Services
                        </Link>
                        <div className="h-px bg-gray-100 my-2" />
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.id}`}
                            className="block px-4 py-2 text-gray-600 hover:bg-primary/5 hover:text-primary text-sm"
                          >
                            {service.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative text-sm font-medium transition-all whitespace-nowrap ${
                    pathname === link.path ? "text-primary" : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {link.name}
                  {pathname === link.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              )
            )}
          </div>

          {/* ── Right Side (never shrinks) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Currency Switcher */}
            <CurrencySwitcher />

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* Auth */}
            <AuthSection />

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" as any }}
              className="lg:hidden mt-3 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="py-3 px-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.path
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-2 border-t border-gray-100 mt-2 flex gap-2 px-1">
                  <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/signup" className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors">
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
