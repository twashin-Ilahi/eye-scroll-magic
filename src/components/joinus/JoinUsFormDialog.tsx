import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const baseSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

const developerSchema = baseSchema.extend({
  skills: z.string().trim().max(500, "Skills must be less than 500 characters").optional(),
  portfolio_url: z.string().trim().url("Invalid URL").max(500, "URL must be less than 500 characters").optional().or(z.literal("")),
});

type BaseFormData = z.infer<typeof baseSchema>;
type DeveloperFormData = z.infer<typeof developerSchema>;

interface JoinUsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleType: string;
  roleTitle: string;
  roleColor: string;
}

const isDeveloperRole = (role: string) => 
  role === "App Maintainers" || role === "Mobile Developers";

export function JoinUsFormDialog({
  open,
  onOpenChange,
  roleType,
  roleTitle,
  roleColor,
}: JoinUsFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDeveloper = isDeveloperRole(roleType);
  
  const form = useForm<DeveloperFormData>({
    resolver: zodResolver(isDeveloper ? developerSchema : baseSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      skills: "",
      portfolio_url: "",
    },
  });

  const onSubmit = async (data: DeveloperFormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("join_requests").insert({
        role_type: roleType,
        name: data.name,
        email: data.email,
        message: data.message,
        skills: isDeveloper ? data.skills || null : null,
        portfolio_url: isDeveloper && data.portfolio_url ? data.portfolio_url : null,
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll be in touch soon.",
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl" style={{ color: roleColor }}>
            Apply as {roleTitle}
          </DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you soon.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isDeveloper && (
              <>
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., React, Python, Swift" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="portfolio_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio / LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input 
                          type="url" 
                          placeholder="https://linkedin.com/in/yourprofile" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isDeveloper 
                      ? "Why do you want to contribute? *" 
                      : roleType === "Angel Investors"
                        ? "Tell us about your investment interest *"
                        : "How would you like to support NavEye? *"
                    }
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={
                        isDeveloper 
                          ? "Share your experience and what excites you about NavEye..."
                          : "Tell us more about yourself and why you're interested..."
                      }
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
              style={{ 
                backgroundColor: roleColor,
                color: "white",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
