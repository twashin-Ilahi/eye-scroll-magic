import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Check if device has mouse
    const hasTouch = "ontouchstart" in window;
    if (hasTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Track hoverable elements
    const addHoverListeners = () => {
      const hoverables = document.querySelectorAll("a, button, [role='button'], input, textarea, select");
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovering(true));
        el.addEventListener("mouseleave", () => setIsHovering(false));
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    // Add hover listeners with delay to ensure DOM is ready
    setTimeout(addHoverListeners, 1000);

    // MutationObserver to handle dynamically added elements
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  // Hide on touch devices or reduced motion
  if (typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasTouch = "ontouchstart" in window;
    if (prefersReducedMotion || hasTouch) return null;
  }

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div 
          className="w-10 h-10 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(74, 144, 226, 0.3) 0%, rgba(155, 89, 182, 0.1) 50%, transparent 70%)",
            boxShadow: isHovering 
              ? "0 0 30px rgba(74, 144, 226, 0.5), 0 0 60px rgba(155, 89, 182, 0.3)"
              : "0 0 20px rgba(74, 144, 226, 0.3)",
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div 
          className="w-2 h-2 rounded-full bg-primary"
          style={{
            boxShadow: "0 0 10px rgba(74, 144, 226, 0.8)",
          }}
        />
      </motion.div>
    </>
  );
};
