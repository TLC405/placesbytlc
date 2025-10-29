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
  Zap,
  Heart
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
import CupidSettingsPanel from "@/components/admin/CupidSettingsPanel";
import ActivityLogViewer from "@/components/admin/ActivityLogViewer";
import ComprehensiveExportSystem from "@/components/admin/ComprehensiveExportSystem";
import { UpdateLogger } from "@/components/admin/UpdateLogger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("Please sign in");
        navigate("/");
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      const isUserAdmin = roles?.some(r => r.role === 'admin');
      if (!isUserAdmin) {
        toast.error("Admin access required");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      setUser(session.user);
      setLoading(false);
    };

    checkAdmin();
  }, [navigate]);

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
    if (!isAdmin) return;

    fetchUserAnalytics();

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
  }, [isAdmin]);

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

  return (
    <div className="h-screen overflow-hidden bg-black flex flex-col">
      <style>{`
        @keyframes matrix-rain {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .matrix-bg {
          background: linear-gradient(180deg, #000000 0%, #001a00 100%);
          position: relative;
          overflow: hidden;
        }
        .matrix-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(0, 255, 0, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 255, 0, 0.03) 0%, transparent 50%);
          pointer-events: none;
        }
      `}</style>
      {/* Hacker Terminal Header */}
      <div className="flex-shrink-0 border-b-2 border-green-500/30 bg-black/95 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-green-500 animate-pulse" />
              <div>
                <h1 className="text-2xl font-black text-green-500 font-mono tracking-wider">
                  [✓] ACCESS GRANTED :: ADMIN_TERMINAL
                </h1>
                <p className="text-xs text-green-400/70 font-mono">
                  {user?.email} // CLEARANCE_LEVEL: OMEGA
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/teefeeme')}
                className="border-green-500/50 text-green-500 hover:bg-green-500/10 hover:border-green-500 font-mono"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                TEEFEE_LAB
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="border-green-500/50 text-green-500 hover:bg-green-500/10 hover:border-green-500 font-mono"
              >
                <Terminal className="w-4 h-4 mr-2" />
                EXIT_TERMINAL
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Tabbed Interface */}
      <div className="flex-1 overflow-hidden matrix-bg">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <div className="border-b border-green-500/30 bg-black/50 backdrop-blur">
            <div className="max-w-7xl mx-auto px-6">
              <TabsList className="bg-transparent border-none">
                <TabsTrigger value="overview" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500 text-green-400/70 font-mono border-none">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  OVERVIEW
                </TabsTrigger>
                <TabsTrigger value="cupid" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500 text-green-400/70 font-mono border-none">
                  <Heart className="w-4 h-4 mr-2" />
                  CUPID_SYS
                </TabsTrigger>
                <TabsTrigger value="logs" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500 text-green-400/70 font-mono border-none">
                  <Activity className="w-4 h-4 mr-2" />
                  ACTIVITY_LOG
                </TabsTrigger>
                <TabsTrigger value="tools" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500 text-green-400/70 font-mono border-none">
                  <Code className="w-4 h-4 mr-2" />
                  DEV_TOOLS
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-6 py-4">
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Analytics */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        User Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <UserAnalyticsDashboard />
                    </CardContent>
                  </Card>

                  {/* Network */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wifi className="w-5 h-5" />
                        Network Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WiFiAnalyzer />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Command Station */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Terminal className="w-5 h-5" />
                        Command Station
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CommandStation />
                    </CardContent>
                  </Card>

                  {/* Recent Updates */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Recent Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RecentUpdates />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Cupid Settings Tab */}
              <TabsContent value="cupid" className="mt-0">
                <CupidSettingsPanel />
              </TabsContent>

              {/* Activity Logs Tab */}
              <TabsContent value="logs" className="mt-0">
                <ActivityLogViewer />
              </TabsContent>

              {/* Dev Tools Tab */}
              <TabsContent value="tools" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>📋 Update Changelog Manager</CardTitle>
                    <CardDescription>Log new updates for the changelog</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UpdateLogger />
                  </CardContent>
                </Card>
                <ComprehensiveExportSystem />
                <AIPromptInterface />
                <SMSNotificationPanel />
                <AppReadinessChecklist />
              </TabsContent>

            </div>
          </div>
        </Tabs>
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
