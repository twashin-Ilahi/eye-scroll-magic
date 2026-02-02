import { Link } from "react-router-dom";
import { Mail, Github } from "lucide-react";
import naveyeLogo from "@/assets/naveye-logo.png";

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 bg-card/30">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <img src={naveyeLogo} alt="NavEye Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-xl font-bold">NavEye</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Hands-free scrolling powered by your eyes. Free, fast, and completely private.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/twashin-Ilahi/NavEye"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@naveye.app"
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <div className="flex flex-col gap-3">
              <Link to="/download" className="text-muted-foreground hover:text-foreground transition-colors">
                Download
              </Link>
              <Link to="/instructions" className="text-muted-foreground hover:text-foreground transition-colors">
                Instructions
              </Link>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="flex flex-col gap-3">
              <Link to="/instructions#troubleshooting" className="text-muted-foreground hover:text-foreground transition-colors">
                Troubleshooting
              </Link>
              <Link to="/report-bug" className="text-muted-foreground hover:text-foreground transition-colors">
                Report Issue
              </Link>
              <a href="mailto:hello@naveye.app" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NavEye. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for accessibility
          </p>
        </div>
      </div>
    </footer>
  );
};
