import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Download from "./pages/Download";
import DownloadMac from "./pages/DownloadMac";
import DownloadWindows from "./pages/DownloadWindows";
import Instructions from "./pages/Instructions";
import JoinUs from "./pages/JoinUs";
import ReportBug from "./pages/ReportBug";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLogin from "./pages/AdminLogin";
import AdminBugReports from "./pages/AdminBugReports";
import AdminBlog from "./pages/AdminBlog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/download" element={<Download />} />
          <Route path="/download/mac" element={<DownloadMac />} />
          <Route path="/download/windows" element={<DownloadWindows />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/report-bug" element={<ReportBug />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/bug-reports" element={<AdminBugReports />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
