import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Palette, PartyPopper, Megaphone, Layout, Film, Sparkles, Camera, CalendarDays, ArrowRight, Headphones } from "lucide-react";

type ServiceItem = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  desc: string;
  slug: string;
  highlight?: boolean;
};

const services: ServiceItem[] = [
  { icon: Headphones, title: "Virtual Assistance", desc: "Admin, customer support & business tasks", slug: "virtual-assistance", highlight: true },
  { icon: Palette, title: "Branding Essentials", desc: "Logo, identity & business cards", slug: "branding-essentials" },
  { icon: Megaphone, title: "Digital Marketing", desc: "Social ads & campaign creatives", slug: "digital-marketing" },
  { icon: PartyPopper, title: "Creative Design", desc: "Social media posts & graphics", slug: "creative-design" },
  { icon: Layout, title: "UI/UX Design", desc: "Modern interfaces & prototypes", slug: "ui-ux-design" },
  { icon: Film, title: "Video & Motion Graphics", desc: "Reels, animations & brand videos", slug: "video-motion-graphics" },
  { icon: Camera, title: "Stories & Reels Assets", desc: "Short-form video graphics & templates", slug: "stories-reels-assets" },
  { icon: Sparkles, title: "Seasonal & Festive", desc: "Holiday & festive design packs", slug: "seasonal-festive" },
  { icon: CalendarDays, title: "Event & Launch Graphics", desc: "Event announcements & launch visuals", slug: "event-launch-graphics" },
];

const ServicesHighlight = () => {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-background" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            End-to-end creative solutions to build, grow, and scale your brand in the digital world.
          </p>
          <div className="section-divider mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                to={`/services/${service.slug}`}
                className={`glass-card p-7 hover-lift group cursor-pointer block h-full ${
                  service.highlight ? "ring-2 ring-primary/50 bg-primary/5" : ""
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                  service.highlight ? "bg-primary/20 group-hover:bg-primary/30" : "bg-accent group-hover:bg-primary/10"
                }`}>
                  <service.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{service.title}</h3>
                {service.highlight && (
                  <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">★ Featured</span>
                )}
                <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium group-hover:gap-2.5 transition-all duration-300">
                  Learn More <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesHighlight;
