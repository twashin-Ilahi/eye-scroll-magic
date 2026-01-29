import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Shield, 
  Zap, 
  Settings2, 
  Monitor, 
  WifiOff, 
  Accessibility 
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Private",
    description: "All processing happens on your device. No data is ever uploaded, stored, or shared.",
  },
  {
    icon: Zap,
    title: "Ultra Fast",
    description: "Real-time eye tracking with minimal CPU usage. Smooth, responsive scrolling.",
  },
  {
    icon: Settings2,
    title: "Customizable",
    description: "Adjust sensitivity, speed, and gesture controls to match your preferences.",
  },
  {
    icon: Monitor,
    title: "Cross-Platform",
    description: "Available for macOS and Windows. Works with any application.",
  },
  {
    icon: WifiOff,
    title: "Works Offline",
    description: "No internet connection required. Perfect for focused work anywhere.",
  },
  {
    icon: Accessibility,
    title: "Accessible",
    description: "Designed for everyone — especially those with limited hand mobility.",
  },
];

export const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6" id="features">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">Built for simplicity</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            NavEye is designed to stay out of your way while giving you complete control.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="feature-card group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
