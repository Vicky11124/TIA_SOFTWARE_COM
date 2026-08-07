import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useGeo } from "@/contexts/GeoContext";

type Plan = {
  id: string;
  name: string;
  price: string;
  price_usd: string;
  features: string[];
  is_popular: boolean;
};

const fallbackPlans: Plan[] = [
  {
    id: "web-1",
    name: "Professional Website",
    price: "249",
    price_usd: "329",
    features: [
      "Custom Website Design & Modern UI",
      "Fully Responsive Layout",
      "Up to 5 Pages",
      "Contact Form & WhatsApp Integration",
      "Google Maps Integration",
      "Basic SEO Setup & Analytics Setup",
      "Google Search Console Setup",
      "Basic Performance & Scroll Animations",
      "Browser Compatibility & Clean Code",
      "Live Deployment & Verification",
      "not:Technical & On-Page SEO Optimization",
      "not:XML Sitemap, Robots.txt & Canonical URLs",
      "not:Advanced Performance & Media Optimization"
    ],
    is_popular: false
  },
  {
    id: "web-2",
    name: "Premium Website",
    price: "399",
    price_usd: "499",
    features: [
      "Premium UI/UX & Custom Design",
      "Up to 20 Pages",
      "On-Page & Technical SEO Setup",
      "XML Sitemap, Robots.txt & Canonical URLs",
      "Open Graph & Twitter/X Social Cards",
      "Google Tag Manager & Schema Markup",
      "Advanced Performance & Media Optimization",
      "Core Web Vitals Optimization",
      "Advanced Scroll Animations & Transitions",
      "Accessibility Optimization (WCAG compliant)",
      "100% Secure, Clean Code & Deployment"
    ],
    is_popular: true
  }
];

const fallbackAdsPlans: Plan[] = [
  {
    id: "ads-1",
    name: "Professional Ads",
    price: "199",
    price_usd: "249",
    features: [
      "Google Ads & Meta Ads Setup",
      "Campaign Strategy & Planning",
      "Ad Copywriting & Basic Banner Design",
      "Basic Audience Targeting & Keyword Research",
      "Basic Conversion Tracking Setup",
      "Google Analytics Integration",
      "Competitor Analysis & Campaign Optimization",
      "Weekly 2 Posts Social Media Management",
      "Content Creation & Design (2 Posts / Week)",
      "Hashtag Research & Basic Community Engagement",
      "Monthly Report & Dedicated Support",
      "not:Google Tag Manager & Meta Pixel Integration",
      "not:A/B Testing & Video/Reels Management"
    ],
    is_popular: false
  },
  {
    id: "ads-2",
    name: "Premium Ads",
    price: "299",
    price_usd: "379",
    features: [
      "Everything in Professional Ads",
      "Google Ads & Meta Ads Setup",
      "Campaign Strategy & Planning",
      "Ad Copywriting & Advanced Banner Design",
      "Advanced Audience Targeting & Keyword Research",
      "Advanced Conversion & Pixel Tracking Setup",
      "Google Tag Manager & Meta Pixel Setup",
      "Advanced Campaign & Competitor Optimization",
      "A/B Split Testing & High-ROI campaigns",
      "Weekly 3 Posts (1 Video + 2 Posts) Management",
      "Content Creation (1 Video + 2 Posts / Week)",
      "Advanced Community & Hashtag Optimization",
      "Detailed Weekly Reports & Dedicated Support"
    ],
    is_popular: true
  }
];

const fallbackOldPlans: Plan[] = [
  {
    id: "old-1",
    name: "Basic",
    price: "149.99",
    price_usd: "199.99",
    features: [
      "Logo Design (2-3 concepts)",
      "Business Card Design",
      "Basic Brand Identity",
      "2 Rounds of Revisions",
      "Social Media Graphics",
      "Standard Turnaround Time",
      "Basic Website (Hosting, Domain & 2 Emails)"
    ],
    is_popular: false
  },
  {
    id: "old-2",
    name: "Standard",
    price: "299.99",
    price_usd: "399.99",
    features: [
      "Everything in the Basic Plan",
      "Social Media Templates & Banners",
      "Presentation/Deck Design",
      "2 Rounds of Revisions",
      "Standard Turnaround Time"
    ],
    is_popular: false
  },
  {
    id: "old-3",
    name: "Pro",
    price: "499.99",
    price_usd: "649.99",
    features: [
      "Everything in the Standard Plan",
      "Packaging & Merchandise Design",
      "Motion Graphics / Animated Content",
      "Unlimited Revisions",
      "Social Media Promotions",
      "Express Turnaround Time"
    ],
    is_popular: true
  },
  {
    id: "old-4",
    name: "Premium",
    price: "699.99",
    price_usd: "899.99",
    features: [
      "Everything in the Pro Plan",
      "UX/UI Design for Apps & Websites",
      "Virtual Assistance",
      "Dedicated Account Manager",
      "ERP Tool (Any one module)"
    ],
    is_popular: false
  }
];

const planPricing: Record<string, {
  UK: { price: string; original?: string };
  US: { price: string; original?: string };
  AU: { price: string; original?: string };
}> = {
  "basic": {
    UK: { price: "149.99", original: "249.99" },
    US: { price: "199.99", original: "299.99" },
    AU: { price: "289.99", original: "399.99" }
  },
  "standard": {
    UK: { price: "299.99", original: "449.99" },
    US: { price: "399.99", original: "599.99" },
    AU: { price: "579.99", original: "799.99" }
  },
  "pro": {
    UK: { price: "499.99", original: "699.99" },
    US: { price: "649.99", original: "899.99" },
    AU: { price: "939.99", original: "1,299.99" }
  },
  "premium": {
    UK: { price: "699.99", original: "999.99" },
    US: { price: "899.99", original: "1,299.99" },
    AU: { price: "1,299.99", original: "1,799.99" }
  },
  "professional website": {
    UK: { price: "249", original: "399" },
    US: { price: "329", original: "499" },
    AU: { price: "479", original: "729" }
  },
  "premium website": {
    UK: { price: "399", original: "599" },
    US: { price: "499", original: "799" },
    AU: { price: "729", original: "1,159" }
  },
  "professional ads": {
    UK: { price: "199", original: "299" },
    US: { price: "249", original: "399" },
    AU: { price: "359", original: "569" }
  },
  "premium ads": {
    UK: { price: "299", original: "449" },
    US: { price: "379", original: "599" },
    AU: { price: "539", original: "799" }
  }
};

const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const { whatsappLink } = useSiteSettings();
  const { geo, currencySymbol } = useGeo();

  useEffect(() => {
    supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPlans(data);
        }
      });
  }, []);

  const oldPlans = plans.filter(p => ["basic", "standard", "pro", "premium"].includes(p.name.toLowerCase()));
  const displayOldPlans = oldPlans.length > 0 ? oldPlans : fallbackOldPlans;

  const websitePlans = plans.filter(p => p.name.toLowerCase().includes("website"));
  const displayWebsitePlans = websitePlans.length > 0 ? websitePlans : fallbackPlans;

  const adsPlans = plans.filter(p => p.name.toLowerCase().includes("ads"));
  const displayAdsPlans = adsPlans.length > 0 ? adsPlans : fallbackAdsPlans;

  const PlanCard = ({ plan, i, isAds = false }: { plan: Plan; i: number; isAds?: boolean }) => {
    const isPremiumWebsite = plan.name.toLowerCase() === "premium website";
    const isPremiumAds = plan.name.toLowerCase() === "premium ads";

    // Lookup prices from planPricing based on geo
    const pricing = planPricing[plan.name.toLowerCase()]?.[geo];
    const price = pricing ? pricing.price : (geo === "US" && plan.price_usd ? plan.price_usd : plan.price);
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.1, duration: 0.5 }}
        className={`glass-card p-8 relative hover-lift flex flex-col ${
          plan.is_popular ? "glow-border border-primary/30" : ""
        }`}
      >
        {plan.is_popular && (
          <div className="absolute top-4 right-4 bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border border-pink-200 dark:border-pink-900/30">
            {isPremiumAds ? "Highest ROI" : "Most Popular"}
          </div>
        )}

        <h3 className="text-xl font-bold">{plan.name}</h3>

        {/* Subtitle / desc */}
        <p className="text-xs text-muted-foreground/80 mt-1.5 mb-4">
          {plan.name.toLowerCase().includes("premium") || plan.name.toLowerCase() === "pro"
            ? "Complete solution for business growth" 
            : "Perfect for businesses getting started online"}
        </p>

        <div className="mb-6 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-foreground">
            {currencySymbol}{price}
          </span>
          {pricing?.original && (
            <span className="text-sm text-muted-foreground/60 line-through">
              {currencySymbol}{pricing.original}
            </span>
          )}
        </div>

        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.map((f) => {
            const isExcluded = f.startsWith("not:");
            const text = isExcluded ? f.substring(4) : f;
            return (
              <li
                key={f}
                className={`flex items-start gap-3 text-sm ${
                  isExcluded ? "text-muted-foreground/40" : "text-muted-foreground"
                }`}
              >
                {isExcluded ? (
                  <X size={16} className="text-muted-foreground/30 shrink-0 mt-0.5" />
                ) : (
                  <Check size={16} className="text-primary shrink-0 mt-0.5" />
                )}
                {text}
              </li>
            );
          })}
        </ul>

        <Button
          variant={plan.is_popular ? "hero" : "hero-outline"}
          className="w-full"
          asChild
        >
          <a
            href={`${whatsappLink}?text=${encodeURIComponent(
              `Hi! I'm interested in the ${plan.name} plan.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Started
          </a>
        </Button>
      </motion.div>
    );
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.tiasoftwaresolutions.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Plans",
        "item": "https://www.tiasoftwaresolutions.com/plans"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Website Pricing UK | TIA Software Solutions</title>
        <meta name="description" content="View transparent web development, digital marketing, and ad campaign pricing packages. Serving clients throughout the UK. No hidden fees. Get your quote today." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.tiasoftwaresolutions.com/plans" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Website Pricing UK | TIA Software Solutions" />
        <meta property="og:description" content="View transparent web development, digital marketing, and ad campaign pricing packages. Serving clients throughout the UK. No hidden fees. Get your quote today." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Website Pricing UK | TIA Software Solutions" />
        <meta name="twitter:description" content="View transparent web development, digital marketing, and ad campaign pricing packages. Serving clients throughout the UK. No hidden fees. Get your quote today." />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
              Pricing & Plans
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Choose Your <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Flexible packages designed to match your ambition and budget.
            </p>
            <div className="section-divider mt-6" />
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="pb-24">
        <div className="container space-y-16">
          {/* Core Subscription Packages (Old Plans) */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Core Subscription <span className="gradient-text">Packages</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                All-inclusive branding, design, website, and support packages to grow your business.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {displayOldPlans.map((plan, i) => (
                <PlanCard key={plan.id} plan={plan} i={i} />
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-12" />

          {/* Website Development Plans */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Website Development <span className="gradient-text">Plans</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Bespoke design and engineering packages tailored for businesses of all sizes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {displayWebsitePlans.map((plan, i) => (
                <PlanCard key={plan.id} plan={plan} i={i} />
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent my-12" />

          {/* Ads Plans */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Digital Marketing & <span className="gradient-text">Ads Plans</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                Drive conversions and scale your brand with expert ad campaigns and social media management.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {displayAdsPlans.map((plan, i) => (
                <PlanCard key={plan.id} plan={plan} i={i} isAds={true} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Plans;
