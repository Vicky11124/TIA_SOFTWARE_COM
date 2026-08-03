import { useState, useEffect, useRef } from "react";
import { Send, RefreshCw, X, Sparkles } from "lucide-react";
import MessageItem, { Message } from "./MessageItem";
import ProgressIndicator from "./ProgressIndicator";
import ProjectSummaryCard from "./ProjectSummaryCard";
import ContactFormInline from "./ContactFormInline";
import { getActiveProvider, LeadState, ChatJSONResponse } from "@/services/aiProvider";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  onClose: () => void;
}

const LOCAL_STORAGE_KEY = "tia_ai_chat_history";

const WELCOME_MESSAGE: Message = {
  role: "model",
  content: `👋 Welcome to TIA Software Solutions!

I'm TIA AI, your digital project consultant. 

I can help you design, build, and scale:
• Websites & E-commerce Stores
• Mobile Applications
• Digital SEO & Marketing Ads
• Branding & custom AI integrations

Are you planning to build a new Website, develop an App, or start marketing your business?`,
};

const SUGGESTED_PROMPTS = [
  "I need a Website",
  "I want a Mobile App",
  "Digital Marketing & SEO",
  "Branding & Logo Design",
];

const INITIAL_LEAD_STATE: LeadState = {
  service: null,
  businessType: null,
  pages: null,
  features: [],
  budget: null,
  timeline: null,
};

const parsePartialJSON = (jsonStr: string) => {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && typeof parsed === "object") {
      return {
        response: parsed.assistant_response || "",
        state: parsed.lead_state || null,
        score: typeof parsed.lead_score === "number" ? parsed.lead_score : null,
      };
    }
  } catch (e) {
    // Continue to partial parse
  }

  let response = "";
  // Match "assistant_response": "..."
  const match = jsonStr.match(/"assistant_response"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
  if (match) {
    response = match[1];
  } else {
    // If not closed yet, match what's currently in progress
    const partialMatch = jsonStr.match(/"assistant_response"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)$/);
    if (partialMatch) {
      response = partialMatch[1];
    }
  }

  // Unescape common JSON escapes
  response = response
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");

  return { response, state: null, score: null };
};

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Conversational Lead capture states
  const [leadState, setLeadState] = useState<LeadState>(INITIAL_LEAD_STATE);
  const [leadScore, setLeadScore] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Hydrate states on mount
  useEffect(() => {
    const savedMsgs = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedMsgs) {
      try {
        setMessages(JSON.parse(savedMsgs));
      } catch (e) {
        setMessages([WELCOME_MESSAGE]);
      }
    } else {
      setMessages([WELCOME_MESSAGE]);
    }

    const savedState = localStorage.getItem("tia_lead_state");
    if (savedState) {
      try {
        setLeadState(JSON.parse(savedState));
      } catch (e) {}
    }

    const savedScore = localStorage.getItem("tia_lead_score");
    if (savedScore) {
      const score = Number(savedScore) || 0;
      setLeadScore(score);
      if (score >= 100) {
        setShowContactForm(true);
      }
    }
  }, []);

  const saveMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMsgs));
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showContactForm]);

  const handleClearChat = () => {
    saveMessages([WELCOME_MESSAGE]);
    setLeadState(INITIAL_LEAD_STATE);
    setLeadScore(0);
    setShowContactForm(false);
    localStorage.removeItem("tia_lead_state");
    localStorage.removeItem("tia_lead_score");
    setIsTyping(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    saveMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    const provider = getActiveProvider();
    
    // Add placeholder message for bot stream
    const botPlaceholderMsg: Message = { role: "model", content: "" };
    setMessages([...updatedMessages, botPlaceholderMsg]);

    let streamText = "";

    try {
      await provider.streamChat(updatedMessages, leadState, {
        onChunk: (chunk) => {
          streamText += chunk;
          const parsed = parsePartialJSON(streamText);
          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0) {
              next[next.length - 1] = { role: "model", content: parsed.response };
            }
            return next;
          });
        },
        onFinish: (result: ChatJSONResponse) => {
          setIsTyping(false);

          // Save conversational output
          const finalMessages = [
            ...updatedMessages,
            { role: "model", content: result.assistant_response },
          ];
          saveMessages(finalMessages);

          // Update Lead State & Score
          setLeadState(result.lead_state);
          setLeadScore(result.lead_score);
          
          localStorage.setItem("tia_lead_state", JSON.stringify(result.lead_state));
          localStorage.setItem("tia_lead_score", String(result.lead_score));

          if (result.lead_score >= 100) {
            setShowContactForm(true);
          }
        },
        onError: (err) => {
          console.error("Gemini stream error", err);
          setIsTyping(false);
          
          // Revert template on error
          const errorMsg: Message = {
            role: "model",
            content: "Sorry, I ran into a connection issue. Please contact our sales team at sales@tiasoftwaresolutions.com or call +44 7451 255217!",
          };
          saveMessages([...updatedMessages, errorMsg]);
        },
      });
    } catch (e) {
      setIsTyping(false);
      console.error(e);
    }
  };

  const handleContactSuccess = (name: string, email: string, phone: string) => {
    setShowContactForm(false);
    
    // Increment leadScore slightly beyond 100 to flag complete
    setLeadScore(105);
    localStorage.setItem("tia_lead_score", "105");

    const finalModelResponse: Message = {
      role: "model",
      content: `Thanks ${name}! 🎉 

Your quotation inquiry has been successfully sent to our expert developers. We will prepare your custom proposal and contact you at **${email}** (or **${phone || "phone"}**) within 24 hours.

If you have any other questions in the meantime, feel free to ask!`,
    };
    saveMessages([...messages, finalModelResponse]);
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
              TIA AI <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-medium">Consultant</span>
            </h3>
            <span className="text-[10px] text-white/80 flex items-center gap-1">
              Online • 24/7 Digital Advisor
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

      {/* Progress Phase Header */}
      <ProgressIndicator score={leadScore} />

      {/* Message Stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin flex flex-col bg-background/50"
      >
        {/* Project Profile Summary rendered at the top of messages so it scrolls naturally */}
        {leadScore > 0 && (
          <ProjectSummaryCard leadState={leadState} />
        )}

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

        {showContactForm && (
          <ContactFormInline
            leadState={leadState}
            onSubmitSuccess={handleContactSuccess}
          />
        )}
      </div>

      {/* Suggestion Prompt Chips */}
      {!showContactForm && (
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

      {/* Footer Input Bar */}
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
            disabled={showContactForm}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 min-w-0 bg-background border border-border rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow disabled:opacity-50"
            placeholder={showContactForm ? "Submit form to continue..." : "Ask TIA AI..."}
            maxLength={400}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping || showContactForm}
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
