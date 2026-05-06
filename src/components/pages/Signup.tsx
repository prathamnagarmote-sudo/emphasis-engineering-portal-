"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User, AlertCircle, Loader2, CheckCircle, Star, Users, Award, ShieldCheck } from "lucide-react";

// ─── Shared UI pieces ──────────────────────────────────────────────────────────
const HeroOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
      className="absolute -top-20 right-0 w-80 h-80 bg-teal-400/25 rounded-full blur-[80px]" />
    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 1.5 }}
      className="absolute bottom-0 -left-20 w-96 h-96 bg-primary/25 rounded-full blur-[100px]" />
    <div className="absolute inset-0 opacity-[0.04]"
      style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
  </div>
);

const StatCard = ({ icon: Icon, value, label, delay }: { icon: any; value: string; label: string; delay: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6 }}
    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3"
  >
    <div className="w-9 h-9 rounded-xl bg-primary/30 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-teal-300" />
    </div>
    <div>
      <div className="text-white font-bold text-lg leading-none">{value}</div>
      <div className="text-white/60 text-xs mt-0.5">{label}</div>
    </div>
  </motion.div>
);

const Benefit = ({ text, delay }: { text: string; delay: number }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.5 }} className="flex items-center gap-3">
    <CheckCircle className="w-4 h-4 text-teal-300 shrink-0" />
    <span className="text-white/70 text-sm">{text}</span>
  </motion.div>
);

const GoogleButton = ({ label }: { label: string }) => (
  <motion.button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} whileTap={{ scale: 0.98 }}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    {label} with Google
  </motion.button>
);

// ─── OTP Step ──────────────────────────────────────────────────────────────────
const OtpStep = ({ email, onVerified, onBack }: { email: string; onVerified: () => void; onBack: () => void }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp]; newOtp[index] = value; setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }
    setIsLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Invalid OTP"); setIsLoading(false); return; }
      onVerified();
    } catch { setError("Verification failed"); setIsLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    await fetch("/api/auth/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    setResending(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Check your email</h3>
        <p className="text-gray-500 text-sm mt-2">We sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span></p>
      </div>
      <div className="flex gap-2 justify-center mb-6">
        {otp.map((digit, i) => (
          <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-11 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      <motion.button onClick={handleVerify} disabled={isLoading}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-sm"
      >
        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : <>Verify & Create Account <ArrowRight className="w-4 h-4" /></>}
      </motion.button>
      <div className="flex items-center justify-between mt-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">← Go back</button>
        <button onClick={handleResend} disabled={resending} className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors">
          {resending ? "Sending..." : "Resend code"}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Signup ────────────────────────────────────────────────────────────────────
const Signup = () => {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } } };
  const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed."); setIsLoading(false); return; }

      // Try to send OTP - falls back to direct sign-in if not configured
      try {
        const otpRes = await fetch("/api/auth/send-otp", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.email }),
        });
        if (otpRes.ok) { setStep("otp"); setIsLoading(false); return; }
      } catch { /* OTP not configured */ }

      // Direct sign-in fallback
      await signIn("credentials", { email: formData.email, password: formData.password, redirect: false });
      router.push("/dashboard"); router.refresh();
    } catch { setError("An unexpected error occurred"); }
    setIsLoading(false);
  };

  const handleOtpVerified = async () => {
    const res = await signIn("credentials", { email: formData.email, password: formData.password, redirect: false });
    if (!res?.error) { router.push("/dashboard"); router.refresh(); }
  };

  return (
    <div className="min-h-screen flex pt-16">
      {/* LEFT */}
      <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-col justify-between w-[55%] bg-gradient-to-br from-[#061F33] via-[#0a2d4a] to-[#061F33] p-12 relative overflow-hidden"
      >
        <HeroOrbs />
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3">
            <img src="https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775721626/logo-nobackground-500_prbht7.png" alt="Logo" className="h-12 w-auto" />
            <span className="text-white font-bold text-xl">Emphasis<span className="text-primary">Engineering</span></span>
          </motion.div>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-6"
            >
              <Star className="w-4 h-4 fill-primary" /> Trusted by 2,000+ Engineers
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
              className="text-4xl xl:text-5xl font-bold text-white leading-tight"
            >
              Start Your Journey to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-300">P.Eng Success</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
              className="text-white/60 text-lg mt-4 max-w-md leading-relaxed"
            >
              Create your free account and unlock access to practice tests, expert coaching, and everything you need to pass the NPPE.
            </motion.p>
          </div>
          <div className="space-y-3">
            <Benefit text="2,000+ NPPE practice questions with full explanations" delay={0.9} />
            <Benefit text="Expert-led courses mapped to the NPPE syllabus" delay={1.0} />
            <Benefit text="1-on-1 coaching from licensed P.Eng mentors" delay={1.1} />
            <Benefit text="Track your progress and identify weak areas" delay={1.2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Users} value="2,000+" label="Engineers supported" delay={0.9} />
            <StatCard icon={Award} value="100%" label="Pass rate" delay={1.4} />
          </div>
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="relative z-10 text-white/30 text-sm">
          © 2025 Emphasis Engineering. All rights reserved.
        </motion.p>
      </motion.div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-gray-50">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === "form" ? (
              <motion.div key="form" variants={container} initial="hidden" animate="show" exit={{ opacity: 0, x: -30 }}>
                <motion.div variants={item} className="flex items-center gap-2 mb-8 lg:hidden">
                  <img src="https://res.cloudinary.com/dwk1cnlw2/image/upload/v1775721626/logo-nobackground-500_prbht7.png" alt="Logo" className="h-9 w-auto" />
                  <span className="font-bold text-gray-900">Emphasis<span className="text-primary">Engineering</span></span>
                </motion.div>

                <motion.div variants={item}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">Create account</h2>
                  <p className="text-gray-500 text-sm">Start your free trial today - no credit card required</p>
                </motion.div>

                <motion.div variants={item} className="mt-8"><GoogleButton label="Sign up" /></motion.div>

                <motion.div variants={item} className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">or sign up with email</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div variants={item}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-sm"
                        placeholder="John Doe" required />
                    </div>
                  </motion.div>

                  <motion.div variants={item}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-sm"
                        placeholder="you@example.com" required />
                    </div>
                  </motion.div>

                  <motion.div variants={item}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none text-sm"
                        placeholder="Min. 6 characters" required minLength={6} />
                    </div>
                  </motion.div>

                  <motion.div variants={item}>
                    <motion.button type="submit" disabled={isLoading}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-sm"
                    >
                      {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : <>Create Free Account <ArrowRight className="w-4 h-4" /></>}
                    </motion.button>
                  </motion.div>
                </form>

                <motion.p variants={item} className="text-center text-xs text-gray-400 mt-4">
                  By signing up you agree to our <Link href="/terms-of-service" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                </motion.p>
                <motion.p variants={item} className="text-center text-sm text-gray-500 mt-5">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">Sign in →</Link>
                </motion.p>
              </motion.div>
            ) : (
              <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <OtpStep email={formData.email} onVerified={handleOtpVerified} onBack={() => setStep("form")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Signup;
