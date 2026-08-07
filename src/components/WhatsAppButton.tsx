import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const WhatsAppButton = () => {
  const { whatsappLink } = useSiteSettings();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleOpened = () => setIsHidden(true);
    const handleClosed = () => setIsHidden(false);

    window.addEventListener("tia-chatbot-opened", handleOpened);
    window.addEventListener("tia-chatbot-closed", handleClosed);

    return () => {
      window.removeEventListener("tia-chatbot-opened", handleOpened);
      window.removeEventListener("tia-chatbot-closed", handleClosed);
    };
  }, []);

  if (isHidden) return null;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-6 sm:bottom-10 sm:right-8 z-50 w-14 h-14 rounded-full bg-[hsl(142_70%_45%)] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-300"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} className="text-white" />
    </a>
  );
};

export default WhatsAppButton;
