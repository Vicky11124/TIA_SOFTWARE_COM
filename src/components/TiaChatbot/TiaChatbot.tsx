import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ChatWindow from "./ChatWindow";

const TiaChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Exclude admin pages from rendering the chatbot
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg text-primary-foreground hover:scale-110 active:scale-95 transition-transform duration-300"
        aria-label="Toggle TIA AI Chatbot"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
      >
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <MessageCircle size={24} className="animate-spin-slow text-white" />
          ) : (
            <Sparkles size={24} className="text-white animate-pulse" />
          )}
          {/* Notification badge / Pulse dot */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-white" />
          )}
        </div>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="z-50"
          >
            <ChatWindow onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TiaChatbot;
