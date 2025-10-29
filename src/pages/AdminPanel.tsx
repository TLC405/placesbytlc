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
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
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
  Heart,
  Lock,
  LogIn
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
import { PromptLibrary } from "@/components/admin/PromptLibrary";
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
  const { user } = useAuth();
  const { hasRole, isLoading: roleLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  const isAdmin = hasRole('admin');

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

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success("Signed in successfully!");
      // Role check will happen automatically via useUserRole
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsSigningIn(false);
    }
  };

  // Setup realtime subscription for analytics
  useEffect(() => {
    if (!isAdmin || !user) return;

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
  }, [isAdmin, user]);

  // Fetch analytics when admin access is confirmed
  useEffect(() => {
    if (isAdmin && user && !roleLoading) {
      fetchUserAnalytics();
      setLoading(false);
    } else if (!roleLoading && !isAdmin && user) {
      setLoading(false);
    } else if (!roleLoading && !user) {
      setLoading(false);
    }
  }, [isAdmin, user, roleLoading]);

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

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show sign-in form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-primary/30 bg-black/50 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-pink-500 p-4 shadow-lg shadow-primary/50">
                <Shield className="w-full h-full text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-500 to-purple-500">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to access admin features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="bg-black/50 border-primary/30 text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-black/50 border-primary/30 text-white placeholder:text-gray-600"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSigningIn}
                className="w-full bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white font-bold py-6"
              >
                {isSigningIn ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Sign In to Admin Panel
                  </div>
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-gray-400 hover:text-white"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-red-500/30 bg-black/50 backdrop-blur-xl">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-red-500/20 p-4 border-2 border-red-500/50">
                <Lock className="w-full h-full text-red-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-red-500">
              Access Denied
            </CardTitle>
            <CardDescription className="text-gray-400">
              You don't have admin privileges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-300">
              This area is restricted to administrators only. Please contact support if you need access.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
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
                  ADMIN COMMAND CENTER V2
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

      {/* Main Content - Tabbed Interface */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <div className="border-b bg-card/30">
            <div className="max-w-7xl mx-auto px-6">
              <TabsList className="bg-transparent">
                <TabsTrigger value="overview">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="cupid">
                  <Heart className="w-4 h-4 mr-2" />
                  Cupid Settings
                </TabsTrigger>
                <TabsTrigger value="logs">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity Logs
                </TabsTrigger>
                <TabsTrigger value="tools">
                  <Code className="w-4 h-4 mr-2" />
                  Dev Tools
                </TabsTrigger>
                <TabsTrigger value="prompts">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Prompts
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

              {/* Prompts Tab */}
              <TabsContent value="prompts" className="mt-0">
                <PromptLibrary />
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
