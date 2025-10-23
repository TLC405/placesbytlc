import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Lock, Users, Activity, MapPin, Calendar, Eye, TrendingUp, Download, Code2, Sparkles, Heart, Crown, Zap, BarChart3, Search, FileText } from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const FeliciaModPanel = lazy(() => import("@/components/FeliciaModPanel"));

interface UserAnalytics {
  user_id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  total_visits: number;
  last_visit: string;
  locations: string[];
  pages_visited: any[];
  places_viewed: any[];
  searches: any[];
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAnalytics | null>(null);
  const [downloadingSource, setDownloadingSource] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check admin status - restricted to inspirelawton@gmail.com with code 1309
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      // Verify both role and specific email
      const { data } = await supabase.rpc('has_role', { 
        _user_id: user.id, 
        _role: 'admin' 
      });
      
      // Admin access restricted to inspirelawton@gmail.com only (code: 1309)
      const isAuthorizedAdmin = !!data && user.email === 'inspirelawton@gmail.com';
      setIsAdmin(isAuthorizedAdmin);
      
      if (isAuthorizedAdmin) {
        fetchUserAnalytics();
      }
    };
    
    checkAdmin();
  }, [user]);

  const handleDownloadSource = async () => {
    setDownloadingSource(true);
    try {
      const { data, error } = await supabase.functions.invoke('download-source', {
        body: {}
      });

      if (error) throw error;

      if (data?.download_url) {
        window.open(data.download_url, '_blank');
        toast.success("Source code download started!");
      } else {
        toast.error("Failed to generate download link");
      }
    } catch (error) {
      console.error('Error downloading source:', error);
      toast.error("Failed to download source code");
    } finally {
      setDownloadingSource(false);
    }
  };

  const fetchUserAnalytics = async () => {
    try {
      // Fetch all profiles with their activity logs
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch activity logs for all users
      const { data: activities, error: activitiesError } = await supabase
        .from("user_activity_log")
        .select("*")
        .order("timestamp", { ascending: false });

      if (activitiesError) throw activitiesError;

      // Aggregate data by user
      const userMap = new Map<string, UserAnalytics>();

      profiles?.forEach((profile) => {
        const userActivities = activities?.filter((a) => a.user_id === profile.id) || [];
        
        const pageVisits = userActivities.filter((a) => a.activity_type === "page_visit");
        const placeViews = userActivities.filter((a) => a.activity_type === "place_view");
        const searches = userActivities.filter((a) => a.activity_type === "search");
        
        // Extract unique locations from activity data
        const locations = new Set<string>();
        userActivities.forEach((activity) => {
          const data = activity.activity_data as any;
          if (data?.location) {
            locations.add(data.location);
          }
          if (data?.country) {
            locations.add(data.country);
          }
          if (data?.city) {
            locations.add(`${data.city}, ${data.country || ""}`);
          }
        });

        userMap.set(profile.id, {
          user_id: profile.id,
          email: profile.email || "No email",
          display_name: profile.display_name,
          created_at: profile.created_at,
          total_visits: pageVisits.length,
          last_visit: userActivities[0]?.timestamp || profile.created_at,
          locations: Array.from(locations),
          pages_visited: pageVisits.map((a) => a.activity_data),
          places_viewed: placeViews.map((a) => a.activity_data),
          searches: searches.map((a) => a.activity_data),
        });
      });

      setUsers(Array.from(userMap.values()));
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Admin full screen layout
  if (isAdmin) {
    const sidebarItems = [
      { id: "dashboard", label: "Dashboard", icon: BarChart3, color: "from-pink-500 to-rose-500" },
      { id: "users", label: "Users", icon: Users, color: "from-purple-500 to-pink-500" },
      { id: "activity", label: "Activity", icon: Activity, color: "from-blue-500 to-purple-500" },
      { id: "tools", label: "Dev Tools", icon: Code2, color: "from-emerald-500 to-teal-500" },
    ];

    return (
      <div className="fixed inset-0 flex overflow-hidden bg-gradient-to-br from-rose-50/50 via-purple-50/30 to-pink-50/50 dark:from-background dark:via-background dark:to-background">
        {/* Fixed Sidebar */}
        <aside className="w-72 bg-gradient-to-br from-white/80 to-pink-50/80 dark:from-card dark:to-card backdrop-blur-xl border-r border-border/50 shadow-2xl overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-8">
              {/* Header with Crown */}
              <div className="text-center space-y-3 pb-4 border-b border-border/50">
                <div className="relative inline-block">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-400 animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                    Admin Portal
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    Code: 1309
                    <Zap className="w-3 h-3 text-yellow-500" />
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full group relative overflow-hidden rounded-xl p-4 transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-r " + item.color + " text-white shadow-lg scale-105"
                          : "bg-gradient-to-r from-white/50 to-pink-50/50 dark:from-muted/30 dark:to-muted/10 hover:shadow-md hover:scale-102"
                      )}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      )}
                      <div className="relative flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          isActive ? "bg-white/20" : "bg-gradient-to-br " + item.color
                        )}>
                          <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-white")} />
                        </div>
                        <span className={cn(
                          "font-semibold transition-colors",
                          isActive ? "text-white" : "text-foreground/80"
                        )}>
                          {item.label}
                        </span>
                        {isActive && <Heart className="ml-auto w-4 h-4 text-white animate-pulse" fill="currentColor" />}
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="space-y-3 pt-4 border-t border-border/50">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Stats</p>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-950/30 dark:to-rose-950/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Users</span>
                      <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
                        {users.length}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Visits</span>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                        {users.reduce((sum, u) => sum + u.total_visits, 0)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {/* Dashboard Section */}
            {activeSection === "dashboard" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      Dashboard Overview
                    </h1>
                    <p className="text-sm text-muted-foreground">Your empire at a glance</p>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/5 group-hover:from-pink-500/20 group-hover:to-rose-500/10 transition-all" />
                    <CardHeader className="pb-3 relative">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Users className="w-5 h-5 text-pink-500" />
                          Total Users
                        </CardTitle>
                        <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-4xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                        {users.length}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Amazing humans</p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5 group-hover:from-purple-500/20 group-hover:to-pink-500/10 transition-all" />
                    <CardHeader className="pb-3 relative">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Activity className="w-5 h-5 text-purple-500" />
                          Total Visits
                        </CardTitle>
                        <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {users.reduce((sum, u) => sum + u.total_visits, 0)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Magical moments</p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 group-hover:from-blue-500/20 group-hover:to-purple-500/10 transition-all" />
                    <CardHeader className="pb-3 relative">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Eye className="w-5 h-5 text-blue-500" />
                          Places Viewed
                        </CardTitle>
                        <Heart className="w-4 h-4 text-rose-400 animate-pulse" fill="currentColor" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {users.reduce((sum, u) => sum + u.places_viewed.length, 0)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Dream destinations</p>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 group-hover:from-emerald-500/20 group-hover:to-teal-500/10 transition-all" />
                    <CardHeader className="pb-3 relative">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                          <Search className="w-5 h-5 text-emerald-500" />
                          Searches
                        </CardTitle>
                        <TrendingUp className="w-4 h-4 text-emerald-400 animate-pulse" />
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {users.reduce((sum, u) => sum + u.searches.length, 0)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Love queries</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Users Section */}
            {activeSection === "users" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      User Management
                    </h1>
                    <p className="text-sm text-muted-foreground">Browse and analyze user activity</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 shadow-xl border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        User Activity
                      </CardTitle>
                      <CardDescription>Click a user to view detailed analytics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[600px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>User</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Visits</TableHead>
                              <TableHead>Last Active</TableHead>
                              <TableHead>Locations</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {users.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                  No users found
                                </TableCell>
                              </TableRow>
                            ) : (
                              users.map((user) => (
                                <TableRow
                                  key={user.user_id}
                                  className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 dark:hover:from-purple-950/20 dark:hover:to-pink-950/20 transition-all"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <TableCell className="font-medium">
                                    {user.display_name || "Anonymous"}
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {user.email}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                                      {user.total_visits}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    {new Date(user.last_visit).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                      {user.locations.slice(0, 2).map((loc, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          <MapPin className="w-3 h-3 mr-1" />
                                          {loc}
                                        </Badge>
                                      ))}
                                      {user.locations.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{user.locations.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* User Details Panel */}
                  <Card className="lg:col-span-1 shadow-xl border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-pink-500" />
                        User Details
                      </CardTitle>
                      <CardDescription>
                        {selectedUser ? "Detailed activity breakdown" : "Select a user to view details"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedUser ? (
                        <ScrollArea className="h-[600px]">
                          <div className="space-y-6">
                            {/* User Info */}
                            <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                              <h3 className="font-bold text-lg">
                                {selectedUser.display_name || "Anonymous User"}
                              </h3>
                              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-purple-500" />
                                <span>Joined {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <Tabs defaultValue="visits" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="visits">Visits</TabsTrigger>
                                <TabsTrigger value="places">Places</TabsTrigger>
                                <TabsTrigger value="searches">Searches</TabsTrigger>
                              </TabsList>

                              <TabsContent value="visits" className="space-y-3">
                                <div className="text-sm font-medium">
                                  Total: {selectedUser.total_visits} visits
                                </div>
                                {selectedUser.pages_visited.map((page, i) => (
                                  <Card key={i} className="p-3 border-l-4 border-purple-500">
                                    <div className="text-sm font-medium">{page.path || "/"}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(page.timestamp).toLocaleString()}
                                    </div>
                                  </Card>
                                ))}
                              </TabsContent>

                              <TabsContent value="places" className="space-y-3">
                                <div className="text-sm font-medium">
                                  Total: {selectedUser.places_viewed.length} places viewed
                                </div>
                                {selectedUser.places_viewed.map((place, i) => (
                                  <Card key={i} className="p-3 border-l-4 border-pink-500">
                                    <div className="text-sm font-medium">{place.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {place.types?.join(", ")}
                                    </div>
                                    {place.price_level && (
                                      <Badge variant="outline" className="mt-1">
                                        {"$".repeat(place.price_level)}
                                      </Badge>
                                    )}
                                  </Card>
                                ))}
                              </TabsContent>

                              <TabsContent value="searches" className="space-y-3">
                                <div className="text-sm font-medium">
                                  Total: {selectedUser.searches.length} searches
                                </div>
                                {selectedUser.searches.map((search, i) => (
                                  <Card key={i} className="p-3 border-l-4 border-blue-500">
                                    <div className="text-sm font-medium">"{search.query}"</div>
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(search.timestamp).toLocaleString()}
                                    </div>
                                    {search.filters && (
                                      <div className="mt-1 text-xs">
                                        Radius: {search.filters.radius}mi
                                      </div>
                                    )}
                                  </Card>
                                ))}
                              </TabsContent>
                            </Tabs>

                            {/* Locations */}
                            {selectedUser.locations.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-rose-500" />
                                  Locations
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedUser.locations.map((loc, i) => (
                                    <Badge key={i} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">
                                      {loc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="h-[600px] flex flex-col items-center justify-center text-muted-foreground">
                          <Users className="w-16 h-16 mb-4 text-muted-foreground/30" />
                          <p>Select a user from the table</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Activity Section */}
            {activeSection === "activity" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Activity Monitor
                    </h1>
                    <p className="text-sm text-muted-foreground">Real-time user activity tracking</p>
                  </div>
                </div>

                <Card className="shadow-xl border-2">
                  <CardHeader>
                    <CardTitle>Coming Soon!</CardTitle>
                    <CardDescription>Advanced activity monitoring and real-time analytics</CardDescription>
                  </CardHeader>
                  <CardContent className="h-96 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                        <Activity className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-muted-foreground">This section is under construction</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Dev Tools Section */}
            {activeSection === "tools" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Developer Tools
                    </h1>
                    <p className="text-sm text-muted-foreground">Powerful utilities for developers</p>
                  </div>
                </div>

                <div className="grid gap-6">
                  <Card className="shadow-xl border-2 overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-emerald-500" />
                        Source Code
                      </CardTitle>
                      <CardDescription>Download the complete source code as a ZIP file</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <Button 
                        onClick={handleDownloadSource}
                        disabled={downloadingSource}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg"
                        size="lg"
                      >
                        {downloadingSource ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Preparing Download...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download Source Code
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-2 overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all" />
                    <CardHeader className="relative">
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-blue-500" />
                        Code Browser
                      </CardTitle>
                      <CardDescription>Browse and explore the project's codebase online</CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <Button 
                        onClick={() => window.open('/code', '_blank')}
                        variant="outline"
                        size="lg"
                        className="border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20"
                      >
                        <Code2 className="w-4 h-4 mr-2" />
                        Open Code Browser
                      </Button>
                    </CardContent>
                  </Card>

                  <Suspense fallback={<Skeleton className="h-48 w-full" />}>
                    <FeliciaModPanel />
                  </Suspense>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 sm:space-y-8 pb-12 px-2 sm:px-4 animate-in fade-in duration-700">
      {/* Hero Section - Full Width */}
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-glow border-2 border-primary/40 overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift">
          <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_100%]" />
          <CardHeader className="pb-4 px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-4xl md:text-6xl font-black gradient-text text-center tracking-tight">
              Welcome to FELICIA.TLC
            </CardTitle>
            <CardDescription className="text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-2xl mx-auto pt-2">
              Your AI-powered love companion for discovering perfect date spots, romance insights, and relationship tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 md:px-12 pb-6 sm:pb-8">
            <Link to="/explore">
              <Button size="lg" className="w-full gap-2 sm:gap-3 h-14 sm:h-16 md:h-20 text-base sm:text-lg md:text-xl font-bold shadow-glow hover:shadow-romantic transition-all hover:scale-105 group">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
                Start Your Love Journey
              </Button>
            </Link>
            <div className="text-center text-sm sm:text-base text-muted-foreground font-medium">
              ✨ AI-Powered • 🗺️ Smart Discovery • 💝 Made with Love
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Explore Card */}
        <Link to="/explore">
          <Card className="hover-lift shadow-soft border-primary/20 h-full cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                🗺️ Explore
              </CardTitle>
              <CardDescription className="text-base leading-relaxed pt-2">
                Discover romantic restaurants, fun activities, and perfect date spots nearby.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Period Tracker Card */}
        <Link to="/period-tracker">
          <Card className="hover-lift shadow-soft border-primary/20 h-full cursor-pointer group bg-gradient-to-br from-rose-50 to-purple-50 dark:from-rose-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                📅 Peripod Tracker
              </CardTitle>
              <CardDescription className="text-base leading-relaxed pt-2">
                Send him hilarious survival reminders. Because he WILL forget. (BETA)
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Quizzes Card */}
        <Link to="/quizzes">
          <Card className="hover-lift shadow-soft border-primary/20 h-full cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                🎯 Quizzes
              </CardTitle>
              <CardDescription className="text-base leading-relaxed pt-2">
                Discover your love language, personality type, and compatibility insights.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Auth Panel - Full Width if Not Logged In */}
      {!user && (
        <div className="max-w-2xl mx-auto">
          <AuthPanel />
        </div>
      )}
    </div>
  );
}
