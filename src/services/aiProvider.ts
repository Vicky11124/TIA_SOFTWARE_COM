import { GoogleGenerativeAI } from "@google/generative-ai";

export interface LeadState {
  service: string | null;
  businessType: string | null;
  pages: string | null;
  features: string[];
  budget: string | null;
  timeline: string | null;
}

export interface ChatJSONResponse {
  assistant_response: string;
  lead_state: LeadState;
  lead_score: number;
  missing: string[];
}

export interface ChatMessage {
  role: "user" | "model" | "system";
  content: string;
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onFinish: (response: ChatJSONResponse) => void;
  onError: (error: Error) => void;
}

export interface AIProvider {
  streamChat(
    messages: ChatMessage[],
    currentLeadState: LeadState,
    callbacks: StreamCallbacks
  ): Promise<void>;
}

// ----------------------------------------------------
// TIA Knowledge Base & JSON System Prompt
// ----------------------------------------------------
export const TIA_SYSTEM_PROMPT = `
You are TIA AI, a professional 24/7 sales consultant for TIA Software Solutions.
Your goal is to help visitors understand our services, answer their questions, recommend solutions, and capture their project requirements.

ABOUT TIA SOFTWARE SOLUTIONS:
We are a premier digital agency specializing in premium design, software development, and digital growth.
Location: London, United Kingdom.
Contact Info:
- Email: sales@tiasoftwaresolutions.com
- Phone / WhatsApp: +44 7451 255217 (This is our only official contact number)

OUR SERVICES:
1. Website Development: Custom high-performance business websites, e-commerce stores, web applications, landing pages, and interactive platforms.
2. Mobile App Development: Custom iOS and Android apps, cross-platform apps (React Native), and mobile products.
3. Digital Marketing & SEO: Search Engine Optimization, PPC ads (Google, Meta), social media management, email marketing, and audience growth.
4. Branding Essentials: Logo design, brand style guides, stationery design, social media kits, and brand books.
5. UI/UX Design: Wireframes, user journey mapping, high-fidelity UI designs, mobile app design, web design, and interactive prototypes.
6. AI Automation: Chatbots, custom AI integrations, automated workflows, and workflow optimization.

PRICING PLANS (All services operate on a subscription tier system, supporting GBP, USD, and AUD):
- Basic Plan: £199.99 / $199.99 USD / $285.41 AUD per month. Standard design, daily graphics, email support, 1 active project at a time.
- Standard Plan: £399.99 / $399.99 USD / $570.83 AUD per month. Standard website development & design, 2 active projects, faster response times.
- Pro Plan: £649.99 / $649.99 USD / $927.61 AUD per month. Advanced development, web/mobile app design, priority support, dedicated designer/developer.
- Premium Plan: £899.99 / $899.99 USD / $1,284.40 AUD per month. Complete digital solutions, unlimited active projects, 24/7 VIP support.
*Note: The exchange rate for AUD is exactly 1.4271 relative to USD.*

CONVERSATIONAL RULES (Acknowledge ➔ Provide Expertise ➔ Ask ONE Question):
1. Keep Memory: Do not ask questions for details the user has already stated. Always look at the user's message history and the provided currentLeadState context.
2. Direct, Focused Inquiries: Never ask two questions at the same time. Maintain a conversational flow.
3. Consultative Selling: When a user shares their business type or goals, give value!
   - E.g. If it is a Dental Clinic: "That's great! For dental clinics, patients usually look for services, doctor profiles, online appointments, and contact details. Do you also want online appointment booking?"
   - E.g. If it is a Restaurant: "Excellent! Restaurant websites convert best when they feature an interactive online menu, table reservations, Google Maps, and easy WhatsApp ordering. Do you need table reservations?"
4. Recommend Packages: When discussing budget, instead of asking "What is your budget?", recommend our plans based on what they want.
   - E.g. "Based on your requirements for custom web and mobile app design, I'd recommend our Pro subscription (£649.99/mo). It gives you a dedicated developer and priority support. Does that sound like a good fit?"
5. Closing details: Once all project details are collected (completeness score reaches 100), output:
   "Perfect! 🎉 I've gathered everything needed to prepare your quotation. Please share your name, email, and phone number so our team can send you a detailed proposal within 24 hours."

OUTPUT FORMAT:
You MUST respond with a single valid JSON object containing:
{
  "assistant_response": "The conversational reply to the user (contains no JSON tags, clean markdown)",
  "lead_state": {
    "service": "Website" | "Mobile App" | "Digital Marketing" | "Branding" | "UI/UX Design" | "AI Automation" | null,
    "businessType": "string or null",
    "pages": "string or null",
    "features": ["array of strings"],
    "budget": "string or null",
    "timeline": "string or null"
  },
  "lead_score": number, // 0 to 100. Calculate based on filled lead_state fields (service: 20%, businessType: 20%, pages: 15%, features: 15%, budget: 15%, timeline: 15%)
  "missing": ["array of fields from lead_state that are currently null"]
}
`;

// ----------------------------------------------------
// Google Gemini Provider Implementation
// ----------------------------------------------------
export class GeminiProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private modelName = "gemini-1.5-flash";

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async streamChat(
    messages: ChatMessage[],
    currentLeadState: LeadState,
    callbacks: StreamCallbacks
  ): Promise<void> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: TIA_SYSTEM_PROMPT,
      });

      // Prepare payload. We prepend current lead state context in system instructions
      const leadStateContext = `Current Project Summary State: ${JSON.stringify(currentLeadState)}`;
      const contents = [
        {
          role: "user" as const,
          parts: [{ text: leadStateContext }],
        },
        ...messages
          .filter((msg) => msg.role !== "system")
          .map((msg) => ({
            role: msg.role === "user" ? ("user" as const) : ("model" as const),
            parts: [{ text: msg.content }],
          })),
      ];

      const result = await model.generateContentStream({
        contents,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      let fullText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          fullText += chunkText;
          callbacks.onChunk(chunkText);
        }
      }

      // Final parse
      try {
        const parsed: ChatJSONResponse = JSON.parse(fullText);
        callbacks.onFinish(parsed);
      } catch (jsonErr) {
        // Fallback if JSON format was slightly corrupted
        console.warn("JSON parsing failed, attempting raw extract", jsonErr);
        const extractedResponse = fullText.match(/"assistant_response"\s*:\s*"([^"]+)"/)?.[1] || "Sorry, please try again.";
        callbacks.onFinish({
          assistant_response: extractedResponse,
          lead_state: currentLeadState,
          lead_score: 50,
          missing: [],
        });
      }
    } catch (error) {
      callbacks.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

// ----------------------------------------------------
// Mock / Fallback Provider Implementation
// ----------------------------------------------------
export class MockProvider implements AIProvider {
  async streamChat(
    messages: ChatMessage[],
    currentLeadState: LeadState,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || "";

    // Copy current state
    const nextState = { ...currentLeadState };
    if (!nextState.features) nextState.features = [];

    let reply = "";

    // 1. Identify Service & BusinessType
    if (!nextState.service) {
      if (lastUserMessage.includes("website") || lastUserMessage.includes("e-commerce") || lastUserMessage.includes("ecommerce") || lastUserMessage.includes("site")) {
        nextState.service = "Website";
      } else if (lastUserMessage.includes("app") || lastUserMessage.includes("mobile") || lastUserMessage.includes("ios") || lastUserMessage.includes("android")) {
        nextState.service = "Mobile App";
      } else if (lastUserMessage.includes("seo") || lastUserMessage.includes("marketing") || lastUserMessage.includes("ads") || lastUserMessage.includes("grow")) {
        nextState.service = "Digital Marketing";
      } else if (lastUserMessage.includes("brand") || lastUserMessage.includes("logo") || lastUserMessage.includes("identity")) {
        nextState.service = "Branding";
      } else if (lastUserMessage.includes("automation") || lastUserMessage.includes("chatbot") || lastUserMessage.includes("ai tool")) {
        nextState.service = "AI Automation";
      } else if (lastUserMessage.includes("design") || lastUserMessage.includes("ui") || lastUserMessage.includes("ux")) {
        nextState.service = "UI/UX Design";
      }
    }

    if (!nextState.businessType && nextState.service) {
      // Try to extract business keyword
      const words = lastUserMessage.split(/\s+/);
      const skip = ["i", "need", "want", "website", "app", "marketing", "for", "a", "an", "my", "our", "company", "business"];
      const potential = words.find((w) => w.length > 3 && !skip.includes(w));
      if (potential) {
        nextState.businessType = potential.charAt(0).toUpperCase() + potential.slice(1);
      }
    }

    // 2. Classify state updates based on current progress
    if (nextState.service && !nextState.businessType) {
      reply = `I'd love to help you build your ${nextState.service}! To give you the best advice, what kind of business or industry is this project for?`;
    } else if (!nextState.service) {
      reply = `Hello! 👋 I'm TIA AI, your digital project consultant. 

Are you looking to build a new Website, develop a Mobile App, optimize your Digital Marketing (SEO/Ads), or refresh your Brand Identity?`;
    } else if (nextState.features.length === 0) {
      if (lastUserMessage.includes("clinic") || lastUserMessage.includes("dental") || lastUserMessage.includes("doctor")) {
        nextState.businessType = "Dental Clinic";
        reply = `Awesome—a dental clinic! Patient sites usually require services listings, staff profiles, WhatsApp support, and online appointment bookings because they build trust. 

Do you want us to include online appointment scheduling?`;
      } else if (lastUserMessage.includes("restaurant") || lastUserMessage.includes("food") || lastUserMessage.includes("cafe")) {
        nextState.businessType = "Restaurant";
        reply = `That's great! Restaurant websites convert best when they feature an interactive online menu, table reservations, Google Maps, and easy WhatsApp ordering.

Would you like online table reservations built-in?`;
      } else {
        // Standard feature recommendation
        reply = `Excellent! For a ${nextState.businessType || "business"} ${nextState.service}, most clients usually include:
• WhatsApp Chat Support
• Google Maps Location
• Online Contact Form
• Built-in SEO Optimization

Would you like us to integrate any of these, or do you have other features in mind?`;
      }
      nextState.features = ["Standard Features"];
    } else if (!nextState.pages) {
      // User answered about features, record it and ask about size
      if (lastUserMessage.includes("yes") || lastUserMessage.includes("booking") || lastUserMessage.includes("reservation")) {
        nextState.features.push("Interactive booking");
      }
      reply = `Got it! Approximately how many pages are we planning for this project? (e.g. 5 pages, 10 pages, or not sure?)`;
      nextState.pages = "Not sure yet";
    } else if (!nextState.budget) {
      // User answered about pages
      if (lastUserMessage.match(/\d+/)) {
        nextState.pages = `${lastUserMessage.match(/\d+/)?.[0]} pages`;
      }
      reply = `Perfect. Based on your features, I'd highly recommend our **Standard Plan** (£399.99/mo). It covers full website development, support, and hosting maintenance.

Does that sound close to what you're looking for, or did you have a different budget in mind?`;
      nextState.budget = "Standard Plan (£399.99/mo)";
    } else if (!nextState.timeline) {
      // User answered about budget
      reply = `Understood. And what is your target timeline to launch this project? (e.g. 1 month, 3 months, or flexible?)`;
      nextState.timeline = "Flexible";
    } else {
      // Everything is gathered!
      reply = `Perfect! 🎉 I've gathered everything needed to prepare your quotation. 

Please share your name, email, and phone number so our team can send you a detailed proposal within 24 hours.`;
    }

    // Calculate score
    let score = 0;
    const missing: string[] = [];
    if (nextState.service) score += 20; else missing.push("service");
    if (nextState.businessType) score += 20; else missing.push("businessType");
    if (nextState.pages) score += 15; else missing.push("pages");
    if (nextState.features.length > 0) score += 15; else missing.push("features");
    if (nextState.budget) score += 15; else missing.push("budget");
    if (nextState.timeline) score += 15; else missing.push("timeline");

    const jsonResponse: ChatJSONResponse = {
      assistant_response: reply,
      lead_state: nextState,
      lead_score: score,
      missing,
    };

    // Stream the JSON response as a string, simulating typing
    const responseString = JSON.stringify(jsonResponse);
    const chars = responseString.split("");
    let currentText = "";
    let index = 0;

    const interval = setInterval(() => {
      if (index < chars.length) {
        currentText += chars[index];
        callbacks.onChunk(chars[index]);
        index++;
      } else {
        clearInterval(interval);
        callbacks.onFinish(jsonResponse);
      }
    }, 2); // Extremely fast chunk updates for JSON string streaming
  }
}

// ----------------------------------------------------
// Active Provider Fetcher
// ----------------------------------------------------
let activeProvider: AIProvider | null = null;

export function getActiveProvider(): AIProvider {
  if (activeProvider) return activeProvider;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY" && apiKey.trim() !== "") {
    activeProvider = new GeminiProvider(apiKey);
  } else {
    activeProvider = new MockProvider();
  }

  return activeProvider;
}
