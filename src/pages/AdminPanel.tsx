import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  BarChart3, 
  Terminal, 
  Download,
  Code,
  Activity,
  Sparkles,
  MessageSquare,
  Wifi,
  FileCode,
  Rocket,
  Shield,
  Zap
} from "lucide-react";
import { CommandStation } from "@/components/admin/CommandStation";
import { UserAnalyticsDashboard } from "@/components/admin/UserAnalyticsDashboard";
import { UserProfileViewer } from "@/components/admin/UserProfileViewer";
import { CodeExportSystem } from "@/components/admin/CodeExportSystem";
import { SMSNotificationPanel } from "@/components/admin/SMSNotificationPanel";
import { AIPromptInterface } from "@/components/admin/AIPromptInterface";
import { WiFiAnalyzer } from "@/components/admin/WiFiAnalyzer";
import { AppReadinessChecklist } from "@/components/admin/AppReadinessChecklist";
import { RecentUpdates } from "@/components/RecentUpdates";

interface UserAnalytics {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  visit_count?: number;
  last_visit?: string;
  locations_visited?: string[];
  pages_visited?: string[];
  places_viewed?: string[];
  searches_made?: string[];
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [codeUnlocked, setCodeUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [showCodeDialog, setShowCodeDialog] = useState(true);

  // Track admin actions
  const trackAdminAction = useCallback(async (action: string, section: string, details?: any) => {
    try {
      await supabase.functions.invoke('track-admin-activity', {
        body: { action, section, details }
      });
    } catch (error) {
      console.error('Failed to track admin action:', error);
    }
  }, []);

  // Setup realtime subscription for analytics
  useEffect(() => {
    if (!codeUnlocked) return;

    const channel = supabase
      .channel('admin-analytics-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchUserAnalytics()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_activity_log' },
        () => fetchUserAnalytics()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_analytics' },
        () => fetchUserAnalytics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [codeUnlocked]);

  // Check admin access on mount
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          toast.error("Please log in to access admin panel");
          navigate('/');
          return;
        }

        setUser(currentUser);

        // Check if user has admin role
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', currentUser.id);
        
        const hasAdminRole = roles?.some(r => r.role === 'admin');
        
        if (!hasAdminRole) {
          toast.error("Admin access required");
          navigate('/');
          return;
        }

        setIsAdmin(true);
        
        // Check if code was already entered in this session
        const sessionCode = sessionStorage.getItem('admin_code_unlocked');
        if (sessionCode === 'true') {
          setCodeUnlocked(true);
          setShowCodeDialog(false);
          fetchUserAnalytics();
        }
      } catch (error) {
        console.error("Admin access check failed:", error);
        toast.error("Failed to verify admin access");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  const handleCodeSubmit = () => {
    if (codeInput === "1309") {
      setCodeUnlocked(true);
      setShowCodeDialog(false);
      sessionStorage.setItem('admin_code_unlocked', 'true');
      fetchUserAnalytics();
      toast.success("Access granted");
    } else {
      toast.error("Incorrect code");
      setCodeInput("");
    }
  };

  const fetchUserAnalytics = async () => {
    try {
      console.log('Fetching admin portal data...');
      const { data, error } = await supabase.functions.invoke('admin-portal-data', {
        body: {}
      });
      
      if (error) {
        console.error('Edge function error:', error);
        toast.error('Failed to load analytics data');
        return;
      }

      if (!data) {
        console.warn('No data returned from edge function');
        setUsers([]);
        return;
      }

      console.log('Admin portal data received:', data);

      const profiles = data?.profiles || [];
      const activities = data?.activities || [];
      const analytics = data?.analytics || [];
      
      // Store all activities for UserProfileViewer
      setAllActivities(activities);

      console.log(`Loaded ${profiles.length} profiles, ${activities.length} activities, ${analytics.length} analytics`);

      const userMap = new Map<string, UserAnalytics>();

      profiles.forEach((profile: any) => {
        const userActivities = activities.filter((a: any) => a.user_id === profile.id);
        const userAnalytics = analytics.find((a: any) => a.user_id === profile.id);

        const pageVisits = userActivities.filter((a: any) => a.activity_type === 'page_visit');
        const placeViews = userActivities.filter((a: any) => a.activity_type === 'place_view');
        const searches = userActivities.filter((a: any) => a.activity_type === 'search');

        const locations = new Set<string>();
        userActivities.forEach((activity: any) => {
          const d = activity.activity_data as any;
          if (d?.location?.city && d?.location?.country_name) {
            locations.add(`${d.location.city}, ${d.location.country_name}`);
          } else if (d?.location?.country_name) {
            locations.add(d.location.country_name);
          }
        });

        userMap.set(profile.id, {
          id: profile.id,
          email: profile.email || 'Unknown',
          display_name: profile.display_name || 'Anonymous',
          created_at: profile.created_at,
          visit_count: userAnalytics?.total_sessions || pageVisits.length,
          last_visit: userActivities[0]?.timestamp || profile.created_at,
          locations_visited: Array.from(locations),
          pages_visited: pageVisits.map((a: any) => a.activity_data),
          places_viewed: placeViews.map((a: any) => a.activity_data),
          searches_made: searches.map((a: any) => a.activity_data),
        });
      });

      const userList = Array.from(userMap.values());
      console.log('Processed user list:', userList.length, 'users');
      setUsers(userList);
      
      if (userList.length === 0) {
        toast.info('No user data found yet. Users will appear as they use the app.');
      } else {
        toast.success(`Loaded ${userList.length} users`);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics: ' + (error as Error).message);
    }
  };

  const handleDownloadSource = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('download-source');
      
      if (error) throw error;
      
      // Create README file
      const readme = data?.readme || 'INPERSON.TLC Source Code';
      const readmeBlob = new Blob([readme], { type: 'text/markdown' });
      const readmeUrl = URL.createObjectURL(readmeBlob);
      
      // Download README
      const readmeLink = document.createElement('a');
      readmeLink.href = readmeUrl;
      readmeLink.download = 'INPERSON-TLC-README.md';
      document.body.appendChild(readmeLink);
      readmeLink.click();
      document.body.removeChild(readmeLink);
      URL.revokeObjectURL(readmeUrl);
      
      // Open GitHub download in new tab
      if (data?.download_url) {
        window.open(data.download_url, '_blank');
      }
      
      toast.success("📦 Source code package downloaded!");
      trackAdminAction('download_source', 'developer');
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download source");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Code unlock dialog
  if (!codeUnlocked) {
    return (
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="bg-white border-2 border-primary">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
              <Shield className="w-6 h-6" />
              Admin Security Check
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Enter admin code to unlock full access</p>
            <Input
              type="password"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
              placeholder="Enter code..."
              className="text-center text-xl tracking-widest"
            />
            <Button onClick={handleCodeSubmit} className="w-full">
              Unlock Admin Panel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header with Cupid */}
      <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-b-4 border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Cupid Icon */}
              <div className="w-20 h-20 rounded-full bg-white shadow-lg p-2 border-4 border-primary/30">
                <img 
                  src="/src/assets/cupid-tlc-transparent.png" 
                  alt="TLC Cupid" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/src/assets/cupid-icon-original.png";
                  }}
                />
              </div>
              <div>
                <h1 className="text-4xl font-black text-primary flex items-center gap-2">
                  <Sparkles className="w-8 h-8" />
                  ADMIN COMMAND CENTER
                </h1>
                <p className="text-muted-foreground mt-1">Full system access granted</p>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-white border-primary/30">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Single Page Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Section 1: Analytics & Monitoring */}
        <Card className="bg-white border-2 border-rose-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b-2 border-rose-200">
            <CardTitle className="flex items-center gap-2 text-primary">
              <BarChart3 className="w-6 h-6" />
              Analytics & User Monitoring
            </CardTitle>
            <CardDescription>Real-time user analytics, sessions, and behavior tracking</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <UserAnalyticsDashboard />
          </CardContent>
        </Card>

        {/* Section 2: System Management */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white border-2 border-purple-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Terminal className="w-5 h-5" />
                Command Station
              </CardTitle>
              <CardDescription>Feature management & app settings</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <CommandStation />
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-blue-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Wifi className="w-5 h-5" />
                Network & IP Analyzer
              </CardTitle>
              <CardDescription>Real-time network monitoring</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <WiFiAnalyzer />
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Developer Tools */}
        <Card className="bg-white border-2 border-emerald-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-200">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Code className="w-6 h-6" />
              Developer Tools
            </CardTitle>
            <CardDescription>Source code export, AI tools, and system utilities</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                onClick={handleDownloadSource}
                className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Download className="w-6 h-6" />
                <span>Download Source</span>
              </Button>
              
              <Button 
                onClick={() => trackAdminAction('view_code_export', 'developer')}
                className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <FileCode className="w-6 h-6" />
                <span>Code Export</span>
              </Button>
              
              <Button 
                onClick={() => trackAdminAction('view_ai_tools', 'developer')}
                className="h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                <Sparkles className="w-6 h-6" />
                <span>AI Tools</span>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  SMS Notifications
                </h3>
                <SMSNotificationPanel />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  App Readiness
                </h3>
                <AppReadinessChecklist />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Recent Updates
              </h3>
              <RecentUpdates />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* User Profile Modal */}
      {selectedUserId && (
        <UserProfileViewer
          userId={selectedUserId}
          activities={allActivities}
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
        />
      )}
    </div>
  );
};

export default AdminPanel;
