import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Image, 
  Sparkles,
  Clock,
  Shield,
  Download,
  MapPin,
  Monitor
} from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsStats {
  totalSessions: number;
  activeTesters: number;
  totalUploads: number;
  totalGenerations: number;
  avgTimeInApp: number;
  topTabs: Array<{ name: string; count: number }>;
  geoData: Array<{ location: string; count: number }>;
  deviceMix: Array<{ device: string; count: number }>;
  blockedAdminAttempts: number;
}

const DashCard = ({ title, value, icon, trend }: any) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">{icon}</div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      {trend && (
        <p className="text-xs text-muted-foreground mt-1">{trend}</p>
      )}
    </CardContent>
  </Card>
);

export const EpicCenter = () => {
  const [stats, setStats] = useState<AnalyticsStats>({
    totalSessions: 0,
    activeTesters: 0,
    totalUploads: 0,
    totalGenerations: 0,
    avgTimeInApp: 0,
    topTabs: [],
    geoData: [],
    deviceMix: [],
    blockedAdminAttempts: 0,
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('analytics-query', {
        body: { 
          dashcards: [
            'sessions',
            'active_users',
            'uploads',
            'generations',
            'time_in_app',
            'top_tabs',
            'geo_heat',
            'device_mix',
            'security_events'
          ]
        }
      });
      
      if (error) throw error;
      
      setStats(data);
      toast.success('Analytics loaded');
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };
  
  const exportData = () => {
    const csv = [
      ['Metric', 'Value'],
      ['Total Sessions', stats.totalSessions],
      ['Active Testers', stats.activeTesters],
      ['Photo Uploads', stats.totalUploads],
      ['Cartoons Generated', stats.totalGenerations],
      ['Avg Time (seconds)', stats.avgTimeInApp],
      ['Blocked Admin Attempts', stats.blockedAdminAttempts],
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('CSV exported');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Epic Center...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-primary" />
            Epic Center
          </h1>
          <p className="text-muted-foreground mt-2">Comprehensive analytics dashboard</p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
      
      {/* Dashcards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashCard
          title="Total Sessions"
          value={stats.totalSessions}
          icon={<Users className="w-5 h-5" />}
        />
        <DashCard
          title="Active Testers"
          value={stats.activeTesters}
          icon={<Users className="w-5 h-5" />}
        />
        <DashCard
          title="Photo Uploads"
          value={stats.totalUploads}
          icon={<Image className="w-5 h-5" />}
        />
        <DashCard
          title="Cartoons Generated"
          value={stats.totalGenerations}
          icon={<Sparkles className="w-5 h-5" />}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Top Tabs by Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topTabs.slice(0, 5).map((tab, index) => (
                <div key={tab.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {index + 1}. {tab.name}
                  </span>
                  <Badge variant="secondary">{tab.count} views</Badge>
                </div>
              ))}
              {stats.topTabs.length === 0 && (
                <p className="text-sm text-muted-foreground">No tab data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.geoData.slice(0, 5).map((geo, index) => (
                <div key={geo.location} className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {index + 1}. {geo.location}
                  </span>
                  <Badge variant="secondary">{geo.count} users</Badge>
                </div>
              ))}
              {stats.geoData.length === 0 && (
                <p className="text-sm text-muted-foreground">No location data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Device Mix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Device Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.deviceMix.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{device.device}</span>
                  <Badge variant="secondary">{device.count}</Badge>
                </div>
              ))}
              {stats.deviceMix.length === 0 && (
                <p className="text-sm text-muted-foreground">No device data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Blocked Admin Attempts</span>
                <Badge variant={stats.blockedAdminAttempts > 0 ? "destructive" : "secondary"}>
                  {stats.blockedAdminAttempts}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Session Time</span>
                <Badge variant="secondary">
                  {Math.round(stats.avgTimeInApp / 60)} min
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
