import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/home/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Shield, LogIn, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        // Try to access bug reports to verify admin status
        const { error: accessError } = await supabase
          .from("bug_reports")
          .select("id")
          .limit(1);

        if (accessError) {
          await supabase.auth.signOut();
          setError("You don't have admin privileges.");
          return;
        }

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        navigate("/admin/bug-reports");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

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
        
        <main className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
              <p className="text-muted-foreground">
                Sign in to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Only authorized administrators can access this area.
            </p>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default AdminLogin;
