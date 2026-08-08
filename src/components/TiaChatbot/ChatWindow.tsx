import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { getActiveProvider, LeadState, COUNTRY_CONFIG, extractCountryFromText } from "@/services/aiProvider";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import tiaBotIcon from "@/assets/tia-bot.webp";
import {
  Globe,
  Smartphone,
  TrendingUp,
  Palette,
  MessageSquare,
  Utensils,
  HeartPulse,
  Home,
  Briefcase,
  Hammer,
  ShoppingBag,
  Sparkles,
  Dumbbell,
  Bed,
  GraduationCap,
  Code2,
  Store,
  Car,
  Landmark,
  Layers,
  Laptop,
  Check,
  X,
  RefreshCw,
  Coins,
  Wallet,
  Banknote,
  HelpCircle,
  Zap,
  Calendar,
  Clock,
  Hourglass,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Phone,
  Mail,
  CheckCircle2,
  Instagram,
  Facebook,
  Linkedin
} from "lucide-react";

// Icon lookup helper
const iconMap: Record<string, any> = {
  Globe, Smartphone, TrendingUp, Palette, MessageSquare,
  Utensils, HeartPulse, Home, Briefcase, Hammer, ShoppingBag,
  Sparkles, Dumbbell, Bed, GraduationCap, Code2, Store, Car,
  Landmark, Layers, Laptop, Check, X, RefreshCw, Coins, Wallet,
  Banknote, HelpCircle, Zap, Calendar, Clock, Hourglass
};

interface ChatWindowProps {
  onClose: () => void;
}

// ----------------------------------------------------
// Legacy testing export preserved to satisfy unit tests
// ----------------------------------------------------
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

  const words = trimmed.split(/\s+/);
  if (words.length > 6) {
    return Object.keys(updates).length > 0 ? updates : null;
  }

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

// ----------------------------------------------------
// Type Definitions
// ----------------------------------------------------
interface Option {
  label: string;
  value: string;
  description: string;
  iconName: string;
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
  milestone: string;
  options: Option[];
  nextStep: (selections: Record<string, string>) => string | null;
}

interface RecommendationResult {
  packageName: string;
  price: string;
  timeline: string;
  features: string[];
  addons: string[];
  benefits: string[];
}

// ----------------------------------------------------
// Step Wizard Configuration
// ----------------------------------------------------
const STEPS: Step[] = [
  {
    id: "service",
    title: "Welcome to TIA Software Solutions",
    subtitle: "Select a digital service to start your interactive project configuration.",
    milestone: "Service",
    options: [
      { label: "Build a Website", value: "Website", iconName: "Globe", description: "Custom landing pages, e-commerce, and high-converting business sites." },
      { label: "Develop a Mobile App", value: "Mobile App", iconName: "Smartphone", description: "Native-grade iOS & Android applications tailored to your business." },
      { label: "Digital Marketing", value: "Digital Marketing", iconName: "TrendingUp", description: "Targeted SEO, content marketing, and performance advertising." },
      { label: "Branding & UI/UX", value: "Branding & UI/UX", iconName: "Palette", description: "Sleek logos, brand kits, and interactive product designs." },
      { label: "Software Development", value: "Software Development", iconName: "Code2", description: "Bespoke custom software, APIs, databases, and integrations." },
      { label: "Virtual Assistance", value: "Virtual Assistance", iconName: "Briefcase", description: "Dedicated virtual assistants for admin, support, and marketing." },
      { label: "Talk to Our Team", value: "Talk to Our Team", iconName: "MessageSquare", description: "Get direct contact details including email, phone, and social media." }
    ],
    nextStep: () => "industry"
  },
  {
    id: "industry",
    title: "What type of business do you have?",
    subtitle: "We customize the engineering and design patterns based on your industry.",
    milestone: "Industry",
    options: [
      { label: "Restaurant", value: "Restaurant", iconName: "Utensils", description: "Menu pages, reservation links, and ordering solutions." },
      { label: "Healthcare", value: "Healthcare", iconName: "HeartPulse", description: "Appointment bookings, clinic profiles, and patient info." },
      { label: "Real Estate", value: "Real Estate", iconName: "Home", description: "Property listings, realtor profiles, and contact capture." },
      { label: "Law Firm", value: "Law Firm", iconName: "Briefcase", description: "Service listings, attorney profiles, and legal inquiries." },
      { label: "Construction", value: "Construction", iconName: "Hammer", description: "Project portfolios, contractor quote forms, and service list." },
      { label: "E-commerce", value: "E-commerce", iconName: "ShoppingBag", description: "Online shopping carts, payments, and product galleries." },
      { label: "Beauty & Salon", value: "Beauty", iconName: "Sparkles", description: "Booking integrations, service lists, and lookbooks." },
      { label: "Gym & Fitness", value: "Gym", iconName: "Dumbbell", description: "Member plans, trainer profiles, and schedule bookings." },
      { label: "Hotel & Travel", value: "Hotel", iconName: "Bed", description: "Room listings, reservation engines, and tourism details." },
      { label: "Education", value: "Education", iconName: "GraduationCap", description: "Course lists, tutor profiles, and class schedulers." },
      { label: "Software / Tech", value: "Software Company", iconName: "Code2", description: "SaaS websites, interactive diagrams, and feature logs." },
      { label: "Retail Shop", value: "Retail", iconName: "Store", description: "Store location, hours, product display, and local queries." },
      { label: "Automotive", value: "Automotive", iconName: "Car", description: "Car/bike stock lists, service bookings, and test drive forms." },
      { label: "Finance", value: "Finance", iconName: "Landmark", description: "Calculator tools, loan schedules, and compliance info." },
      { label: "Other Business", value: "Other", iconName: "Layers", description: "Bespoke digital solutions for any unique business model." }
    ],
    nextStep: (sel) => {
      const s = sel["service"];
      if (s === "Website") return "website_scope";
      if (s === "Mobile App") return "app_platforms";
      if (s === "Digital Marketing") return "marketing_website";
      if (s === "Branding & UI/UX") return "branding_scope";
      if (s === "Software Development") return "team_topic";
      if (s === "Virtual Assistance") return "va_scope";
      return "budget";
    }
  },
  {
    id: "website_scope",
    title: "What is the scope of your website?",
    subtitle: "Choose the scale that best describes your requirements.",
    milestone: "Scope",
    options: [
      { label: "1–5 Pages", value: "1–5 Pages", iconName: "Globe", description: "Ideal for startups, landing pages, and business portfolios." },
      { label: "5–10 Pages", value: "5–10 Pages", iconName: "Laptop", description: "For growing brands requiring booking engines or service pages." },
      { label: "10–20 Pages", value: "10–20 Pages", iconName: "Layers", description: "For content-rich blogs, directory portals, or catalogs." },
      { label: "Enterprise", value: "Enterprise", iconName: "Code2", description: "Bespoke web applications, SaaS dashboards, and portal systems." },
      { label: "Not Sure", value: "Not Sure", iconName: "Layers", description: "Tell us what you need and we will recommend the best fit." }
    ],
    nextStep: () => "website_branding"
  },
  {
    id: "website_branding",
    title: "What is your branding status?",
    subtitle: "Do you have existing assets or do you need creative branding?",
    milestone: "Scope",
    options: [
      { label: "Existing Branding", value: "Existing Branding", iconName: "Check", description: "We have style guides, professional logos, and brand kit." },
      { label: "Need Branding", value: "Need Branding", iconName: "Sparkles", description: "We need brand logo design, color selection, and style guidelines." },
      { label: "Complete Rebrand", value: "Complete Rebrand", iconName: "RefreshCw", description: "We want to completely modernize our brand image." }
    ],
    nextStep: () => "budget"
  },
  {
    id: "app_platforms",
    title: "Which platforms are you targeting?",
    subtitle: "Determine the mobile build specifications.",
    milestone: "Platforms",
    options: [
      { label: "iOS App", value: "iOS App", iconName: "Smartphone", description: "Target Apple iPhones and iPads on the App Store." },
      { label: "Android App", value: "Android App", iconName: "Smartphone", description: "Target Android devices via the Google Play Store." },
      { label: "Both iOS & Android", value: "Both iOS & Android", iconName: "Smartphone", description: "Deliver native-grade builds for both mobile ecosystems." },
      { label: "Cross-platform", value: "Cross-platform", iconName: "Smartphone", description: "High-performance hybrid codebases (Flutter/React Native)." },
      { label: "Not Sure", value: "Not Sure", iconName: "Layers", description: "We will recommend the best deployment path." }
    ],
    nextStep: () => "app_features"
  },
  {
    id: "app_features",
    title: "What is the primary feature needed?",
    subtitle: "Choose the core functionality of your mobile app.",
    milestone: "Platforms",
    options: [
      { label: "User Accounts", value: "User Accounts", iconName: "Code2", description: "Secure profiles, user signups, and dashboard logins." },
      { label: "In-App Payments", value: "In-App Payments", iconName: "Landmark", description: "Subscriptions, marketplace checkouts, and stripe integrations." },
      { label: "Offline Syncing", value: "Offline Syncing", iconName: "RefreshCw", description: "Offline database access and local cache storage." },
      { label: "Push Notifications", value: "Push Notifications", iconName: "MessageSquare", description: "Direct updates, alerts, and transactional messages." },
      { label: "Custom Admin Panel", value: "Custom Admin Panel", iconName: "Store", description: "Manage user registrations, database logs, and analytical data." }
    ],
    nextStep: () => "budget"
  },
  {
    id: "marketing_website",
    title: "Do you have a current website?",
    subtitle: "Tell us where we will drive the ad traffic.",
    milestone: "Channels",
    options: [
      { label: "Yes", value: "Yes", iconName: "Check", description: "We have an active website ready to optimize." },
      { label: "No", value: "No", iconName: "X", description: "We do not have a website at this time." },
      { label: "Need One Built", value: "Need One Built", iconName: "Laptop", description: "We want a custom landing page built alongside ads." }
    ],
    nextStep: () => "marketing_channels"
  },
  {
    id: "marketing_channels",
    title: "Which marketing channels do you need?",
    subtitle: "Select your preferred client acquisition channel.",
    milestone: "Channels",
    options: [
      { label: "SEO Campaign", value: "SEO Campaign", iconName: "TrendingUp", description: "Rank organic keywords to get continuous unpaid traffic." },
      { label: "Social Media Ads", value: "Social Media Ads", iconName: "Sparkles", description: "Paid campaigns on Facebook, Instagram, and LinkedIn." },
      { label: "Google Ads (PPC)", value: "Google Ads (PPC)", iconName: "Globe", description: "Target high-intent search keywords for instant leads." },
      { label: "Brand Marketing", value: "Brand Marketing", iconName: "Palette", description: "High-end content design for brand recognition." }
    ],
    nextStep: () => "marketing_goals"
  },
  {
    id: "marketing_goals",
    title: "What is your primary marketing goal?",
    subtitle: "Define the key success metric for your campaigns.",
    milestone: "Channels",
    options: [
      { label: "Lead Generation", value: "Lead Generation", iconName: "MessageSquare", description: "Collect customer calls, email signups, and quotes." },
      { label: "Online Sales", value: "Online Sales", iconName: "ShoppingBag", description: "Increase purchases on your e-commerce shop." },
      { label: "Brand Awareness", value: "Brand Awareness", iconName: "Sparkles", description: "Educate audiences and establish authority." },
      { label: "Site Traffic", value: "Site Traffic", iconName: "TrendingUp", description: "Drive high-volume visits to your blog or web pages." }
    ],
    nextStep: () => "budget"
  },
  {
    id: "branding_scope",
    title: "What is your design scope?",
    subtitle: "Choose the deliverables you require.",
    milestone: "Scope",
    options: [
      { label: "Logo Design", value: "Logo Design", iconName: "Palette", description: "Professional logo concepts and brand files." },
      { label: "Brand Guidelines", value: "Brand Guidelines", iconName: "Layers", description: "Typography, color schemes, and styling rules." },
      { label: "UI/UX Web Design", value: "UI/UX Web Design", iconName: "Laptop", description: "Figma wireframes and interactive web layouts." },
      { label: "Full Brand Identity", value: "Full Brand Identity", iconName: "Sparkles", description: "Logo, guidelines, typography, assets, and branding kits." }
    ],
    nextStep: () => "budget"
  },
  {
    id: "team_topic",
    title: "What is the primary discussion topic?",
    subtitle: "Select the main area of inquiry for our developers.",
    milestone: "Topic",
    options: [
      { label: "Custom Software", value: "Custom Software", iconName: "Code2", description: "Internal systems, custom tools, and business automations." },
      { label: "E-commerce System", value: "E-commerce System", iconName: "ShoppingBag", description: "Complex digital stores and payment flows." },
      { label: "AI & Automation", value: "AI & Automation", iconName: "Sparkles", description: "AI integrations, automated workflows, and bot helpers." },
      { label: "Other Custom Project", value: "Other Custom Project", iconName: "Layers", description: "Discuss a fully custom software development project." }
    ],
    nextStep: () => "budget"
  },
  {
    id: "va_scope",
    title: "What assistance tasks are required?",
    subtitle: "Select the primary scope for your dedicated assistant.",
    milestone: "Scope",
    options: [
      { label: "Customer Support", value: "Customer Support", iconName: "MessageSquare", description: "Email handling, live chat support, and ticket management." },
      { label: "Data Entry & Admin", value: "Data Entry & Admin", iconName: "Layers", description: "CRM management, spreadsheet updates, and file organizing." },
      { label: "Social Media Management", value: "Social Media", iconName: "Sparkles", description: "Post scheduling, basic graphic design, and audience engagement." },
      { label: "Billing & Bookkeeping", value: "Bookkeeping", iconName: "Coins", description: "Invoice generation, expense tracking, and basic accounts." },
      { label: "General Admin VA", value: "General Admin", iconName: "Briefcase", description: "Calendar management, travel booking, and custom executive support." }
    ],
    nextStep: () => "budget"
  },
  {
    id: "budget",
    title: "What is your estimated investment budget?",
    subtitle: "We offer tailored tiers matching different scales.",
    milestone: "Budget",
    options: [
      { label: "Basic", value: "Basic", iconName: "Coins", description: "Cost-effective, essential digital solutions." },
      { label: "Standard", value: "Standard", iconName: "Wallet", description: "Full-featured premium quality for growing brands." },
      { label: "Premium", value: "Premium", iconName: "Banknote", description: "Bespoke engineering, speed, and analytics campaigns." },
      { label: "Not Sure", value: "Not Sure", iconName: "HelpCircle", description: "Flexible budget / require direct quote analysis." }
    ],
    nextStep: (sel) => {
      const s = sel["service"];
      if (s === "Digital Marketing" || s === "Software Development" || s === "Virtual Assistance") {
        return "country";
      }
      return "timeline";
    }
  },
  {
    id: "timeline",
    title: "What is your target launch timeline?",
    subtitle: "When do you plan to launch or execute?",
    milestone: "Timeline",
    options: [
      { label: "ASAP", value: "ASAP", iconName: "Zap", description: "Urgent deployment/launch requirements." },
      { label: "2 Weeks", value: "2 Weeks", iconName: "Calendar", description: "Accelerated development speed." },
      { label: "1 Month", value: "1 Month", iconName: "Clock", description: "Standard, structured execution schedule." },
      { label: "Flexible", value: "Flexible", iconName: "Hourglass", description: "Prioritise features and quality over urgency." }
    ],
    nextStep: () => "country"
  },
  {
    id: "country",
    title: "Where is your business located?",
    subtitle: "We localize pricing structures and team matching.",
    milestone: "Location",
    options: [
      { label: "United Kingdom", value: "UK", iconName: "Globe", description: "🇬🇧 Serving clients throughout the United Kingdom." },
      { label: "United States", value: "US", iconName: "Globe", description: "🇺🇸 Serving clients throughout the United States." },
      { label: "Australia", value: "AU", iconName: "Globe", description: "🇦🇺 Serving clients throughout Australia." }
    ],
    nextStep: () => null
  }
];

// Helper to calculate dynamic packages
export function getRecommendation(selections: Record<string, string>): RecommendationResult {
  const service = selections["service"];
  const country = selections["country"] || "UK";
  const budget = selections["budget"] || "Standard";

  const prices: Record<string, Record<string, string>> = {
    UK: { Basic: "£149.99/mo", Standard: "£299.99/mo", Pro: "£499.99/mo", Premium: "£699.99/mo" },
    US: { Basic: "$199.99/mo", Standard: "$399.99/mo", Pro: "$649.99/mo", Premium: "$899.99/mo" },
    AU: { Basic: "A$299.99/mo", Standard: "A$599.99/mo", Pro: "A$999.99/mo", Premium: "A$1,399.99/mo" }
  };

  const selectedPrices = prices[country] || prices.UK;

  if (service === "Website") {
    if (budget === "Basic") {
      return {
        packageName: "Basic Web Subscription",
        price: selectedPrices.Basic,
        timeline: "1-2 Weeks",
        features: ["1-5 responsive pages", "Core SEO architecture", "WhatsApp live contact link", "Premium hosting setup"],
        addons: ["Google Analytics dashboard", "Secure contact forms"],
        benefits: ["Rapid launch times", "Optimized loading speeds", "Zero upfront dev fees"]
      };
    } else if (budget === "Standard" || budget === "Not Sure") {
      return {
        packageName: "Standard Web Subscription",
        price: selectedPrices.Standard,
        timeline: "2-3 Weeks",
        features: ["5-10 responsive pages", "Custom styling & brand integration", "Interactive contact form", "Booking schedule plugin"],
        addons: ["Local Google Maps SEO setup", "Blog content management engine"],
        benefits: ["Double customer conversions", "Automated booking management", "Flexible CMS options"]
      };
    } else {
      return {
        packageName: "Pro Web Subscription",
        price: selectedPrices.Pro,
        timeline: "3-4 Weeks",
        features: ["10-20 bespoke pages", "Advanced animation framework", "Custom user profiles", "Third-party API integrations"],
        addons: ["Speed optimization guarantee", "Advanced admin management dashboard"],
        benefits: ["SaaS scalability ready", "Unique custom design identity", "Dedicated database backend"]
      };
    }
  } else if (service === "Mobile App") {
    const appPrice = budget === "Basic" ? selectedPrices.Standard : budget === "Standard" ? selectedPrices.Pro : selectedPrices.Premium;
    return {
      packageName: budget === "Premium" ? "Enterprise App Package" : "Premium App Subscription",
      price: appPrice,
      timeline: "4-6 Weeks",
      features: ["Cross-platform App deployment", "Interactive mobile UI/UX design", "Secure authentication modules", "Offline database syncing"],
      addons: ["App Store & Play Store publication support", "Custom push notifications backend"],
      benefits: ["Native iOS/Android performance", "High customer retention rates", "Sleek mobile branding presence"]
    };
  } else if (service === "Digital Marketing") {
    const marketingPrice = budget === "Basic" ? selectedPrices.Basic : budget === "Standard" ? selectedPrices.Standard : selectedPrices.Pro;
    return {
      packageName: "Performance Marketing Retainer",
      price: marketingPrice,
      timeline: "Monthly Execution",
      features: ["Full SEO campaign audits", "PPC Google search campaigns", "Meta social media ads setup", "Bi-weekly reporting & analytics dashboard"],
      addons: ["High-converting ad landing page", "Retargeting pixel tracking setup"],
      benefits: ["Direct inbound sales leads", "First page Google ranking boost", "Measurable ad spend ROI reports"]
    };
  } else if (service === "Branding & UI/UX") {
    const brandingPrice = budget === "Basic" ? selectedPrices.Basic : budget === "Standard" ? selectedPrices.Standard : selectedPrices.Pro;
    return {
      packageName: "Full Design & Branding Identity",
      price: brandingPrice,
      timeline: "1-2 Weeks",
      features: ["Custom logo design concepts", "Complete typography guidelines", "High-fidelity Figma wireframes", "Social media templates kit"],
      addons: ["Interactive design prototype preview", "High-resolution source file delivery"],
      benefits: ["Premium design look and feel", "Instant market credibility", "Consistent brand presentation"]
    };
  } else if (service === "Virtual Assistance") {
    if (budget === "Basic") {
      const vaBasic = country === "UK" ? "£199.99/mo" : country === "US" ? "$249.99/mo" : "A$349.99/mo";
      return {
        packageName: "Essential VA Subscription",
        price: vaBasic,
        timeline: "Immediate Start",
        features: ["10 hours per week dedicated support", "Email inbox & calendar management", "Basic CRM & data entry tasks", "Document editing and scheduling"],
        addons: ["Weekly performance breakdown", "Direct Slack/WhatsApp chat line"],
        benefits: ["Saves 10 operational hours/wk", "No employee overhead / benefits", "Fully trained & vetted agent"]
      };
    } else if (budget === "Standard" || budget === "Not Sure") {
      const vaStandard = country === "UK" ? "£379.99/mo" : country === "US" ? "$479.99/mo" : "A$679.99/mo";
      return {
        packageName: "Professional VA Subscription",
        price: vaStandard,
        timeline: "Immediate Start",
        features: ["20 hours per week dedicated support", "Customer live chat & email ticket handling", "Lead follow-up & CRM coordination", "Social media post scheduling & basic graphics"],
        addons: ["Daily progress reports", "Shared dashboard integration"],
        benefits: ["Delegate core admin tasks completely", "Boost customer response times", "Consistent execution week-to-week"]
      };
    } else {
      const vaPremium = country === "UK" ? "£699.99/mo" : country === "US" ? "$899.99/mo" : "A$1,299.99/mo";
      return {
        packageName: "Premium VA Subscription",
        price: vaPremium,
        timeline: "Immediate Start",
        features: ["Full-time support hours", "Custom operations support", "Bookkeeping & invoice creation", "Comprehensive administrative operations support"],
        addons: ["Priority agent matching", "Custom tool onboarding support"],
        benefits: ["Maximize administrative output", "1-on-1 direct operations scaling", "Comprehensive operations relief"]
      };
    }
  } else {
    return {
      packageName: "Custom Software Development",
      price: "Bespoke Pricing",
      timeline: "Tailored Schedule",
      features: ["Discovery and wireframing phases", "Scalable backend code architecture", "Dedicated team deployment model"],
      addons: ["Custom database integrations", "Dedicated cloud hosting environment"],
      benefits: ["Resolve complex operational bottlenecks", "100% custom operations tools", "Long-term scalability potential"]
    };
  }
}

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const { settings, whatsappLink } = useSiteSettings();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [activeStepId, setActiveStepId] = useState<string>("service");
  const [stepHistory, setStepHistory] = useState<string[]>([]);
  const [phase, setPhase] = useState<"onboarding" | "completion" | "chat" | "contact">("onboarding");

  // Chat follow-up states
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "model"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatTyping, setIsChatTyping] = useState(false);

  // Proposal contact form states
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalForm, setProposalForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [submittedProposal, setSubmittedProposal] = useState(false);

  // Book Consultation state
  const [showBookForm, setShowBookForm] = useState(false);
  const [bookSuccess, setBookSuccess] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Trigger onboarding active state for Mascot
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("tia-chatbot-opened"));
    window.dispatchEvent(new CustomEvent("tia-chatbot-onboarding-start"));

    // Hydrate from localStorage
    const savedComplete = localStorage.getItem("tia_onboarding_complete");
    const savedSelections = localStorage.getItem("tia_onboarding_selections");
    if (savedComplete === "true" && savedSelections) {
      try {
        const parsed = JSON.parse(savedSelections);
        setSelections(parsed);
        setPhase("completion");
        window.dispatchEvent(new CustomEvent("tia-chatbot-onboarding-complete"));
      } catch (e) {
        // Hydration error fallback
      }
    }

    return () => {
      window.dispatchEvent(new CustomEvent("tia-chatbot-closed"));
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatTyping]);

  const activeStep = STEPS.find(s => s.id === activeStepId) || STEPS[0];
  const service = selections["service"] || "Website";

  // Dynamic milestone checklist
  const milestonesByService: Record<string, string[]> = {
    "Website": ["Service", "Industry", "Scope", "Budget", "Timeline", "Location"],
    "Mobile App": ["Service", "Industry", "Platforms", "Budget", "Timeline", "Location"],
    "Digital Marketing": ["Service", "Industry", "Channels", "Budget", "Location"],
    "Branding & UI/UX": ["Service", "Industry", "Scope", "Budget", "Timeline", "Location"],
    "Software Development": ["Service", "Industry", "Topic", "Budget", "Location"],
    "Virtual Assistance": ["Service", "Industry", "Scope", "Budget", "Location"],
  };

  const activeMilestones = milestonesByService[service] || milestonesByService["Website"];

  // Mapping steps to milestones
  const stepIdToMilestoneMap: Record<string, string> = {
    service: "Service",
    industry: "Industry",
    website_scope: "Scope",
    website_branding: "Scope",
    app_platforms: "Platforms",
    app_features: "Platforms",
    marketing_website: "Channels",
    marketing_channels: "Channels",
    marketing_goals: "Channels",
    branding_scope: "Scope",
    team_topic: "Topic",
    budget: "Budget",
    timeline: "Timeline",
    country: "Location"
  };

  const getActiveMilestoneIndex = () => {
    const activeMilestone = stepIdToMilestoneMap[activeStepId] || "Service";
    return activeMilestones.indexOf(activeMilestone);
  };

  // Helper to format values for checklist
  const getMilestoneValue = (milestone: string) => {
    if (milestone === "Service") return selections["service"] || "—";
    if (milestone === "Industry") return selections["industry"] || "—";
    if (milestone === "Scope" || milestone === "Platforms" || milestone === "Channels" || milestone === "Topic") {
      const s = selections["service"];
      if (s === "Website") return selections["website_scope"] ? `${selections["website_scope"]}` : "—";
      if (s === "Mobile App") return selections["app_platforms"] ? `${selections["app_platforms"]}` : "—";
      if (s === "Digital Marketing") return selections["marketing_channels"] || "—";
      if (s === "Branding & UI/UX") return selections["branding_scope"] || "—";
      if (s === "Software Development") return selections["team_topic"] || "—";
      if (s === "Virtual Assistance") return selections["va_scope"] || "—";
      return "—";
    }
    if (milestone === "Budget") return selections["budget"] || "—";
    if (milestone === "Timeline") return selections["timeline"] || "—";
    if (milestone === "Location") return selections["country"] || "—";
    return "—";
  };

  // Handle card click
  const handleSelect = (val: string) => {
    if (activeStepId === "service" && val === "Talk to Our Team") {
      setSelections({ service: "Talk to Our Team" });
      setPhase("contact");
      window.dispatchEvent(new CustomEvent("tia-chatbot-onboarding-complete"));
      return;
    }

    const updated = { ...selections, [activeStepId]: val };
    
    // Explicit mappings for top-level keys
    if (activeStepId === "service") updated["service"] = val;
    if (activeStepId === "industry") updated["industry"] = val;
    if (activeStepId === "country") updated["country"] = val;

    setSelections(updated);

    const next = activeStep.nextStep(updated);
    if (next) {
      setStepHistory([...stepHistory, activeStepId]);
      setActiveStepId(next);
    } else {
      // Completed questionnaire!
      setPhase("completion");
      window.dispatchEvent(new CustomEvent("tia-chatbot-onboarding-complete"));
      localStorage.setItem("tia_onboarding_complete", "true");
      localStorage.setItem("tia_onboarding_selections", JSON.stringify(updated));
    }
  };

  // Back navigation
  const handleBack = () => {
    if (stepHistory.length > 0) {
      const prev = stepHistory[stepHistory.length - 1];
      setStepHistory(stepHistory.slice(0, -1));
      setActiveStepId(prev);
    }
  };

  // Restart onboarding wizard
  const handleRestart = () => {
    localStorage.removeItem("tia_onboarding_complete");
    localStorage.removeItem("tia_onboarding_selections");
    setSelections({});
    setActiveStepId("service");
    setStepHistory([]);
    setPhase("onboarding");
    setChatMessages([]);
    setShowProposalForm(false);
    setShowBookForm(false);
    setBookSuccess(false);
    setSubmittedProposal(false);
    window.dispatchEvent(new CustomEvent("tia-chatbot-onboarding-start"));
  };

  const handleBackToServices = () => {
    setSelections({});
    setActiveStepId("service");
    setStepHistory([]);
    setPhase("onboarding");
    window.dispatchEvent(new CustomEvent("tia-chatbot-onboarding-start"));
  };

  // Edit specific section helper
  const handleEditSection = (milestone: "Scope" | "Budget" | "Timeline") => {
    setPhase("onboarding");
    window.dispatchEvent(new CustomEvent("tia-chatbot-onboarding-start"));
    
    if (milestone === "Scope") {
      const s = selections["service"];
      const targetStep = s === "Website" ? "website_scope" :
                         s === "Mobile App" ? "app_platforms" :
                         s === "Digital Marketing" ? "marketing_website" :
                         s === "Branding & UI/UX" ? "branding_scope" :
                         s === "Virtual Assistance" ? "va_scope" : "team_topic";
      setActiveStepId(targetStep);
      // Re-create history leading up to target
      setStepHistory(["service", "industry"]);
    } else if (milestone === "Budget") {
      setActiveStepId("budget");
      const s = selections["service"];
      const scopeHistory = s === "Website" ? ["website_scope", "website_branding"] :
                           s === "Mobile App" ? ["app_platforms", "app_features"] :
                           s === "Digital Marketing" ? ["marketing_website", "marketing_channels", "marketing_goals"] :
                           s === "Branding & UI/UX" ? ["branding_scope"] : ["team_topic"];
      setStepHistory(["service", "industry", ...scopeHistory]);
    } else if (milestone === "Timeline") {
      setActiveStepId("timeline");
      const s = selections["service"];
      const scopeHistory = s === "Website" ? ["website_scope", "website_branding"] :
                           s === "Mobile App" ? ["app_platforms", "app_features"] :
                           s === "Branding & UI/UX" ? ["branding_scope"] : [];
      setStepHistory(["service", "industry", ...scopeHistory, "budget"]);
    }
  };

  // WhatsApp template redirect
  const handleWhatsAppRedirect = () => {
    const rec = getRecommendation(selections);
    const country = selections["country"] || "UK";
    const flag = country === "US" ? "🇺🇸" : country === "AU" ? "🇦🇺" : "🇬🇧";
    const text = `Hi TIA Digital Studio, I completed your digital consultant wizard! ${flag}\n\n• Service: ${selections["service"]}\n• Industry: ${selections["industry"]}\n• Scope: ${getMilestoneValue("Scope")}\n• Budget: ${selections["budget"]}\n• Timeline: ${selections["timeline"] || "N/A"}\n\nRecommended: ${rec.packageName} (${rec.price}). I'd like to discuss our official project proposal!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/447451234567?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  // Supabase lead submission for proposal request
  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.name.trim() || !proposalForm.email.trim()) return;

    setSubmittingProposal(true);
    try {
      const rec = getRecommendation(selections);
      const detailMsg = `[TIA DIGITAL CONSULTANT REDESIGN]
Service: ${selections["service"] || "N/A"}
Industry: ${selections["industry"] || "N/A"}
Scope/Pages: ${getMilestoneValue("Scope")}
Budget Preferred: ${selections["budget"] || "N/A"}
Timeline: ${selections["timeline"] || "N/A"}
Location: ${selections["country"] || "N/A"}
Recommended Package: ${rec.packageName} (${rec.price})
User Notes: ${proposalForm.notes.trim() || "None"}`;

      const { error } = await supabase.from("leads").insert({
        name: proposalForm.name.trim(),
        email: proposalForm.email.trim(),
        phone: proposalForm.phone.trim() || null,
        message: detailMsg,
        status: "new",
      });

      if (error) throw error;
      setSubmittedProposal(true);
      setTimeout(() => {
        setShowProposalForm(false);
      }, 3000);
    } catch (err) {
      console.error("Supabase lead submission failure:", err);
    } finally {
      setSubmittingProposal(false);
    }
  };

  // Mock booking calendar submission
  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookSuccess(true);
    // Auto-create a lead record in supabase for booked call
    try {
      const rec = getRecommendation(selections);
      await supabase.from("leads").insert({
        name: proposalForm.name.trim() || "Consultation Booking",
        email: proposalForm.email.trim() || "booking@temp.com",
        phone: proposalForm.phone.trim() || null,
        message: `[CONSULTATION BOOKING]
User requested discovery call.
Selections: Service: ${selections["service"]}, Industry: ${selections["industry"]}, Package: ${rec.packageName}`,
        status: "new",
      });
    } catch (e) {
      // Ignored
    }
    setTimeout(() => {
      setShowBookForm(false);
      setBookSuccess(false);
    }, 3000);
  };

  // Conversational AI Streaming Chat Trigger
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatTyping) return;

    const userText = chatInput.trim();
    setChatInput("");

    const newMsgs = [...chatMessages, { role: "user" as const, content: userText }];
    setChatMessages(newMsgs);
    setIsChatTyping(true);

    try {
      const rec = getRecommendation(selections);
      const systemPrompt = `You are TIA AI, the Senior Digital Solutions Consultant at TIA Software Solutions.
The user has completed our interactive project configurator. Here are their selections:
- Service: ${selections["service"] || "N/A"}
- Industry: ${selections["industry"] || "N/A"}
- Scope details: ${getMilestoneValue("Scope")}
- Budget Preference: ${selections["budget"] || "N/A"}
- Timeline: ${selections["timeline"] || "N/A"}
- Country: ${selections["country"] || "N/A"}

Recommended Package: ${rec.packageName} (${rec.price})
Estimated Timeline: ${rec.timeline}

Your task is to answer follow-up questions about this project and explain how TIA can execute it.
Speak with executive confidence, clarity, and genuine consultative insight. Keep answers brief (2-3 concise paragraphs maximum).
Never suggest we can't do the project. Always guide them toward scheduling a discovery call.`;

      // Seeding prompt
      const apiMessages = [
        { role: "system" as const, content: systemPrompt },
        ...newMsgs.map(m => ({ role: m.role === "user" ? ("user" as const) : ("model" as const), content: m.content }))
      ];

      const mappedLeadState: LeadState = {
        country: (selections["country"] as "UK" | "US" | "AU") || null,
        service: selections["service"] || null,
        businessType: selections["industry"] || null,
        pages: selections["service"] === "Website" ? selections["website_scope"] : null,
        features: selections["service"] === "Mobile App" ? [selections["app_features"]] : [],
        budget: selections["budget"] || null,
        timeline: selections["timeline"] || null,
      };

      const provider = getActiveProvider();
      let botReply = "";

      // Append typing item placeholder
      setChatMessages(prev => [...prev, { role: "model", content: "" }]);

      await provider.streamChat(
        apiMessages,
        mappedLeadState,
        null,
        {
          onChunk: (chunk) => {
            botReply += chunk;
            setChatMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].content = botReply;
              return updated;
            });
          },
          onFinish: (text) => {
            setIsChatTyping(false);
          },
          onError: (err) => {
            console.error("Streaming chat error:", err);
            setIsChatTyping(false);
            setChatMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].content = "I encountered a minor connection issue, but our team is ready to discuss your project! Let's book a consultation.";
              return updated;
            });
          }
        }
      );
    } catch (err) {
      console.error("Failed to execute chat stream:", err);
      setIsChatTyping(false);
    }
  };

  // Recommendation details for completion card
  const recommendation = getRecommendation(selections);

  return (
    <div className="fixed bottom-6 right-6 w-[92vw] sm:w-[750px] h-[600px] max-h-[85vh] rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden z-50 animate-scale-up">
      
      {/* Upper Title Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-primary/95 to-primary/80 text-primary-foreground flex items-center justify-between shadow-sm select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-white/20 overflow-hidden">
              <img src={tiaBotIcon} alt="TIA AI" className="w-full h-full object-cover" width={32} height={32} />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-primary animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">
              TIA Digital Consultant
            </h3>
            <p className="text-[10px] text-white/80">Premium Solutions Architect</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {phase !== "onboarding" && (
            <button
              onClick={handleRestart}
              className="text-[10px] font-semibold flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md transition-colors"
              title="Restart consultation"
            >
              <RefreshCw size={11} />
              Restart
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md hover:bg-white/15 flex items-center justify-center text-white/95 hover:text-white transition-colors"
            title="Minimize"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Main Panel Content Split */}
      <div className="flex-1 flex overflow-hidden bg-background/40">
        
        {/* Left Side: Live Project Summary Checklist (Tesla/Linear style) */}
        {phase !== "chat" && phase !== "contact" && (
          <div className="hidden sm:flex w-[220px] bg-muted/20 border-r border-border/50 p-4 flex-col justify-between shrink-0 select-none">
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Your Project</h4>
                <div className="w-full h-px bg-border/40 mb-3.5" />
              </div>

              <div className="space-y-3.5">
                {activeMilestones.map((milestone, idx) => {
                  const val = getMilestoneValue(milestone);
                  const isCompleted = val !== "—" && val !== "";
                  const activeMilestoneIdx = getActiveMilestoneIndex();
                  const isActive = idx === activeMilestoneIdx;
                  
                  return (
                    <div key={milestone} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        ) : isActive ? (
                          <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/40 relative">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-border/80 flex items-center justify-center shrink-0 text-muted-foreground/30">
                            <div className="w-1 h-1 rounded-full bg-border" />
                          </div>
                        )}
                        <span className={`text-xs font-semibold ${isCompleted ? 'text-foreground/90' : isActive ? 'text-primary font-bold' : 'text-muted-foreground/50'}`}>
                          {milestone}
                        </span>
                      </div>
                      {val && val !== "—" && (
                        <div className="pl-6 text-[10px] font-medium text-muted-foreground line-clamp-1">
                          {val}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[9px] text-muted-foreground/40 font-medium">
              TIA Digital Studio © {new Date().getFullYear()}
            </div>
          </div>
        )}

        {/* Right Side: Active Wizard Options Grid / Completion View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-card/10">
          
          {phase === "onboarding" && (
            <div className="flex-1 flex flex-col overflow-hidden p-5 sm:p-6">
              
              {/* Question Info */}
              <div className="mb-4 select-none shrink-0">
                <h2 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">
                  {activeStep.title}
                </h2>
                {activeStep.subtitle && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    {activeStep.subtitle}
                  </p>
                )}
              </div>

              {/* Scrollable option cards grid */}
              <div className="flex-1 overflow-y-auto pr-1 select-none space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeStep.options.map((opt) => {
                    const IconComp = iconMap[opt.iconName] || Globe;
                    const isSelected = selections[activeStep.id] === opt.value;
                    
                    return (
                      <div
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`group border rounded-xl p-3 flex items-start gap-3 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "bg-primary/5 border-primary shadow-sm"
                            : "bg-card/40 border-border/80 hover:bg-primary/5 hover:border-primary/20 hover:shadow-sm"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                        }`}>
                          <IconComp size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                            {opt.label}
                            {isSelected && <Check size={10} strokeWidth={3} className="text-primary" />}
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">
                            {opt.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wizard Back Navigation */}
              {stepHistory.length > 0 && (
                <div className="mt-4 pt-3.5 border-t border-border/40 flex justify-between shrink-0">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-bold flex items-center gap-1.5 border-border hover:bg-muted"
                  >
                    <ArrowLeft size={12} />
                    Back
                  </Button>
                </div>
              )}
            </div>
          )}

          {phase === "completion" && (
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin">
              
              {/* Header Splash */}
              <div className="text-center select-none">
                <span className="text-[24px]">🎉</span>
                <h2 className="text-base font-extrabold text-foreground mt-1">Consultation Complete</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Here's our recommendation tailored to your parameters.</p>
              </div>

              {/* Interactive Report View */}
              {!showProposalForm && !showBookForm ? (
                <div className="space-y-4">
                  
                  {/* Recommendation Card */}
                  <div className="border border-border/80 bg-card/60 backdrop-blur-sm rounded-xl p-4 shadow-sm space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border/50 gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Recommended Plan</span>
                        <h3 className="font-extrabold text-sm text-foreground mt-0.5">{recommendation.packageName}</h3>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-black text-foreground bg-primary/10 border border-primary/20 px-3 py-1 rounded-full inline-block">
                          {recommendation.price}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] leading-relaxed">
                      
                      {/* Features Bullet List */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Features Included</h4>
                        <ul className="space-y-1.5">
                          {recommendation.features.map(f => (
                            <li key={f} className="flex items-start gap-1.5 text-foreground/80 font-medium">
                              <Check size={11} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Benefits & Add-ons */}
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Target Timeline</h4>
                          <div className="font-bold text-foreground">{recommendation.timeline}</div>
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Business Impact</h4>
                          <ul className="space-y-1.5">
                            {recommendation.benefits.map(b => (
                              <li key={b} className="flex items-start gap-1.5 text-foreground/80 font-medium">
                                <span className="text-primary shrink-0 font-bold">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tesla-style Edit Selectors */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">Need to adjust requirements?</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => handleEditSection("Scope")}
                        variant="outline"
                        className="text-[10px] h-8 font-bold border-border/80 hover:bg-muted"
                      >
                        ✏ Edit Scope
                      </Button>
                      <Button
                        onClick={() => handleEditSection("Budget")}
                        variant="outline"
                        className="text-[10px] h-8 font-bold border-border/80 hover:bg-muted"
                      >
                        ✏ Edit Budget
                      </Button>
                      {selections["service"] !== "Digital Marketing" && selections["service"] !== "Software Development" && selections["service"] !== "Virtual Assistance" ? (
                        <Button
                          onClick={() => handleEditSection("Timeline")}
                          variant="outline"
                          className="text-[10px] h-8 font-bold border-border/80 hover:bg-muted"
                        >
                          ✏ Edit Timeline
                        </Button>
                      ) : (
                        <Button
                          disabled
                          variant="outline"
                          className="text-[10px] h-8 font-bold border-border/40 text-muted-foreground/30 opacity-55"
                        >
                          Fixed Timeline
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Actions Choice Panel */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">For more info contact us</h4>
                    <button
                      onClick={handleWhatsAppRedirect}
                      className="flex items-center gap-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/40 rounded-xl p-3.5 text-left transition-all w-full group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Phone size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">WhatsApp Us</h4>
                        <p className="text-[9px] text-muted-foreground font-medium">Instantly message your project configuration details to our team.</p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : showProposalForm ? (
                
                // Proposal request form
                <form onSubmit={handleProposalSubmit} className="border border-border/80 bg-card p-4 rounded-xl space-y-3.5 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <div>
                      <h3 className="font-extrabold text-xs text-foreground">Request Project Proposal</h3>
                      <p className="text-[9px] text-muted-foreground">Submit contact info to send specs to our sales engineers.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowProposalForm(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {submittedProposal ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center select-none">
                      <CheckCircle2 className="text-emerald-500 w-10 h-10 mb-2 animate-bounce" />
                      <h4 className="font-bold text-foreground text-xs">Request Received!</h4>
                      <p className="text-[10px] text-muted-foreground max-w-[240px] mt-0.5">
                        Your project configuration is sent. We will prepare your official proposal within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[9px] font-bold text-muted-foreground mb-0.5 block">Name *</label>
                          <input
                            type="text"
                            required
                            value={proposalForm.name}
                            onChange={(e) => setProposalForm({ ...proposalForm, name: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-muted-foreground mb-0.5 block">Email *</label>
                          <input
                            type="email"
                            required
                            value={proposalForm.email}
                            onChange={(e) => setProposalForm({ ...proposalForm, email: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-muted-foreground mb-0.5 block">Phone Number</label>
                        <input
                          type="tel"
                          value={proposalForm.phone}
                          onChange={(e) => setProposalForm({ ...proposalForm, phone: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="+44 7..."
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-muted-foreground mb-0.5 block">Additional Notes</label>
                        <textarea
                          value={proposalForm.notes}
                          onChange={(e) => setProposalForm({ ...proposalForm, notes: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary h-14 resize-none"
                          placeholder="e.g. key integrations needed, competitor references..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={submittingProposal}
                        className="w-full text-xs font-bold bg-primary hover:bg-primary/95 text-primary-foreground shadow"
                      >
                        {submittingProposal ? <Loader2 size={12} className="animate-spin" /> : "Submit Proposal Request"}
                      </Button>
                    </div>
                  )}
                </form>
              ) : (
                
                // Book Consultation schedule form
                <form onSubmit={handleBookSubmit} className="border border-border/80 bg-card p-4 rounded-xl space-y-3.5 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <div>
                      <h3 className="font-extrabold text-xs text-foreground">Schedule Discovery Call</h3>
                      <p className="text-[9px] text-muted-foreground">Select your preferences to book a 15-minute consultation.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowBookForm(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {bookSuccess ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center select-none">
                      <CheckCircle2 className="text-emerald-500 w-10 h-10 mb-2 animate-bounce" />
                      <h4 className="font-bold text-foreground text-xs">Consultation Scheduled!</h4>
                      <p className="text-[10px] text-muted-foreground max-w-[240px] mt-0.5">
                        Our lead solution architect will email you confirmation details.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[9px] font-bold text-muted-foreground mb-0.5 block">Prefered Date</label>
                          <input
                            type="date"
                            required
                            className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-muted-foreground mb-0.5 block">Time Slot</label>
                          <select className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary">
                            <option>Morning (09:00 - 12:00)</option>
                            <option>Afternoon (12:00 - 17:00)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[9px] font-bold text-muted-foreground mb-0.5 block">Your Name</label>
                          <input
                            type="text"
                            required
                            value={proposalForm.name}
                            onChange={(e) => setProposalForm({ ...proposalForm, name: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-muted-foreground mb-0.5 block">Email</label>
                          <input
                            type="email"
                            required
                            value={proposalForm.email}
                            onChange={(e) => setProposalForm({ ...proposalForm, email: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full text-xs font-bold bg-primary hover:bg-primary/95 text-primary-foreground shadow"
                      >
                        Book Discovery Session
                      </Button>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

          {phase === "contact" && (
            <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-5 space-y-4 max-w-md mx-auto animate-fade-in overflow-hidden">
              <div className="text-center select-none space-y-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-1 border border-primary/20">
                  <MessageSquare size={18} className="animate-pulse" />
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight">Talk to Our Team</h2>
                <p className="text-[11px] text-muted-foreground leading-normal max-w-[280px] mx-auto">
                  Have a custom requirement? Connect with our team directly through our official channels.
                </p>
              </div>

              {/* Contact Channels Card */}
              <div className="w-full border border-border/80 bg-card/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-sm space-y-2">
                {/* Email Channel */}
                <a
                  href={`mailto:${settings.email || "sales@tiasoftwaresolutions.com"}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/15 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <Mail size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Email Us</div>
                    <div className="text-xs font-semibold text-foreground truncate mt-0.5">
                      {settings.email || "sales@tiasoftwaresolutions.com"}
                    </div>
                  </div>
                </a>

                {/* Phone Channel */}
                <a
                  href={`tel:${(settings.phone || "+44 7451 255217").replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/15 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <Phone size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Call Us</div>
                    <div className="text-xs font-semibold text-foreground truncate mt-0.5">
                      {settings.phone || "+44 7451 255217"}
                    </div>
                  </div>
                </a>

                {/* WhatsApp Channel */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                    <Smartphone size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">WhatsApp Us</div>
                    <div className="text-xs font-semibold text-foreground truncate mt-0.5">
                      Send a message on WhatsApp
                    </div>
                  </div>
                </a>
              </div>

              {/* Social Media Links */}
              <div className="w-full space-y-1.5">
                <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-center select-none">
                  Follow Our Socials
                </div>
                <div className="flex justify-center gap-2.5">
                  {settings.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all"
                      aria-label="Instagram"
                    >
                      <Instagram size={14} />
                    </a>
                  )}
                  {settings.facebook_url && (
                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all"
                      aria-label="Facebook"
                    >
                      <Facebook size={14} />
                    </a>
                  )}
                  {settings.linkedin_url && (
                    <a
                      href={settings.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={14} />
                    </a>
                  )}
                  <a
                    href="https://x.com/tiasoftwares"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all"
                    aria-label="X (Twitter)"
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Back Button */}
              <div className="pt-1.5 select-none w-full">
                <Button
                  onClick={handleBackToServices}
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs font-bold flex items-center justify-center gap-1.5 border-border hover:bg-muted"
                >
                  <ArrowLeft size={12} />
                  Back to Services
                </Button>
              </div>
            </div>
          )}

          {phase === "chat" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-background/5 p-4 justify-between">
              
              {/* Chat Header Navigation back to report */}
              <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0 select-none">
                <button
                  onClick={() => setPhase("completion")}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  <ArrowLeft size={12} />
                  Back to Consultation Report
                </button>
                <span className="text-[10px] text-muted-foreground">TIA Assistant Agent</span>
              </div>

              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 scrollbar-thin">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-2.5 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse ml-auto" : "self-start"}`}
                  >
                    {msg.role !== "user" && (
                      <div className="w-7 h-7 rounded-full bg-white border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden select-none">
                        <img src={tiaBotIcon} alt="TIA AI" className="w-full h-full object-cover" width={28} height={28} />
                      </div>
                    )}
                    <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none font-medium"
                        : "bg-card border border-border text-foreground rounded-tl-none font-medium"
                    }`}>
                      {msg.content === "" ? (
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-75" />
                          <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-150" />
                          <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-300" />
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {isChatTyping && chatMessages[chatMessages.length - 1]?.content !== "" && (
                  <div className="flex gap-2.5 max-w-[85%] self-start animate-pulse">
                    <div className="w-7 h-7 rounded-full bg-white border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={tiaBotIcon} alt="TIA AI" className="w-full h-full object-cover" width={28} height={28} />
                    </div>
                    <div className="rounded-xl px-3.5 py-2.5 bg-card border border-border text-foreground rounded-tl-none shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-75" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-border shrink-0 select-none">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ask about plan details, stack, hosting..."
                  maxLength={400}
                />
                <Button
                  type="submit"
                  disabled={!chatInput.trim() || isChatTyping}
                  size="icon"
                  className="w-8.5 h-8.5 rounded-xl shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground shadow"
                >
                  <Send size={11} />
                </Button>
              </form>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
