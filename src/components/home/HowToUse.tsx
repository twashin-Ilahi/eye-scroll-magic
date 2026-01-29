import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Camera, Hand, Play, ArrowUpDown, PauseCircle } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Grant Camera Permission",
    description: "Allow NavEye to access your webcam for eye tracking.",
    tip: "Your camera feed is processed locally and never recorded.",
  },
  {
    icon: Hand,
    title: "Grant Accessibility Permission",
    description: "Enable NavEye to control scrolling in any application.",
    tip: "Required for system-wide scroll control on macOS.",
  },
  {
    icon: Play,
    title: "Start NavEye",
    description: "Click the NavEye icon in your menu bar to start tracking.",
    tip: "Look at the camera briefly to calibrate.",
  },
  {
    icon: ArrowUpDown,
    title: "Wink Left/Right to Scroll",
    description: "Wink your left eye to scroll up, right eye to scroll down.",
    tip: "Adjust sensitivity in settings if needed.",
  },
  {
    icon: PauseCircle,
    title: "Close Both Eyes to Pause",
    description: "Close both eyes for 1 second to pause eye tracking.",
    tip: "Open your eyes to resume instantly.",
  },
];

export const HowToUse = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">How to use NavEye</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master the basics in under a minute
          </p>
        </motion.div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * index }}
              className="step-card flex flex-col md:flex-row gap-6 items-start group"
            >
              {/* Step number */}
              <div className="flex-shrink-0 flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                >
                  <step.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <span className="text-4xl font-bold text-muted/30 md:hidden">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <span className="hidden md:inline text-3xl font-bold text-muted/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">{step.description}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-sm text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {step.tip}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
