import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Target, Eye, Users, Lightbulb, Zap, Globe, Wrench, Shield, MessageCircle } from "lucide-react";
import aboutBg from "@/assets/about-bg.webp";
import aboutTeam from "@/assets/about-team.webp";

const whyChooseUs = [
  {
    icon: Users,
    title: "Client-Centric Approach",
    desc: "Your vision is our blueprint. We listen, understand, and tailor every design to fit your goals, your voice, and your audience.",
  },
  {
    icon: Lightbulb,
    title: "Creative Meets Strategy",
    desc: "We don't just create unique designs — we craft purposeful visuals that drive engagement, boost conversions, and bring your brand to life.",
  },
  {
    icon: Zap,
    title: "Fast & Flexible Delivery",
    desc: "Need it now? We get it. Our streamlined online workflow ensures quick turnaround times without compromising on quality.",
  },
  {
    icon: Globe,
    title: "Remote-Ready & Global Reach",
    desc: "We operate fully online, giving us the freedom to work without borders. No matter where you're located, our team is ready to bring your project to life.",
  },
  {
    icon: Wrench,
    title: "All-in-One Design Services",
    desc: "From logos and branding to websites, social media visuals, and marketing materials — all your design needs covered in one place by a skilled, dedicated expert team.",
  },
  {
    icon: Shield,
    title: "Transparent Pricing, No Surprises",
    desc: "Our pricing is transparent, competitive, and fixed. No hidden costs. No unexpected add-ons. Just great design at a fair price.",
  },
  {
    icon: MessageCircle,
    title: "Ongoing Support",
    desc: "Our partnership goes beyond project delivery. We're here to assist with revisions, updates, and creative support whenever you need us.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <img
          src={aboutBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
              Who We Are
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              About <span className="gradient-text">TIA</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={aboutTeam}
                alt="TIA team collaborating"
                className="rounded-2xl shadow-lg w-full"
                loading="lazy"
                width={1200}
                height={800}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                TIA Software Solutions is a creative digital solutions provider
                focused on helping businesses establish a strong online presence.
                We specialize in branding, digital marketing, UI design, and
                promotional content creation.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is to deliver affordable, high-quality digital
                solutions that drive real results. Whether you're a startup or an
                established brand, we provide scalable services to match your
                growth.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="glass-card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
                <Eye size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become a trusted global digital partner for businesses of all
                sizes, delivering innovation that drives measurable impact.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass-card p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
                <Target size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To deliver innovative, creative, and affordable solutions that
                empower brands to reach their full potential in the digital
                landscape.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/40 to-background" />
        <div className="container max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              Creative Design, Smart Solutions, <span className="gradient-text">Real Results</span>.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4">
              At TIA Software Solutions, we're not just a design company — we're your creative partner in crafting a brand that stands out in today's competitive digital space. Whether you're launching a startup, scaling a growing business, or refreshing an established identity, we're here to help bring your vision to life.
            </p>
            <div className="section-divider mt-6 mb-16" />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card p-7 hover-lift"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5">
                  <item.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
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

export default About;
