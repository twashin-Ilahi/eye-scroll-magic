import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Camera, 
  Hand, 
  Play, 
  ArrowUpDown, 
  PauseCircle,
  Settings,
  AlertCircle,
  Monitor,
  RefreshCw,
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

const installationSteps = [
  {
    icon: Camera,
    title: "1. Download NavEye",
    description: "Download the installer for your operating system from the Download page.",
    details: [
      "macOS: Open the .dmg file and drag NavEye to Applications",
      "Windows: Run the .exe installer and follow the prompts",
    ],
  },
  {
    icon: Hand,
    title: "2. Grant Camera Permission",
    description: "When you first open NavEye, you'll be prompted to allow camera access.",
    details: [
      "macOS: Click 'OK' when System Preferences prompts for camera access",
      "Windows: Allow access in the Windows privacy settings",
    ],
  },
  {
    icon: Settings,
    title: "3. Grant Accessibility Permission",
    description: "NavEye needs accessibility access to control scrolling system-wide.",
    details: [
      "macOS: Go to System Preferences → Privacy & Security → Accessibility → Enable NavEye",
      "Windows: Run NavEye as Administrator the first time, or adjust UAC settings",
    ],
  },
  {
    icon: Play,
    title: "4. Start NavEye",
    description: "Click the NavEye icon in your menu bar or system tray to start.",
    details: [
      "The icon will change color to indicate tracking is active",
      "Look directly at your camera briefly to calibrate",
    ],
  },
];

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
    title: "Close Both Eyes = Pause",
    description: "Close both eyes for about 1 second to pause tracking. Open them to resume.",
  },
  {
    icon: RefreshCw,
    title: "Wink to Click",
    description: "Quick wink with your left eye for left click, right eye for right click (if enabled in settings).",
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
    answer: "Some apps may have custom scroll handling. Try enabling 'Compatibility Mode' in NavEye Settings. If the issue persists, report it on our GitHub issues page.",
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
  const installRef = useRef(null);
  const usageRef = useRef(null);
  const troubleRef = useRef(null);
  
  const installInView = useInView(installRef, { once: true, margin: "-100px" });
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
              Getting Started with <span className="gradient-text">NavEye</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete guide to installing and using NavEye for hands-free scrolling.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-20"
          >
            <a href="#installation" className="counter-display hover:bg-secondary transition-colors">
              Installation
            </a>
            <a href="#usage" className="counter-display hover:bg-secondary transition-colors">
              How to Use
            </a>
            <a href="#troubleshooting" className="counter-display hover:bg-secondary transition-colors">
              Troubleshooting
            </a>
          </motion.div>

          {/* Installation Section */}
          <section id="installation" className="mb-24" ref={installRef}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={installInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="section-title text-3xl mb-4">Installation</h2>
              <p className="text-muted-foreground">
                Follow these steps to get NavEye running on your computer.
              </p>
            </motion.div>

            <div className="space-y-6">
              {installationSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={installInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="step-card"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      
                      {/* Screenshot placeholder */}
                      <div className="mb-4 rounded-xl overflow-hidden bg-secondary/50 aspect-video flex items-center justify-center border border-border/50">
                        <div className="text-center text-muted-foreground">
                          <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Screenshot placeholder</p>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

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
                Check out our GitHub discussions or reach out to support.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://github.com/naveye/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm px-6 py-3"
                >
                  Open GitHub Issue
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
