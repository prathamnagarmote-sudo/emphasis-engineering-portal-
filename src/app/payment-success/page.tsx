"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Calendar, ArrowRight, Loader2, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import ServiceIntakeForm from "@/components/forms/ServiceIntakeForm";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const hasService = searchParams.get("has_service") === "true";
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 15; // 30 seconds total

    const checkBooking = async () => {
      try {
        attempts++;
        // Refresh session to get latest purchased content
        await update();

        if (hasService) {
          const res = await fetch('/api/services/booking');
          if (res.ok) {
            const data = await res.json();
            const latestPending = data.find((b: any) => b.status === 'pending' && !b.formData?.name);
            
            if (latestPending) {
              setPendingBooking(latestPending);
              setLoading(false);
              return true; // Stop polling
            }
          }
        } else {
          setLoading(false);
          return true; // Not a service, stop polling
        }
      } catch (e) {
        console.error("Polling error", e);
      }
      
      if (attempts >= maxAttempts) {
        setLoading(false);
        return true;
      }
      return false;
    };

    const startPolling = async () => {
      const found = await checkBooking();
      if (!found && hasService) {
        interval = setInterval(async () => {
          const done = await checkBooking();
          if (done) clearInterval(interval);
        }, 2000);
      }
    };

    startPolling();

    // Auto-redirect for non-service items only
    if (!hasService) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 5000);
      return () => {
        if (interval) clearInterval(interval);
        clearTimeout(timer);
      };
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hasService, update, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Setting up your experience...</h2>
        <p className="text-gray-500 mt-2">Just a moment while we process your access.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full bg-white rounded-[40px] shadow-2xl p-8 md:p-12 relative z-10 ${pendingBooking ? 'max-w-3xl' : 'max-w-xl text-center'}`}
      >
        {!pendingBooking && (
          <div className="relative mb-10 inline-block">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto relative z-10"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.5 }}
              className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl"
            />
          </div>
        )}

        <h1 className="font-display text-4xl font-black text-[#061F33] mb-4">
          {hasService ? "Payment Confirmed!" : "Purchase Successful!"}
        </h1>
        <p className={`text-gray-500 text-lg mb-10 leading-relaxed font-medium ${hasService ? 'text-left' : 'max-w-md mx-auto'}`}>
          {hasService 
            ? "Success! You've taken a significant step toward a thriving engineering career. Let's get your expert consultation scheduled to map out your path forward."
            : "Thank you for choosing Emphasis Engineering. Your materials are now unlocked and ready in your dashboard."
          }
        </p>

        {hasService ? (
          <div className="space-y-8">
            {pendingBooking ? (
              <div className="space-y-8">
                {!showForm ? (
                  <div className="space-y-6">
                  <div className="bg-primary/5 border border-primary/10 rounded-[32px] p-8 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">Ready to start?</h3>
                    <p className="text-sm text-gray-500 font-medium mb-6">
                      Schedule your meeting now to kickstart your journey, or handle it later from your dashboard.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button 
                        onClick={() => setShowForm(true)}
                        className="w-full py-4 text-sm"
                        variant="primary"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Now
                      </Button>
                      <Button 
                        onClick={() => router.push("/dashboard")}
                        variant="ghost"
                        className="w-full py-4 text-sm border-2 border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-700 shadow-none bg-white"
                      >
                        Schedule Later
                      </Button>
                    </div>
                  </div>
                    
                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" />
                      Scheduling takes less than 2 minutes
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-6 md:p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Calendar className="w-7 h-7 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-secondary">Schedule {pendingBooking.serviceTitle}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Final Step: Provide details</p>
                      </div>
                    </div>
                    
                    <ServiceIntakeForm 
                      bookingId={pendingBooking._id} 
                      serviceTitle={pendingBooking.serviceTitle}
                      onSuccess={() => setPendingBooking(null)}
                    />
                  </div>
                )}
              </div>
            ) : hasService ? (
              <div className="bg-white border border-gray-100 rounded-[32px] p-12 text-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-secondary mb-2">Finalizing your purchase...</h3>
                <p className="text-sm text-gray-400">Please wait while we set up your service booking. This usually takes a few seconds.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 text-xs font-bold text-primary hover:underline uppercase tracking-widest"
                >
                  Refresh Page
                </button>
              </div>
            ) : (
              <div className="bg-green-50/50 border border-green-100 rounded-[32px] p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-green-900 mb-4">Booking Scheduled!</h3>
                <p className="text-green-700 font-medium leading-relaxed max-w-md mx-auto mb-10">
                  We've received your details. Our lead instructor will review them and reach out within 24 hours with your personal meeting link.
                </p>
                <Link href="/dashboard" className="block">
                  <Button className="w-full py-4 text-base" variant="primary">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <Link href="/dashboard">
              <Button className="w-full py-4 text-base shadow-2xl shadow-primary/25">
                Go to My Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <Loader2 className="w-4 h-4 animate-spin text-primary" /> Redirecting in 5s...
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
