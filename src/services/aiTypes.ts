export interface RegionConfig {
  country: "UK" | "US" | "AU";
  name: string;
  currency: "GBP" | "USD" | "AUD";
  symbol: string;
  flag: string;
  timezone: string;
  locale: string;
}

export const COUNTRY_CONFIG: Record<"UK" | "US" | "AU", RegionConfig> = {
  UK: {
    country: "UK",
    name: "United Kingdom",
    currency: "GBP",
    symbol: "£",
    flag: "🇬🇧",
    timezone: "Europe/London",
    locale: "en-GB"
  },
  US: {
    country: "US",
    name: "United States",
    currency: "USD",
    symbol: "$",
    flag: "🇺🇸",
    timezone: "America/New_York",
    locale: "en-US"
  },
  AU: {
    country: "AU",
    name: "Australia",
    currency: "AUD",
    symbol: "A$",
    flag: "🇦🇺",
    timezone: "Australia/Sydney",
    locale: "en-AU"
  }
};

export function extractCountryFromText(text: string): "UK" | "US" | "AU" | null {
  if (!text) return null;
  const lower = text.toLowerCase().trim();

  if (text.includes("🇬🇧") || text.includes("£") || lower.includes("gbp") || lower.includes("great britain") || lower.includes("london uk")) {
    return "UK";
  }
  if (text.includes("🇦🇺") || text.includes("a$") || lower.includes("aud") || lower.includes("australia")) {
    return "AU";
  }
  if (text.includes("🇺🇸") || (text.includes("$") && !text.includes("a$")) || lower.includes("usd") || lower.includes("united states")) {
    return "US";
  }

  const ukKeywords = [
    "uk", "gb", "united kingdom", "great britain", "britain", "england", "scotland", "wales", "northern ireland",
    "london", "manchester", "birmingham", "liverpool", "leeds", "bristol", "glasgow", "edinburgh", "belfast", "cardiff"
  ];
  if (ukKeywords.some(k => new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i").test(lower))) {
    return "UK";
  }

  const usKeywords = [
    "us", "usa", "united states", "america",
    "texas", "california", "florida", "new york", "chicago", "los angeles", "miami", "dallas", "seattle", "houston",
    "boston", "atlanta", "denver", "san francisco", "austin", "washington", "ohio", "phoenix"
  ];
  if (usKeywords.some(k => new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i").test(lower))) {
    return "US";
  }

  const auKeywords = [
    "au", "australia", "aussie",
    "sydney", "melbourne", "brisbane", "perth", "adelaide", "gold coast", "canberra", "queensland", "victoria", "nsw"
  ];
  if (auKeywords.some(k => new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i").test(lower))) {
    return "AU";
  }

  return null;
}

export interface LeadState {
  country: "UK" | "US" | "AU" | null;
  service: string | null;
  businessType: string | null;
  pages: string | null;
  features: string[];
  budget: string | null;
  timeline: string | null;
}

export interface RecommendedPackage {
  name: string;
  price: string;
  description: string;
}

export interface ReportData {
  businessType: string;
  service: string;
  scope: string;
  pages: string;
  features: string[];
  budget: string;
  timeline: string;
  leadScore: number;
  readinessPercentage: number;
  confidenceLevel: "High Confidence" | "Medium Confidence" | "Low Confidence";
  status: "Ready for Quotation" | "More Information Required";
  recommendedPackage: RecommendedPackage;
}

export interface ReportExplanations {
  executiveSummary: string;
  whyThisPackage: string;
  immediateBenefits: string[];
  longTermBenefits: string[];
  potentialConsiderations: string[];
  futureGrowth: string[];
  nextSteps: string[];
}

const REGIONAL_PRICES = {
  UK: { basic: "£199.99/mo", standard: "£399.99/mo", pro: "£649.99/mo", premium: "£899.99/mo" },
  US: { basic: "$249.99/mo", standard: "$499.99/mo", pro: "$799.99/mo", premium: "$1,099.99/mo" },
  AU: { basic: "A$349.99/mo", standard: "A$699.99/mo", pro: "A$1,099.99/mo", premium: "A$1,499.99/mo" }
};

export function recommendPackage(leadState: LeadState): RecommendedPackage {
  const service = (leadState.service || "").toLowerCase();
  const pagesStr = (leadState.pages || "").toLowerCase();
  const budgetStr = (leadState.budget || "").toLowerCase();
  const country = leadState.country || "UK";
  const prices = REGIONAL_PRICES[country] || REGIONAL_PRICES.UK;

  const matchPages = pagesStr.match(/\b(\d+)\b/);
  const pageCount = matchPages ? parseInt(matchPages[1], 10) : 5;

  if (service.includes("app") || service.includes("mobile") || budgetStr.includes("premium") || budgetStr.includes("899") || budgetStr.includes("1099") || budgetStr.includes("1499")) {
    return {
      name: "Premium Plan",
      price: prices.premium,
      description: "Custom native iOS/Android mobile apps, advanced database integrations, full SEO campaigns, and custom dashboards."
    };
  }
  if (service.includes("automation") || pageCount > 10 || budgetStr.includes("pro") || budgetStr.includes("649") || budgetStr.includes("799") || budgetStr.includes("1099")) {
    return {
      name: "Pro Plan",
      price: prices.pro,
      description: "E-commerce online stores, custom Web Apps, AI automations, user login portals, and dedicated cloud hosting support."
    };
  }
  if (pageCount > 5 || budgetStr.includes("standard") || budgetStr.includes("399") || budgetStr.includes("499") || budgetStr.includes("699")) {
    return {
      name: "Standard Plan",
      price: prices.standard,
      description: "Growing businesses, interactive websites, service booking calendars, custom styling, and performance tuning."
    };
  }
  return {
    name: "Basic Plan",
    price: prices.basic,
    description: "Small business websites, simple landing pages, brand kits, responsive design, core SEO, and WhatsApp integration."
  };
}

export function buildReportData(leadState: LeadState, score: number = 100): ReportData | null {
  if (!leadState.service || !leadState.businessType || !leadState.pages || !leadState.budget || !leadState.timeline) {
    return null;
  }

  const country = leadState.country || "UK";
  const stateWithCountry = { ...leadState, country };
  const pkg = recommendPackage(stateWithCountry);
  const filledCount = [leadState.service, leadState.businessType, leadState.pages, leadState.budget, leadState.timeline, country].filter(Boolean).length;
  const readinessPercentage = Math.min(100, Math.round((filledCount / 6) * 100));

  const confidenceLevel: "High Confidence" | "Medium Confidence" | "Low Confidence" = 
    readinessPercentage >= 90 ? "High Confidence" : readinessPercentage >= 60 ? "Medium Confidence" : "Low Confidence";

  return {
    businessType: leadState.businessType,
    service: leadState.service,
    scope: leadState.pages,
    pages: leadState.pages,
    features: leadState.features || [],
    budget: leadState.budget,
    timeline: leadState.timeline,
    leadScore: score,
    readinessPercentage,
    confidenceLevel,
    status: readinessPercentage === 100 ? "Ready for Quotation" : "More Information Required",
    recommendedPackage: pkg,
  };
}

export function sanitizeLeadState(state: Record<string, unknown> | null | undefined): LeadState {
  let country: "UK" | "US" | "AU" | null = null;
  if (state && (state.country === "UK" || state.country === "US" || state.country === "AU")) {
    country = state.country as "UK" | "US" | "AU";
  }

  const validServices = [
    "Website",
    "Mobile App",
    "Digital Marketing",
    "Branding",
    "UI/UX Design",
    "AI Automation"
  ];

  let service = state?.service;
  if (typeof service === "string") {
    const trimmed = service.trim();
    const matched = validServices.find(s => s.toLowerCase() === trimmed.toLowerCase());
    if (matched) {
      service = matched;
    } else {
      const lower = trimmed.toLowerCase();
      if (lower.includes("website") || lower.includes("web site") || lower.includes("web app") || lower.includes("webapp")) {
        service = "Website";
      } else if (lower.includes("app") || lower.includes("mobile") || lower.includes("ios") || lower.includes("android")) {
        service = "Mobile App";
      } else if (lower.includes("marketing") || lower.includes("seo") || lower.includes("ppc") || lower.includes("ad")) {
        service = "Digital Marketing";
      } else if (lower.includes("brand") || lower.includes("logo")) {
        service = "Branding";
      } else if (lower.includes("design") || lower.includes("ui") || lower.includes("ux")) {
        service = "UI/UX Design";
      } else if (lower.includes("automation") || lower.includes("bot") || lower.includes("ai")) {
        service = "AI Automation";
      } else {
        service = null;
      }
    }
  } else {
    service = null;
  }

  return {
    country,
    service,
    businessType: typeof state?.businessType === "string" ? state.businessType : null,
    pages: typeof state?.pages === "string" ? state.pages : null,
    features: Array.isArray(state?.features) ? state.features.filter((f: unknown) => typeof f === "string") as string[] : [],
    budget: typeof state?.budget === "string" ? state.budget : null,
    timeline: typeof state?.timeline === "string" ? state.timeline : null,
  };
}

export function getFallbackExplanations(data: ReportData): ReportExplanations {
  const biz = data.businessType || "your business";
  const srv = data.service || "digital solution";
  const pkg = data.recommendedPackage.name;

  return {
    executiveSummary: `Based on our digital consultation, TIA Software Solutions has prepared this tailored Project Consultation Report for your ${biz}. We have aligned your strategic goals for a high-performance ${srv} with our proven engineering methodology.\n\nThis proposed solution focuses on establishing a high-converting digital presence, streamlining customer interactions, and establishing a solid foundation for measurable business growth.`,
    whyThisPackage: `The ${pkg} is specifically selected for your ${biz} project because it provides the optimal balance of functional capacity (${data.pages}), performance architecture, and long-term scalability without unnecessary overhead.`,
    immediateBenefits: [
      "Professional online presence tailored to your industry standard",
      "Enhanced customer trust and immediate brand credibility",
      "Seamless mobile-first responsive experience across all screen sizes",
      "Direct lead capture and streamlined inquiry workflows"
    ],
    longTermBenefits: [
      "Robust Search Engine Optimization (SEO) foundation for organic search growth",
      "High-performance architecture built for long-term scalability",
      "Increased digital asset value and brand equity",
      "Flexible foundation allowing effortless future module expansion"
    ],
    potentialConsiderations: [
      `High-resolution visual assets and professional content for ${biz}`,
      "Google Business Profile optimization and Google Maps integration",
      "Automated customer inquiry handling and notification workflows"
    ],
    futureGrowth: [
      "Targeted Google Ads & Meta Paid Acquisition Campaigns",
      "AI Customer Support Assistant Integration",
      "Dedicated Mobile Application Development (iOS & Android)"
    ],
    nextSteps: [
      "Review this recommendation and project profile summary.",
      "Schedule a 15-minute consultation with our lead software architect.",
      "Receive your official, itemized proposal and quotation.",
      "Kickoff development and begin project execution."
    ]
  };
}
