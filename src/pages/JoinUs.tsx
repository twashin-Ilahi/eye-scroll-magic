import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Code, 
  Heart, 
  Rocket, 
  Smartphone, 
  Users, 
  Mail,
  Github,
  DollarSign
} from "lucide-react";

const roles = [
  {
    icon: Code,
    title: "App Maintainers",
    description: "Help us maintain and improve NavEye. We're looking for developers who are passionate about accessibility and open-source software.",
    skills: ["Python", "Computer Vision", "Desktop Development", "Eye Tracking"],
    color: "#4A90E2"
  },
  {
    icon: Smartphone,
    title: "Mobile Developers",
    description: "We're expanding to iOS and Android! Join us to bring eye-controlled scrolling to mobile devices worldwide.",
    skills: ["Swift/iOS", "Kotlin/Android", "React Native", "Capacitor"],
    color: "#9B59B6"
  },
  {
    icon: Rocket,
    title: "Angel Investors",
    description: "Believe in accessibility for all? Help us scale NavEye to reach millions of users who could benefit from hands-free navigation.",
    benefits: ["Equity opportunity", "Early access to features", "Advisory role"],
    color: "#E74C3C"
  },
  {
    icon: Heart,
    title: "Donors & Supporters",
    description: "Every contribution helps us keep NavEye free and accessible. Support our mission to make technology more inclusive.",
    benefits: ["Recognition on our site", "Exclusive updates", "Community access"],
    color: "#2ECC71"
  }
];

export default function JoinUs() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            background: "radial-gradient(ellipse at 50% 0%, rgba(74, 144, 226, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(155, 89, 182, 0.1) 0%, transparent 50%)"
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
          >
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Join Our Mission</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Help Us Make
            <br />
            <span className="gradient-text">Technology Accessible</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            NavEye is on a mission to make computing accessible to everyone. 
            We're looking for passionate individuals to join our journey.
          </motion.p>
        </div>
      </section>

      {/* Roles Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ 
                    background: `radial-gradient(circle at 50% 50%, ${role.color}15 0%, transparent 70%)`
                  }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${role.color}20` }}
                  >
                    <role.icon className="w-7 h-7" style={{ color: role.color }} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">{role.title}</h3>
                  <p className="text-muted-foreground mb-6">{role.description}</p>
                  
                  {role.skills && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {role.skills.map((skill) => (
                        <span 
                          key={skill}
                          className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {role.benefits && (
                    <ul className="space-y-2 mb-6">
                      {role.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: role.color }} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-lg font-medium transition-colors"
                    style={{ 
                      backgroundColor: `${role.color}20`,
                      color: role.color
                    }}
                  >
                    Get Involved
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-10 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Whether you're a developer, investor, or simply someone who believes in our mission, 
              we'd love to hear from you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="mailto:join@naveye.app"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center gap-2 min-w-[200px]"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </motion.a>
              
              <motion.a
                href="https://github.com/naveye"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary flex items-center gap-2 min-w-[200px]"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </motion.a>
            </div>
            
            {/* Donation CTA */}
            <div className="mt-10 pt-8 border-t border-primary/20">
              <p className="text-sm text-muted-foreground mb-4">Support our open-source mission</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent/20 text-accent font-medium"
              >
                <DollarSign className="w-5 h-5" />
                Donate to NavEye
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
