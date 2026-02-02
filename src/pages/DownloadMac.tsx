import { useState } from "react";
import { motion } from "framer-motion";
import { Apple, Download, CheckCircle, ArrowDown, AlertTriangle, Shield, Terminal, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingShapes } from "@/components/home/FloatingShapes";
import { useDownloadStats, useRecordDownload } from "@/hooks/useDownloadStats";
import { TermsDialog } from "@/components/download/TermsDialog";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { FirstTimeSetupDialog } from "@/components/download/FirstTimeSetupDialog";

const platform = {
  id: "mac" as const,
  name: "macOS",
  icon: Apple,
  version: "1.0.0",
  size: "~210 MB",
  file: "/downloads/NavEye-mac.dmg",
  requirements: [
    "macOS 12 Monterey or later",
    "Apple Silicon or Intel processor",
    "Built-in or external webcam",
  ],
};

const troubleshooting = [
  {
    title: '"NavEye" can\'t be opened because it is from an unidentified developer',
    solution: `This happens because NavEye isn't notarized with Apple (I'm a student and can't afford the $99/year developer fee). Don't worry - the app is completely safe!

**To open NavEye:**
1. Right-click (or Control-click) on the NavEye app
2. Select "Open" from the context menu
3. Click "Open" in the dialog that appears

After doing this once, macOS will remember your choice and you can open NavEye normally.`,
  },
  {
    title: '"NavEye" is damaged and can\'t be opened',
    solution: `This error usually appears due to macOS Gatekeeper restrictions. Here's how to fix it:

**Option 1 - Remove quarantine attribute:**
1. Open Terminal (search in Spotlight)
2. Run: \`xattr -cr /Applications/NavEye.app\`
3. Try opening NavEye again

**Option 2 - Temporarily allow apps from anywhere:**
1. Open Terminal
2. Run: \`sudo spctl --master-disable\`
3. Open NavEye
4. Re-enable protection: \`sudo spctl --master-enable\``,
  },
  {
    title: "NavEye needs camera permission",
    solution: `NavEye requires camera access to track your eye movements. All processing happens locally on your device.

**To grant camera permission:**
1. Go to System Preferences → Security & Privacy
2. Click the "Privacy" tab
3. Select "Camera" from the left sidebar
4. Check the box next to NavEye
5. Restart NavEye if it was already running`,
  },
  {
    title: "NavEye needs accessibility permission",
    solution: `NavEye needs accessibility access to control scrolling in other applications.

**To grant accessibility permission:**
1. Go to System Preferences → Security & Privacy
2. Click the "Privacy" tab
3. Select "Accessibility" from the left sidebar
4. Click the lock icon and enter your password
5. Check the box next to NavEye
6. Restart NavEye`,
  },
];

const DownloadMac = () => {
  const { data: stats, isLoading } = useDownloadStats();
  const recordDownload = useRecordDownload();
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);

  const handleDownloadClick = () => {
    setTermsDialogOpen(true);
  };

  const handleAgreeAndDownload = async () => {
    try {
      await recordDownload.mutateAsync(platform.id);
      toast.success(`Thank you for downloading NavEye!`, {
        description: "Your download will start shortly.",
      });
      
      const link = document.createElement("a");
      link.href = platform.file;
      link.download = platform.file.split("/").pop() || "NavEye";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTermsDialogOpen(false);
      setSetupDialogOpen(true);
    } catch (error) {
      toast.error("Download tracking failed, but your download should still work.");
      window.open(platform.file, "_blank");
      setTermsDialogOpen(false);
      setSetupDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        <FloatingShapes />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Link 
              to="/download" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              ← Back to all downloads
            </Link>
            
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-600/20 to-gray-800/20 border border-gray-500/30 flex items-center justify-center mx-auto mb-6"
            >
              <Apple className="w-12 h-12 text-gray-400" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              NavEye for <span className="gradient-text">macOS</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hands-free scrolling for your Mac
            </p>
          </motion.div>

          {/* Download Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <div className="counter-display">
              <Download className="w-4 h-4 text-primary" />
              <span>{isLoading ? "..." : stats?.mac.toLocaleString()} macOS downloads</span>
            </div>
            <div className="counter-display">
              <span>v{platform.version}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span>{platform.size}</span>
            </div>
          </motion.div>

          {/* Download Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 rounded-2xl mb-12"
          >
            <h2 className="text-xl font-semibold mb-4">System Requirements</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {platform.requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadClick}
              disabled={recordDownload.isPending}
              className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4"
            >
              <ArrowDown className="w-6 h-6" />
              Download NavEye for macOS
            </motion.button>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6 rounded-2xl mb-12 border-amber-500/30 bg-amber-500/5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-amber-500">Important: First-Time Setup</h3>
                <p className="text-muted-foreground mb-4">
                  NavEye is developed by me, a student, and isn't notarized with Apple (the $99/year developer fee is expensive for me!). 
                  macOS will show a warning when you first try to open it. <strong>The app is completely safe</strong> — here's how to open it:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">1</div>
                    <p className="text-sm"><strong>Right-click</strong> (or Control-click) on the NavEye app in your Applications folder</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">2</div>
                    <p className="text-sm">Select <strong>"Open"</strong> from the context menu</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">3</div>
                    <p className="text-sm">Click <strong>"Open"</strong> in the dialog — macOS will remember your choice</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Installation Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Installation Steps</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: "Download the DMG file", desc: "Click the download button above to get NavEye-mac.dmg" },
                { step: 2, title: "Open the DMG", desc: "Double-click the downloaded file to mount it" },
                { step: 3, title: "Drag to Applications", desc: "Drag the NavEye icon to your Applications folder" },
                { step: 4, title: "Open with Right-Click", desc: "Right-click NavEye and select 'Open' to bypass Gatekeeper" },
                { step: 5, title: "Grant Permissions", desc: "Allow camera and accessibility access when prompted" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 p-4 glass-card rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Troubleshooting */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Troubleshooting</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {troubleshooting.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass-card px-6 border-none rounded-xl"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      {item.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed whitespace-pre-line">
                    {item.solution}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Switch Platform */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground mb-4">Looking for a different platform?</p>
            <Link 
              to="/download/windows" 
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Download for Windows <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <TermsDialog
        open={termsDialogOpen}
        onOpenChange={setTermsDialogOpen}
        onAgree={handleAgreeAndDownload}
        platformName={platform.name}
        isLoading={recordDownload.isPending}
      />

      <FirstTimeSetupDialog
        open={setupDialogOpen}
        onOpenChange={setSetupDialogOpen}
        platform="mac"
      />

      <Footer />
    </div>
  );
};

export default DownloadMac;
