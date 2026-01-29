import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TiltCard } from "./TiltCard";
import { 
  Ghost, 
  Gauge, 
  Target, 
  Shield, 
  Accessibility, 
  Rocket 
} from "lucide-react";

const features = [
  {
    icon: Ghost,
    title: "Ghost Mode",
    description: "Invisible background operation. No dock icon, no menubar clutter. Just pure, seamless scrolling.",
    color: "#4A90E2",
    gradient: "from-blue-500/20 to-blue-600/10",
  },
  {
    icon: Gauge,
    title: "Smart Physics",
    description: "Natural momentum and inertia simulation. Scrolling feels organic, like using a trackpad.",
    color: "#9B59B6",
    gradient: "from-purple-500/20 to-purple-600/10",
  },
  {
    icon: Target,
    title: "Sub-Pixel Precision",
    description: "Ultra-smooth tracking with sub-pixel accuracy. Every micro-movement is captured perfectly.",
    color: "#E74C3C",
    gradient: "from-red-500/20 to-red-600/10",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "All processing happens locally on your device. Zero cloud, zero telemetry, zero tracking.",
    color: "#22c55e",
    gradient: "from-green-500/20 to-green-600/10",
  },
  {
    icon: Accessibility,
    title: "Accessibility",
    description: "Designed for everyone—especially those with RSI, carpal tunnel, or limited hand mobility.",
    color: "#f59e0b",
    gradient: "from-amber-500/20 to-amber-600/10",
  },
  {
    icon: Rocket,
    title: "Productivity",
    description: "Keep your hands on the keyboard while reading. Perfect for developers, researchers, and writers.",
    color: "#06b6d4",
    gradient: "from-cyan-500/20 to-cyan-600/10",
  },
];

const FloatingIcon = ({ icon: Icon, color }: { icon: typeof Ghost; color: string }) => (
  <motion.div
    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative"
    style={{ 
      background: `linear-gradient(135deg, ${color}20, ${color}10)`,
      boxShadow: `0 0 30px ${color}20`,
    }}
    whileHover={{ scale: 1.1, rotate: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Icon className="w-8 h-8" style={{ color }} />
    
    {/* Floating particles around icon */}
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color, opacity: 0.5 }}
      animate={{
        x: [0, 10, -5, 0],
        y: [-20, -25, -18, -20],
        scale: [1, 0.8, 1.2, 1],
      }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: color, opacity: 0.3 }}
      animate={{
        x: [15, 20, 12, 15],
        y: [5, 0, 10, 5],
        scale: [1, 1.3, 0.7, 1],
      }}
      transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
    />
  </motion.div>
);

export const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative overflow-hidden" id="features">
      {/* Background effects */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 80% 50%, rgba(155, 89, 182, 0.08) 0%, transparent 50%)"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block text-accent text-sm font-medium mb-4 tracking-wider uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Features
          </motion.span>
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
              className="group"
              style={{ perspective: "1000px" }}
            >
              <TiltCard glowColor={feature.color}>
                <FloatingIcon icon={feature.icon} color={feature.color} />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
