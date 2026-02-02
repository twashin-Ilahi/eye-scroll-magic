import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  ArrowUpDown, 
  PauseCircle,
  AlertCircle,
  Eye,
  Lightbulb
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const usageTips = [
  {
    icon: Eye,
    title: "Look Up = Scroll Up",
    description: "Move your gaze upward to scroll the page up. The scroll speed adjusts based on how far you look.",
  },
  {
    icon: ArrowUpDown,
    title: "Look Down = Scroll Down",
    description: "Move your gaze downward to scroll the page down. Keep your head relatively still for best results.",
  },
  {
    icon: PauseCircle,
    title: "Open Both Eyes = Pause",
    description: "Open both eyes wide for about 1 second to pause tracking. Resume normal gaze to continue.",
  },
];

const troubleshooting = [
  {
    question: "NavEye isn't detecting my eyes",
    answer: "Ensure good lighting on your face, position your camera at eye level, and make sure nothing is obstructing your eyes (remove glasses if they have heavy glare). Try the 'Recalibrate' option in the menu.",
  },
  {
    question: "Scrolling is too fast or too slow",
    answer: "Open NavEye Settings and adjust the 'Scroll Sensitivity' slider. Lower values = slower scrolling. You can also adjust the 'Dead Zone' to require more eye movement before scrolling starts.",
  },
  {
    question: "Accessibility permission keeps turning off (macOS)",
    answer: "This can happen after macOS updates. Go to System Preferences → Privacy & Security → Accessibility, remove NavEye from the list, then add it again. You may need to restart NavEye.",
  },
  {
    question: "NavEye isn't working in a specific app",
    answer: "Some apps may have custom scroll handling. Try enabling 'Compatibility Mode' in NavEye Settings. If the issue persists, report it via our Report Bug page.",
  },
  {
    question: "High CPU usage",
    answer: "Lower the 'Tracking Quality' setting to 'Balanced' or 'Power Saver' mode. You can also reduce the camera resolution in settings.",
  },
  {
    question: "Cursor moves on its own",
    answer: "Disable 'Eye-to-Cursor' mode in settings if you only want scrolling. Make sure your camera is stable and not moving.",
  },
];

const InstructionsPage = () => {
  const usageRef = useRef(null);
  const troubleRef = useRef(null);
  
  const usageInView = useInView(usageRef, { once: true, margin: "-100px" });
  const troubleInView = useInView(troubleRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              How to Use <span className="gradient-text">NavEye</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master hands-free scrolling with these simple gestures and tips.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-20"
          >
            <a href="#usage" className="counter-display hover:bg-secondary transition-colors">
              How to Use
            </a>
            <a href="#troubleshooting" className="counter-display hover:bg-secondary transition-colors">
              Troubleshooting
            </a>
          </motion.div>

          {/* Usage Section */}
          <section id="usage" className="mb-24" ref={usageRef}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={usageInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="section-title text-3xl mb-4">How to Use</h2>
              <p className="text-muted-foreground">
                Master the basic gestures to control NavEye.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {usageTips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={usageInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="feature-card group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                  >
                    <tip.icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground text-sm">{tip.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Pro Tips */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={usageInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 glass-card p-8 border-primary/20"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-primary" />
                Pro Tips
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>For best results, sit in a well-lit area with your face evenly illuminated.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Keep your head relatively still — NavEye tracks eye movement, not head movement.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>If wearing glasses, adjust your position to minimize glare on the lenses.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span>Use the calibration tool in Settings for a personalized experience.</span>
                </li>
              </ul>
            </motion.div>
          </section>

          {/* Troubleshooting Section */}
          <section id="troubleshooting" ref={troubleRef}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={troubleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center gap-4 mb-4">
                <AlertCircle className="w-8 h-8 text-primary" />
                <h2 className="section-title text-3xl">Troubleshooting</h2>
              </div>
              <p className="text-muted-foreground">
                Common issues and how to fix them.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={troubleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {troubleshooting.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="glass-card px-6 border-none"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6 font-medium">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            {/* Still need help */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={troubleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center glass-card p-8"
            >
              <h3 className="text-xl font-semibold mb-3">Still need help?</h3>
              <p className="text-muted-foreground mb-6">
                Report an issue or reach out to our support team.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/report-bug"
                  className="btn-secondary text-sm px-6 py-3"
                >
                  Report an Issue
                </a>
                <a href="mailto:hello@naveye.app" className="btn-primary text-sm px-6 py-3">
                  Contact Support
                </a>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InstructionsPage;
