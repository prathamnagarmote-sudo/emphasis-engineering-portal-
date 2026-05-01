"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { services } from "@/data/services";

const avatar = "https://res.cloudinary.com/dwk1cnlw2/image/upload/v1776854809/logo-original-200_eqblkl.png";

type Message = {
  text: string;
  from: "bot" | "user";
  buttons?: { label: React.ReactNode; action: () => void; isBack?: boolean }[];
};

const ChatBot = () => {
  const router = useRouter();

  const Flag = ({ url, label }: { url: string; label: string }) => (
    <span className="flex items-center gap-2">
      <img src={url} alt="flag" className="w-4 h-auto rounded-sm object-contain" />
      {label}
    </span>
  );
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      showStep("start");
    }
  }, []);

  const addBotMessage = (text: string, buttons?: { label: string; action: () => void; isBack?: boolean }[]) => {
    setMessages((prev) => [...prev, { text, from: "bot", buttons }]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { text, from: "user" }]);
  };

  // --- GUIDED FUNNEL STATE MACHINE ---
  const showStep = (step: string) => {
    switch (step) {
      case "start":
        addBotMessage("Hi 👋! I'm your Emphasis Engineering guide. What are you looking to achieve today?", [
          { label: "🛣️ Find my Licensing Pathway", action: () => { addUserMessage("Find my Licensing Pathway"); showStep("pathway"); } },
          { label: "📚 Explore Courses", action: () => { addUserMessage("Explore Courses"); showStep("courses"); } },
          { label: "🤝 1-on-1 Mentorship", action: () => { addUserMessage("1-on-1 Mentorship"); showStep("services"); } },
          { label: "❓ Ask a Question", action: () => { addUserMessage("Ask a Question"); addBotMessage("Sure! Type your question below and I'll do my best to find the answer in our FAQs."); } },
        ]);
        break;

      case "pathway":
        addBotMessage("Great! Which country are you looking to get licensed in?", [
          { label: <Flag url="https://flagcdn.com/gb.svg" label="United Kingdom (CEng)" />, action: () => { addUserMessage("United Kingdom (CEng)"); showStep("pathway_uk"); } },
          { label: <Flag url="https://flagcdn.com/us.svg" label="United States (PE)" />, action: () => { addUserMessage("United States (PE)"); showStep("pathway_us"); } },
          { label: <Flag url="https://flagcdn.com/ca.svg" label="Canada (P.Eng)" />, action: () => { addUserMessage("Canada (P.Eng)"); showStep("pathway_ca"); } },
          { label: "⬅️ Back", action: () => showStep("start"), isBack: true },
        ]);
        break;

      case "pathway_uk":
        addBotMessage("For the UK, which engineering institution are you applying through?", [
          { label: "⚙️ IMechE (Mechanical)", action: () => { addUserMessage("IMechE"); showStep("institution_imeche"); } },
          { label: "⚡ IET (Technology/Electrical)", action: () => { addUserMessage("IET"); showStep("institution_iet"); } },
          { label: "🏗️ ICE (Civil)", action: () => { addUserMessage("ICE"); showStep("institution_ice"); } },
          { label: "⬅️ Back", action: () => showStep("pathway"), isBack: true },
        ]);
        break;

      case "institution_imeche":
        addBotMessage("We have a dedicated Masterclass Course and 1-on-1 Mentorship Services to help you achieve CEng with IMechE. What would you like to see?", [
          { label: "📚 View IMechE Course", action: () => router.push("/courses/imech-101") },
          { label: "🤝 View IMechE Mentorship", action: () => router.push("/services/IMECHE") },
          { label: "⬅️ Back", action: () => showStep("pathway_uk"), isBack: true },
        ]);
        break;

      case "institution_iet":
        addBotMessage("We offer expert guidance for IET Registration. What would you like to see?", [
          { label: "📚 View IET Course", action: () => router.push("/courses/iet-101") },
          { label: "🤝 View IET Mentorship", action: () => router.push("/services/IET") },
          { label: "⬅️ Back", action: () => showStep("pathway_uk"), isBack: true },
        ]);
        break;

      case "institution_ice":
        addBotMessage("MICE / ICE registration is highly demanding. We offer comprehensive support. What would you like to see?", [
          { label: "📚 View ICE Course", action: () => router.push("/courses/ice-101") },
          { label: "🤝 View ICE Mentorship", action: () => router.push("/services/ICE") },
          { label: "⬅️ Back", action: () => showStep("pathway_uk"), isBack: true },
        ]);
        break;

      case "pathway_us":
        addBotMessage("We support UK Chartered Engineers pursuing U.S. licensure via the NCEES MRA pathway. Would you like to see how we can help?", [
          { label: "🤝 View US PE Services", action: () => router.push("/services/US%20PE") },
          { label: "❓ Read US PE FAQ", action: () => router.push("/services/US%20PE#faq") },
          { label: "⬅️ Back", action: () => showStep("pathway"), isBack: true },
        ]);
        break;

      case "pathway_ca":
        addBotMessage("For Canada, we offer comprehensive P.Eng licensure support, including CBA and NPPE preparation. What do you need?", [
          { label: "📚 View P.Eng Masterclass", action: () => router.push("/courses/peng-101") },
          { label: "🤝 View P.Eng Mentorship", action: () => router.push("/services/CANADIAN%20PEng") },
          { label: "⬅️ Back", action: () => showStep("pathway"), isBack: true },
        ]);
        break;

      case "courses":
        addBotMessage("Which engineering institution or country are you preparing for?", [
          { label: <Flag url="https://flagcdn.com/gb.svg" label="IMechE" />, action: () => router.push("/courses/imech-101") },
          { label: <Flag url="https://flagcdn.com/gb.svg" label="IET" />, action: () => router.push("/courses/iet-101") },
          { label: <Flag url="https://flagcdn.com/gb.svg" label="ICE" />, action: () => router.push("/courses/ice-101") },
          { label: <Flag url="https://flagcdn.com/ca.svg" label="Canadian P.Eng" />, action: () => router.push("/courses/peng-101") },
          { label: "⬅️ Back", action: () => showStep("start"), isBack: true },
        ]);
        break;

      case "services":
        addBotMessage("Which specific 1-on-1 mentorship service are you looking for?", [
          { label: <Flag url="https://flagcdn.com/us.svg" label="US PE MRA Support" />, action: () => router.push("/services/US%20PE") },
          { label: <Flag url="https://flagcdn.com/gb.svg" label="IMechE CEng Support" />, action: () => router.push("/services/IMECHE") },
          { label: <Flag url="https://flagcdn.com/gb.svg" label="IET CEng Support" />, action: () => router.push("/services/IET") },
          { label: <Flag url="https://flagcdn.com/gb.svg" label="ICE CEng Support" />, action: () => router.push("/services/ICE") },
          { label: <Flag url="https://flagcdn.com/ca.svg" label="Canadian P.Eng Support" />, action: () => router.push("/services/CANADIAN%20PEng") },
          { label: "⬅️ Back", action: () => showStep("start"), isBack: true },
        ]);
        break;

      default:
        showStep("start");
        break;
    }
  };

  // --- FAQ & KEYWORD FALLBACK LOGIC ---
  const searchFAQ = (query: string) => {
    query = query.toLowerCase();
    let bestMatch = null;
    let maxScore = 0;

    for (const service of services) {
      if (!service.faqs) continue;
      for (const faq of service.faqs) {
        const question = faq.question.toLowerCase();
        let score = 0;
        if (question.includes(query)) score += 5;
        query.split(" ").forEach((word) => {
          if (word.length > 2 && question.includes(word)) score += 1;
        });
        if (query.includes(service.id.toLowerCase()) || query.includes(service.title.toLowerCase())) {
          score += 3;
        }
        if (score > maxScore) {
          maxScore = score;
          bestMatch = faq;
        }
      }
    }

    if (maxScore >= 3 && bestMatch) return bestMatch.answer;
    return null;
  };

  const handleTextInput = () => {
    const text = input.trim();
    if (!text) return;
    
    addUserMessage(text);
    setInput("");

    const lowerText = text.toLowerCase();

    // Check for "start over" or "menu"
    if (lowerText.includes("start over") || lowerText.includes("menu") || lowerText === "hi" || lowerText === "hello") {
      showStep("start");
      return;
    }

    // Attempt FAQ match
    const faqAnswer = searchFAQ(text);
    if (faqAnswer) {
      addBotMessage(faqAnswer, [{ label: "Start Over", action: () => showStep("start") }]);
      return;
    }

    // Default fallback
    addBotMessage("I couldn't find an exact match for that in our FAQs. Would you like to restart the guide or contact support?", [
      { label: "🔄 Start Over", action: () => showStep("start") },
      { label: "✉️ Contact Support", action: () => router.push("/contact") },
    ]);
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-3 bg-white shadow-xl shadow-teal-500/20 px-4 py-3 rounded-full cursor-pointer z-50 border border-teal-100 hover:scale-105 transition-transform"
        >
          <img src={avatar} className="w-10 h-10 rounded-full shadow-sm" alt="chat" />
          <span className="text-sm font-semibold text-gray-800 pr-2">Guide me</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </motion.div>
      )}

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[90vw] bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200"
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#061F33] to-teal-800 text-white p-4 flex justify-between items-center shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={avatar} className="w-10 h-10 rounded-full border-2 border-white/20 bg-white" alt="bot" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#061F33]" />
                </div>
                <div>
                  <div className="font-semibold text-sm leading-tight">Emphasis Guide</div>
                  <div className="text-xs text-white/70">Online • Ready to help</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>

            {/* MESSAGES */}
            <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.from === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2 shrink-0 border border-teal-200">
                      <Bot className="w-4 h-4 text-teal-600" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.from === "user"
                          ? "bg-teal-600 text-white rounded-tr-sm"
                          : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                      }`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {msg.text}
                    </div>

                    {msg.buttons && (
                      <div className="flex flex-col gap-2 mt-3 w-full">
                        {msg.buttons.map((btn, i) => (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            key={i}
                            onClick={btn.action}
                            className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 ${
                              btn.isBack 
                                ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                                : "bg-white text-teal-700 border border-teal-100 hover:border-teal-300 hover:shadow-md"
                            }`}
                          >
                            {btn.label}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* INPUT */}
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextInput()}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm"
              />
              <button
                onClick={handleTextInput}
                disabled={!input.trim()}
                className="bg-teal-600 disabled:bg-gray-300 text-white w-10 rounded-xl flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
