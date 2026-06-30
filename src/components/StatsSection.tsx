import { motion } from "framer-motion";

const stats = [
  { value: "5000+", label: "Happy Customers" },
  { value: "50+", label: "Cities Worldwide" },
  { value: "25000+", label: "Projects Delivered" },
  { value: "99%", label: "Client Satisfaction" },
];

const StatsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/30 to-primary/5" />
      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
