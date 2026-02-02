import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Download, CheckCircle, ArrowDown, AlertTriangle, Shield, ChevronRight } from "lucide-react";
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
  id: "windows" as const,
  name: "Windows",
  icon: Monitor,
  version: "1.0.0",
  size: "~210 MB",
  file: "https://github.com/twashin-Ilahi/eye-scroll-magic/releases/download/Windows_v1/NavEye.exe",
  requirements: [
    "Windows 10 or Windows 11",
    "64-bit processor",
    "Built-in or external webcam",
  ],
};

const troubleshooting = [
  {
    title: '"Windows protected your PC" - SmartScreen warning',
    solution: `This warning appears because NavEye isn't signed with an expensive code signing certificate (I'm a student!). The app is completely safe.

**To run NavEye:**
1. Click "More info" on the SmartScreen popup
2. Click "Run anyway"

Windows will remember your choice and won't show this warning again for NavEye.`,
  },
  {
    title: '"This app can\'t run on your PC"',
    solution: `This usually means you're trying to run the app on a 32-bit system.

**Requirements:**
- Windows 10 or Windows 11
- 64-bit operating system

To check your system type:
1. Press Windows + I to open Settings
2. Go to System → About
3. Look for "System type" - it should say "64-bit operating system"`,
  },
  {
    title: "Antivirus blocking NavEye",
    solution: `Some antivirus software may flag NavEye because it's not signed. This is a false positive.

**To allow NavEye:**
1. Open your antivirus software
2. Go to Settings or Exclusions
3. Add NavEye.exe to the exclusion/whitelist
4. Try running NavEye again

Popular antivirus exclusion guides:
- **Windows Defender**: Settings → Virus & threat protection → Exclusions
- **Avast/AVG**: Settings → Exceptions → Add exception
- **Norton**: Settings → Antivirus → Scans and Risks → Items to Exclude`,
  },
  {
    title: "Camera not detected",
    solution: `NavEye needs camera access to track your eye movements.

**Troubleshooting steps:**
1. Make sure your webcam is connected and working
2. Check if other apps can use the camera (try the Camera app)
3. Grant camera permission:
   - Press Windows + I
   - Go to Privacy & Security → Camera
   - Make sure "Camera access" is On
   - Make sure "Let apps access your camera" is On

4. Update your webcam drivers if issues persist`,
  },
  {
    title: "NavEye is running but not scrolling",
    solution: `If NavEye opens but scrolling doesn't work:

**Check these settings:**
1. Make sure eye tracking is calibrated (use the calibration wizard in NavEye)
2. Ensure good lighting - face your light source, not away from it
3. Position yourself about arm's length from the screen
4. Make sure your full face is visible to the camera

**Try these fixes:**
- Restart NavEye
- Run NavEye as Administrator (right-click → Run as administrator)
- Check if your webcam supports the required resolution`,
  },
];

const DownloadWindows = () => {
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
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6"
            >
              <Monitor className="w-12 h-12 text-blue-400" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              NavEye for <span className="gradient-text">Windows</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hands-free scrolling for your PC
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
              <span>{isLoading ? "..." : stats?.windows.toLocaleString()} Windows downloads</span>
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
              Download NavEye for Windows
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
                  NavEye isn't signed with an expensive code signing certificate (I'm a student and these cost hundreds of dollars!).
                  Windows SmartScreen will show a warning. <strong>The app is completely safe</strong> — here's how to run it:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">1</div>
                    <p className="text-sm">When you see "Windows protected your PC", click <strong>"More info"</strong></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">2</div>
                    <p className="text-sm">Click <strong>"Run anyway"</strong></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">3</div>
                    <p className="text-sm">Windows will remember your choice and won't ask again</p>
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
                { step: 1, title: "Download the installer", desc: "Click the download button above to get NavEye.exe" },
                { step: 2, title: "Run the installer", desc: "Double-click the downloaded file" },
                { step: 3, title: "Bypass SmartScreen", desc: "Click 'More info' then 'Run anyway' on the warning" },
                { step: 4, title: "Follow the setup wizard", desc: "Accept the defaults or customize installation location" },
                { step: 5, title: "Launch NavEye", desc: "Find NavEye in your Start menu and run it" },
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
              to="/download/mac" 
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Download for macOS <ChevronRight className="w-4 h-4" />
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
        platform="windows"
      />

      <Footer />
    </div>
  );
};

export default DownloadWindows;
