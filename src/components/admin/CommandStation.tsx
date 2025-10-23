import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, Globe, Smartphone, Monitor, MapPin, Clock, 
  TrendingUp, Users, Eye, Zap, Shield, AlertTriangle, Copy, MousePointer, Wifi, Signal 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { UserProfileViewer } from "./UserProfileViewer";

interface Analytics {
  totalVisits: number;
  uniqueUsers: number;
  mobileUsers: number;
  desktopUsers: number;
  topCities: { city: string; count: number }[];
  topCountries: { country: string; count: number }[];
  deviceTypes: { name: string; value: number }[];
  hourlyActivity: { hour: string; visits: number }[];
  recentActivity: any[];
  topPages: { path: string; visits: number }[];
  connectionTypes: { type: string; count: number }[];
  topCarriers?: { carrier: string; count: number }[];
  networkSpeeds?: Record<string, number>;
  behaviorMetrics?: { rageClicks: number; deadClicks: number; copyEvents: number };
  allLogs?: any[];
}

// Professional color palette with majestic tones
const COLORS = ['#C084FC', '#A78BFA', '#818CF8', '#60A5FA', '#34D399', '#FBBF24', '#F472B6', '#FB7185'];

export const CommandStation = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userProfileOpen, setUserProfileOpen] = useState(false);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-portal-data', { body: { pin: '666' } });
      if (error) throw error;
      const activities = (data?.activities || []) as any[];

      if (!activities || activities.length === 0) {
        setLoading(false);
        return;
      }

      const uniqueUsers = new Set(activities.map(a => a.user_id)).size;
      const mobileActivities = activities.filter(a => (a.activity_data as any)?.device?.touchPoints > 0);
      const desktopActivities = activities.filter(a => (a.activity_data as any)?.device?.touchPoints === 0);

      const cityMap = new Map<string, number>();
      activities.forEach(a => {
        const city = (a.activity_data as any)?.location?.city;
        if (city) cityMap.set(city, (cityMap.get(city) || 0) + 1);
      });
      const topCities = Array.from(cityMap.entries())
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const countryMap = new Map<string, number>();
      activities.forEach(a => {
        const country = (a.activity_data as any)?.location?.country_name;
        if (country) countryMap.set(country, (countryMap.get(country) || 0) + 1);
      });
      const topCountries = Array.from(countryMap.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const deviceTypes = [
        { name: 'Mobile', value: mobileActivities.length },
        { name: 'Desktop', value: desktopActivities.length },
      ];

      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recentActivities = activities.filter(a => new Date(a.timestamp) > last24Hours);
      
      const hourlyMap = new Map<number, number>();
      for (let i = 0; i < 24; i++) hourlyMap.set(i, 0);
      recentActivities.forEach(a => {
        const hour = new Date(a.timestamp).getHours();
        hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
      });
      const hourlyActivity = Array.from(hourlyMap.entries())
        .map(([hour, visits]) => ({ hour: `${hour}:00`, visits }));

      const pageMap = new Map<string, number>();
      activities.forEach(a => {
        if (a.activity_type === 'page_visit') {
          const path = (a.activity_data as any)?.path || '/';
          pageMap.set(path, (pageMap.get(path) || 0) + 1);
        }
      });
      const topPages = Array.from(pageMap.entries())
        .map(([path, visits]) => ({ path, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 5);

      const connMap = new Map<string, number>();
      activities.forEach(a => {
        const type = (a.activity_data as any)?.network?.speed || 'unknown';
        connMap.set(type, (connMap.get(type) || 0) + 1);
      });
      const connectionTypes = Array.from(connMap.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      const carrierMap = new Map<string, number>();
      activities.forEach(a => {
        const carrier = (a.activity_data as any)?.location?.carrierName;
        if (carrier && carrier !== 'Unknown') carrierMap.set(carrier, (carrierMap.get(carrier) || 0) + 1);
      });
      const topCarriers = Array.from(carrierMap.entries())
        .map(([carrier, count]) => ({ carrier, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const networkSpeeds = activities
        .filter(a => (a.activity_data as any)?.network?.speed)
        .reduce((acc: Record<string, number>, a) => {
          const speed = (a.activity_data as any).network.speed;
          acc[speed] = (acc[speed] || 0) + 1;
          return acc;
        }, {});

      const rageClicks = activities.filter(a => a.activity_type === 'rage_click').length;
      const deadClicks = activities.filter(a => a.activity_type === 'dead_click').length;
      const copyEvents = activities.filter(a => a.activity_type === 'copy').length;

      const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const liveUsers = new Set(
        activities.filter(a => new Date(a.timestamp) > fiveMinAgo).map(a => a.user_id)
      ).size;
      setLiveCount(liveUsers);

      setAnalytics({
        totalVisits: activities.length,
        uniqueUsers,
        mobileUsers: new Set(mobileActivities.map(a => a.user_id)).size,
        desktopUsers: new Set(desktopActivities.map(a => a.user_id)).size,
        topCities,
        topCountries,
        deviceTypes,
        hourlyActivity,
        recentActivity: activities.slice(0, 20),
        topPages,
        connectionTypes,
        topCarriers,
        networkSpeeds,
        behaviorMetrics: { rageClicks, deadClicks, copyEvents },
        allLogs: activities,
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-12">
        <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
        <p className="text-muted-foreground">Activity data will appear here as users interact with the app.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-0">
      {/* Live Stats - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="relative overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
          <CardHeader className="pb-2 sm:pb-3 relative">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 text-emerald-100">
              <Signal className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Live Now</span>
              <span className="sm:hidden">Live</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">{liveCount}</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-purple-900/20 backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
          <CardHeader className="pb-2 sm:pb-3 relative">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 text-purple-100">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="hidden sm:inline">Unique Users</span>
              <span className="sm:hidden">Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">{analytics.uniqueUsers}</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-blue-900/20 backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
          <CardHeader className="pb-2 sm:pb-3 relative">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 text-blue-100">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="hidden sm:inline">Total Visits</span>
              <span className="sm:hidden">Visits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">{analytics.totalVisits}</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden border-pink-500/30 bg-gradient-to-br from-pink-950/40 to-pink-900/20 backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent" />
          <CardHeader className="pb-2 sm:pb-3 relative">
            <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 text-pink-100">
              <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
              Mobile
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">{Math.round((analytics.mobileUsers / analytics.uniqueUsers) * 100)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1 bg-gradient-to-r from-slate-900/80 to-slate-800/80 p-1 backdrop-blur-xl border border-slate-700/50">
          <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white text-xs sm:text-sm">Activity</TabsTrigger>
          <TabsTrigger value="geographic" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white text-xs sm:text-sm">Location</TabsTrigger>
          <TabsTrigger value="devices" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-500 data-[state=active]:text-white text-xs sm:text-sm">Devices</TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-xs sm:text-sm">Profiles</TabsTrigger>
          <TabsTrigger value="behavior" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-500 data-[state=active]:text-white text-xs sm:text-sm">Behavior</TabsTrigger>
          <TabsTrigger value="live" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-600 data-[state=active]:to-rose-500 data-[state=active]:text-white text-xs sm:text-sm">Live</TabsTrigger>
        </TabsList>

        
        <TabsContent value="activity" className="space-y-4 mt-4">
          <Card className="border-purple-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-purple-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                24-Hour Activity Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.hourlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="hour" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="visits" stroke="#A78BFA" strokeWidth={3} dot={{ fill: '#C084FC', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-4">
          <Card className="border-emerald-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-emerald-100">
              <Users className="h-5 w-5 text-emerald-400" />
              User Profiles & Intelligence
            </h3>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {analytics.allLogs && Array.from(new Set(analytics.allLogs.map(log => log.user_id || (log.activity_data as any)?.sessionId))).filter(Boolean).map((userId: any) => {
                  const userLogs = analytics.allLogs!.filter(log => log.user_id === userId || (log.activity_data as any)?.sessionId === userId);
                  const location = (userLogs[0]?.activity_data as any)?.location || {};
                  const device = (userLogs[0]?.activity_data as any)?.device || {};
                  const visitor = (userLogs[0]?.activity_data as any)?.visitor || {};
                  
                  // Calculate user segment
                  const isNew = !visitor.isReturning;
                  const visitCount = userLogs.length;
                  let segment = { label: 'Regular', color: 'bg-slate-500' };
                  if (isNew && visitCount <= 2) segment = { label: 'New', color: 'bg-blue-500' };
                  else if (visitCount > 20) segment = { label: 'Power User', color: 'bg-purple-500' };
                  else if (visitCount > 5) segment = { label: 'Active', color: 'bg-emerald-500' };
                  
                  return (
                    <div 
                      key={userId} 
                      className="p-4 border border-emerald-500/20 rounded-xl hover:bg-emerald-950/30 cursor-pointer transition-all hover:border-emerald-500/40 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur group"
                      onClick={() => { setSelectedUserId(userId); setUserProfileOpen(true); }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30">
                            <Users className="h-4 w-4 text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <div className="font-mono text-sm font-medium text-emerald-100 truncate">{userId.slice(0, 12)}...</div>
                              <Badge className={`${segment.color} text-white text-xs`}>{segment.label}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{location.city || 'Unknown'}, {location.region || location.country_name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                              <span>IP: {location.ip || 'N/A'}</span>
                              {device.touchPoints > 0 ? '📱' : '💻'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="bg-purple-950/50 text-purple-300 border-purple-500/30">
                            {userLogs.length} visits
                          </Badge>
                          {location.carrierName && (
                            <Badge variant="outline" className="bg-blue-950/50 text-blue-300 border-blue-500/30 hidden sm:inline-flex">
                              {location.carrierName}
                            </Badge>
                          )}
                          {location.org && (
                            <Badge variant="outline" className="bg-slate-950/50 text-slate-300 border-slate-500/30 text-xs hidden lg:inline-flex">
                              {location.org.slice(0, 20)}...
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 sm:p-6 border-red-500/30 bg-gradient-to-br from-red-950/40 to-red-900/20 backdrop-blur">
              <div className="flex items-center gap-2 text-red-400 mb-3">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-semibold text-red-100">Rage Clicks</h3>
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-300 to-red-500 bg-clip-text text-transparent">
                {analytics.behaviorMetrics?.rageClicks || 0}
              </div>
            </Card>
            <Card className="p-4 sm:p-6 border-orange-500/30 bg-gradient-to-br from-orange-950/40 to-orange-900/20 backdrop-blur">
              <div className="flex items-center gap-2 text-orange-400 mb-3">
                <MousePointer className="h-5 w-5" />
                <h3 className="font-semibold text-orange-100">Dead Clicks</h3>
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
                {analytics.behaviorMetrics?.deadClicks || 0}
              </div>
            </Card>
            <Card className="p-4 sm:p-6 border-blue-500/30 bg-gradient-to-br from-blue-950/40 to-blue-900/20 backdrop-blur">
              <div className="flex items-center gap-2 text-blue-400 mb-3">
                <Copy className="h-5 w-5" />
                <h3 className="font-semibold text-blue-100">Copy Events</h3>
              </div>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                {analytics.behaviorMetrics?.copyEvents || 0}
              </div>
            </Card>
          </div>
        </TabsContent>

        
        <TabsContent value="geographic" className="mt-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="border-blue-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-100">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Top Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {analytics.topCountries.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-blue-950/30 rounded-lg border border-blue-500/20 hover:bg-blue-950/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">{i+1}</Badge>
                          <span className="font-semibold text-blue-100">{c.country}</span>
                        </div>
                        <Badge variant="outline" className="bg-blue-950/50 text-blue-300 border-blue-500/30">{c.count} visits</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card className="border-purple-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-100">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  Top Cities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {analytics.topCities.slice(0, 10).map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-purple-950/30 rounded-lg border border-purple-500/20 hover:bg-purple-950/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">{i+1}</Badge>
                          <span className="font-semibold text-purple-100">{c.city}</span>
                        </div>
                        <Badge variant="outline" className="bg-purple-950/50 text-purple-300 border-purple-500/30">{c.count} visits</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="mt-4">
          <Card className="border-pink-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-pink-100 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-pink-400" />
                Device Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={analytics.deviceTypes} 
                    cx="50%" 
                    cy="50%" 
                    label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`} 
                    outerRadius={80} 
                    dataKey="value"
                    labelLine={{ stroke: '#64748b' }}
                  >
                    {analytics.deviceTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="live" className="mt-4">
          <Card className="border-rose-500/30 bg-gradient-to-br from-slate-950/90 to-slate-900/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-rose-100">
                <Clock className="w-5 h-5 text-rose-400" />
                Recent Activity Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {analytics.recentActivity.map((a, i) => (
                    <div key={i} className="p-4 border border-rose-500/20 rounded-lg bg-rose-950/20 hover:bg-rose-950/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-gradient-to-r from-rose-600 to-rose-500 text-white mt-1">{a.activity_type}</Badge>
                        <div className="flex-1 text-xs text-slate-400 space-y-1">
                          <div>{new Date(a.timestamp).toLocaleString()}</div>
                          {(a.activity_data as any)?.path && <div className="text-rose-300">Path: {(a.activity_data as any).path}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedUserId && analytics?.allLogs && (
        <UserProfileViewer userId={selectedUserId} activities={analytics.allLogs} open={userProfileOpen} onOpenChange={setUserProfileOpen} />
      )}
    </div>
  );
};
