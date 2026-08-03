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
- Basic Plan: £199.99 / $199.99 USD / $285.41 AUD per month. Standard design, daily graphics, email support, 1 active project at a time. Recommended for simple websites (e.g. 5 pages or less).
- Standard Plan: £399.99 / $399.99 USD / $570.83 AUD per month. Standard website development & design, 2 active projects, faster response times. Recommended for standard business sites (e.g. 5-10 pages).
- Pro Plan: £649.99 / $649.99 USD / $927.61 AUD per month. Advanced development, web/mobile app design, priority support, dedicated designer/developer.
- Premium Plan: £899.99 / $899.99 USD / $1,284.40 AUD per month. Complete digital solutions, unlimited active projects, 24/7 VIP support.
*Note: The exchange rate for AUD is exactly 1.4271 relative to USD.*

CONVERSATIONAL RULES (Acknowledge ➔ Provide Expertise ➔ Ask ONE Question):
1. DETECT AND ACKNOWLEDGE CORRECTIONS CAREFULLY:
   - Read the user's latest message. If they correct, change, reject, or modify any previously collected field (e.g., they say "no I want 5 pages instead" when pages was 10, or "actually budget is £500"), you MUST:
     a) Acknowledge the correction (e.g., "Got it! Thanks for clarifying. I've updated the project to a 5-page website.")
     b) Provide expertise about the change (e.g., "A 5-page website gives you enough space for Home, About, Services, Projects, and Contact. We can always scale it later!")
     c) Recalculate/adjust package recommendation if applicable (e.g. suggest Basic Plan instead of Standard).
     d) Ask only ONE next missing question.
2. KEEP ACTIVE MEMORY:
   - Do not ask questions for details the user has already stated. Check currentLeadState.
3. ASK ONE QUESTION AT A TIME:
   - Never ask two questions at once. Let the conversation flow naturally.
4. RECOMMEND PLANS DYNAMICALLY:
   - Suggest basic, standard, pro, or premium plans based on the client's scope. If scope changes, update the recommendation dynamically.
5. CLOSING DETAILS:
   - Once all project details are collected (completeness score reaches 100), output:
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

      try {
        const parsed: ChatJSONResponse = JSON.parse(fullText);
        callbacks.onFinish(parsed);
      } catch (jsonErr) {
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
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const lastUserLower = lastUserMessage.toLowerCase();

    const nextState = { ...currentLeadState };
    if (!nextState.features) nextState.features = [];

    let correctionText = "";

    // 1. Dynamic parameters detection from last message
    let detectedService: string | null = null;
    if (lastUserLower.includes("website") || lastUserLower.includes("e-commerce") || lastUserLower.includes("ecommerce") || lastUserLower.includes("site")) {
      detectedService = "Website";
    } else if (lastUserLower.includes("app") || lastUserLower.includes("mobile") || lastUserLower.includes("ios") || lastUserLower.includes("android")) {
      detectedService = "Mobile App";
    } else if (lastUserLower.includes("seo") || lastUserLower.includes("marketing") || lastUserLower.includes("ads") || lastUserLower.includes("grow")) {
      detectedService = "Digital Marketing";
    } else if (lastUserLower.includes("brand") || lastUserLower.includes("logo") || lastUserLower.includes("identity")) {
      detectedService = "Branding";
    } else if (lastUserLower.includes("automation") || lastUserLower.includes("chatbot") || lastUserLower.includes("ai tool")) {
      detectedService = "AI Automation";
    } else if (lastUserLower.includes("design") || lastUserLower.includes("ui") || lastUserLower.includes("ux")) {
      detectedService = "UI/UX Design";
    }

    if (detectedService) {
      if (nextState.service && nextState.service !== detectedService) {
        correctionText += `Got it! I've updated your project type from a ${nextState.service} to a ${detectedService}. `;
      }
      nextState.service = detectedService;
    }

    let detectedBusiness: string | null = null;
    if (lastUserLower.includes("dental") || lastUserLower.includes("clinic") || lastUserLower.includes("doctor")) {
      detectedBusiness = "Dental Clinic";
    } else if (lastUserLower.includes("restaurant") || lastUserLower.includes("food") || lastUserLower.includes("cafe")) {
      detectedBusiness = "Restaurant";
    } else if (lastUserLower.includes("interior") || lastUserLower.includes("house") || lastUserLower.includes("decor")) {
      detectedBusiness = "Interior Design";
    } else if (lastUserLower.includes("store") || lastUserLower.includes("shop") || lastUserLower.includes("clothing")) {
      detectedBusiness = "Retail Store";
    }

    if (detectedBusiness) {
      if (nextState.businessType && nextState.businessType !== detectedBusiness) {
        correctionText += `Thanks for clarifying. I've updated the business industry to ${detectedBusiness}. `;
      }
      nextState.businessType = detectedBusiness;
    }

    let detectedPages: string | null = null;
    const pageMatch = lastUserMessage.match(/(\d+)\s*-?\s*page/i) || lastUserMessage.match(/page\s*-?\s*(\d+)/i) || lastUserMessage.match(/\b(\d+)\s*pages?\b/i);
    if (pageMatch) {
      detectedPages = `${pageMatch[1]} pages`;
    }

    if (detectedPages) {
      if (nextState.pages && nextState.pages !== detectedPages) {
        correctionText += `Got it! I've updated the size of the project to ${detectedPages}. `;
        // If they correct to 5 pages, we reset budget so it gets recalculated
        if (detectedPages.includes("5")) {
          nextState.budget = null;
        }
      }
      nextState.pages = detectedPages;
    }

    let detectedBudget: string | null = null;
    const budgetMatch = lastUserMessage.match(/(?:£|\$|aud)\s*(\d+(?:,\d+)?)/i) || lastUserMessage.match(/(\d+(?:,\d+)?)\s*(?:gbp|usd|aud)/i);
    if (budgetMatch) {
      detectedBudget = `£${budgetMatch[1]}`;
    }

    if (detectedBudget) {
      if (nextState.budget && nextState.budget !== detectedBudget) {
        correctionText += `Acknowledge. I've updated your budget preference to ${detectedBudget}. `;
      }
      nextState.budget = detectedBudget;
    }

    let detectedTimeline: string | null = null;
    const timelineMatch = lastUserMessage.match(/(\d+)\s*(?:month|week|day)/i) || lastUserLower.match(/flexible/i) || lastUserLower.match(/asap/i);
    if (timelineMatch) {
      detectedTimeline = timelineMatch[0];
    }

    if (detectedTimeline) {
      if (nextState.timeline && nextState.timeline !== detectedTimeline) {
        correctionText += `Sure, I've adjusted your launch target timeline to ${detectedTimeline}. `;
      }
      nextState.timeline = detectedTimeline;
    }

    // Features detection
    if (lastUserLower.includes("booking") || lastUserLower.includes("appointment") || lastUserLower.includes("schedule")) {
      if (!nextState.features.includes("Online Booking")) {
        nextState.features.push("Online Booking");
      }
    }
    if (lastUserLower.includes("menu") || lastUserLower.includes("reservation")) {
      if (!nextState.features.includes("Menu & Reservations")) {
        nextState.features.push("Menu & Reservations");
      }
    }
    if (lastUserLower.includes("whatsapp") || lastUserLower.includes("chat")) {
      if (!nextState.features.includes("WhatsApp Support")) {
        nextState.features.push("WhatsApp Support");
      }
    }
    if (lastUserLower.includes("seo") || lastUserLower.includes("google")) {
      if (!nextState.features.includes("SEO Setup")) {
        nextState.features.push("SEO Setup");
      }
    }

    // 2. Formulate the response
    let reply = "";
    if (correctionText) {
      reply += correctionText;
      if (detectedPages && detectedPages.includes("5")) {
        reply += `A 5-page site is ideal! It gives you space for Home, About, Services, Projects, and Contact. We can always scale it later. Let's adjust the plans. `;
      }
    }

    if (!nextState.service) {
      reply += `Hello! 👋 I'm TIA AI, your digital project consultant.

Are you looking to build a new Website, develop a Mobile App, optimize your Digital Marketing (SEO/Ads), or refresh your Brand Identity?`;
    } else if (!nextState.businessType) {
      reply += `I'd love to help you build your ${nextState.service}! To give you the best advice, what kind of business or industry is this project for?`;
    } else if (nextState.features.length === 0) {
      if (nextState.businessType === "Dental Clinic") {
        reply += `Awesome—a dental clinic! Patient sites usually require services listings, staff profiles, WhatsApp support, and online appointment bookings because they build trust.

Do you want us to include online appointment scheduling?`;
      } else if (nextState.businessType === "Restaurant") {
        reply += `That's great! Restaurant websites convert best when they feature an interactive online menu, table reservations, Google Maps, and easy WhatsApp ordering.

Would you like online table reservations built-in?`;
      } else {
        reply += `Excellent. For a ${nextState.businessType} ${nextState.service}, most clients usually include:
• WhatsApp Chat Support
• Google Maps Location
• Online Contact Form
• Built-in SEO Optimization

Would you like us to integrate any of these features, or do you have other options in mind?`;
      }
      nextState.features = ["Standard Setup"];
    } else if (!nextState.pages) {
      reply += `A website for a ${nextState.businessType} works great when pages are divided cleanly. Approximately how many pages are we planning for this project? (e.g. 5 pages, 10 pages, or not sure?)`;
    } else if (!nextState.budget) {
      // Dynamic budget recommendation
      let recommendedPlan = "Standard Plan (£399.99/mo)";
      if (nextState.pages && (nextState.pages.includes("5") || nextState.pages.includes("five"))) {
        recommendedPlan = "Basic Plan (£199.99/mo)";
      }
      reply += `For a ${nextState.pages || "standard"} ${nextState.businessType || "business"} site, I recommend our **${recommendedPlan}**. This plan covers all design, development, and standard support.

Does that sound close to what you're looking for, or do you have a different budget preference?`;
      nextState.budget = `Recommended: ${recommendedPlan}`;
    } else if (!nextState.timeline) {
      reply += `Perfect. And what is your target timeline to launch this project? (e.g. 1 month, 3 months, or flexible?)`;
    } else {
      reply += `Perfect! 🎉 I've gathered everything needed to prepare your quotation.

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
    }, 2);
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
