import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroBg from "@/assets/hero-bg.webp";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const { whatsappLink } = useSiteSettings();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* BG Image */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        width={1920}
        height={1080}
        fetchpriority="high"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

      {/* Floating orb */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-float" />

      <div className="container relative z-10 pt-20">
        <div className="max-w-3xl animate-fade-in">
          <span className="inline-block text-sm font-medium text-primary mb-6 tracking-widest uppercase">
            Digital Solutions Agency
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Build Your Brand
            <br />
            With <span className="gradient-text">Precision</span> &{" "}
            <span className="gradient-text">Power</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
            We craft high-performance digital experiences that elevate your
            business and drive real growth.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" className="px-8 py-6 text-base" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Book Now <ArrowRight className="ml-2" size={18} />
              </a>
            </Button>
            <Button variant="hero-outline" size="lg" className="px-8 py-6 text-base" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
