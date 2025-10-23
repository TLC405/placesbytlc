import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Activity, Globe, Clock, TrendingUp, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserAnalytics {
  user_id: string;
  email: string;
  display_name: string;
  total_sessions: number;
  total_time_spent: number;
  average_session_duration: number;
  total_page_views: number;
  unique_ips_count: number;
  last_ip_address: string;
  last_seen: string;
  account_created: string;
  user_segment: string;
  engagement_score: number;
}

interface SessionData {
  id: string;
  ip_address: string;
  user_agent: string;
  device_info: any;
  location_info: any;
  session_start: string;
  session_end: string | null;
  total_duration: number | null;
  pages_visited: number;
  is_active: boolean;
}

interface IPHistory {
  ip_address: string;
  first_seen: string;
  last_seen: string;
  visit_count: number;
  location_data: any;
}

export const UserAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [ipHistory, setIpHistory] = useState<IPHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Load user analytics with profile data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('user_analytics')
        .select(`
          *,
          profiles:user_id (
            email,
            display_name
          )
        `)
        .order('engagement_score', { ascending: false });

      if (analyticsError) throw analyticsError;

      const formattedData = analyticsData?.map((item: any) => ({
        ...item,
        email: item.profiles?.email || 'Unknown',
        display_name: item.profiles?.display_name || 'Anonymous User'
      })) || [];

      setAnalytics(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  };

  const loadUserDetails = async (userId: string) => {
    try {
      // Load sessions
      const { data: sessionsData } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_start', { ascending: false })
        .limit(20);

      setSessions(sessionsData || []);

      // Load IP history
      const { data: ipData } = await supabase
        .from('ip_history')
        .select('*')
        .eq('user_id', userId)
        .order('last_seen', { ascending: false });

      setIpHistory(ipData || []);
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'power': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'active': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'casual': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'new': return 'bg-gradient-to-r from-orange-500 to-amber-500';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-0">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-purple-900/20 backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-100">Total Users</CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">{analytics.length}</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-blue-900/20 backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-100">Total Sessions</CardTitle>
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              {analytics.reduce((sum, user) => sum + (user.total_sessions || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-xs sm:text-sm font-medium text-emerald-100">Avg Time</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              {formatTimeSpent(
                analytics.reduce((sum, user) => sum + (user.average_session_duration || 0), 0) / 
                (analytics.length || 1)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-amber-900/20 backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-xs sm:text-sm font-medium text-amber-100">Unique IPs</CardTitle>
            <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {analytics.reduce((sum, user) => sum + (user.unique_ips_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50">
          <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs sm:text-sm">User Overview</TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white text-xs sm:text-sm">Sessions</TabsTrigger>
          <TabsTrigger value="ips" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-xs sm:text-sm">IP History</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-4">
          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-purple-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                User Analytics
              </CardTitle>
              <CardDescription className="text-slate-400">Detailed user engagement metrics and behavior patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {analytics.map((user) => (
                    <Card
                      key={user.user_id}
                      className="cursor-pointer hover:shadow-xl transition-all hover:scale-[1.01] bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur border-purple-500/20 hover:border-purple-500/40"
                      onClick={() => {
                        setSelectedUser(user.user_id);
                        loadUserDetails(user.user_id);
                      }}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-purple-100 truncate">{user.display_name}</p>
                              <Badge className={getSegmentColor(user.user_segment) + " text-white"}>
                                {user.user_segment}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-400 truncate">{user.email}</p>
                            <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3 text-blue-400" />
                                {user.total_sessions}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-emerald-400" />
                                {formatTimeSpent(user.total_time_spent)}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-purple-400" />
                                {user.engagement_score.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs bg-amber-950/50 text-amber-300 border-amber-500/30">
                              <Globe className="w-3 h-3 mr-1" />
                              {user.unique_ips_count} IPs
                            </Badge>
                            <p className="text-xs text-slate-500 hidden sm:block">
                              {new Date(user.last_seen).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4 mt-4">
          {selectedUser ? (
            <Card className="border-blue-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-blue-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Session History
                </CardTitle>
                <CardDescription className="text-slate-400">Recent user sessions and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <Card key={session.id} className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur border-blue-500/20">
                        <CardContent className="p-3 sm:p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant={session.is_active ? "default" : "secondary"}>
                                {session.is_active ? "Active" : "Ended"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDuration(session.total_duration)}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">IP Address</p>
                                <p className="font-mono">{session.ip_address}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Pages Visited</p>
                                <p>{session.pages_visited}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground text-xs">Location</p>
                                <p className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {session.location_info?.city || 'Unknown'}, {session.location_info?.region || 'Unknown'}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground text-xs">Started</p>
                                <p>{new Date(session.session_start).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-700/50 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
              <CardContent className="flex items-center justify-center min-h-[400px] text-slate-400">
                Select a user from the User Overview tab to view their session history
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ips" className="space-y-4 mt-4">
          {selectedUser ? (
            <Card className="border-emerald-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-emerald-100 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  IP Address History
                </CardTitle>
                <CardDescription className="text-slate-400">Tracked IP addresses for this user</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {ipHistory.map((ip, index) => (
                      <Card key={index} className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur border-emerald-500/20">
                        <CardContent className="p-3 sm:p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="font-mono font-semibold">{ip.ip_address}</p>
                              <Badge variant="outline">{ip.visit_count} visits</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">Location</p>
                                <p className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {ip.location_data?.city || 'Unknown'}, {ip.location_data?.country_name || 'Unknown'}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">ISP</p>
                                <p>{ip.location_data?.org || 'Unknown'}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">First Seen</p>
                                <p>{new Date(ip.first_seen).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Last Seen</p>
                                <p>{new Date(ip.last_seen).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-700/50 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
              <CardContent className="flex items-center justify-center min-h-[400px] text-slate-400">
                Select a user from the User Overview tab to view their IP history
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};