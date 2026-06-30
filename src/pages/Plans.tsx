import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
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
    id: "1",
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
      "Basic Website (Hosting, Domain & 2 Emails)",
    ],
    is_popular: false,
  },
  {
    id: "2",
    name: "Standard",
    price: "299.99",
    price_usd: "399.99",
    features: [
      "Everything in the Basic Plan",
      "Social Media Templates & Banners",
      "Presentation/Deck Design",
      "2 Rounds of Revisions",
      "Standard Turnaround Time",
    ],
    is_popular: false,
  },
  {
    id: "3",
    name: "Pro",
    price: "499.99",
    price_usd: "649.99",
    features: [
      "Everything in the Standard Plan",
      "Packaging & Merchandise Design",
      "Motion Graphics / Animated Content",
      "Unlimited Revisions",
      "Social Media Promotions",
      "Express Turnaround Time",
    ],
    is_popular: true,
  },
  {
    id: "4",
    name: "Premium",
    price: "699.99",
    price_usd: "899.99",
    features: [
      "Everything in the Pro Plan",
      "UX/UI Design for Apps & Websites",
      "Virtual Assistance",
      "Dedicated Account Manager",
      "ERP Tool (Any one module)",
    ],
    is_popular: false,
  },
];

const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>(fallbackPlans);
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

  const getPrice = (plan: Plan) => {
    return geo === "US" && plan.price_usd ? plan.price_usd : plan.price;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
              Pricing
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

      {/* Plans Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`glass-card p-8 relative hover-lift flex flex-col ${
                  plan.is_popular ? "glow-border border-primary/30" : ""
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} /> Most Popular
                  </div>
                )}

                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold">{currencySymbol}{getPrice(plan)}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check size={16} className="text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.is_popular ? "hero" : "hero-outline"}
                  className="w-full"
                  asChild
                >
                  <a
                    href={`${whatsappLink}?text=${encodeURIComponent(`Hi! I'm interested in the ${plan.name} plan.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Started
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Plans;
