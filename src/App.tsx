import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Download from "./pages/Download";
import Instructions from "./pages/Instructions";
import JoinUs from "./pages/JoinUs";
import ReportBug from "./pages/ReportBug";
import AdminLogin from "./pages/AdminLogin";
import AdminBugReports from "./pages/AdminBugReports";
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
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/report-bug" element={<ReportBug />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/bug-reports" element={<AdminBugReports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
