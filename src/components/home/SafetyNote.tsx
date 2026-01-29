import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle } from "lucide-react";

export const SafetyNote = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-16 px-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <div className="glass-card p-6 md:p-8 border-yellow-500/30 bg-yellow-500/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-yellow-200">Safety Note</h3>
              <p className="text-muted-foreground leading-relaxed">
                NavEye is designed for everyday use, but extended screen time and focused eye movements 
                may cause eye strain. Take regular breaks, follow the 20-20-20 rule (every 20 minutes, 
                look at something 20 feet away for 20 seconds), and consult an eye care professional 
                if you experience discomfort.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
