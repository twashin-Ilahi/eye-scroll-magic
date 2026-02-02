import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/home/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Bug, Send, AlertTriangle, Monitor, Smartphone, CheckCircle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ReportBug = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuickSubmitting, setIsQuickSubmitting] = useState(false);
  const [quickNote, setQuickNote] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    platform: "",
    description: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const bugReportsRef = collection(db, "bugReports");
      await addDoc(bugReportsRef, {
        report_type: "detailed",
        title: formData.title,
        category: formData.category,
        platform: formData.platform,
        description: formData.description,
        steps_to_reproduce: formData.stepsToReproduce,
        expected_behavior: formData.expectedBehavior,
        actual_behavior: formData.actualBehavior,
        email: formData.email || null,
        status: "open",
        created_at: new Date().toISOString(),
      });

      toast({
        title: "Bug Report Submitted!",
        description: "Thank you for helping us improve NavEye. We'll look into this issue.",
      });
      
      setFormData({
        title: "",
        category: "",
        platform: "",
        description: "",
        stepsToReproduce: "",
        expectedBehavior: "",
        actualBehavior: "",
        email: "",
      });
    } catch (error) {
      console.error("Error submitting bug report:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    
    setIsQuickSubmitting(true);
    
    try {
      const bugReportsRef = collection(db, "bugReports");
      await addDoc(bugReportsRef, {
        report_type: "quick",
        quick_note: quickNote.trim(),
        status: "open",
        created_at: new Date().toISOString(),
      });

      toast({
        title: "Quick Note Sent!",
        description: "Thanks for the quick feedback. We appreciate it!",
      });
      
      setQuickNote("");
    } catch (error) {
      console.error("Error submitting quick note:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsQuickSubmitting(false);
    }
  };

  const categories = [
    { value: "eye-tracking", label: "Eye Tracking" },
    { value: "scrolling", label: "Scrolling Issues" },
    { value: "calibration", label: "Calibration" },
    { value: "ui", label: "User Interface" },
    { value: "performance", label: "Performance" },
    { value: "crash", label: "App Crash" },
    { value: "other", label: "Other" },
  ];

  const platforms = [
    { value: "windows", label: "Windows" },
    { value: "macos", label: "macOS" },
    { value: "linux", label: "Linux" },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #0a0e27 0%, #0d1230 50%, #0a0e27 100%)"
        }}
      />
      
      <ParticleBackground />
      
      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-4 py-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/20 mb-6">
              <Bug className="w-10 h-10 text-destructive" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Report a <span className="text-destructive">Bug</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Found something that doesn't work right? Let us know and help us make NavEye better for everyone.
            </p>
          </motion.div>

          {/* Quick Bug Report Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Quick Bug Report</h3>
                  <p className="text-sm text-muted-foreground">Just want to leave a quick note? Drop it here.</p>
                </div>
              </div>
              <form onSubmit={handleQuickSubmit} className="flex gap-3">
                <Textarea
                  placeholder="Describe the issue briefly... (e.g., 'Eye tracking stops working after 10 minutes')"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  rows={2}
                  className="bg-background/50 flex-1 resize-none"
                />
                <Button
                  type="submit"
                  disabled={isQuickSubmitting || !quickNote.trim()}
                  className="self-end"
                >
                  {isQuickSubmitting ? (
                    <CheckCircle className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-sm text-muted-foreground">or provide more details below</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-500 mb-2">Tips for a Great Bug Report</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be specific about what happened and when</li>
                    <li>• Include steps to reproduce the issue</li>
                    <li>• Mention your operating system and version</li>
                    <li>• Describe what you expected to happen vs what actually happened</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="max-w-3xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
                {/* Bug Title */}
                <div className="space-y-2 mb-6">
                  <Label htmlFor="title" className="text-foreground">Bug Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-background/50"
                  />
                </div>

                {/* Category and Platform */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label className="text-foreground">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      required
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Platform *</Label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) => setFormData({ ...formData, platform: value })}
                      required
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((plat) => (
                          <SelectItem key={plat.value} value={plat.value}>
                            <span className="flex items-center gap-2">
                              {plat.value === "windows" || plat.value === "linux" ? (
                                <Monitor className="w-4 h-4" />
                              ) : (
                                <Smartphone className="w-4 h-4" />
                              )}
                              {plat.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-6">
                  <Label htmlFor="description" className="text-foreground">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the bug in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="bg-background/50"
                  />
                </div>

                {/* Steps to Reproduce */}
                <div className="space-y-2 mb-6">
                  <Label htmlFor="steps" className="text-foreground">Steps to Reproduce</Label>
                  <Textarea
                    id="steps"
                    placeholder="1. Open the app&#10;2. Click on...&#10;3. Notice that..."
                    value={formData.stepsToReproduce}
                    onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                    rows={4}
                    className="bg-background/50"
                  />
                </div>

                {/* Expected vs Actual */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="expected" className="text-foreground">Expected Behavior</Label>
                    <Textarea
                      id="expected"
                      placeholder="What should have happened?"
                      value={formData.expectedBehavior}
                      onChange={(e) => setFormData({ ...formData, expectedBehavior: e.target.value })}
                      rows={3}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="actual" className="text-foreground">Actual Behavior</Label>
                    <Textarea
                      id="actual"
                      placeholder="What actually happened?"
                      value={formData.actualBehavior}
                      onChange={(e) => setFormData({ ...formData, actualBehavior: e.target.value })}
                      rows={3}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 mb-8">
                  <Label htmlFor="email" className="text-foreground">Your Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll only use this to follow up on your report if needed.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-destructive hover:bg-destructive/90"
                >
                  {isSubmitting ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2 animate-pulse" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Bug Report
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Alternative Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              Need immediate help?{" "}
              <a
                href="mailto:hello@naveye.app"
                className="text-primary hover:underline"
              >
                Contact our support team
              </a>
            </p>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default ReportBug;
