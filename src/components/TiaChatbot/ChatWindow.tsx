import { useState, useEffect, useRef } from "react";
import { Send, Trash2, X, RefreshCw, Sparkles } from "lucide-react";
import MessageItem, { Message } from "./MessageItem";
import LeadCaptureForm from "./LeadCaptureForm";
import { getActiveProvider, detectBuyingIntent } from "@/services/aiProvider";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  onClose: () => void;
}

const LOCAL_STORAGE_KEY = "tia_ai_chat_history";

const WELCOME_MESSAGE: Message = {
  role: "model",
  content: `👋 Welcome to TIA Software Solutions!

I'm TIA AI.

I can help you with:
• Website Development
• Mobile App Development
• Digital Marketing
• SEO
• Branding
• UI/UX Design
• AI Automation

How can I help you today?`,
};

const SUGGESTED_PROMPTS = [
  "I need a website",
  "Website pricing",
  "SEO services",
  "Mobile app development",
  "Branding",
  "Book a consultation",
  "Contact your team",
];

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([WELCOME_MESSAGE]);
      }
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
  }, []);

  // Save messages to local storage
  const saveMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMsgs));
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showLeadForm]);

  const handleClearChat = () => {
    saveMessages([WELCOME_MESSAGE]);
    setShowLeadForm(false);
    setIsTyping(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    saveMessages(updatedMessages);
    setInputValue("");

    // Check for buying intent or lead request
    if (detectBuyingIntent(text)) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setShowLeadForm(true);
      }, 1000);
      return;
    }

    // Call AI provider
    setIsTyping(true);
    const provider = getActiveProvider();

    // Add empty placeholder for streaming message
    const botPlaceholderMsg: Message = { role: "model", content: "" };
    const messagesWithPlaceholder = [...updatedMessages, botPlaceholderMsg];
    setMessages(messagesWithPlaceholder);

    let streamText = "";

    try {
      await provider.streamChat(updatedMessages, {
        onChunk: (chunk) => {
          streamText += chunk;
          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0) {
              next[next.length - 1] = { role: "model", content: streamText };
            }
            return next;
          });
        },
        onFinish: (fullText) => {
          setIsTyping(false);
          const finalMessages = [...updatedMessages, { role: "model", content: fullText }];
          saveMessages(finalMessages);
        },
        onError: (err) => {
          console.error("AI Error:", err);
          setIsTyping(false);
          const errorMsg = {
            role: "model" as const,
            content: "Sorry, I ran into an issue connecting to my brain. Please contact our team at sales@tiasoftwaresolutions.com or +44 7451 255217 for assistance!",
          };
          saveMessages([...updatedMessages, errorMsg]);
        },
      });
    } catch (e) {
      setIsTyping(false);
      console.error(e);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-[92vw] sm:w-[400px] h-[600px] max-h-[80vh] rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden z-50 animate-scale-up">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/95 to-primary/80 text-primary-foreground flex items-center justify-between shadow-sm select-none">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-primary animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight flex items-center gap-1">
              TIA AI <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-medium">Agent</span>
            </h3>
            <span className="text-[10px] text-white/80 flex items-center gap-1">
              Online • Sales Assistant
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="w-7 h-7 rounded-md hover:bg-white/15 flex items-center justify-center text-white/90 hover:text-white transition-colors"
            title="Restart conversation"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md hover:bg-white/15 flex items-center justify-center text-white/90 hover:text-white transition-colors"
            title="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin flex flex-col bg-background/50"
      >
        {messages.map((msg, index) => (
          <MessageItem key={index} message={msg} />
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-[85%] self-start animate-pulse mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              <Sparkles size={14} />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-card border border-border text-foreground rounded-tl-sm shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-75" />
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}

        {showLeadForm && (
          <LeadCaptureForm
            onSubmitSuccess={() => {
              setShowLeadForm(false);
              saveMessages([
                ...messages,
                {
                  role: "model",
                  content: "Thanks for submitting your request! An expert from our team will contact you very soon. What else can I help you with?",
                },
              ]);
            }}
            onCancel={() => setShowLeadForm(false)}
          />
        )}
      </div>

      {/* Suggested Chips */}
      {!showLeadForm && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto whitespace-nowrap bg-background/20 border-t border-border/40 select-none scrollbar-none">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80 px-2.5 py-1 rounded-full transition-all duration-200 shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 border-t border-border bg-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            disabled={showLeadForm}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 min-w-0 bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow disabled:opacity-50"
            placeholder={showLeadForm ? "Please complete the form..." : "Ask TIA AI..."}
            maxLength={500}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping || showLeadForm}
            size="icon"
            className="w-8 h-8 rounded-xl shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm transition-transform duration-200"
          >
            <Send size={12} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
