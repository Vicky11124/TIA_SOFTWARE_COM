import { useInView } from "@/hooks/useInView";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const CTASection = () => {
  const { whatsappLink } = useSiteSettings();
  const [sectionRef, sectionInView] = useInView();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="container relative z-10 text-center">
        <div
          ref={sectionRef}
          className={`max-w-2xl mx-auto reveal-fade-up ${sectionInView ? "in-view" : ""}`}
        >
          <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
            Let's Work Together
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            Ready to Transform Your{" "}
            <span className="gradient-text">Brand</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            Schedule an appointment to talk to our expert team and discover how we can elevate your digital presence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" className="px-10 py-6 text-base shadow-lg" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Book Now <ArrowRight className="ml-2" size={18} />
              </a>
            </Button>
            <Button variant="hero-outline" size="lg" className="px-10 py-6 text-base" asChild>
              <a href="/contact">
                Contact Us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
