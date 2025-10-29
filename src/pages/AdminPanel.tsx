import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
    <div className="h-screen overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background flex flex-col">
      {/* Compact Header */}
      <div className="flex-shrink-0 border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 p-2">
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
                <h1 className="text-2xl font-black text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  ADMIN COMMAND CENTER
                </h1>
              </div>
            </div>
            <Badge variant="outline" className="bg-card border-primary/30">
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - No Scroll Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-3 gap-4 h-full">
            
            {/* Column 1: Analytics */}
            <Card className="bg-card border-2 overflow-hidden flex flex-col">
              <CardHeader className="bg-muted/50 border-b flex-shrink-0 py-3">
                <CardTitle className="flex items-center gap-2 text-primary text-lg">
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 overflow-auto flex-1">
                <UserAnalyticsDashboard />
              </CardContent>
            </Card>

            {/* Column 2: System & Network */}
            <div className="flex flex-col gap-4">
              <Card className="bg-card border-2 flex-1 overflow-hidden flex flex-col">
                <CardHeader className="bg-muted/50 border-b flex-shrink-0 py-3">
                  <CardTitle className="flex items-center gap-2 text-primary text-lg">
                    <Terminal className="w-4 h-4" />
                    Command Station
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 overflow-auto flex-1">
                  <CommandStation />
                </CardContent>
              </Card>

              <Card className="bg-card border-2 flex-1 overflow-hidden flex flex-col">
                <CardHeader className="bg-muted/50 border-b flex-shrink-0 py-3">
                  <CardTitle className="flex items-center gap-2 text-primary text-lg">
                    <Wifi className="w-4 h-4" />
                    Network
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 overflow-auto flex-1">
                  <WiFiAnalyzer />
                </CardContent>
              </Card>
            </div>

            {/* Column 3: Developer Tools */}
            <Card className="bg-card border-2 overflow-hidden flex flex-col">
              <CardHeader className="bg-muted/50 border-b flex-shrink-0 py-3">
                <CardTitle className="flex items-center gap-2 text-primary text-lg">
                  <Code className="w-5 h-5" />
                  Developer Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 overflow-auto flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleDownloadSource}
                    className="h-16 flex flex-col items-center justify-center gap-1 text-xs"
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Button>
                  
                  <Button 
                    onClick={() => trackAdminAction('view_code_export', 'developer')}
                    className="h-16 flex flex-col items-center justify-center gap-1 text-xs"
                    variant="outline"
                  >
                    <FileCode className="w-4 h-4" />
                    <span>Export</span>
                  </Button>
                  
                  <Button 
                    onClick={() => trackAdminAction('view_ai_tools', 'developer')}
                    className="h-16 flex flex-col items-center justify-center gap-1 text-xs"
                    variant="outline"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Tools</span>
                  </Button>
                  
                  <Button 
                    onClick={() => trackAdminAction('view_updates', 'developer')}
                    className="h-16 flex flex-col items-center justify-center gap-1 text-xs"
                    variant="outline"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Updates</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 font-semibold text-sm w-full hover:text-primary">
                      <MessageSquare className="w-4 h-4" />
                      SMS Notifications
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <SMSNotificationPanel />
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 font-semibold text-sm w-full hover:text-primary">
                      <Rocket className="w-4 h-4" />
                      App Readiness
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <AppReadinessChecklist />
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible defaultOpen>
                    <CollapsibleTrigger className="flex items-center gap-2 font-semibold text-sm w-full hover:text-primary">
                      <Activity className="w-4 h-4" />
                      Recent Updates
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <RecentUpdates />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
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
