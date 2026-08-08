import { useInView } from "@/hooks/useInView";

const stats = [
  { value: "5000+", label: "Happy Customers" },
  { value: "50+", label: "Cities Worldwide" },
  { value: "25000+", label: "Projects Delivered" },
  { value: "99%", label: "Client Satisfaction" },
];

const StatsSection = () => {
  const [gridRef, gridInView] = useInView();

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/30 to-primary/5" />
      <div className="container relative z-10">
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center reveal-fade-up ${gridInView ? "in-view" : ""}`}
              style={{ transitionDelay: gridInView ? `${i * 100}ms` : "0ms" }}
            >
              <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
