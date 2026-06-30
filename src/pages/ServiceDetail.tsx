import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check, Headphones, ClipboardList, Phone, Megaphone, ShoppingCart, BarChart3, CalendarDays, Calculator, Star, Users, Zap, Shield, Clock, Target } from "lucide-react";
import serviceBranding from "@/assets/service-branding.webp";
import serviceMarketing from "@/assets/service-marketing.webp";
import serviceCreative from "@/assets/service-creative.webp";
import serviceUiux from "@/assets/service-uiux.webp";
import serviceVideo from "@/assets/service-video.webp";
import serviceStoriesReels from "@/assets/service-stories-reels.webp";
import serviceSeasonal from "@/assets/service-seasonal.webp";
import serviceEvents from "@/assets/service-events.webp";
import serviceVA from "@/assets/service-virtual-assistance.webp";
import vaHero from "@/assets/va-hero.webp";
import vaCustomerSupport from "@/assets/va-customer-support.webp";
import vaDigitalMarketing from "@/assets/va-digital-marketing.webp";
import vaAccounting from "@/assets/va-accounting.webp";

const vaSubServices = [
  {
    icon: ClipboardList,
    title: "Administrative Support",
    desc: "Manage your day-to-day operations effortlessly.",
    image: serviceVA,
    items: ["Data entry and database management", "Email and calendar management", "Document preparation and formatting", "Scheduling and coordination"],
  },
  {
    icon: Phone,
    title: "Customer Support Services",
    desc: "Deliver exceptional customer experience.",
    image: vaCustomerSupport,
    items: ["Email, chat, and call support", "CRM management", "Customer follow-ups", "Complaint handling"],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing Support",
    desc: "Boost your online presence and reach.",
    image: vaDigitalMarketing,
    items: ["Social media management", "Content posting and scheduling", "Lead generation support", "Email marketing campaigns"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Assistance",
    desc: "Efficiently manage your online store.",
    image: serviceVA,
    items: ["Product listing and updates", "Order processing and tracking", "Inventory management", "Customer support"],
  },
  {
    icon: BarChart3,
    title: "Business Support Services",
    desc: "Make smarter business decisions.",
    image: vaDigitalMarketing,
    items: ["Market research and analysis", "Report generation", "Data analysis and insights", "Presentation preparation"],
  },
  {
    icon: CalendarDays,
    title: "Personal Assistance",
    desc: "Stay organized and productive.",
    image: vaHero,
    items: ["Appointment scheduling", "Travel planning", "Task reminders", "Online research"],
  },
  {
    icon: Calculator,
    title: "Accounting & Bookkeeping",
    desc: "Keep your finances organized and accurate.",
    image: vaAccounting,
    items: ["Daily bookkeeping", "Accounts payable & receivable", "Invoice management", "Bank reconciliation", "GST / tax data preparation", "Financial reports (P&L, Balance Sheet)"],
  },
];

const whyChooseUs = [
  { icon: Star, title: "Skilled & Experienced", desc: "Our virtual assistants are trained professionals with years of experience." },
  { icon: Zap, title: "Cost-Effective", desc: "Scalable solutions that save you up to 60% compared to full-time hiring." },
  { icon: Clock, title: "Flexible Hours", desc: "Round-the-clock availability to match your business schedule." },
  { icon: Shield, title: "Data Security", desc: "High accuracy with enterprise-grade data security protocols." },
  { icon: Users, title: "Dedicated Team", desc: "A committed support team that grows with your business." },
  { icon: Target, title: "Result-Oriented", desc: "Focused on delivering measurable outcomes for your business." },
];

const whoCanBenefit = [
  "Startups and entrepreneurs",
  "Small & medium businesses",
  "E-commerce businesses",
  "Consultants and professionals",
  "Corporate teams",
  "Digital agencies",
];

const serviceData: Record<string, {
  title: string;
  subtitle: string;
  image: string;
  description: string;
  features: string[];
  process: { step: string; desc: string }[];
  deliverables: string[];
}> = {
  "branding-essentials": {
    title: "Branding Essentials",
    subtitle: "Build a memorable identity",
    image: serviceBranding,
    description:
      "Your brand is the first impression people have of your business. We create comprehensive brand identities that tell your story, establish credibility, and make you unforgettable.",
    features: [
      "Logo Design — 2-3 unique concepts with unlimited refinements",
      "Brand Identity Kit — colors, typography, visual language",
      "Business Card Design — premium print-ready files",
      "Brand Guidelines Document — rules for consistent usage",
      "Letterhead & Envelope Design",
      "Social Media Brand Kit — profile & cover images",
    ],
    process: [
      { step: "Discovery", desc: "We learn about your business, audience, and competition." },
      { step: "Concept", desc: "Our designers create 2-3 unique concepts." },
      { step: "Refinement", desc: "We refine the chosen direction until perfect." },
      { step: "Delivery", desc: "All files in multiple formats, ready for use." },
    ],
    deliverables: ["Logo files (SVG, PNG, PDF)", "Brand style guide", "Business card templates", "Social media kit", "Stationery designs"],
  },
  "digital-marketing": {
    title: "Digital Marketing",
    subtitle: "Grow your reach & revenue",
    image: serviceMarketing,
    description:
      "Our data-driven marketing strategies help you reach the right audience at the right time with campaigns that drive real, measurable results.",
    features: [
      "Social Media Advertising — Facebook, Instagram, LinkedIn",
      "SEO Optimization — on-page, technical, and content SEO",
      "Campaign Management — end-to-end strategy and execution",
      "Content Strategy — engaging posts, blogs, and newsletters",
      "Analytics & Reporting — monthly performance insights",
      "Google Ads Management — search, display, and remarketing",
    ],
    process: [
      { step: "Audit", desc: "We analyze your current digital presence." },
      { step: "Strategy", desc: "Custom marketing plan tailored to your goals." },
      { step: "Execute", desc: "Launch campaigns with A/B testing." },
      { step: "Optimize", desc: "Continuous monitoring and optimization." },
    ],
    deliverables: ["Monthly analytics reports", "Ad creatives & copy", "SEO audit document", "Content calendar", "Campaign dashboard"],
  },
  "creative-design": {
    title: "Creative Design",
    subtitle: "Visuals that captivate",
    image: serviceCreative,
    description:
      "Our creative team produces stunning visual content that stops the scroll and drives engagement across all platforms.",
    features: [
      "Social Media Post Design — feed, stories, and carousel",
      "Event Graphics — banners, invitations, and promotional materials",
      "Festive & Seasonal Designs — holiday campaigns and themes",
      "Infographics & Data Visualization",
      "Email Newsletter Design",
      "Print Materials — flyers, brochures, and posters",
    ],
    process: [
      { step: "Brief", desc: "We understand your vision and message." },
      { step: "Design", desc: "Eye-catching designs aligned with your brand." },
      { step: "Review", desc: "You provide feedback for revisions." },
      { step: "Deliver", desc: "Final files in all required formats." },
    ],
    deliverables: ["Social media graphics", "Print-ready files", "Editable templates", "Brand-consistent designs", "Source files"],
  },
  "ui-ux-design": {
    title: "UI/UX Design",
    subtitle: "Interfaces users love",
    image: serviceUiux,
    description:
      "We design digital experiences that are both beautiful and functional with a user-centered approach.",
    features: [
      "Website UI Design — responsive, modern layouts",
      "Mobile App Design — iOS & Android interfaces",
      "Interactive Prototypes — clickable, testable mockups",
      "User Research & Persona Development",
      "Information Architecture & Wireframing",
      "Design System Creation — reusable component libraries",
    ],
    process: [
      { step: "Research", desc: "Study users, competitors, and market." },
      { step: "Wireframe", desc: "Low-fidelity layouts for structure." },
      { step: "Design", desc: "High-fidelity, pixel-perfect designs." },
      { step: "Handoff", desc: "Developer-ready specs and assets." },
    ],
    deliverables: ["Figma design files", "Interactive prototype", "UI component library", "Style guide", "Developer documentation"],
  },
  "video-motion-graphics": {
    title: "Video & Motion Graphics",
    subtitle: "Content that moves",
    image: serviceVideo,
    description:
      "We create dynamic motion graphics and short-form videos that capture attention and drive engagement.",
    features: [
      "Instagram Reels & Short-Form Video",
      "Animated Logo & Brand Intros",
      "Explainer Videos & Product Demos",
      "Social Media Video Ads",
      "Motion Graphics & Kinetic Typography",
      "Video Editing & Post-Production",
    ],
    process: [
      { step: "Concept", desc: "Creative concept and storyboard." },
      { step: "Production", desc: "Design and animation of elements." },
      { step: "Sound", desc: "Music, sound effects, and voiceover." },
      { step: "Delivery", desc: "Optimized for each platform." },
    ],
    deliverables: ["Video files (MP4, MOV)", "Platform-optimized versions", "Thumbnail designs", "Storyboard", "Source files"],
  },
  "stories-reels-assets": {
    title: "Stories & Reels Assets",
    subtitle: "Short-form content that converts",
    image: serviceStoriesReels,
    description:
      "Scroll-stopping templates and assets optimized for Instagram, Facebook, and TikTok.",
    features: [
      "Instagram Story Templates — branded, editable designs",
      "Reel Cover & Thumbnail Design",
      "Story Highlight Icons — custom icon sets",
      "Interactive Story Elements — polls, quizzes, countdowns",
      "Reel Graphics & Overlays",
      "Story Sequence Design — multi-slide narratives",
    ],
    process: [
      { step: "Analyze", desc: "Study your audience and content strategy." },
      { step: "Design", desc: "Custom templates in your brand style." },
      { step: "Adapt", desc: "Optimized for each platform." },
      { step: "Deliver", desc: "Ready-to-use files with editables." },
    ],
    deliverables: ["Story template pack", "Reel cover designs", "Highlight icon set", "Editable files", "Brand usage guide"],
  },
  "seasonal-festive": {
    title: "Seasonal & Festive Designs",
    subtitle: "Celebrate every occasion",
    image: serviceSeasonal,
    description:
      "Beautiful, culturally relevant festive designs that keep your brand top-of-mind during the moments that matter.",
    features: [
      "Festival Greeting Cards — Diwali, Christmas, Eid, and more",
      "Holiday Campaign Graphics — social media & email",
      "Seasonal Banner Designs — website & storefront",
      "Themed Social Media Posts",
      "Gift Card & Coupon Designs",
      "Event-Specific Branding — limited-edition looks",
    ],
    process: [
      { step: "Plan", desc: "Map out seasonal calendar and key dates." },
      { step: "Create", desc: "Beautifully crafted designs for each occasion." },
      { step: "Schedule", desc: "Assets delivered ahead of time." },
      { step: "Optimize", desc: "Post-campaign analysis for improvement." },
    ],
    deliverables: ["Festive greeting designs", "Social media campaign kit", "Email templates", "Print-ready materials", "Seasonal brand assets"],
  },
  "event-launch-graphics": {
    title: "Event & Launch Graphics",
    subtitle: "Make every launch unforgettable",
    image: serviceEvents,
    description:
      "Compelling event graphics that build anticipation, drive registrations, and create buzz.",
    features: [
      "Event Announcement Designs — social & email",
      "Launch Poster & Banner Design",
      "Digital Invitation & RSVP Cards",
      "Event Countdown Graphics",
      "Venue Signage & Backdrop Design",
      "Post-Event Thank You & Recap Graphics",
    ],
    process: [
      { step: "Brief", desc: "Understand the event theme and messaging." },
      { step: "Design", desc: "Eye-catching graphics for excitement." },
      { step: "Produce", desc: "Digital and print-ready formats." },
      { step: "Support", desc: "Day-of support and post-event content." },
    ],
    deliverables: ["Event poster & banner designs", "Digital invitations", "Social media kit", "Venue signage files", "Post-event graphics"],
  },
};

const VirtualAssistancePage = () => {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Virtual Assistance Services",
    "description": "Professional Virtual Assistance Services designed to help businesses streamline operations, reduce workload, and improve productivity.",
    "provider": {
      "@type": "Organization",
      "name": "TIA Software Solutions",
      "url": "https://www.tiasoftwaresolutions.com"
    },
    "serviceType": "Virtual Assistance",
    "areaServed": "Worldwide"
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Virtual Assistance Services | TIA Software Solutions</title>
        <meta name="description" content="Professional Virtual Assistance Services designed to help businesses streamline operations, reduce workload, and improve productivity. Hire trained virtual assistants." />
        <link rel="canonical" href="https://www.tiasoftwaresolutions.com/services/virtual-assistance" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Virtual Assistance Services | TIA Software Solutions" />
        <meta property="og:description" content="Professional Virtual Assistance Services designed to help businesses streamline operations, reduce workload, and improve productivity." />
        <meta property="og:url" content="https://www.tiasoftwaresolutions.com/services/virtual-assistance" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Virtual Assistance Services | TIA Software Solutions" />
        <meta name="twitter:description" content="Professional Virtual Assistance Services designed to help businesses streamline operations, reduce workload, and improve productivity." />
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <img
          src={vaHero}
          alt="Virtual Assistance Services"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        <div className="container relative z-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Headphones size={16} /> Our Flagship Service
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              <span className="gradient-text">Virtual Assistance</span> Services
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-foreground/80 mb-4">
              Simplify Your Work. Maximize Your Growth.
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              Professional Virtual Assistance Services designed to help businesses streamline operations, reduce workload, and improve productivity. Our dedicated virtual assistants handle your daily tasks efficiently so you can focus on growing your business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" className="px-8" asChild>
                <a href="https://wa.me/447418378044" target="_blank" rel="noopener noreferrer">
                  Get Started Today <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-8" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sub-services */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              What We Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Our Virtual <span className="gradient-text">Assistance Services</span>
            </h2>
          </motion.div>

          <div className="space-y-16">
            {vaSubServices.map((sub, i) => (
              <motion.div
                key={sub.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                className="glass-card overflow-hidden"
              >
                <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img
                      src={sub.image}
                      alt={sub.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      width={1200}
                      height={800}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
                  </div>
                  <div className={`p-8 lg:p-12 ${i % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                    <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-5">
                      <sub.icon size={28} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{sub.title}</h3>
                    <p className="text-muted-foreground mb-6">{sub.desc}</p>
                    <ul className="space-y-3">
                      {sub.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Check size={14} className="text-primary" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose <span className="gradient-text">TIA Software Solutions</span>?
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 text-center hover-lift"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits + Who Can Benefit */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
                Benefits
              </span>
              <h2 className="text-3xl font-bold mb-8">
                Benefits of Hiring a <span className="gradient-text">Virtual Assistant</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Save time and focus on core business activities",
                  "Reduce operational costs by up to 60%",
                  "Improve efficiency and productivity",
                  "Access skilled professionals without full-time hiring",
                  "Scale your team flexibly based on demand",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Check size={16} className="text-primary" />
                    </div>
                    <p className="text-muted-foreground">{b}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
                Who Can Benefit
              </span>
              <h2 className="text-3xl font-bold mb-8">
                Perfect For <span className="gradient-text">Your Business</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {whoCanBenefit.map((item) => (
                  <div key={item} className="glass-card p-4 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary/5">
        <div className="container text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Get Started</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let TIA Software Solutions take care of your tasks while you focus on scaling your business. Contact us today for reliable Virtual Assistance Services!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" className="px-10" asChild>
                <a href="https://wa.me/447418378044" target="_blank" rel="noopener noreferrer">
                  Contact Us on WhatsApp <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-10" asChild>
                <Link to="/plans">View Our Plans</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const GenericServiceDetail = ({ service }: { service: typeof serviceData[string] }) => {
  const { slug } = useParams<{ slug: string }>();
  const serviceUrl = `https://www.tiasoftwaresolutions.com/services/${slug}`;
  const serviceTitle = `${service.title} | TIA Software Solutions`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "TIA Software Solutions",
      "url": "https://www.tiasoftwaresolutions.com"
    },
    "serviceType": service.title,
    "areaServed": "Worldwide"
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{serviceTitle}</title>
        <meta name="description" content={service.description} />
        <link rel="canonical" href={serviceUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={serviceTitle} />
        <meta property="og:description" content={service.description} />
        <meta property="og:image" content={service.image} />
        <meta property="og:url" content={serviceUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={serviceTitle} />
        <meta name="twitter:description" content={service.description} />
        <meta name="twitter:image" content={service.image} />
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="lazy"
          width={1200}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        <div className="container relative z-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              {service.subtitle}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="gradient-text">{service.title}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Description + image */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {service.description}
              </p>
              <Button variant="hero" size="lg" className="px-8" asChild>
                <a href="https://wa.me/447418378044" target="_blank" rel="noopener noreferrer">
                  Get a Quote <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-auto rounded-2xl"
                loading="lazy"
                width={1200}
                height={800}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-secondary/20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              What's Included
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Service <span className="gradient-text">Features</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {service.features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={16} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{f}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              How We Work
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Our <span className="gradient-text">Process</span>
            </h2>
          </motion.div>
          <div className="space-y-8">
            {service.process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 flex items-start gap-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-lg">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{p.step}</h3>
                  <p className="text-muted-foreground">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section-padding bg-secondary/20">
        <div className="container max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              What You Get
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-10">
              <span className="gradient-text">Deliverables</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {service.deliverables.map((d) => (
                <span
                  key={d}
                  className="glass-card px-5 py-3 text-sm font-medium text-foreground"
                >
                  {d}
                </span>
              ))}
            </div>
            <Button variant="hero" size="lg" className="mt-12 px-10" asChild>
              <a href="https://wa.me/447418378044" target="_blank" rel="noopener noreferrer">
                Start Your Project <ArrowRight className="ml-2" size={18} />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  if (slug === "virtual-assistance") {
    return <VirtualAssistancePage />;
  }

  const service = slug ? serviceData[slug] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Button variant="hero" asChild>
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <GenericServiceDetail service={service} />;
};

export default ServiceDetail;
