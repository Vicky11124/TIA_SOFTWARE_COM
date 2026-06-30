import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Palette, Megaphone, PenTool, Monitor, Film, Camera, Sparkles, CalendarDays, Headphones } from "lucide-react";
import serviceBranding from "@/assets/service-branding.webp";
import serviceMarketing from "@/assets/service-marketing.webp";
import serviceCreative from "@/assets/service-creative.webp";
import serviceUiux from "@/assets/service-uiux.webp";
import serviceVideo from "@/assets/service-video.webp";
import serviceStoriesReels from "@/assets/service-stories-reels.webp";
import serviceSeasonal from "@/assets/service-seasonal.webp";
import serviceEvents from "@/assets/service-events.webp";
import serviceVA from "@/assets/service-virtual-assistance.webp";

const serviceCategories = [
  {
    icon: Headphones,
    title: "Virtual Assistance Services",
    slug: "virtual-assistance",
    image: serviceVA,
    items: ["Administrative Support", "Customer Support", "Digital Marketing Support", "E-commerce Assistance", "Bookkeeping & Accounting"],
    desc: "Professional virtual assistants to streamline your operations, reduce workload, and boost productivity.",
    highlight: true,
  },
  {
    icon: Palette,
    title: "Branding Essentials",
    slug: "branding-essentials",
    image: serviceBranding,
    items: ["Logo Design", "Brand Identity", "Business Cards"],
    desc: "Build a memorable brand identity that speaks to your audience.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    slug: "digital-marketing",
    image: serviceMarketing,
    items: ["Social Media Ads", "SEO Optimization", "Campaign Management"],
    desc: "Data-driven campaigns that grow your reach and revenue.",
  },
  {
    icon: PenTool,
    title: "Creative Design",
    slug: "creative-design",
    image: serviceCreative,
    items: ["Social Media Posts", "Event Graphics", "Festive Designs"],
    desc: "Stunning visuals that stop the scroll and drive engagement.",
  },
  {
    icon: Monitor,
    title: "UI/UX Design",
    slug: "ui-ux-design",
    image: serviceUiux,
    items: ["Website UI Design", "App Design", "Prototypes"],
    desc: "User-centered interfaces that are beautiful and functional.",
  },
  {
    icon: Film,
    title: "Video & Motion Graphics",
    slug: "video-motion-graphics",
    image: serviceVideo,
    items: ["Reels", "Animated Content", "Brand Videos"],
    desc: "Dynamic motion content that captures attention instantly.",
  },
  {
    icon: Camera,
    title: "Stories & Reels Assets",
    slug: "stories-reels-assets",
    image: serviceStoriesReels,
    items: ["Instagram Story Templates", "Reel Cover Designs", "Highlight Icons"],
    desc: "Scroll-stopping short-form video graphics and templates.",
  },
  {
    icon: Sparkles,
    title: "Seasonal & Festive Designs",
    slug: "seasonal-festive",
    image: serviceSeasonal,
    items: ["Festival Greetings", "Holiday Campaigns", "Seasonal Banners"],
    desc: "Celebrate every occasion with beautifully crafted festive designs.",
  },
  {
    icon: CalendarDays,
    title: "Event & Launch Graphics",
    slug: "event-launch-graphics",
    image: serviceEvents,
    items: ["Event Announcements", "Launch Posters", "Invitation Designs"],
    desc: "Make every event and launch unforgettable with impactful visuals.",
  },
];

const Services = () => {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "TIA Software Solutions Services",
    "description": "Premium creative and digital solutions including Branding, Marketing, UI/UX Design, and Virtual Assistance.",
    "numberOfItems": serviceCategories.length,
    "itemListElement": serviceCategories.map((cat, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": cat.title,
        "description": cat.desc,
        "url": `https://www.tiasoftwaresolutions.com/services/${cat.slug}`,
        "provider": {
          "@type": "Organization",
          "name": "TIA Software Solutions",
          "url": "https://www.tiasoftwaresolutions.com"
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
              What We Offer
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              End-to-end creative and digital solutions tailored for your brand's growth.
            </p>
            <div className="section-divider mt-6" />
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            {serviceCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <Link
                  to={`/services/${cat.slug}`}
                  className={`glass-card overflow-hidden group block hover-lift ${
                    (cat as any).highlight ? "ring-2 ring-primary/50" : ""
                  }`}
                >
                  <div className={`grid md:grid-cols-2 ${i % 2 === 1 ? "md:direction-rtl" : ""}`}>
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        width={1200}
                        height={800}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                        <cat.icon size={28} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{cat.title}</h3>
                      <p className="text-muted-foreground mb-6">{cat.desc}</p>
                      <ul className="space-y-2 mb-6">
                        {cat.items.map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                        Learn More <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
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

export default Services;
