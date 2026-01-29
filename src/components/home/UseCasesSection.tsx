import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Code, Heart } from "lucide-react";

const useCases = [
  {
    id: "reading",
    title: "Comfortable Reading",
    description: "Curl up with a book or article. Scroll through long documents while keeping your hands warm under a blanket.",
    icon: BookOpen,
    color: "#4A90E2",
    scene: "winter-reading",
  },
  {
    id: "coding",
    title: "Developer Productivity",
    description: "Keep your hands on the keyboard while reviewing code. Perfect for documentation, Stack Overflow, and code reviews.",
    icon: Code,
    color: "#9B59B6",
    scene: "developer",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    description: "For users with RSI, carpal tunnel, or limited mobility. Navigate the web without physical strain.",
    icon: Heart,
    color: "#E74C3C",
    scene: "accessibility",
  },
];

const IsometricScene = ({ scene, color }: { scene: string; color: string }) => {
  return (
    <div 
      className="relative w-full h-48 rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
        transform: "perspective(500px) rotateX(10deg)",
      }}
    >
      {/* Isometric grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(${color}40 1px, transparent 1px),
            linear-gradient(90deg, ${color}40 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          transform: "skewY(-5deg)",
        }}
      />

      {/* Scene elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        {scene === "winter-reading" && (
          <motion.div
            className="relative"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Cozy lamp */}
            <div 
              className="absolute -top-8 -left-8 w-12 h-12 rounded-full blur-xl"
              style={{ backgroundColor: color, opacity: 0.4 }}
            />
            {/* Book */}
            <div 
              className="w-24 h-16 rounded-lg shadow-lg"
              style={{ backgroundColor: color, opacity: 0.8 }}
            >
              <div className="h-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white/80" />
              </div>
            </div>
            {/* Snowflakes */}
            <motion.div
              className="absolute -top-4 -right-4 w-2 h-2 rounded-full bg-white/60"
              animate={{ y: [0, 20], opacity: [1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}

        {scene === "developer" && (
          <motion.div
            className="relative"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {/* Monitor */}
            <div 
              className="w-32 h-20 rounded-lg shadow-lg relative overflow-hidden"
              style={{ backgroundColor: "#1a1f3f" }}
            >
              {/* Code lines */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 rounded mx-2 my-1"
                  style={{ 
                    backgroundColor: i % 2 === 0 ? color : "#3a4060",
                    width: `${40 + Math.random() * 40}%`
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            {/* Keyboard */}
            <div className="w-28 h-6 rounded bg-secondary mt-2 mx-auto" />
          </motion.div>
        )}

        {scene === "accessibility" && (
          <motion.div
            className="relative"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${color}40, ${color}20)`,
                boxShadow: `0 0 40px ${color}30`
              }}
            >
              <Heart className="w-10 h-10" style={{ color }} />
            </div>
            {/* Pulse rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: color }}
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const UseCasesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(74, 144, 226, 0.03) 50%, transparent 100%)"
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
            className="inline-block text-primary text-sm font-medium mb-4 tracking-wider uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Use Cases
          </motion.span>
          <h2 className="section-title mb-4">Perfect for everyone</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're reading, coding, or need accessible controls—NavEye adapts to your workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="glass-card p-6 group hover:border-primary/30 transition-colors"
            >
              <IsometricScene scene={useCase.scene} color={useCase.color} />
              
              <div className="mt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${useCase.color}20` }}
                  >
                    <useCase.icon className="w-5 h-5" style={{ color: useCase.color }} />
                  </div>
                  <h3 className="text-lg font-semibold">{useCase.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{useCase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
