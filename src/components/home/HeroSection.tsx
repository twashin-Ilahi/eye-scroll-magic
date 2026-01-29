import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Apple, Monitor, ChevronDown } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden pt-24 pb-16 px-6 gap-8">
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          background: "radial-gradient(ellipse at 30% 20%, rgba(74, 144, 226, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(155, 89, 182, 0.1) 0%, transparent 50%)"
        }}
      />

      {/* Text Content - Left Side */}
      <div className="relative z-10 flex-1 max-w-xl text-center lg:text-left">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-primary font-medium">Now available for macOS & Windows</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
        >
          Scroll with
          <br />
          <span className="gradient-text">your eyes.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground mb-3"
        >
          Free. Fast. Private.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base text-muted-foreground/80 mb-8"
        >
          NavEye uses your webcam to detect eye movements, letting you scroll any app hands-free. 
          No data ever leaves your device.
        </motion.p>

        {/* Eye gesture indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex items-center justify-center lg:justify-start gap-6 mb-8 text-sm"
        >
          <div className="flex items-center gap-2 text-primary">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Left eye = Scroll down</span>
          </div>
          <div className="flex items-center gap-2 text-accent">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span>Right eye = Scroll up</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3"
        >
          <Link to="/download?platform=mac">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center gap-3 min-w-[200px]"
            >
              <Apple className="w-5 h-5" />
              Download for Mac
            </motion.button>
          </Link>

          <Link to="/download?platform=windows">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary flex items-center gap-3 min-w-[200px]"
            >
              <Monitor className="w-5 h-5" />
              Download for Windows
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>100% Privacy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Works Offline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>Open Source</span>
          </div>
        </motion.div>
      </div>

      {/* Hero Illustration - Right Side */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 flex-1 w-full max-w-2xl flex items-center justify-center"
      >
        <div className="relative">
          {/* Glow effect behind image */}
          <div 
            className="absolute inset-0 blur-3xl opacity-40"
            style={{
              background: "radial-gradient(ellipse at center, rgba(74, 144, 226, 0.4) 0%, rgba(155, 89, 182, 0.3) 50%, transparent 70%)"
            }}
          />
          <motion.img 
            src={heroIllustration} 
            alt="Person using NavEye eye-tracking to scroll hands-free while holding a coffee mug"
            className="relative z-10 w-full h-auto max-h-[500px] lg:max-h-[600px] object-contain drop-shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground/50"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};
