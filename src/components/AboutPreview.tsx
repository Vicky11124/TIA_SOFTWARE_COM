import { useInView } from "@/hooks/useInView";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import aboutTeam from "@/assets/about-team.webp";

const AboutPreview = () => {
  const [leftRef, leftInView] = useInView();
  const [rightRef, rightInView] = useInView();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div
            ref={leftRef}
            className={`reveal-fade-left ${leftInView ? "in-view" : ""}`}
          >
            <div className="relative">
              <img
                src={aboutTeam}
                alt="TIA team collaborating"
                className="rounded-2xl shadow-lg w-full"
                loading="lazy"
                width={1200}
                height={800}
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-primary/10 -z-10" />
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-accent -z-10" />
            </div>
          </div>

          <div
            ref={rightRef}
            className={`reveal-fade-right ${rightInView ? "in-view" : ""}`}
          >
            <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Crafting Digital <span className="gradient-text">Excellence</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              At TIA Software Solutions, we help brands grow smarter, faster, and
              stronger in the digital world. From impactful digital marketing
              strategies and SEO optimization to stunning business card designs,
              greeting templates, and eye-catching social media ads.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We deliver creative solutions tailored to your needs — whether you're a startup or an established brand.
            </p>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/about">
                Learn More About TIA <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
