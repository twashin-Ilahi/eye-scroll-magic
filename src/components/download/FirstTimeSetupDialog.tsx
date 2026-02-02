import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface FirstTimeSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: "mac" | "windows";
}

export const FirstTimeSetupDialog = ({
  open,
  onOpenChange,
  platform,
}: FirstTimeSetupDialogProps) => {
  const isMac = platform === "mac";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Please Read Carefully - First Time Setup
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Important steps to run NavEye for the first time
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              NavEye is developed by me, a student, and I couldn't afford the{" "}
              {isMac ? "$99/year Apple Developer fee" : "expensive code signing certificate"} to get the app officially signed.{" "}
              <strong className="text-foreground">The app is completely safe!</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Your {isMac ? "Mac" : "PC"} will show a security warning because of this. Here's how to bypass it:
            </p>
          </div>

          <div className="space-y-3">
            {isMac ? (
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">1</div>
                  <p className="text-sm"><strong>Right-click</strong> (or Control-click) on the NavEye app</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">2</div>
                  <p className="text-sm">Select <strong>"Open"</strong> from the context menu</p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">3</div>
                  <p className="text-sm">Click <strong>"Open"</strong> in the dialog that appears</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">1</div>
                  <p className="text-sm">When "Windows protected your PC" appears, click <strong>"More info"</strong></p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">2</div>
                  <p className="text-sm">Click <strong>"Run anyway"</strong></p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">3</div>
                  <p className="text-sm">Windows will remember your choice</p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-green-500 mt-4">
            <CheckCircle className="w-4 h-4" />
            <span>Your download has started!</span>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
