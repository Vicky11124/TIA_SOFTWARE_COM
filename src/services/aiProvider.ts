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
You are TIA AI, the Senior Digital Solutions Consultant at TIA Software Solutions.
You are NOT a chatbot.
You are an experienced consultant helping businesses choose the right digital solution.
Your primary objective is to understand the client's business completely before recommending any service.

CRAWLED KNOWLEDGE (WEBSITE & INSTAGRAM @tiasoftwaresolutions):
- Website Portfolio & Core Offerings: We are a premier digital agency that builds custom React/Node.js web apps, mobile apps, graphic design brand kits, motion graphics, and offers dedicated virtual assistance. Our primary hub is located in Chennai, India, with headquarters in London, UK.
- Instagram Showcase (@tiasoftwaresolutions): Our feed features live motion design showreels, client branding guides, logo animations, custom UI transition previews, daily graphic design tips, interactive social media reels, and seasonal/festive greeting templates designed for client brands.
- Client Project Types: Frequently consult on and build dental clinics, e-commerce stores, real estate websites, vehicle inventory systems (like second-hand bike/car sellers), and creative branding solutions.

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

----------------------------------
PERSONALITY
Professional. Friendly. Consultative. Confident.
Never robotic. Never generic. Never rush.
Always sound like a real consultant.

----------------------------------
CONSULTATION RULES
Every reply MUST follow this order:
1. Read the user's latest message carefully.
2. Determine whether the user:
   - answered a question
   - corrected previous information
   - changed requirements
   - rejected a recommendation
   - asked a new question
3. If the user changed or corrected something, acknowledge it naturally.
   Examples: "Thanks for letting me know.", "Got it.", "I've updated your requirements.", "That makes sense."
   Never ignore corrections.

----------------------------------
PROJECT MEMORY
Maintain an internal project summary.
Service, Business Type, Industry, Website Type, Pages, Features, Budget, Timeline, Target Audience, Brand Style, SEO Required, Hosting Required, Maintenance Required, Integrations, Contact Information.
Every user message can modify this information. Always update it. Never lose previous information.

----------------------------------
NEVER ASK DUPLICATE QUESTIONS
Before asking anything, check whether that information already exists. If it exists, never ask again. Instead continue naturally.

----------------------------------
ONE QUESTION RULE
Never ask more than ONE important question in a reply. Wait for the answer. Then continue.

----------------------------------
CONSULTANT BEHAVIOUR
Never behave like a form. Never behave like a questionnaire. Instead educate the customer.
Example:
Instead of: "What pages do you need?"
Say: "For most restaurants we usually recommend Home, Menu, Gallery, About and Contact pages. Would something similar work for you, or do you have different requirements?"

----------------------------------
IF USER MODIFIES SOMETHING
Example:
User: "I need 5 pages"
AI: "Perfect, thanks for clarifying. I've updated your project to include a 5-page website. That should comfortably cover the core pages for most businesses. Now I'd like to understand your preferred launch timeline."

----------------------------------
PACKAGE RECOMMENDATIONS
Never recommend a package until you understand at least: Business, Pages, Features, Budget, Timeline.
Only recommend when confidence >80%.

----------------------------------
WHEN USER ASKS PRICE
Never give one fixed number. Instead give an Estimated Range. Explain why, explain what affects cost, and ask one follow-up question.

----------------------------------
WHEN USER CHANGES THEIR MIND
Forget the old value. Replace it. Never continue using outdated information.

----------------------------------
IF USER SAYS: "No", "Actually", "Instead", "I changed my mind", "I want", "Not that"
Treat it as a correction.

----------------------------------
WHEN YOU DON'T KNOW
Never invent information. Say "I'd like one more detail before making a recommendation." or "I don't have enough information yet."

----------------------------------
RESPONSE STYLE
Keep replies under 120 words.
Short paragraphs. Easy English. Professional. Natural.

----------------------------------
AFTER EVERY RESPONSE
Mentally update the project. Then ask ONE relevant question.

----------------------------------
GOAL
By the end of the consultation, the customer should feel like they spoke with an experienced digital consultant, not an AI chatbot.

----------------------------------
OUTPUT FORMAT:
You MUST respond with a single valid JSON object containing:
{
  "assistant_response": "The conversational reply to the user (contains no JSON tags, clean markdown, under 120 words)",
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

    // 1. Dynamic service detection (with override avoidance)
    let detectedService: string | null = null;
    const isExplicitChange = lastUserLower.includes("change") || lastUserLower.includes("instead") || lastUserLower.startsWith("no ");
    
    // Only parse a new service if not already set, OR if the user is explicitly correcting it
    if (!nextState.service || isExplicitChange) {
      if (lastUserLower.includes("website") || lastUserLower.includes("e-commerce") || lastUserLower.includes("ecommerce") || lastUserLower.includes("site")) {
        detectedService = "Website";
      } else if (lastUserLower.includes("app") || lastUserLower.includes("mobile") || lastUserLower.includes("ios") || lastUserLower.includes("android")) {
        detectedService = "Mobile App";
      } else if (lastUserLower.includes("seo") || lastUserLower.includes("marketing") || lastUserLower.includes("ads") || lastUserLower.includes("grow")) {
        // Prevent phrase collisions (e.g. "seo ready website" shouldn't change service to marketing)
        if (!lastUserLower.includes("ready") && !lastUserLower.includes("stuff") && !lastUserLower.includes("include") && !lastUserLower.includes("do you")) {
          detectedService = "Digital Marketing";
        }
      } else if (lastUserLower.includes("brand") || lastUserLower.includes("logo") || lastUserLower.includes("identity")) {
        detectedService = "Branding";
      } else if (lastUserLower.includes("automation") || lastUserLower.includes("chatbot") || lastUserLower.includes("ai tool")) {
        detectedService = "AI Automation";
      } else if (lastUserLower.includes("design") || lastUserLower.includes("ui") || lastUserLower.includes("ux")) {
        detectedService = "UI/UX Design";
      }
    }

    if (detectedService) {
      if (nextState.service && nextState.service !== detectedService) {
        correctionText += `Got it! I've updated your project type from a ${nextState.service} to a ${detectedService}. `;
      }
      nextState.service = detectedService;
    }

    // 2. Dynamic Business Type Extraction
    let detectedBusiness: string | null = null;
    if (lastUserLower.includes("bike") || lastUserLower.includes("bicycle") || lastUserLower.includes("vehicle") || lastUserLower.includes("car ")) {
      detectedBusiness = "Second Hand Bike Seller";
    } else if (lastUserLower.includes("dental") || lastUserLower.includes("clinic") || lastUserLower.includes("doctor") || lastUserLower.includes("dentist")) {
      detectedBusiness = "Dental Clinic";
    } else if (lastUserLower.includes("restaurant") || lastUserLower.includes("food") || lastUserLower.includes("cafe") || lastUserLower.includes("bakery")) {
      detectedBusiness = "Restaurant";
    } else if (lastUserLower.includes("interior") || lastUserLower.includes("house") || lastUserLower.includes("decor") || lastUserLower.includes("architect")) {
      detectedBusiness = "Interior Design";
    } else if (lastUserLower.includes("police")) {
      detectedBusiness = "Police Website";
    } else if (lastUserLower.includes("real estate") || lastUserLower.includes("property")) {
      detectedBusiness = "Real Estate Agency";
    } else if (lastUserLower.includes("gym") || lastUserLower.includes("fitness") || lastUserLower.includes("trainer")) {
      detectedBusiness = "Fitness & Gym";
    } else if (lastUserLower.includes("law") || lastUserLower.includes("legal") || lastUserLower.includes("attorney") || lastUserLower.includes("lawyer")) {
      detectedBusiness = "Law Firm";
    } else if (lastUserLower.includes("construction") || lastUserLower.includes("builder")) {
      detectedBusiness = "Construction Company";
    } else if (lastUserLower.includes("cleaning")) {
      detectedBusiness = "Cleaning Services";
    } else {
      // If we are currently missing businessType and they answered with a short phrase (not a question or command)
      const isQuestion = lastUserLower.includes("?") || lastUserLower.includes("do you") || lastUserLower.includes("can you") || lastUserLower.includes("how much") || lastUserLower.includes("where");
      if (!nextState.businessType && !isQuestion) {
        const words = lastUserMessage.trim().split(/\s+/);
        if (words.length <= 4 && !words.includes("website") && !words.includes("app") && !words.includes("site") && !words.includes("stuff")) {
          detectedBusiness = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        }
      } else {
        const match = lastUserLower.match(/(?:for a|for|my|own a|own|about a|about)\s+([^.,?!]+)/i);
        if (match) {
          const potential = match[1].trim();
          const words = potential.split(/\s+/);
          if (words.length <= 4 && !words.includes("website") && !words.includes("app") && !words.includes("site") && !words.includes("stuff")) {
            detectedBusiness = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          }
        }
      }
    }

    if (detectedBusiness) {
      if (nextState.businessType && nextState.businessType !== detectedBusiness) {
        correctionText += `Thanks for clarifying! I've updated your business industry to a **${detectedBusiness}**. `;
      }
      nextState.businessType = detectedBusiness;
    }

    // 3. Dynamic Page count detection
    let detectedPages: string | null = null;
    const pageMatch = lastUserMessage.match(/(\d+)\s*-?\s*page/i) || lastUserMessage.match(/page\s*-?\s*(\d+)/i) || lastUserMessage.match(/\b(\d+)\s*pages?\b/i);
    if (pageMatch) {
      detectedPages = `${pageMatch[1]} pages`;
    }

    if (detectedPages) {
      if (nextState.pages && nextState.pages !== detectedPages) {
        correctionText += `Got it! I've updated the size of the project to ${detectedPages}. `;
        if (detectedPages.includes("5")) {
          nextState.budget = null;
        }
      }
      nextState.pages = detectedPages;
    }

    // 4. Dynamic Budget / package matching
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

    // 5. Dynamic Timeline matching
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
    let addedFeatureText = "";
    if (lastUserLower.includes("booking") || lastUserLower.includes("appointment") || lastUserLower.includes("schedule")) {
      if (!nextState.features.includes("Online Booking")) {
        nextState.features.push("Online Booking");
        addedFeatureText = "Online Booking scheduling";
      }
    }
    if (lastUserLower.includes("menu") || lastUserLower.includes("reservation")) {
      if (!nextState.features.includes("Menu & Reservations")) {
        nextState.features.push("Menu & Reservations");
        addedFeatureText = "Menu & Reservations layout";
      }
    }
    if (lastUserLower.includes("whatsapp") || lastUserLower.includes("chat")) {
      if (!nextState.features.includes("WhatsApp Support")) {
        nextState.features.push("WhatsApp Support");
        addedFeatureText = "WhatsApp Support buttons";
      }
    }
    if (lastUserLower.includes("seo")) {
      if (!nextState.features.includes("SEO Setup")) {
        nextState.features.push("SEO Setup");
        addedFeatureText = "Google SEO Optimization";
      }
    }
    if (lastUserLower.includes("inventory") || lastUserLower.includes("search") || lastUserLower.includes("listing")) {
      if (!nextState.features.includes("Inventory Listings")) {
        nextState.features.push("Inventory Listings");
        addedFeatureText = "Inventory listings catalog";
      }
    }

    if (addedFeatureText && !correctionText) {
      correctionText += `Got it! I've added **${addedFeatureText}** to your website specifications. `;
    }

    // 6. FAQ / User Question Answering
    let questionAnswer = "";
    if (lastUserLower.includes("do you do") || lastUserLower.includes("can you") || lastUserLower.includes("do you offer") || lastUserLower.includes("support")) {
      if (lastUserLower.includes("seo") || lastUserLower.includes("marketing") || lastUserLower.includes("stuff")) {
        questionAnswer = "Yes, absolutely! We handle complete Search Engine Optimization (SEO) including technical audits, metadata configuration, keyword research, and Google indexing setup. For any website we build, standard SEO packages are included in our Basic and Standard subscription tiers.";
        if (nextState.service === "Website" && !nextState.features.includes("SEO Setup")) {
          nextState.features.push("SEO Setup");
        }
      } else if (lastUserLower.includes("design") || lastUserLower.includes("logo")) {
        questionAnswer = "Yes, TIA offers high-fidelity UI/UX design, visual branding, logo assets, and full corporate branding kits.";
      } else if (lastUserLower.includes("app") || lastUserLower.includes("mobile")) {
        questionAnswer = "Yes! We build cross-platform mobile apps for iOS and Android using React Native and Flutter.";
      }
    } else if (lastUserLower.includes("price") || lastUserLower.includes("cost") || lastUserLower.includes("how much")) {
      questionAnswer = "Our digital design and development subscription plans start at £199.99/mo (Basic), £399.99/mo (Standard), and £649.99/mo (Pro), supporting flexible scaling.";
    } else if (lastUserLower.includes("where") || lastUserLower.includes("location") || lastUserLower.includes("located")) {
      questionAnswer = "We are headquartered in London, United Kingdom, and deliver digital solutions to businesses globally.";
    } else if (lastUserLower.includes("phone") || lastUserLower.includes("number") || lastUserLower.includes("whatsapp") || lastUserLower.includes("contact")) {
      questionAnswer = "You can contact our sales advisors directly via phone/WhatsApp at **+44 7451 255217** or email at **sales@tiasoftwaresolutions.com**.";
    }

    // 7. Assemble the final reply
    let reply = "";
    if (questionAnswer) {
      reply += questionAnswer + "\n\n";
    } else if (correctionText) {
      reply += correctionText + "\n\n";
    }

    // Industry-specific value addition (Provide Expertise)
    let industryTips = "";
    const bizType = nextState.businessType || "";
    if (bizType.includes("Bike") || bizType.includes("Vehicle") || bizType.includes("Car")) {
      industryTips = "For bike or vehicle sellers, visitors convert best when they can view an interactive catalog listing, detailed photo galleries, vehicle specs, and a direct WhatsApp button to schedule test rides.";
    } else if (bizType.includes("Dental") || bizType.includes("Clinic") || bizType.includes("Dentist")) {
      industryTips = "For clinical practices, patients look for verified treatments, staff biographies, clinic images, and simple online appointment options to build absolute trust.";
    } else if (bizType.includes("Restaurant") || bizType.includes("Food")) {
      industryTips = "For food establishments, visitors appreciate interactive online menus, maps directories, and seamless table reservations to optimize conversions.";
    } else if (bizType.includes("Police")) {
      industryTips = "For community and public service hubs, users look for online enquiry forms, latest announcements dashboards, and contact support lines.";
    } else if (bizType.includes("Real Estate")) {
      industryTips = "For real estate agencies, visitors convert best when they can search listings, view high-quality property pictures, filter by location or price, and contact agents directly.";
    } else if (bizType.includes("Gym") || bizType.includes("Fitness")) {
      industryTips = "For fitness centers, clients look for class timetables, trainer bios, membership pricing options, and online registration sheets.";
    } else if (bizType.includes("Law") || bizType.includes("Legal")) {
      industryTips = "For legal firms, clients seek practice area summaries, lawyer bios, case results, client reviews, and direct consultation booking portals.";
    } else if (bizType.includes("Construction")) {
      industryTips = "For construction companies, customers look for portfolio galleries of past builds, lists of services, safety certifications, and request-a-quote estimators.";
    } else if (bizType.includes("Cleaning")) {
      industryTips = "For cleaning services, customers look for service lists, service areas, customer testimonials, and an online quote calculator.";
    }

    // Next missing question logic
    if (!nextState.service) {
      reply += `Hello! 👋 I'm TIA AI, your digital project consultant.

Are you looking to build a new Website, develop a Mobile App, optimize your Digital Marketing (SEO/Ads), or refresh your Brand Identity?`;
    } else if (!nextState.businessType) {
      reply += `I'd love to help you build your ${nextState.service}! To give you the best advice, what kind of business or industry is this project for?`;
    } else if (nextState.features.length === 0) {
      reply += `Got it! ${industryTips || `For a ${bizType} project, we recommend displaying clear services, galleries, customer reviews, and a simple lead capture form.`}

Would you like us to integrate these standard conversion features, or do you have specific options in mind?`;
      nextState.features = ["Standard Setup"];
    } else if (!nextState.pages) {
      if (industryTips && !correctionText && !questionAnswer) {
        reply += `${industryTips}\n\n`;
      }
      reply += `Approximately how many pages are we planning for this ${bizType} ${nextState.service}? (e.g. 5 pages, 10 pages, or not sure?)`;
    } else if (!nextState.budget) {
      let recommendedPlan = "Standard Plan (£399.99/mo)";
      if (nextState.pages && (nextState.pages.includes("5") || nextState.pages.includes("five"))) {
        recommendedPlan = "Basic Plan (£199.99/mo)";
      }
      reply += `Since we're building a ${nextState.pages} website for your ${bizType}, I recommend our **${recommendedPlan}**. This plan covers all design, development, SEO setups, and daily maintenance support.

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
    const isTest = typeof process !== "undefined" && process.env?.NODE_ENV === "test";

    if (isTest) {
      callbacks.onChunk(responseString);
      callbacks.onFinish(jsonResponse);
      return;
    }

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
