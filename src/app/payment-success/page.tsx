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

  useEffect(() => {
    const init = async () => {
      try {
        await update();
        if (hasService) {
          const res = await fetch('/api/services/booking');
          const data = await res.json();
          const latestPending = data.find((b: any) => b.status === 'pending' && !b.formData?.name);
          setPendingBooking(latestPending);
        }
      } catch (e) {
        console.error("Initialization error", e);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [hasService, update]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 ${pendingBooking ? 'max-w-3xl' : 'max-w-md text-center'}`}
      >
        {!pendingBooking && (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        )}

        <h1 className="font-display text-3xl font-bold text-secondary mb-4">
          Payment Successful!
        </h1>
        <p className={`text-gray-600 mb-8 ${pendingBooking ? 'text-left' : ''}`}>
          {pendingBooking 
            ? "Your payment was successful. Please fill in the details below to schedule your session."
            : "Thank you for your purchase. Your order has been processed and your content is now unlocked."
          }
        </p>

        {hasService ? (
          <div className="space-y-6">
            {pendingBooking ? (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary">Schedule {pendingBooking.serviceTitle}</h3>
                    <p className="text-xs text-gray-500">Provide your details to get started</p>
                  </div>
                </div>
                
                <ServiceIntakeForm 
                  bookingId={pendingBooking._id} 
                  serviceTitle={pendingBooking.serviceTitle}
                  onSuccess={() => setPendingBooking(null)}
                />
              </div>
            ) : (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-green-800">Booking Confirmed</h3>
                </div>
                <p className="text-sm text-green-700 leading-relaxed">
                  Our instructor will contact you via WhatsApp/Email within 24 hours to provide your custom meeting link.
                </p>
                <Link href="/dashboard" className="block mt-6">
                  <Button className="w-full" variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            )}
            {pendingBooking && (
              <Link href="/dashboard" className="block text-sm text-gray-500 hover:text-primary transition-colors text-center">
                Skip for now and schedule from Dashboard
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Link href="/dashboard">
              <Button className="w-full">
                Go to My Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <p className="text-xs text-gray-400">
              You will be redirected automatically in a few seconds...
            </p>
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
