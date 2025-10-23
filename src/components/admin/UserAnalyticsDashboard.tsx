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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.reduce((sum, user) => sum + (user.total_sessions || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTimeSpent(
                analytics.reduce((sum, user) => sum + (user.average_session_duration || 0), 0) / 
                (analytics.length || 1)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
            <Globe className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.reduce((sum, user) => sum + (user.unique_ips_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Overview</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="ips">IP History</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>Detailed user engagement metrics and behavior patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {analytics.map((user) => (
                    <Card
                      key={user.user_id}
                      className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.01]"
                      onClick={() => {
                        setSelectedUser(user.user_id);
                        loadUserDetails(user.user_id);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{user.display_name}</p>
                              <Badge className={getSegmentColor(user.user_segment)}>
                                {user.user_segment}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                {user.total_sessions} sessions
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeSpent(user.total_time_spent)}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {user.engagement_score.toFixed(1)} score
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                              <Globe className="w-3 h-3 mr-1" />
                              {user.unique_ips_count} IPs
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-2">
                              Last: {new Date(user.last_seen).toLocaleDateString()}
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

        <TabsContent value="sessions" className="space-y-4">
          {selectedUser ? (
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>Recent user sessions and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <Card key={session.id} className="bg-card/50">
                        <CardContent className="p-4">
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
            <Card>
              <CardContent className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                Select a user to view their session history
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ips" className="space-y-4">
          {selectedUser ? (
            <Card>
              <CardHeader>
                <CardTitle>IP Address History</CardTitle>
                <CardDescription>Tracked IP addresses for this user</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {ipHistory.map((ip, index) => (
                      <Card key={index} className="bg-card/50">
                        <CardContent className="p-4">
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
            <Card>
              <CardContent className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                Select a user to view their IP history
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};