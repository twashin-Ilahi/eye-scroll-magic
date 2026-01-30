import { useState } from "react";
import { motion } from "framer-motion";
import { Apple, Monitor, Download, CheckCircle, ArrowDown } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingShapes } from "@/components/home/FloatingShapes";
import { useDownloadStats, useRecordDownload } from "@/hooks/useDownloadStats";
import { TermsDialog } from "@/components/download/TermsDialog";
import { toast } from "sonner";

const platforms = [
  {
    id: "mac" as const,
    name: "macOS",
    icon: Apple,
    version: "1.0.0",
    size: "~25 MB",
    file: "/downloads/NavEye-mac.dmg",
    requirements: [
      "macOS 12 Monterey or later",
      "Apple Silicon or Intel processor",
      "Built-in or external webcam",
    ],
    gradient: "from-gray-600 to-gray-800",
  },
  {
    id: "windows" as const,
    name: "Windows",
    icon: Monitor,
    version: "1.0.0",
    size: "~30 MB",
    file: "/downloads/NavEye-win.exe",
    requirements: [
      "Windows 10 or Windows 11",
      "64-bit processor",
      "Built-in or external webcam",
    ],
    gradient: "from-blue-600 to-blue-800",
  },
];

const DownloadPage = () => {
  const { data: stats, isLoading } = useDownloadStats();
  const recordDownload = useRecordDownload();
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<{
    id: "mac" | "windows";
    name: string;
    file: string;
  } | null>(null);

  const handleDownloadClick = (platform: typeof platforms[0]) => {
    setSelectedPlatform({
      id: platform.id,
      name: platform.name,
      file: platform.file,
    });
    setTermsDialogOpen(true);
  };

  const handleAgreeAndDownload = async () => {
    if (!selectedPlatform) return;

    try {
      await recordDownload.mutateAsync(selectedPlatform.id);
      toast.success(`Thank you for downloading NavEye!`, {
        description: "Your download will start shortly.",
      });
      
      // Trigger download
      const link = document.createElement("a");
      link.href = selectedPlatform.file;
      link.download = selectedPlatform.file.split("/").pop() || "NavEye";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTermsDialogOpen(false);
      setSelectedPlatform(null);
    } catch (error) {
      toast.error("Download tracking failed, but your download should still work.");
      // Still attempt the download
      window.open(selectedPlatform.file, "_blank");
      setTermsDialogOpen(false);
      setSelectedPlatform(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        <FloatingShapes />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Download <span className="gradient-text">NavEye</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started with hands-free scrolling in under a minute.
            </p>
          </motion.div>

          {/* Download Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <div className="counter-display">
              <Download className="w-4 h-4 text-primary" />
              <span>
                {isLoading ? "..." : stats?.total.toLocaleString()} total downloads
              </span>
            </div>
            <div className="counter-display">
              <Apple className="w-4 h-4" />
              <span>{isLoading ? "..." : stats?.mac.toLocaleString()} macOS</span>
            </div>
            <div className="counter-display">
              <Monitor className="w-4 h-4" />
              <span>{isLoading ? "..." : stats?.windows.toLocaleString()} Windows</span>
            </div>
          </motion.div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="platform-card"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6"
                >
                  <platform.icon className="w-10 h-10 text-primary" />
                </motion.div>

                {/* Platform Name */}
                <h2 className="text-2xl font-bold mb-2">{platform.name}</h2>

                {/* Version & Size */}
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                  <span>v{platform.version}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{platform.size}</span>
                </div>

                {/* Requirements */}
                <div className="space-y-2 mb-8">
                  {platform.requirements.map((req, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>

                {/* Download Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownloadClick(platform)}
                  disabled={recordDownload.isPending}
                  className="btn-primary w-full flex items-center justify-center gap-3"
                >
                  <ArrowDown className="w-5 h-5" />
                  Download for {platform.name}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground">
              Need help installing?{" "}
              <a href="/instructions" className="text-primary hover:underline">
                View installation guide →
              </a>
            </p>
          </motion.div>
        </div>
      </main>

      {/* Terms Dialog */}
      <TermsDialog
        open={termsDialogOpen}
        onOpenChange={setTermsDialogOpen}
        onAgree={handleAgreeAndDownload}
        platformName={selectedPlatform?.name || ""}
        isLoading={recordDownload.isPending}
      />

      <Footer />
    </div>
  );
};

export default DownloadPage;
