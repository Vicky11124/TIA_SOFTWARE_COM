import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FAQSection from "@/components/FAQSection";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { faqs } from "@/data/faqData";

const FAQ = () => {
  const { whatsappLink } = useSiteSettings();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap((cat) =>
      cat.items.map((item) => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a,
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Frequently Asked Questions | TIA Software Solutions</title>
        <meta
          name="description"
          content="Find answers to common questions about TIA Software Solutions' services, pricing, Virtual Assistance, web development, and digital marketing."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.tiasoftwaresolutions.com/faq" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Frequently Asked Questions | TIA Software Solutions" />
        <meta
          property="og:description"
          content="Find answers to common questions about TIA Software Solutions' services, pricing, Virtual Assistance, web development, and digital marketing."
        />
        <meta property="og:url" content="https://www.tiasoftwaresolutions.com/faq" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[140px] -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] -translate-y-1/2 pointer-events-none" />

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
              Help Centre
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answers to the questions we hear most often. If you can't find
              what you're looking for, we're just a message away.
            </p>
            <div className="section-divider mt-6" />
          </motion.div>
        </div>
      </section>

      {/* Full FAQ accordion (all categories) */}
      <FAQSection preview={false} hideHeading={true} />

      {/* Still have questions CTA */}
      <section className="section-padding pt-0">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card glow-border border-primary/20 rounded-2xl p-10 md:p-16 text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={28} className="text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our team is happy to help. Reach out via WhatsApp for the fastest
              response, or drop us an email if you prefer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                id="faq-whatsapp-cta"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
              <Link
                id="faq-contact-cta"
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-semibold px-8 py-3 rounded-full hover:bg-accent transition-colors"
              >
                Send us a message
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default FAQ;
