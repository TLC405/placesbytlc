import { lazy, Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Lock, Users, Activity, MapPin, Calendar, Eye, TrendingUp, Download, Code2, Sparkles, Heart, Crown, Zap, BarChart3, Search, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CommandStation } from "@/components/admin/CommandStation";
import { UserAnalyticsDashboard } from "@/components/admin/UserAnalyticsDashboard";

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

export default function AdminPanel() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showPinDialog, setShowPinDialog] = useState(true);
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAnalytics | null>(null);
  const [downloadingSource, setDownloadingSource] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const handlePinSubmit = () => {
    if (pinInput === "1309") {
      setIsUnlocked(true);
      setShowPinDialog(false);
      fetchUserAnalytics();
      toast.success("Welcome to Admin Portal!");
    } else {
      toast.error("Invalid PIN");
      setPinInput("");
    }
  };

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
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: activities, error: activitiesError } = await supabase
        .from("user_activity_log")
        .select("*")
        .order("timestamp", { ascending: false });

      if (activitiesError) throw activitiesError;

      const userMap = new Map<string, UserAnalytics>();

      profiles?.forEach((profile) => {
        const userActivities = activities?.filter((a) => a.user_id === profile.id) || [];
        
        const pageVisits = userActivities.filter((a) => a.activity_type === "page_visit");
        const placeViews = userActivities.filter((a) => a.activity_type === "place_view");
        const searches = userActivities.filter((a) => a.activity_type === "search");
        
        const locations = new Set<string>();
        userActivities.forEach((activity) => {
          const data = activity.activity_data as any;
          if (data?.location) locations.add(data.location);
          if (data?.country) locations.add(data.country);
          if (data?.city) locations.add(`${data.city}, ${data.country || ""}`);
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

  if (!isUnlocked) {
    return (
      <Dialog open={showPinDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Administrative Access
            </DialogTitle>
            <DialogDescription className="text-center">
              Enter PIN to access the admin panel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              className="text-center text-2xl tracking-widest"
              maxLength={4}
            />
            <Button onClick={handlePinSubmit} className="w-full" size="lg">
              <Lock className="w-4 h-4 mr-2" />
              Unlock Admin Panel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, color: "from-pink-500 to-rose-500" },
    { id: "command", label: "Command Station", icon: Activity, color: "from-blue-500 to-purple-500" },
    { id: "users", label: "Users", icon: Users, color: "from-purple-500 to-pink-500" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, color: "from-orange-500 to-amber-500" },
    { id: "tools", label: "Dev Tools", icon: Code2, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-gradient-to-br from-rose-50/50 via-purple-50/30 to-pink-50/50 dark:from-background dark:via-background dark:to-background">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-br from-white/80 to-pink-50/80 dark:from-card dark:to-card backdrop-blur-xl border-r border-border/50 shadow-2xl overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-8">
            {/* Header */}
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
                    {isActive && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
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

      {/* Main Content */}
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
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Command Station Section */}
          {activeSection === "command" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Command Station
                  </h1>
                  <p className="text-sm text-muted-foreground">Real-time analytics and monitoring</p>
                </div>
              </div>
              <CommandStation />
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
                    User Analytics
                  </h1>
                  <p className="text-sm text-muted-foreground">Detailed user insights and activity tracking</p>
                </div>
              </div>

              <Card className="shadow-2xl border-2 border-purple-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    All Users
                  </CardTitle>
                  <CardDescription className="text-slate-400">Click on a user to view detailed analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-3">
                      {users.map((user) => (
                        <Card
                          key={user.user_id}
                          className="p-3 sm:p-4 hover:shadow-xl transition-all hover:scale-[1.01] bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur border-purple-500/20 hover:border-purple-500/40 cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-purple-100">{user.display_name || "Anonymous"}</p>
                                <Badge className="bg-purple-500 text-white">{user.total_visits} visits</Badge>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-400 truncate">{user.email}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <span>Last: {new Date(user.last_visit).toLocaleDateString()}</span>
                                <span>{user.locations?.length || 0} locations</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 w-full sm:w-auto"
                            >
                              View Details
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Section */}
          {activeSection === "analytics" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    User Analytics
                  </h1>
                  <p className="text-sm text-muted-foreground">Deep insights into user behavior and sessions</p>
                </div>
              </div>
              <UserAnalyticsDashboard />
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
                <Card className="shadow-xl border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-emerald-500" />
                      Source Code
                    </CardTitle>
                    <CardDescription>Download the complete source code as a ZIP file</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleDownloadSource}
                      disabled={downloadingSource}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
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

                <Card className="shadow-xl border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-blue-500" />
                      Code Browser
                    </CardTitle>
                    <CardDescription>Browse and explore the project's codebase online</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => window.open('/code', '_blank')}
                      variant="outline"
                      size="lg"
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
