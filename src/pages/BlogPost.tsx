import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/home/ParticleBackground";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, MapPin, User, ArrowLeft } from "lucide-react";
import { db } from "@/integrations/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import type { BlogPost as BlogPostType } from "@/integrations/firebase/types";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<(BlogPostType & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const postRef = doc(db, "blogPosts", id!);
      const snapshot = await getDoc(postRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as BlogPostType;
        // Only show if published
        if (data.published) {
          setPost({ id: snapshot.id, ...data });
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
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
        
        <main className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Link to="/blog">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Button>
              </Link>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !post ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-xl text-muted-foreground">Post not found</p>
                <Link to="/blog">
                  <Button className="mt-4">Go to Blog</Button>
                </Link>
              </motion.div>
            ) : (
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-6">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/50">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.created_at).date} at {formatDate(post.created_at).time}
                  </span>
                  {post.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {post.location}
                    </span>
                  )}
                </div>
                
                <div className="prose prose-invert prose-lg max-w-none">
                  {post.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="text-foreground/90 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.article>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default BlogPost;
