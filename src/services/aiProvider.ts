import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ChatMessage {
  role: "user" | "model" | "system";
  content: string;
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onFinish: (fullText: string) => void;
  onError: (error: Error) => void;
}

export interface AIProvider {
  streamChat(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void>;
}

// ----------------------------------------------------
// TIA Knowledge Base & System Prompt
// ----------------------------------------------------
export const TIA_SYSTEM_PROMPT = `
You are TIA AI, a professional 24/7 sales assistant for TIA Software Solutions.
Your goal is to help visitors understand our services, answer their questions, recommend solutions, and guide them toward starting a project or booking a consultation.

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
7. Video & Motion Graphics: Explainer videos, promotional videos, logo animations.
8. Stories & Reels Assets: Short-form videos (Reels, TikTok, Shorts), daily content assets.
9. Festive & Event Graphics: Holiday campaigns, teasers, RSVP designs, venue print layouts.

PRICING PLANS (All services operate on a subscription tier system, supporting GBP, USD, and AUD):
- Basic Plan: £199.99 / $199.99 USD / $285.41 AUD per month. Standard design, daily graphics, email support, 1 active project at a time.
- Standard Plan: £399.99 / $399.99 USD / $570.83 AUD per month. Standard website development & design, 2 active projects, faster response times.
- Pro Plan: £649.99 / $649.99 USD / $927.61 AUD per month. Advanced development, web/mobile app design, priority support, dedicated designer/developer.
- Premium Plan: £899.99 / $899.99 USD / $1,284.40 AUD per month. Complete digital solutions, unlimited active projects, 24/7 VIP support.
*Note: The exchange rate for AUD is exactly 1.4271 relative to USD.*

AI BEHAVIOR GUIDELINES:
- Be professional, welcoming, polite, and brief. Do not output massive walls of text. Keep responses conversational.
- Recommend suitable services based on what the user wants.
- Guide the user to click the "Book a consultation" button or use the inquiry form to start their project.
- If the user shows buying intent (e.g. asking to book, start, hire, price, subscribe, schedule), naturally encourage them to book a consultation or fill out the form.
- NEVER invent information. If you do not know something, politely ask them to contact our team directly at sales@tiasoftwaresolutions.com or +44 7451 255217.
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

  async streamChat(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        systemInstruction: TIA_SYSTEM_PROMPT,
      });

      // Map our message format to Gemini's format:
      // role: 'user' or 'model' (Gemini uses 'model' instead of 'assistant')
      const contents = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

      const result = await model.generateContentStream({
        contents,
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
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
      callbacks.onFinish(fullText);
    } catch (error) {
      callbacks.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

// ----------------------------------------------------
// Mock / Fallback Provider Implementation
// ----------------------------------------------------
export class MockProvider implements AIProvider {
  async streamChat(messages: ChatMessage[], callbacks: StreamCallbacks): Promise<void> {
    const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || "";

    let response = "";

    // Classification Rules:
    if (
      lastUserMessage.includes("book") ||
      lastUserMessage.includes("consultation") ||
      lastUserMessage.includes("hire") ||
      lastUserMessage.includes("start") ||
      lastUserMessage.includes("schedule") ||
      lastUserMessage.includes("call") ||
      lastUserMessage.includes("meeting") ||
      lastUserMessage.includes("contact your team")
    ) {
      response = `I'd love to help you book a consultation with our team!

You can click the **Book a consultation** button in the chat options to open our quick contact form, and we'll get back to you within 24 hours.

Alternatively, you can reach out directly via **WhatsApp** or call us at **+44 7451 255217** or email us at **sales@tiasoftwaresolutions.com**.

Would you like to start a project with us? I can collect your details right here!`;
    } else if (
      lastUserMessage.includes("price") ||
      lastUserMessage.includes("pricing") ||
      lastUserMessage.includes("cost") ||
      lastUserMessage.includes("how much") ||
      lastUserMessage.includes("rate") ||
      lastUserMessage.includes("tier") ||
      lastUserMessage.includes("plan")
    ) {
      response = `We offer flexible subscription plans to support brands at all stages. Here are our main pricing tiers:

• **Basic**: £199.99 / $199.99 USD / $285.41 AUD per month. Best for daily graphic design, social media assets, and basic support.
• **Standard**: £399.99 / $399.99 USD / $570.83 AUD per month. Perfect for standard website design, maintenance, and faster responses.
• **Pro**: £649.99 / $649.99 USD / $927.61 AUD per month. Ideal for advanced development, custom mobile apps, and a dedicated developer.
• **Premium**: £899.99 / $899.99 USD / $1,284.40 AUD per month. Full-suite agency solution with unlimited projects and 24/7 VIP support.

*Note: All plans are billed monthly, and we support GBP, USD, and AUD currencies.*

Which plan sounds like the best fit for your project?`;
    } else if (
      lastUserMessage.includes("website") ||
      lastUserMessage.includes("web site") ||
      lastUserMessage.includes("develop") ||
      lastUserMessage.includes("wordpress") ||
      lastUserMessage.includes("react") ||
      lastUserMessage.includes("nextjs") ||
      lastUserMessage.includes("e-commerce") ||
      lastUserMessage.includes("ecommerce")
    ) {
      response = `Website development is one of our core specialties at TIA! 

We build high-performance, responsive websites, e-commerce stores, custom web applications, and landing pages using modern technologies like React, Next.js, and WordPress. All our designs are premium, lightning-fast, and search engine optimized.

Are you looking to build a brand new site from scratch, or are you looking to redesign and optimize an existing website?`;
    } else if (
      lastUserMessage.includes("app") ||
      lastUserMessage.includes("mobile") ||
      lastUserMessage.includes("ios") ||
      lastUserMessage.includes("android") ||
      lastUserMessage.includes("react native")
    ) {
      response = `We design and build premium mobile applications for both iOS and Android. 

Whether you need a cross-platform app built with React Native to launch quickly or a custom mobile product, we manage everything from user journeys (UX) to publication on the App Store and Google Play Store.

What kind of app are you planning to build? I'd love to hear more about your vision!`;
    } else if (
      lastUserMessage.includes("seo") ||
      lastUserMessage.includes("marketing") ||
      lastUserMessage.includes("ads") ||
      lastUserMessage.includes("ppc") ||
      lastUserMessage.includes("google ranking")
    ) {
      response = `We provide complete digital marketing and SEO solutions to help your business get found and grow online.

Our services include:
• **SEO**: On-page, technical, and local optimization (to rank #1 on Google).
• **PPC**: Custom paid ad campaigns on Meta, Google, and LinkedIn.
• **Social Media Management**: Content scheduling, branding, and community building.

Are you looking to improve your organic Google ranking, run paid ads, or manage your social channels?`;
    } else if (lastUserMessage.includes("brand") || lastUserMessage.includes("logo") || lastUserMessage.includes("identity")) {
      response = `A cohesive brand identity is essential for stand-out businesses. We craft premium branding assets, including:

• Professional logo design
• Complete brand style guides (colors, fonts, usage)
• Social media kit assets
• Print stationery (business cards, letterheads)

Do you need a full brand identity from scratch, or are you looking to refresh an existing logo?`;
    } else if (
      lastUserMessage.includes("phone") ||
      lastUserMessage.includes("number") ||
      lastUserMessage.includes("email") ||
      lastUserMessage.includes("contact") ||
      lastUserMessage.includes("support") ||
      lastUserMessage.includes("address") ||
      lastUserMessage.includes("whatsapp")
    ) {
      response = `You can easily reach our team through these official channels:

• **WhatsApp / Phone**: +44 7451 255217
• **Email**: sales@tiasoftwaresolutions.com
• **Location**: London, United Kingdom

Would you like to book a direct consultation with us? You can click the **Book a consultation** button in the chat options to open our quick contact form!`;
    } else if (
      lastUserMessage.includes("hello") ||
      lastUserMessage.includes("hi ") ||
      lastUserMessage.startsWith("hi") ||
      lastUserMessage.includes("hey") ||
      lastUserMessage.includes("help") ||
      lastUserMessage.includes("services") ||
      lastUserMessage.includes("what can you do")
    ) {
      response = `Hello! 👋 I'm TIA AI, your sales and project assistant. 

I can help you with details about:
• Website & E-commerce Development
• Mobile App Development
• Digital Marketing & SEO
• Branding & UI/UX Design
• AI Automation
• Pricing subscriptions and custom quotes

How can I help you with your business goals today?`;
    } else {
      response = `That sounds very interesting! TIA Software Solutions has wide expertise across branding, web development, custom software, SEO, and digital marketing. 

To give you the most accurate advice, could you share a bit more about your project goals or timeline? 

Alternatively, you can book a free consultation by clicking **Book a consultation** below, or contact our team directly at **+44 7451 255217** or **sales@tiasoftwaresolutions.com**.`;
    }

    // Stream response chunk by chunk to mimic typing
    const words = response.split(" ");
    let currentText = "";
    let wordIndex = 0;

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex > 0 ? " " : "") + words[wordIndex];
        callbacks.onChunk(words[wordIndex] + " ");
        wordIndex++;
      } else {
        clearInterval(interval);
        callbacks.onFinish(response);
      }
    }, 45); // Typing speed simulator
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

/**
 * Checks whether the user's message contains buying intent
 */
export function detectBuyingIntent(message: string): boolean {
  const normalized = message.toLowerCase();
  const triggers = [
    "i need a website",
    "website pricing",
    "seo services",
    "mobile app development",
    "branding",
    "book a consultation",
    "contact your team",
    "hire you",
    "get a quote",
    "start a project",
    "buy a plan",
    "subscribe to",
    "how much does",
    "cost to build",
    "want a website",
    "pricing plans",
    "need an app",
  ];
  return triggers.some((trigger) => normalized.includes(trigger));
}
