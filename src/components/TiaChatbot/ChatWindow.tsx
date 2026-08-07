import { useState, useEffect, useRef } from "react";
import { Send, RefreshCw, X, Sparkles } from "lucide-react";
import MessageItem, { Message } from "./MessageItem";
import ProgressIndicator from "./ProgressIndicator";
import ProjectSummaryCard from "./ProjectSummaryCard";
import ContactFormInline from "./ContactFormInline";
import ProjectConsultationReport from "./ProjectConsultationReport";
import { getActiveProvider, LeadState, ChatJSONResponse, sanitizeLeadState, detectLocalIntent, getLocalResponse, buildReportData, getFallbackExplanations, ReportData, ReportExplanations, COUNTRY_CONFIG, extractCountryFromText } from "@/services/aiProvider";
import { Button } from "@/components/ui/button";
import tiaBotIcon from "@/assets/tia-bot.png";

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
  country: null,
  service: null,
  businessType: null,
  pages: null,
  features: [],
  budget: null,
  timeline: null,
};

const calculateLeadScore = (state: LeadState): number => {
  let score = 0;
  if (state.service) score += 20;
  if (state.businessType) score += 20;
  if (state.pages) score += 20;
  if (state.country) score += 5;
  if (state.budget) score += 15;
  if (state.timeline) score += 20;
  return score;
};

const getNextRequiredField = (state: LeadState): string | null => {
  if (!state.service) return "service";
  if (!state.businessType) return "businessType";
  if (!state.pages) return "pages";
  if (!state.budget) return "budget";
  if (!state.timeline) return "timeline";
  if (!state.country) return "country";
  return null;
};

const wordToNumber: { [key: string]: string } = {
  one: "1", two: "2", three: "3", four: "4", five: "5",
  six: "6", seven: "7", eight: "8", nine: "9", ten: "10"
};

export const tryDirectReactExtraction = (
  text: string,
  activeField: string | null,
  leadState: LeadState
): Partial<LeadState> | null => {
  if (!activeField) return null;
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  const updates: Partial<LeadState> = {};

  // Always check for location mentions in text
  const detectedCountry = extractCountryFromText(text);
  if (detectedCountry && !leadState.country) {
    updates.country = detectedCountry;
  }

  if (activeField === "country") {
    if (detectedCountry) {
      updates.country = detectedCountry;
      return updates;
    }
    return null;
  }

  // If the user's input is too long/conversational (e.g., > 6 words), let LLM extract it
  const words = trimmed.split(/\s+/);
  if (words.length > 6) {
    return Object.keys(updates).length > 0 ? updates : null;
  }

  // Resolve word numbers to digits in lower string
  let resolvedText = lower;
  Object.entries(wordToNumber).forEach(([word, num]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    resolvedText = resolvedText.replace(regex, num);
  });

  if (activeField === "service") {
    if (lower.includes("website") || lower.includes("site") || lower.includes("web app")) {
      updates.service = "Website";
    } else if (lower.includes("app") || lower.includes("mobile")) {
      updates.service = "Mobile App";
    } else if (lower.includes("marketing") || lower.includes("seo")) {
      updates.service = "Digital Marketing";
    } else if (lower.includes("brand") || lower.includes("logo")) {
      updates.service = "Branding";
    } else if (lower.includes("design") || lower.includes("ui") || lower.includes("ux")) {
      updates.service = "UI/UX Design";
    } else if (lower.includes("automation") || lower.includes("ai")) {
      updates.service = "AI Automation";
    }
  }

  if (activeField === "pages") {
    const numMatch = resolvedText.match(/\b\d+\b/);
    if (numMatch) {
      updates.pages = `${numMatch[0]} pages`;
    }
  }

  if (activeField === "budget") {
    const c = updates.country || leadState.country || "UK";
    const config = COUNTRY_CONFIG[c];
    const sym = config.symbol;

    if (lower.includes("basic") || lower.includes("199") || lower.includes("249") || lower.includes("349")) {
      updates.budget = `Basic Plan (${sym}${c === 'UK' ? '199.99' : c === 'US' ? '249.99' : '349.99'}/mo)`;
    } else if (lower.includes("standard") || lower.includes("399") || lower.includes("499") || lower.includes("699")) {
      updates.budget = `Standard Plan (${sym}${c === 'UK' ? '399.99' : c === 'US' ? '499.99' : '699.99'}/mo)`;
    } else if (lower.includes("pro") || lower.includes("649") || lower.includes("799") || lower.includes("1099")) {
      updates.budget = `Pro Plan (${sym}${c === 'UK' ? '649.99' : c === 'US' ? '799.99' : '1099.99'}/mo)`;
    } else if (lower.includes("premium") || lower.includes("899") || lower.includes("1099") || lower.includes("1499")) {
      updates.budget = `Premium Plan (${sym}${c === 'UK' ? '899.99' : c === 'US' ? '1099.99' : '1499.99'}/mo)`;
    } else {
      const affirmatives = ["yes", "sure", "ok", "okay", "thats good", "that's good", "perfect", "good", "yep", "sounds good", "sounds perfect", "sounds great", "fine", "agree", "cool", "that works", "this works"];
      if (affirmatives.includes(lower) || affirmatives.some(aff => lower.startsWith(aff))) {
        let hasFivePages = true;
        if (leadState.pages) {
          const match = leadState.pages.match(/\b\d+\b/);
          if (match) {
            const count = parseInt(match[0], 10);
            hasFivePages = count <= 5;
          }
        }
        const basicPrice = c === 'UK' ? '£199.99/mo' : c === 'US' ? '$249.99/mo' : 'A$349.99/mo';
        const standardPrice = c === 'UK' ? '£399.99/mo' : c === 'US' ? '$499.99/mo' : 'A$699.99/mo';
        updates.budget = hasFivePages ? `Basic Plan (${basicPrice})` : `Standard Plan (${standardPrice})`;
      } else {
        const numMatch = resolvedText.match(/\b\d+\b/);
        if (numMatch) {
          updates.budget = `${sym}${numMatch[0]}`;
        }
      }
    }
  }

  if (activeField === "timeline") {
    const numMatch = resolvedText.match(/\b\d+\b/);
    if (numMatch) {
      const unit = lower.includes("week") ? "weeks" : lower.includes("day") ? "days" : "months";
      updates.timeline = `${numMatch[0]} ${unit}`;
    } else if (lower.includes("flexible") || lower.includes("asap") || lower.includes("urgent")) {
      if (lower.includes("flexible")) updates.timeline = "flexible";
      if (lower.includes("asap")) updates.timeline = "ASAP";
      if (lower.includes("urgent")) updates.timeline = "ASAP";
    }
  }

  return Object.keys(updates).length > 0 ? updates : null;
};

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Conversational Lead capture states
  const [leadState, setLeadState] = useState<LeadState>(INITIAL_LEAD_STATE);
  const [leadScore, setLeadScore] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);

  // Report state
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [reportExplanations, setReportExplanations] = useState<ReportExplanations | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);

  // Hydrate states on mount
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("tia-chatbot-opened"));

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
        const parsed = JSON.parse(savedState);
        const sanitized = sanitizeLeadState(parsed);
        setLeadState(sanitized);
        localStorage.setItem("tia_lead_state", JSON.stringify(sanitized));

        const rData = buildReportData(sanitized);
        if (rData) {
          console.log("[TIA Proposal Engine] Hydrating existing report data on mount:", rData);
          setReportData(rData);
          const provider = getActiveProvider();
          provider.generateReportExplanations(rData)
            .then(exp => {
              console.log("[TIA Proposal Engine] Hydrated explanations successfully.");
              setReportExplanations(exp);
            })
            .catch(err => {
              console.warn("[TIA Proposal Engine] Hydration explanation error, using fallback:", err);
              setReportExplanations(getFallbackExplanations(rData));
            });
        }
      } catch (e) {
        // Fallback hydration error ignored
      }
    }

    const savedScore = localStorage.getItem("tia_lead_score");
    if (savedScore) {
      const score = Number(savedScore) || 0;
      setLeadScore(score);
    }

    return () => {
      window.dispatchEvent(new CustomEvent("tia-chatbot-closed"));
    };
  }, []);

  // Declarative effect: Guarantee ReportData generation whenever leadState is complete
  useEffect(() => {
    const nextField = getNextRequiredField(leadState);
    if (nextField === null && !reportData) {
      const score = calculateLeadScore(leadState);
      const rData = buildReportData(leadState, score);
      if (rData) {
        console.log("[TIA Proposal Engine] Declarative useEffect generated reportData:", rData);
        setReportData(rData);
        setIsTyping(false);
        window.dispatchEvent(new CustomEvent("tia-chatbot-thinking-stop"));

        const provider = getActiveProvider();
        provider.generateReportExplanations(rData)
          .then((exp) => setReportExplanations(exp))
          .catch((err) => {
            console.warn("[TIA Proposal Engine] Declarative explanation error, using fallback:", err);
            setReportExplanations(getFallbackExplanations(rData));
          });
      }
    }
  }, [leadState, reportData]);

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
    setReportData(null);
    setReportExplanations(null);
    localStorage.removeItem("tia_lead_state");
    localStorage.removeItem("tia_lead_score");
    setIsTyping(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    saveMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);
    window.dispatchEvent(new CustomEvent("tia-chatbot-thinking-start"));

    const localIntent = detectLocalIntent(text);
    if (localIntent) {
      const responseContent = getLocalResponse(localIntent, leadState);
      const botResponseMsg: Message = { role: "model", content: responseContent };
      setTimeout(() => {
        setIsTyping(false);
        isSubmittingRef.current = false;
        window.dispatchEvent(new CustomEvent("tia-chatbot-thinking-stop"));
        saveMessages([...updatedMessages, botResponseMsg]);
      }, 600);
      return;
    }

    const provider = getActiveProvider();
    
    // Add placeholder message for bot stream
    const botPlaceholderMsg: Message = { role: "model", content: "" };
    setMessages([...updatedMessages, botPlaceholderMsg]);

    let speakingStarted = false;
    let streamText = "";

    try {
      // Get the active field we are trying to collect *before* merging the new message
      const activeField = getNextRequiredField(leadState);

      // 1. Try direct React extraction first (the "Secretary" rules)
      let updates = tryDirectReactExtraction(text, activeField, leadState);

      // 2. If direct extraction returns null, fall back to LLM state extractor
      if (!updates) {
        updates = await provider.extractLeadState(text, leadState, activeField);
      }

      // 3. Merge changes deterministically in React
      const isServiceChanging = updates.service !== undefined && updates.service !== null && updates.service !== leadState.service;
      const initialFeatures = isServiceChanging ? [] : leadState.features;

      const mergedState: LeadState = {
        ...leadState,
        country: updates.country !== undefined && updates.country !== null ? updates.country : leadState.country,
        service: updates.service !== undefined && updates.service !== null ? updates.service : leadState.service,
        businessType: updates.businessType !== undefined && updates.businessType !== null ? updates.businessType : leadState.businessType,
        pages: updates.pages !== undefined && updates.pages !== null ? updates.pages : leadState.pages,
        budget: updates.budget !== undefined && updates.budget !== null ? updates.budget : leadState.budget,
        timeline: updates.timeline !== undefined && updates.timeline !== null ? updates.timeline : leadState.timeline,
        features: updates.features && Array.isArray(updates.features)
          ? Array.from(new Set([...initialFeatures, ...updates.features]))
          : initialFeatures,
      };

      // 4. Calculate workflow missing field & score
      const nextField = getNextRequiredField(mergedState);
      const score = calculateLeadScore(mergedState);

      setLeadState(mergedState);
      setLeadScore(score);
      localStorage.setItem("tia_lead_state", JSON.stringify(mergedState));
      localStorage.setItem("tia_lead_score", String(score));

      // 5. Check if consultation flow is complete -> Generate Project Consultation Report
      if (nextField === null && !reportData) {
        console.log("[TIA Proposal Engine] Proposal trigger condition met!");
        console.log("[TIA Proposal Engine] Merged LeadState:", mergedState);
        console.log("[TIA Proposal Engine] Lead Score:", score);

        const rData = buildReportData(mergedState, score);
        if (rData) {
          console.log("[TIA Proposal Engine] Built ReportData successfully:", rData);
          setReportData(rData);

          const transitionMsgText = "I've gathered enough information to prepare a personalised recommendation for your project.";
          const transitionMsg: Message = { role: "model", content: transitionMsgText };
          const finalMessages = [...updatedMessages, transitionMsg];

          // Save transition message to BOTH React state AND LocalStorage
          saveMessages(finalMessages);
          setIsTyping(false);
          window.dispatchEvent(new CustomEvent("tia-chatbot-thinking-stop"));

          console.log("[TIA Proposal Engine] Requesting explanations from provider...");
          provider.generateReportExplanations(rData)
            .then((exp) => {
              console.log("[TIA Proposal Engine] Received explanations successfully:", exp);
              setReportExplanations(exp);
            })
            .catch((err) => {
              console.warn("[TIA Proposal Engine] Explanation generation failed, setting fallback:", err);
              setReportExplanations(getFallbackExplanations(rData));
            });

          return;
        }
      }

      // 6. Stream conversational chat response if not complete or report already generated
      await provider.streamChat(updatedMessages, mergedState, nextField, {
        onChunk: (chunk) => {
          if (!speakingStarted && chunk.trim()) {
            speakingStarted = true;
            window.dispatchEvent(new CustomEvent("tia-chatbot-speaking-start"));
          }
          streamText += chunk;
          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0) {
              next[next.length - 1] = { role: "model", content: streamText };
            }
            return next;
          });
        },
        onFinish: (resultText) => {
          setIsTyping(false);
          window.dispatchEvent(new CustomEvent("tia-chatbot-thinking-stop"));

          // Save conversational output
          const finalMessages = [
            ...updatedMessages,
            { role: "model", content: resultText },
          ];
          saveMessages(finalMessages);
        },
        onError: (err) => {
          console.error("Gemini stream error", err);
          setIsTyping(false);
          window.dispatchEvent(new CustomEvent("tia-chatbot-thinking-stop"));
          
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
      window.dispatchEvent(new CustomEvent("tia-chatbot-thinking-stop"));
      console.error(e);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleContactSuccess = (name: string, email: string, phone: string) => {
    setShowContactForm(false);
    
    // Increment leadScore slightly beyond 100 to flag complete
    setLeadScore(105);
    localStorage.setItem("tia_lead_score", "105");
    window.dispatchEvent(new CustomEvent("tia-chatbot-success"));

    const finalModelResponse: Message = {
      role: "model",
      content: `Thanks ${name}! 🎉 

Your quotation inquiry has been successfully sent to our expert developers. We will prepare your custom proposal and contact you at **${email}** (or **${phone || "phone"}**) within 24 hours.

If you have any other questions in the meantime, feel free to ask!`,
    };
    saveMessages([...messages, finalModelResponse]);
  };

  return (
    <div className="fixed top-36 right-6 w-[92vw] sm:w-[400px] h-[600px] max-h-[80vh] rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden z-50 animate-scale-up">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/95 to-primary/80 text-primary-foreground flex items-center justify-between shadow-sm select-none">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-white/20 overflow-hidden">
              <img src={tiaBotIcon} alt="TIA AI" className="w-full h-full object-cover" />
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

        {reportData && (
          <ProjectConsultationReport
            data={reportData}
            explanations={reportExplanations}
            onSubmittedSuccess={(name, email) => handleContactSuccess(name, email, "")}
          />
        )}

        {isTyping && (
          <div className="flex gap-3 max-w-[85%] self-start animate-pulse mb-4">
            <div className="w-8 h-8 rounded-full bg-white border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={tiaBotIcon} alt="TIA AI" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-card border border-border text-foreground rounded-tl-sm shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-75" />
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Prompt Chips */}
      {!showContactForm && (() => {
        const nextField = getNextRequiredField(leadState);
        let prompts = SUGGESTED_PROMPTS;
        if (nextField === "country") {
          prompts = ["🇬🇧 United Kingdom", "🇺🇸 United States", "🇦🇺 Australia"];
        } else if (nextField === "budget") {
          const config = COUNTRY_CONFIG[leadState.country || "UK"];
          const sym = config.symbol;
          prompts = [`Basic (${sym}200/mo)`, `Standard (${sym}400/mo)`, `Custom Budget` ];
        }

        return (
          <div className="px-4 py-2 flex gap-2 overflow-x-auto whitespace-nowrap bg-background/20 border-t border-border/40 select-none scrollbar-none">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-medium bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80 px-2.5 py-1 rounded-full transition-all duration-200 shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        );
      })()}

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
