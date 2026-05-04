"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Calendar, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const hasService = searchParams.get("has_service") === "true";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no session ID, redirect to dashboard after a delay
    if (!sessionId) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
    setLoading(false);
  }, [sessionId, router]);

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
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="font-display text-3xl font-bold text-secondary mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been processed and your content is now unlocked.
        </p>

        {hasService ? (
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-secondary">Schedule Your Meeting</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                You've purchased a service package. The next step is to schedule a meeting with our experts via Cal.com.
              </p>
              <a 
                href="https://cal.com/emphasis-engineering-cbfkch/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button className="w-full">
                  Schedule on Cal.com
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
            <Link href="/dashboard" className="block text-sm text-gray-500 hover:text-primary transition-colors">
              Go to Dashboard instead
            </Link>
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
