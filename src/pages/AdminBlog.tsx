import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/home/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { BookOpen, Shield, Plus, Edit, Trash2, Eye, RefreshCw, LogOut, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/integrations/firebase/client";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import type { BlogPost as BlogPostType } from "@/integrations/firebase/types";

type BlogPost = BlogPostType & { id: string };

const AdminBlog = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    location: "",
    published: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        checkAdminAndFetch(user.uid);
      } else {
        navigate("/admin/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const checkAdminAndFetch = async (userId: string) => {
    try {
      // Check admin role
      const rolesRef = collection(db, "userRoles");
      const roleQuery = query(rolesRef, where("user_id", "==", userId), where("role", "==", "admin"));
      const roleSnapshot = await getDocs(roleQuery);

      if (roleSnapshot.empty) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      
      // Fetch posts
      const postsRef = collection(db, "blogPosts");
      const postsQuery = query(postsRef, orderBy("created_at", "desc"));
      const snapshot = await getDocs(postsQuery);
      
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      
      setPosts(postsData);
    } catch (error) {
      console.error("Error:", error);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const openNewPost = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      content: "",
      author: "",
      location: "",
      published: false,
    });
    setIsEditing(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      location: post.location || "",
      published: post.published,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in title, content, and author.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const now = new Date().toISOString();
      
      if (editingPost) {
        // Update existing post
        const postRef = doc(db, "blogPosts", editingPost.id);
        await updateDoc(postRef, {
          title: formData.title.trim(),
          content: formData.content.trim(),
          author: formData.author.trim(),
          location: formData.location.trim() || null,
          published: formData.published,
          updated_at: now,
        });

        setPosts(prev => prev.map(p => 
          p.id === editingPost.id 
            ? { ...p, ...formData, location: formData.location || null, updated_at: now }
            : p
        ));

        toast({
          title: "Post Updated",
          description: "Your blog post has been updated.",
        });
      } else {
        // Create new post
        const postsRef = collection(db, "blogPosts");
        const newPost = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          author: formData.author.trim(),
          location: formData.location.trim() || null,
          published: formData.published,
          author_id: currentUserId,
          created_at: now,
          updated_at: now,
        };
        
        const docRef = await addDoc(postsRef, newPost);

        setPosts(prev => [{ id: docRef.id, ...newPost } as BlogPost, ...prev]);

        toast({
          title: "Post Created",
          description: formData.published ? "Your blog post is now live!" : "Your draft has been saved.",
        });
      }

      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast({
        title: "Save Failed",
        description: error.message || "Could not save the post.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const postRef = doc(db, "blogPosts", postId);
      await deleteDoc(postRef);

      setPosts(prev => prev.filter(p => p.id !== postId));

      toast({
        title: "Post Deleted",
        description: "The blog post has been removed.",
      });
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the post.",
        variant: "destructive",
      });
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const postRef = doc(db, "blogPosts", post.id);
      await updateDoc(postRef, { published: !post.published });

      setPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, published: !p.published } : p
      ));

      toast({
        title: post.published ? "Post Unpublished" : "Post Published",
        description: post.published ? "The post is now a draft." : "The post is now live!",
      });
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const refreshPosts = () => {
    if (currentUserId) {
      setIsLoading(true);
      checkAdminAndFetch(currentUserId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

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
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Blog Management</h1>
                <p className="text-muted-foreground">Create and manage blog posts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate("/admin/bug-reports")} variant="outline">
                Bug Reports
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{posts.length}</p>
              <p className="text-sm text-muted-foreground">Total Posts</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-500">{posts.filter(p => p.published).length}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-yellow-500">{posts.filter(p => !p.published).length}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center gap-4 mb-6"
          >
            <Button onClick={openNewPost}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
            <Button variant="outline" onClick={refreshPosts}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No blog posts yet</p>
                      <Button className="mt-4" onClick={openNewPost}>Create Your First Post</Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {post.title}
                      </TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={post.published 
                            ? "bg-green-500/20 text-green-500 border-green-500/30" 
                            : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                          }
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => togglePublished(post)}
                            title={post.published ? "Unpublish" : "Publish"}
                          >
                            <Eye className={`w-4 h-4 ${post.published ? "text-green-500" : ""}`} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditPost(post)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(post.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </motion.div>
        </main>
        
        <Footer />
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {editingPost ? "Edit Post" : "Create New Post"}
            </DialogTitle>
            <DialogDescription>
              {editingPost ? "Update your blog post details below." : "Fill in the details for your new blog post."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Write your blog post content here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="bg-background/50"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  {formData.published ? "Published (visible to public)" : "Draft (hidden from public)"}
                </Label>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Post"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
