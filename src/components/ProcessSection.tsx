import { motion } from "framer-motion";
import { MessageSquare, Lightbulb, PenTool, Rocket } from "lucide-react";

const steps = [
  { icon: MessageSquare, step: "01", title: "Discover", desc: "We listen to your goals, understand your brand, and define the project scope." },
  { icon: Lightbulb, step: "02", title: "Strategize", desc: "Our team crafts a tailored creative strategy aligned with your business objectives." },
  { icon: PenTool, step: "03", title: "Create", desc: "We bring ideas to life with stunning designs, content, and digital assets." },
  { icon: Rocket, step: "04", title: "Deliver", desc: "Your polished deliverables are handed off on time, ready to make an impact." },
];

const ProcessSection = () => {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/20 to-background" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary tracking-widest uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            Our <span className="gradient-text">Process</span>
          </h2>
          <div className="section-divider mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="w-20 h-20 rounded-2xl bg-accent mx-auto mb-6 flex items-center justify-center relative">
                <item.icon size={32} className="text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
