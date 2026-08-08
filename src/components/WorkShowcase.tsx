import { useInView } from "@/hooks/useInView";
import showcaseWork from "@/assets/showcase-work.webp";
import serviceCreative from "@/assets/service-creative.webp";
import serviceUiux from "@/assets/service-uiux.webp";
import serviceVideo from "@/assets/service-video.webp";

const works = [
  { image: showcaseWork, title: "Brand Identity Projects", category: "Branding" },
  { image: serviceCreative, title: "Social Media Campaigns", category: "Marketing" },
  { image: serviceUiux, title: "UI/UX Design Systems", category: "Design" },
  { image: serviceVideo, title: "Motion & Video Content", category: "Video" },
];

const WorkShowcase = () => {
  const [headingRef, headingInView] = useInView();
  const [gridRef, gridInView] = useInView();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container">
        <div
          ref={headingRef}
          className={`text-center mb-16 reveal-fade-up ${headingInView ? "in-view" : ""}`}
        >
          <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
            Our Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A glimpse of the creative projects we've delivered for brands across the globe.
          </p>
          <div className="section-divider mt-6" />
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {works.map((work, i) => (
            <div
              key={work.title}
              className={`group relative rounded-2xl overflow-hidden hover-lift cursor-pointer reveal-fade-up ${gridInView ? "in-view" : ""}`}
              style={{ transitionDelay: gridInView ? `${i * 100}ms` : "0ms" }}
            >
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                width={1200}
                height={800}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-xs font-semibold text-primary-foreground/80 tracking-widest uppercase">
                  {work.category}
                </span>
                <h3 className="text-xl font-bold text-primary-foreground mt-1">{work.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkShowcase;
