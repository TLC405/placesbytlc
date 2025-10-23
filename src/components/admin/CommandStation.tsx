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

const COLORS = ['#FF6AA2', '#F97316', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

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
      const { data: activities } = await supabase
        .from('user_activity_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1000);

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
    <div className="space-y-6">
      {/* Live Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Signal className="w-4 h-4 text-green-500 animate-pulse" />
              Live Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{liveCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" />Unique Users</CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{analytics.uniqueUsers}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4" />Total Visits</CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{analytics.totalVisits}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><Smartphone className="w-4 h-4" />Mobile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round((analytics.mobileUsers / analytics.uniqueUsers) * 100)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
        </TabsList>

        
        <TabsContent value="activity" className="space-y-4">
          <Card><CardHeader><CardTitle>24-Hour Activity</CardTitle></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.hourlyActivity}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" /><YAxis /><Tooltip /><Line type="monotone" dataKey="visits" stroke="#FF6AA2" strokeWidth={2} /></LineChart>
          </ResponsiveContainer></CardContent></Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5" />Individual Users</h3>
            <ScrollArea className="h-[500px]"><div className="space-y-2">
              {analytics.allLogs && Array.from(new Set(analytics.allLogs.map(log => log.user_id || (log.activity_data as any)?.sessionId))).filter(Boolean).map((userId: any) => {
                const userLogs = analytics.allLogs!.filter(log => log.user_id === userId || (log.activity_data as any)?.sessionId === userId);
                const location = (userLogs[0]?.activity_data as any)?.location || {};
                return (
                  <div key={userId} className="p-4 border rounded-lg hover:bg-accent cursor-pointer" onClick={() => { setSelectedUserId(userId); setUserProfileOpen(true); }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="h-4 w-4" />
                        <div><div className="font-medium text-sm">{userId.slice(0, 8)}...</div>
                        <div className="text-xs text-muted-foreground">{location.city}, {location.region}</div></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{userLogs.length} visits</Badge>
                        {location.carrierName && <Badge variant="outline">{location.carrierName}</Badge>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div></ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-6"><div className="flex items-center gap-2 text-red-500 mb-2"><AlertTriangle className="h-5 w-5" /><h3 className="font-semibold">Rage Clicks</h3></div>
            <div className="text-3xl font-bold">{analytics.behaviorMetrics?.rageClicks || 0}</div></Card>
            <Card className="p-6"><div className="flex items-center gap-2 mb-2"><MousePointer className="h-5 w-5" /><h3 className="font-semibold">Dead Clicks</h3></div>
            <div className="text-3xl font-bold">{analytics.behaviorMetrics?.deadClicks || 0}</div></Card>
            <Card className="p-6"><div className="flex items-center gap-2 mb-2"><Copy className="h-5 w-5" /><h3 className="font-semibold">Copy Events</h3></div>
            <div className="text-3xl font-bold">{analytics.behaviorMetrics?.copyEvents || 0}</div></Card>
          </div>
        </TabsContent>

        
        <TabsContent value="geographic"><div className="grid lg:grid-cols-2 gap-4"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />Top Countries</CardTitle></CardHeader><CardContent><ScrollArea className="h-[300px]"><div className="space-y-3">{analytics.topCountries.map((c, i) => <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"><div className="flex items-center gap-3"><Badge variant="secondary">{i+1}</Badge><span className="font-semibold">{c.country}</span></div><Badge>{c.count} visits</Badge></div>)}</div></ScrollArea></CardContent></Card></div></TabsContent>
        <TabsContent value="devices"><Card><CardHeader><CardTitle>Device Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={analytics.deviceTypes} cx="50%" cy="50%" label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`} outerRadius={80} dataKey="value">{analytics.deviceTypes.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card></TabsContent>
        <TabsContent value="live"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" />Recent Activity</CardTitle></CardHeader><CardContent><ScrollArea className="h-[500px]"><div className="space-y-3">{analytics.recentActivity.map((a, i) => <div key={i} className="p-4 border rounded-lg"><Badge variant="secondary">{a.activity_type}</Badge></div>)}</div></ScrollArea></CardContent></Card></TabsContent>
      </Tabs>

      {selectedUserId && analytics?.allLogs && (
        <UserProfileViewer userId={selectedUserId} activities={analytics.allLogs} open={userProfileOpen} onOpenChange={setUserProfileOpen} />
      )}
    </div>
  );
};
