import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

import { validateFormSecurity, recordFormSubmission } from "@/utils/formSecurity";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [websiteHp, setWebsiteHp] = useState("");
  const [formLoadTime] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const { settings, whatsappLink } = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const secCheck = validateFormSecurity({
      honeypotValue: websiteHp,
      formLoadTime,
      email: form.email,
    });

    if (secCheck.isBot) {
      // Fake success for bots to prevent retries
      setForm({ name: "", email: "", phone: "", message: "" });
      toast.success("Message sent! We'll get back to you soon.");
      return;
    }

    if (!secCheck.isValid) {
      toast.error(secCheck.error || "Invalid form submission.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        message: form.message.trim(),
      });

      if (error) throw error;

      recordFormSubmission();
      const msg = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`;
      window.open(`${whatsappLink}?text=${encodeURIComponent(msg)}`, "_blank");
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Could not send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
        "name": "Contact",
        "item": "https://www.tiasoftwaresolutions.com/contact"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact TIA Software Solutions | Free Consultation UK</title>
        <meta name="description" content="Get in touch with TIA Software Solutions today. Partner with our team for custom web design, SEO, software development, and virtual assistants. Serving clients throughout the UK." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.tiasoftwaresolutions.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact TIA Software Solutions | Free Consultation UK" />
        <meta property="og:description" content="Get in touch with TIA Software Solutions today. Partner with our team for custom web design, SEO, software development, and virtual assistants. Serving clients throughout the UK." />
        <meta property="og:url" content="https://www.tiasoftwaresolutions.com/contact" />
        <meta property="og:image" content="https://www.tiasoftwaresolutions.com/assets/logo.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact TIA Software Solutions | Free Consultation UK" />
        <meta name="twitter:description" content="Get in touch with TIA Software Solutions today. Partner with our team for custom web design, SEO, software development, and virtual assistants. Serving clients throughout the UK." />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <div className="section-divider mt-6" />
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-5 gap-12">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="glass-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <a href={`mailto:${settings.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="glass-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <a href={`tel:${settings.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="glass-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Location</h4>
                  <p className="text-sm text-muted-foreground">{settings.address}</p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-3"
            >
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                {/* Honeypot field for bot protection — hidden from human users */}
                <div style={{ display: "none", position: "absolute", left: "-9999px" }} aria-hidden="true">
                  <input
                    type="text"
                    name="website_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={websiteHp}
                    onChange={(e) => setWebsiteHp(e.target.value)}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input
                      type="email"
                      required
                      maxLength={255}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <input
                    type="tel"
                    maxLength={20}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                    placeholder="+44 ..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <textarea
                    required
                    maxLength={1000}
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button variant="hero" size="lg" className="w-full py-6" type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Message"} <Send className="ml-2" size={18} />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
