import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is my webcam data private?",
    answer: "Absolutely. NavEye processes all camera data locally on your device using on-device machine learning. No images, video, or eye tracking data ever leaves your computer. We don't have servers that could receive your data even if we wanted to.",
  },
  {
    question: "Does NavEye work with any application?",
    answer: "Yes! NavEye works at the system level, meaning it can scroll in any application — browsers, documents, social media, code editors, and more. If it scrolls, NavEye can control it.",
  },
  {
    question: "What are the system requirements?",
    answer: "NavEye requires macOS 12+ or Windows 10/11. You'll need a built-in or external webcam. For best results, we recommend good lighting and positioning your camera at eye level.",
  },
  {
    question: "Can I customize the sensitivity?",
    answer: "Yes! NavEye includes settings to adjust scroll speed, sensitivity, and the gestures used for different actions. You can fine-tune it to match your natural eye movements.",
  },
  {
    question: "Is NavEye free?",
    answer: "Yes, NavEye is completely free to download and use. We believe accessibility tools should be available to everyone. If you'd like to support development, you can star our GitHub repo or spread the word.",
  },
  {
    question: "What if eye tracking isn't accurate?",
    answer: "Make sure you have good lighting and your camera is at eye level. Try the built-in calibration tool in Settings. If issues persist, check our troubleshooting guide or reach out to support.",
  },
];

export const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-6" id="faq">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">Frequently asked questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about NavEye
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
