import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Users, 
  BarChart3, 
  Terminal, 
  Settings, 
  Download,
  Code,
  ChevronLeft,
  Activity,
  Eye,
  Sparkles
} from "lucide-react";
import { CommandStation } from "@/components/admin/CommandStation";
import { UserAnalyticsDashboard } from "@/components/admin/UserAnalyticsDashboard";
import { UserProfileViewer } from "@/components/admin/UserProfileViewer";
import { FileUploadManager } from "@/components/FileUploadManager";
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

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
        fetchUserAnalytics();
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

  const fetchUserAnalytics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-portal-data');
      
      if (error) throw error;

      const profiles = data?.profiles || [];
      const activities = data?.activities || [];
      
      // Store all activities for UserProfileViewer
      setAllActivities(activities);

      const userMap = new Map<string, UserAnalytics>();

      profiles.forEach((profile: any) => {
        const userActivities = activities.filter((a: any) => a.user_id === profile.id);

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
          display_name: profile.display_name,
          created_at: profile.created_at,
          visit_count: pageVisits.length,
          last_visit: userActivities[0]?.timestamp || profile.created_at,
          locations_visited: Array.from(locations),
          pages_visited: pageVisits.map((a: any) => a.activity_data),
          places_viewed: placeViews.map((a: any) => a.activity_data),
          searches_made: searches.map((a: any) => a.activity_data),
        });
      });

      setUsers(Array.from(userMap.values()));
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    }
  };

  const handleDownloadSource = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('download-source');
      
      if (error) throw error;
      
      toast.success("Source code download initiated");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download source");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const tabItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'command', label: 'Command Station', icon: Terminal },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'updates', label: 'Updates', icon: Sparkles },
    { id: 'tools', label: 'Dev Tools', icon: Settings },
  ];

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.last_visit).length;
  const totalSessions = users.reduce((sum, u) => sum + (u.visit_count || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-sm text-muted-foreground">
                  Logged in as {user?.email}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <Users className="h-3 w-3" />
              {totalUsers} Users
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            {tabItems.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Users</span>
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-3xl font-bold">{totalUsers}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <Users className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-3xl font-bold">{activeUsers}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Total Sessions</span>
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-3xl font-bold">{totalSessions}</div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Avg. Session</span>
                  <BarChart3 className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-3xl font-bold">
                  {totalUsers > 0 ? Math.round(totalSessions / totalUsers) : 0}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-2">
                {users.slice(0, 10).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{user.display_name || user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.last_visit
                          ? `Last active: ${new Date(user.last_visit).toLocaleDateString()}`
                          : 'Never visited'}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {user.visit_count || 0} visits
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="command">
            <CommandStation />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">User List</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{user.display_name || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.visit_count || 0} visits</p>
                        <p className="text-xs text-muted-foreground">
                          {user.last_visit
                            ? `Last: ${new Date(user.last_visit).toLocaleDateString()}`
                            : 'Never visited'}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setProfileDialogOpen(true);
                        }}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <UserAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="updates">
            <RecentUpdates />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Developer Tools</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">Download Source Code</p>
                    <p className="text-sm text-muted-foreground">
                      Export the entire codebase as a ZIP file
                    </p>
                  </div>
                  <Button onClick={handleDownloadSource} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium">Code Browser</p>
                    <p className="text-sm text-muted-foreground">
                      View and browse the codebase
                    </p>
                  </div>
                  <Button onClick={() => navigate('/code')} variant="outline" className="gap-2">
                    <Code className="h-4 w-4" />
                    Open Browser
                  </Button>
                </div>

                <div className="p-4 rounded-lg border border-border">
                  <h4 className="font-medium mb-4">File Upload Manager</h4>
                  <FileUploadManager />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Profile Viewer Dialog */}
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
