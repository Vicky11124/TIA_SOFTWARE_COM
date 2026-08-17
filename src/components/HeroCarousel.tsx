import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import banner1 from "@/assets/banner-1.webp";
import banner2 from "@/assets/banner-2.webp";
import banner3 from "@/assets/banner-3.webp";
import banner4 from "@/assets/banner-4.webp";

interface BannerRow {
  image_url?: string;
  subtitle: string;
  title: string;
  highlight: string;
  description: string;
  cta_text?: string;
  cta_link?: string;
}

const fallbackSlides = [
  {
    image: banner1,
    subtitle: "Virtual Assistance Services",
    title: "Simplify Your Work.",
    highlight: "Maximize Your Growth",
    desc: "Professional Virtual Assistance Services to streamline operations, reduce workload, and boost productivity for your business.",
    cta_text: "Get Started",
    cta_link: "",
  },
  {
    image: banner2,
    subtitle: "Digital Solutions Agency",
    title: "Build Your Brand With",
    highlight: "Precision & Power",
    desc: "We craft high-performance digital experiences that elevate your business and drive real growth.",
    cta_text: "Book Now",
    cta_link: "",
  },
  {
    image: banner3,
    subtitle: "Branding & Identity",
    title: "Premium Branding That",
    highlight: "Speaks Volumes",
    desc: "From logos to full brand kits — we create identities that leave lasting impressions.",
    cta_text: "Book Now",
    cta_link: "",
  },
  {
    image: banner4,
    subtitle: "Digital Marketing",
    title: "Data-Driven Campaigns",
    highlight: "That Convert",
    desc: "Strategic social media, SEO, and ad campaigns designed to maximize your ROI.",
    cta_text: "Book Now",
    cta_link: "",
  },
];

type Slide = {
  image: string;
  subtitle: string;
  title: string;
  highlight: string;
  desc: string;
  cta_text: string;
  cta_link: string;
};

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const { whatsappLink } = useSiteSettings();

  useEffect(() => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
    const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

    fetch(`${SUPABASE_URL}/rest/v1/banners?select=*&is_active=eq.true&order=sort_order.asc`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: BannerRow[]) => {
        if (data && data.length > 0) {
          setSlides(
            data.map((b) => ({
              image: b.image_url || banner1,
              subtitle: b.subtitle,
              title: b.title,
              highlight: b.highlight,
              desc: b.description,
              cta_text: b.cta_text || "Book Now",
              cta_link: b.cta_link || "",
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Failed to load banners via REST:", err);
      });
  }, []);

  const changeSlide = useCallback((newIdx: number) => {
    setPrevImage(slides[current].image);
    setCurrent(newIdx);
  }, [current, slides]);

  const next = useCallback(() => {
    const nextIdx = (current + 1) % slides.length;
    changeSlide(nextIdx);
  }, [slides.length, changeSlide]);

  const prev = useCallback(() => {
    const prevIdx = (current - 1 + slides.length) % slides.length;
    changeSlide(prevIdx);
  }, [slides.length, changeSlide]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current] || fallbackSlides[0];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background images with crossfade - only render current and previous to prevent immediate downloads */}
      {prevImage && (
        <img
          key={`prev-${prevImage}`}
          src={prevImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover animate-hero-bg-exit z-0 pointer-events-none"
          width={1920}
          height={1080}
        />
      )}

      <img
        key={`current-${current}`}
        src={slide.image}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover z-10 ${
          prevImage ? "animate-hero-bg" : "opacity-55 scale-100"
        }`}
        width={1920}
        height={1080}
        fetchpriority="high"
        decoding="async"
      />

      {/* Lighter overlays so image is more visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent z-20" />

      {/* Decorative elements */}
      <div 
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-20" 
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, transparent 70%)" }}
      />
      <div 
        className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full pointer-events-none z-20" 
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.3) 0%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="container relative z-30 pt-20">
        <div className="max-w-3xl">
          <span
            key={`subtitle-${current}`}
            className="inline-block text-sm font-semibold text-primary mb-6 tracking-widest uppercase animate-hero-subtitle"
          >
            {slide.subtitle}
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-foreground">
            {slide.title}
            <br />
            <span className="gradient-text">{slide.highlight}</span>
          </h2>

          <p
            key={`desc-${current}`}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed animate-hero-desc"
          >
            {slide.desc}
          </p>

          <div
            key={`actions-${current}`}
            className="flex flex-wrap gap-4 animate-hero-actions"
          >
            <Button variant="hero" size="lg" className="px-8 py-6 text-base shadow-lg" asChild>
              <a href={slide.cta_link || whatsappLink} target="_blank" rel="noopener noreferrer">
                {slide.cta_text} <ArrowRight className="ml-2" size={18} />
              </a>
            </Button>
            <Button variant="hero-outline" size="lg" className="px-8 py-6 text-base" asChild>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center gap-3 mt-16">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => changeSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? "w-10 bg-primary" : "w-4 bg-muted-foreground/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Nav arrows */}
      <div className="absolute right-6 bottom-1/2 translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full bg-background/80 border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="w-11 h-11 rounded-full bg-background/80 border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;

