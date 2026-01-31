import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/home/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Bug, Shield, Trash2, Eye, RefreshCw, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/integrations/firebase/client";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, orderBy, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import type { BugReport as BugReportType } from "@/integrations/firebase/types";

type BugReport = BugReportType & { id: string };

const AdminBugReports = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<BugReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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

      // Fetch bug reports
      const reportsRef = collection(db, "bugReports");
      const reportsQuery = query(reportsRef, orderBy("created_at", "desc"));
      const snapshot = await getDocs(reportsQuery);
      
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BugReport[];
      
      setBugReports(reportsData);
    } catch (error) {
      console.error("Error:", error);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const reportRef = doc(db, "bugReports", reportId);
      await updateDoc(reportRef, { status: newStatus });

      setBugReports(prev => 
        prev.map(r => r.id === reportId ? { ...r, status: newStatus as BugReport['status'] } : r)
      );

      toast({
        title: "Status Updated",
        description: `Bug report status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this bug report?")) return;

    try {
      const reportRef = doc(db, "bugReports", reportId);
      await deleteDoc(reportRef);

      setBugReports(prev => prev.filter(r => r.id !== reportId));
      setSelectedReport(null);

      toast({
        title: "Report Deleted",
        description: "The bug report has been removed.",
      });
    } catch (error) {
      console.error("Error deleting:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the report.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const refreshReports = () => {
    if (currentUserId) {
      setIsLoading(true);
      checkAdminAndFetch(currentUserId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "in_progress": return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "resolved": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "closed": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const filteredReports = filterStatus === "all" 
    ? bugReports 
    : bugReports.filter(r => r.status === filterStatus);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

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
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage bug reports</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => navigate("/admin/blog")} variant="outline">
                Blog Posts
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
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: "Total", count: bugReports.length, color: "text-foreground" },
              { label: "Open", count: bugReports.filter(r => r.status === "open").length, color: "text-yellow-500" },
              { label: "In Progress", count: bugReports.filter(r => r.status === "in_progress").length, color: "text-blue-500" },
              { label: "Resolved", count: bugReports.filter(r => r.status === "resolved").length, color: "text-green-500" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-center">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.count}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center gap-4 mb-6"
          >
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-background/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={refreshReports}>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title / Note</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <Bug className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No bug reports found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(report.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.report_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {report.report_type === "quick" 
                          ? report.quick_note 
                          : report.title}
                      </TableCell>
                      <TableCell>{report.platform || "-"}</TableCell>
                      <TableCell>
                        <Select 
                          value={report.status} 
                          onValueChange={(v) => handleStatusChange(report.id, v)}
                        >
                          <SelectTrigger className={`w-32 h-8 text-xs border ${getStatusColor(report.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setSelectedReport(report)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(report.id)}
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              {selectedReport?.report_type === "quick" ? "Quick Bug Report" : selectedReport?.title}
            </DialogTitle>
            <DialogDescription>
              Submitted on {selectedReport && new Date(selectedReport.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4 mt-4">
              {selectedReport.report_type === "quick" ? (
                <div>
                  <h4 className="font-medium mb-2">Note</h4>
                  <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                    {selectedReport.quick_note}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Category</h4>
                      <p className="text-muted-foreground capitalize">{selectedReport.category || "-"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Platform</h4>
                      <p className="text-muted-foreground capitalize">{selectedReport.platform || "-"}</p>
                    </div>
                  </div>
                  
                  {selectedReport.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                        {selectedReport.description}
                      </p>
                    </div>
                  )}
                  
                  {selectedReport.steps_to_reproduce && (
                    <div>
                      <h4 className="font-medium mb-2">Steps to Reproduce</h4>
                      <p className="text-muted-foreground bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">
                        {selectedReport.steps_to_reproduce}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    {selectedReport.expected_behavior && (
                      <div>
                        <h4 className="font-medium mb-2">Expected Behavior</h4>
                        <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                          {selectedReport.expected_behavior}
                        </p>
                      </div>
                    )}
                    {selectedReport.actual_behavior && (
                      <div>
                        <h4 className="font-medium mb-2">Actual Behavior</h4>
                        <p className="text-muted-foreground bg-muted/50 rounded-lg p-4">
                          {selectedReport.actual_behavior}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {selectedReport.email && (
                    <div>
                      <h4 className="font-medium mb-1">Contact Email</h4>
                      <a href={`mailto:${selectedReport.email}`} className="text-primary hover:underline">
                        {selectedReport.email}
                      </a>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <Badge className={getStatusColor(selectedReport.status)}>
                  {selectedReport.status.replace("_", " ")}
                </Badge>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(selectedReport.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBugReports;
