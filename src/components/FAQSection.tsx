import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { faqs } from "@/data/faqData";

interface FAQSectionProps {
  /** When true, shows only the first 2 categories (for homepage preview) */
  preview?: boolean;
  /** When true, hides the section heading (use on the dedicated FAQ page which has its own hero) */
  hideHeading?: boolean;
}

const FAQSection = ({ preview = false, hideHeading = false }: FAQSectionProps) => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [headingRef, headingInView] = useInView();
  const [listRef, listInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  const displayedFaqs = preview ? faqs.slice(0, 2) : faqs;

  const toggle = (key: string) => {
    setOpenIndex((prev) => (prev === key ? null : key));
  };

  return (
    <section className="section-padding">
      <div className="container">
        {/* Heading — hidden when the page provides its own title */}
        {!hideHeading && (
          <div
            ref={headingRef}
            className={`text-center mb-16 reveal-fade-up ${headingInView ? "in-view" : ""}`}
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
              Frequently Asked{" "}
              <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Everything you need to know about working with TIA Software
              Solutions.
            </p>
            <div className="section-divider mt-6" />
          </div>
        )}

        {/* FAQ categories */}
        <div ref={listRef} className="max-w-3xl mx-auto space-y-10">
          {displayedFaqs.map((cat, ci) => (
            <div
              key={cat.category}
              className={`reveal-fade-up ${listInView ? "in-view" : ""}`}
              style={{ transitionDelay: listInView ? `${ci * 80}ms` : "0ms" }}
            >
              <h3 className="text-xs font-bold tracking-widest uppercase text-primary mb-4">
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.items.map((item, qi) => {
                  const key = `${ci}-${qi}`;
                  const isOpen = openIndex === key;
                  return (
                    <div
                      key={qi}
                      className={`glass-card overflow-hidden transition-all duration-300 ${
                        isOpen ? "glow-border border-primary/20" : ""
                      }`}
                    >
                      <button
                        id={`faq-${ci}-${qi}`}
                        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                        onClick={() => toggle(key)}
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-sm md:text-base">
                          {item.q}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-primary transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA to full FAQ page (only on preview/homepage) */}
        {preview && (
          <div
            ref={ctaRef}
            className={`text-center mt-12 reveal-fade-up ${ctaInView ? "in-view" : ""}`}
            style={{ transitionDelay: "300ms" }}
          >
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              View all FAQs →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
