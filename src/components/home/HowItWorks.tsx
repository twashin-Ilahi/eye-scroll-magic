import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TiltCard } from "./TiltCard";
import { ArrowDown, ArrowUp, Pause, Eye, EyeOff } from "lucide-react";

const controls = [
  {
    id: "scroll-down",
    title: "Scroll Down",
    description: "Close your left eye to scroll down smoothly",
    icon: EyeOff,
    secondaryIcon: Eye,
    arrow: ArrowDown,
    color: "#4A90E2",
    eyeState: "left-closed",
  },
  {
    id: "scroll-up",
    title: "Scroll Up",
    description: "Close your right eye to scroll up smoothly",
    icon: Eye,
    secondaryIcon: EyeOff,
    arrow: ArrowUp,
    color: "#9B59B6",
    eyeState: "right-closed",
  },
  {
    id: "pause",
    title: "Stop Scrolling",
    description: "Keep both eyes open to pause scrolling",
    icon: Eye,
    secondaryIcon: Eye,
    arrow: Pause,
    color: "#22c55e",
    eyeState: "both-open",
  },
];

const SpeedGauge = ({ speed, color }: { speed: number; color: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-muted-foreground">Speed</span>
    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${speed}%` }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </div>
  </div>
);

const FaceAvatar = ({ eyeState }: { eyeState: string }) => (
  <div className="relative w-20 h-20 mx-auto mb-4">
    {/* Face circle */}
    <div className="w-full h-full rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
      {/* Eyes container */}
      <div className="flex items-center gap-4">
        {/* Left eye */}
        <motion.div
          className="w-4 h-4 rounded-full bg-primary flex items-center justify-center"
          animate={{
            scaleY: eyeState === "left-closed" ? 0.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-2 h-2 rounded-full bg-background" />
        </motion.div>
        
        {/* Right eye */}
        <motion.div
          className="w-4 h-4 rounded-full bg-accent flex items-center justify-center"
          animate={{
            scaleY: eyeState === "right-closed" ? 0.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-2 h-2 rounded-full bg-background" />
        </motion.div>
      </div>
    </div>
  </div>
);

export const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative overflow-hidden" id="how-it-works">
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(74, 144, 226, 0.05) 50%, transparent 100%)"
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
            Eye Controls
          </motion.span>
          <h2 className="section-title mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple eye gestures for hands-free scrolling. No learning curve required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {controls.map((control, index) => (
            <motion.div
              key={control.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="group"
              style={{ perspective: "1000px" }}
            >
              <TiltCard glowColor={control.color}>
                <FaceAvatar eyeState={control.eyeState} />
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <motion.div
                    animate={{ y: control.id === "pause" ? 0 : [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <control.arrow 
                      className="w-8 h-8" 
                      style={{ color: control.color }}
                    />
                  </motion.div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-center">{control.title}</h3>
                <p className="text-muted-foreground text-center text-sm mb-4">{control.description}</p>
                
                <SpeedGauge 
                  speed={control.id === "pause" ? 0 : control.id === "scroll-down" ? 75 : 65} 
                  color={control.color} 
                />
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Connection lines */}
        <div className="hidden md:flex justify-center mt-12">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-px w-2/3 bg-gradient-to-r from-primary via-accent to-green-500 opacity-30"
          />
        </div>
      </div>
    </section>
  );
};
