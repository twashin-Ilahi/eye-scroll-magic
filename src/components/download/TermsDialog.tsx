import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Shield, AlertTriangle, Heart, Lock, Settings, RefreshCw, Gauge, Scale, Copyright, ShieldAlert, FileText } from "lucide-react";

interface TermsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgree: () => void;
  platformName: string;
  isLoading?: boolean;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ExpandableSection = ({ title, icon, children }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border border-border/50 rounded-lg overflow-hidden">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <span className="font-medium text-sm">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const TermsDialog = ({
  open,
  onOpenChange,
  onAgree,
  platformName,
  isLoading,
}: TermsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <FileText className="w-6 h-6 text-primary" />
            Terms & Conditions
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Please review before downloading NavEye for {platformName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] px-6 py-4">
          {/* Quick Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Quick Summary
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• NavEye is a hands-free scrolling tool using eye tracking</li>
              <li>• All processing happens locally — no data is uploaded</li>
              <li>• Not for use while driving or operating machinery</li>
              <li>• Take breaks to avoid eye strain</li>
            </ul>
          </div>

          {/* Agreement Notice */}
          <p className="text-sm text-muted-foreground mb-4">
            By clicking "Agree & Download", you confirm that you have read, understood, and accepted these Terms. Expand sections below for full details.
          </p>

          {/* Expandable Sections */}
          <div className="space-y-2">
            <ExpandableSection title="1. Purpose of NavEye" icon={<Shield className="w-4 h-4" />}>
              <p className="mb-2">
                NavEye is a hands-free scrolling and navigation tool that uses camera-based facial and eye landmark detection to allow users to scroll on-screen through eye movement and blinking actions.
              </p>
              <p>
                The App is intended to improve accessibility and user convenience, but it is <strong>not designed for medical, safety-critical, emergency, or high-risk environments</strong>.
              </p>
            </ExpandableSection>

            <ExpandableSection title="2. Safety Notice" icon={<AlertTriangle className="w-4 h-4" />}>
              <p className="mb-2">
                NavEye uses computer vision and real-time eye interaction. Because detection may vary based on lighting, camera quality, facial features, eyewear, or system performance, the App may occasionally behave unexpectedly.
              </p>
              <p className="mb-2 font-medium">You agree NOT to use NavEye while:</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li>Driving, cycling, or operating vehicles</li>
                <li>Operating machinery or tools</li>
                <li>Activities where distraction could cause harm</li>
                <li>Safety-critical environments</li>
              </ul>
              <p>NavEye should only be used for general desktop interaction.</p>
            </ExpandableSection>

            <ExpandableSection title="3. Health & Medical Disclaimer" icon={<Heart className="w-4 h-4" />}>
              <p className="mb-2">
                NavEye requires sustained screen engagement and repeated eye movement, which may cause discomfort for some users.
              </p>
              <p className="mb-2 font-medium">Certain users may experience:</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li>Eye strain or fatigue</li>
                <li>Headaches or dizziness</li>
                <li>Visual discomfort</li>
                <li>Repetitive motion fatigue</li>
              </ul>
              <p className="mb-2">
                If you have any medical, neurological, or vision-related condition, consult a healthcare professional before using NavEye.
              </p>
              <p className="font-medium">
                NavEye is not a medical device. Stop using immediately if discomfort occurs.
              </p>
            </ExpandableSection>

            <ExpandableSection title="4. Local Processing & Privacy" icon={<Lock className="w-4 h-4" />}>
              <p className="mb-2 font-medium">NavEye is designed with privacy in mind:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All detection and processing happens locally on your computer</li>
                <li>No camera footage is uploaded, transmitted, or stored</li>
                <li>No facial data, biometric data, or tracking information is collected</li>
                <li>No user accounts, cloud services, or remote monitoring</li>
                <li>Camera input is used only temporarily in memory and is not saved</li>
              </ul>
            </ExpandableSection>

            <ExpandableSection title="5. Permissions & System Access" icon={<Settings className="w-4 h-4" />}>
              <p className="mb-2">To function properly, NavEye may request:</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li>Camera access</li>
                <li>Accessibility access (for scrolling control)</li>
              </ul>
              <p>
                These permissions are required only to enable functionality. You may revoke them at any time via system settings.
              </p>
            </ExpandableSection>

            <ExpandableSection title="6. No Automatic Updates" icon={<RefreshCw className="w-4 h-4" />}>
              <p>
                NavEye does not automatically install updates. The App will only update if you manually download a newer version from the official NavEye website. Users are responsible for checking for updates.
              </p>
            </ExpandableSection>

            <ExpandableSection title="7. No Guarantee of Performance" icon={<Gauge className="w-4 h-4" />}>
              <p className="mb-2">NavEye depends on device hardware and software conditions. You acknowledge that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Scrolling accuracy may vary</li>
                <li>Detection may fail in certain lighting or environments</li>
                <li>The App may behave inconsistently across devices</li>
                <li>Performance is not guaranteed</li>
              </ul>
            </ExpandableSection>

            <ExpandableSection title="8. Acceptable Use" icon={<Scale className="w-4 h-4" />}>
              <p className="mb-2">You agree not to use NavEye:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>For unlawful activity</li>
                <li>To interfere with other systems or users</li>
                <li>To bypass OS-level security features</li>
                <li>In any way that violates applicable laws or third-party rights</li>
              </ul>
            </ExpandableSection>

            <ExpandableSection title="9. Copyright & Ownership" icon={<Copyright className="w-4 h-4" />}>
              <p className="mb-2">
                NavEye and all associated materials are protected under applicable copyright, intellectual property, and trademark laws.
              </p>
              <p className="mb-2 font-medium">You may not:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Copy, redistribute, sell, sublicense, or reverse engineer the App</li>
                <li>Modify or republish NavEye as your own product</li>
                <li>Use NavEye branding or assets without permission</li>
              </ul>
            </ExpandableSection>

            <ExpandableSection title="10. Limitation of Liability" icon={<ShieldAlert className="w-4 h-4" />}>
              <p className="mb-2">
                NavEye is provided on an "AS IS" and "AS AVAILABLE" basis, without warranties of any kind.
              </p>
              <p className="mb-2">
                NavEye and its creators shall not be liable for any damages including loss of data, device malfunction, health discomfort, unintended scrolling behavior, or business interruption.
              </p>
              <p>
                Use of NavEye is voluntary and undertaken at your own discretion and responsibility.
              </p>
            </ExpandableSection>

            <ExpandableSection title="11. Indemnification" icon={<FileText className="w-4 h-4" />}>
              <p>
                You agree to indemnify and hold harmless NavEye and its developers from any claims, liabilities, damages, losses, or expenses resulting from your misuse of the App, violation of these Terms, or violation of laws or third-party rights.
              </p>
            </ExpandableSection>
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Last Updated: January 2025
          </p>
        </ScrollArea>

        {/* Footer with buttons */}
        <div className="p-6 pt-4 border-t border-border/50 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onAgree}
            disabled={isLoading}
            className="sm:order-2 bg-primary hover:bg-primary/90"
          >
            {isLoading ? "Processing..." : "Agree & Download"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
