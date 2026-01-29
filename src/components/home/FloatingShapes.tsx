import { motion } from "framer-motion";

export const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large cyan blob - top right */}
      <motion.div
        className="floating-shape w-[600px] h-[600px] -top-32 -right-32"
        style={{ background: "var(--shape-cyan)" }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Purple blob - left center */}
      <motion.div
        className="floating-shape w-[500px] h-[500px] top-1/3 -left-48"
        style={{ background: "var(--shape-purple)" }}
        animate={{
          y: [0, 40, 0],
          x: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Blue blob - bottom right */}
      <motion.div
        className="floating-shape w-[400px] h-[400px] bottom-0 right-1/4"
        style={{ background: "var(--shape-blue)" }}
        animate={{
          y: [0, -25, 0],
          x: [0, 30, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Small accent circles */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-primary/40 top-1/4 right-1/3"
        animate={{
          y: [0, -40, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-2 h-2 rounded-full bg-accent/50 bottom-1/3 left-1/4"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          opacity: [0.5, 0.9, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      <motion.div
        className="absolute w-4 h-4 rounded-full bg-primary/30 top-2/3 right-1/4"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
    </div>
  );
};
