import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, Globe, Smartphone, Monitor, MapPin, Clock, 
  TrendingUp, Users, Eye, Search, Wifi, Signal 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

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
}

const COLORS = ['#FF6AA2', '#F97316', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

export const CommandStation = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    loadAnalytics();
    
    // Refresh every 30 seconds
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

      // Process analytics
      const uniqueUsers = new Set(activities.map(a => a.user_id)).size;
      const mobileActivities = activities.filter(a => {
        const data = a.activity_data as any;
        return data?.isMobile === true;
      });
      const desktopActivities = activities.filter(a => {
        const data = a.activity_data as any;
        return data?.isMobile === false;
      });

      // City stats
      const cityMap = new Map<string, number>();
      activities.forEach(a => {
        const data = a.activity_data as any;
        const city = data?.city;
        if (city) cityMap.set(city, (cityMap.get(city) || 0) + 1);
      });
      const topCities = Array.from(cityMap.entries())
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Country stats
      const countryMap = new Map<string, number>();
      activities.forEach(a => {
        const data = a.activity_data as any;
        const country = data?.country;
        if (country) countryMap.set(country, (countryMap.get(country) || 0) + 1);
      });
      const topCountries = Array.from(countryMap.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Device types
      const deviceTypes = [
        { name: 'Mobile', value: mobileActivities.length },
        { name: 'Desktop', value: desktopActivities.length },
      ];

      // Hourly activity (last 24 hours)
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recentActivities = activities.filter(a => 
        new Date(a.timestamp) > last24Hours
      );
      
      const hourlyMap = new Map<number, number>();
      for (let i = 0; i < 24; i++) {
        hourlyMap.set(i, 0);
      }
      recentActivities.forEach(a => {
        const hour = new Date(a.timestamp).getHours();
        hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
      });
      const hourlyActivity = Array.from(hourlyMap.entries())
        .map(([hour, visits]) => ({
          hour: `${hour}:00`,
          visits
        }));

      // Top pages
      const pageMap = new Map<string, number>();
      activities.forEach(a => {
        if (a.activity_type === 'page_visit') {
          const data = a.activity_data as any;
          const path = data?.path || '/';
          pageMap.set(path, (pageMap.get(path) || 0) + 1);
        }
      });
      const topPages = Array.from(pageMap.entries())
        .map(([path, visits]) => ({ path, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 5);

      // Connection types
      const connMap = new Map<string, number>();
      activities.forEach(a => {
        const data = a.activity_data as any;
        const type = data?.connection_type || 'unknown';
        connMap.set(type, (connMap.get(type) || 0) + 1);
      });
      const connectionTypes = Array.from(connMap.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      // Check live users (active in last 5 minutes)
      const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const liveUsers = new Set(
        activities
          .filter(a => new Date(a.timestamp) > fiveMinAgo)
          .map(a => a.user_id)
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
    <div className="space-y-4 sm:space-y-6">
      {/* Live Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Signal className="w-4 h-4 text-green-500 animate-pulse" />
              Live Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              {liveCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Unique Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{analytics.uniqueUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Total Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{analytics.totalVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Mobile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              {Math.round((analytics.mobileUsers / analytics.uniqueUsers) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="live">Live Feed</TabsTrigger>
        </TabsList>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">24-Hour Activity</CardTitle>
              <CardDescription>Visits by hour (last 24 hours)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.hourlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#FF6AA2" 
                    strokeWidth={2}
                    dot={{ fill: '#FF6AA2' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Pages</CardTitle>
              <CardDescription>Most visited pages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.topPages}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="path" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Top Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {analytics.topCountries.map((country, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{idx + 1}</Badge>
                          <span className="font-semibold">{country.country}</span>
                        </div>
                        <Badge>{country.count} visits</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Top Cities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {analytics.topCities.map((city, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{idx + 1}</Badge>
                          <span className="font-semibold">{city.city}</span>
                        </div>
                        <Badge>{city.count} visits</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.deviceTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.deviceTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  Connection Types
                </CardTitle>
                <CardDescription>Network speed distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {analytics.connectionTypes.map((conn, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Signal className={`w-4 h-4 ${
                            conn.type === '4g' ? 'text-green-500' :
                            conn.type === '3g' ? 'text-yellow-500' :
                            conn.type === 'slow-2g' ? 'text-red-500' :
                            'text-blue-500'
                          }`} />
                          <span className="font-semibold uppercase">{conn.type}</span>
                        </div>
                        <Badge>{conn.count}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Live Feed Tab */}
        <TabsContent value="live">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Real-time user interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {analytics.recentActivity.map((activity, idx) => {
                    const activityData = activity.activity_data as any;
                    return (
                    <div 
                      key={idx} 
                      className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/20"
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {activity.activity_type}
                            </Badge>
                            {activityData?.isMobile && (
                              <Smartphone className="w-3 h-3 text-muted-foreground" />
                            )}
                            {!activityData?.isMobile && (
                              <Monitor className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                          <div className="text-sm space-y-1">
                            {activityData?.city && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {activityData.city}, {activityData.region}
                              </div>
                            )}
                            {activityData?.ip && (
                              <div className="text-xs text-muted-foreground font-mono">
                                IP: {activityData.ip}
                              </div>
                            )}
                            {activityData?.path && (
                              <div className="text-xs font-medium">
                                Page: {activityData.path}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
