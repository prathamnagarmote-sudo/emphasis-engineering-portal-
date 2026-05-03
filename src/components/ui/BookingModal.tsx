"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingLink: string;
  serviceTitle: string;
}

export default function BookingModal({ isOpen, onClose, bookingLink, serviceTitle }: BookingModalProps) {
  const [loading, setLoading] = useState(true);

  // Clean the link (ensure it has https://cal.com/ prefix)
  const finalLink = bookingLink.startsWith("http") 
    ? bookingLink 
    : `https://cal.com/${bookingLink}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Schedule Your Session</h3>
                <p className="text-sm text-gray-500 font-medium">{serviceTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content / Iframe */}
            <div className="flex-1 relative bg-gray-50">
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white z-10">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-gray-500 font-medium animate-pulse">Loading Scheduler...</p>
                </div>
              )}
              
              <iframe
                src={`${finalLink}?embed=true`}
                width="100%"
                height="100%"
                frameBorder="0"
                onLoad={() => setLoading(false)}
                className="w-full h-full"
                allowFullScreen
              />
            </div>

            {/* Footer Note */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center shrink-0">
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                Powered by Cal.com & Emphasis Engineering
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
