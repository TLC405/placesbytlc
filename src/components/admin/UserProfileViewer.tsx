import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, MapPin, Monitor, Smartphone, Globe, Clock, 
  Activity, TrendingUp, Shield, Zap, Eye, MousePointer,
  Copy, AlertTriangle, Battery, Cpu, HardDrive
} from "lucide-react";

interface UserActivity {
  id: string;
  timestamp: string;
  activity_type: string;
  activity_data: any;
  user_id?: string;
}

interface UserProfileViewerProps {
  userId: string;
  activities: UserActivity[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileViewer = ({ userId, activities, open, onOpenChange }: UserProfileViewerProps) => {
  const userActivities = activities.filter(a => 
    a.user_id === userId || a.activity_data?.sessionId === userId
  );

  const latestActivity = userActivities[0]?.activity_data || {};
  const device = latestActivity.device || {};
  const location = latestActivity.location || {};
  const visitor = latestActivity.visitor || {};
  const security = latestActivity.security || {};
  const network = latestActivity.network || {};
  const performance = latestActivity.performance || {};

  // Calculate user segment
  const getSegment = () => {
    const count = userActivities.length;
    const isNew = !visitor.isReturning;
    const avgTimeOnPage = userActivities
      .filter(a => a.activity_type === 'page_exit')
      .reduce((sum, a) => sum + (a.activity_data?.timeOnPage || 0), 0) / count || 0;

    if (isNew && count <= 2) return { label: 'New', color: 'bg-blue-500' };
    if (count > 20 && avgTimeOnPage > 60) return { label: 'Power User', color: 'bg-purple-500' };
    if (count > 5) return { label: 'Active', color: 'bg-green-500' };
    if (count < 3 && !isNew) return { label: 'At Risk', color: 'bg-red-500' };
    return { label: 'Regular', color: 'bg-gray-500' };
  };

  const segment = getSegment();

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile: {userId.slice(0, 8)}...
            <Badge className={`${segment.color} text-white ml-2`}>
              {segment.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh]">
          <div className="space-y-6 p-4">
            {/* Overview Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Eye className="h-4 w-4" />
                  Total Visits
                </div>
                <div className="text-2xl font-bold">{userActivities.length}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  Visit Count
                </div>
                <div className="text-2xl font-bold">{visitor.visitCount || 1}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  First Visit
                </div>
                <div className="text-sm font-medium">
                  {visitor.firstVisit ? new Date(visitor.firstVisit).toLocaleDateString() : 'Today'}
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Zap className="h-4 w-4" />
                  Network
                </div>
                <div className="text-sm font-bold">{network.speed || 'Unknown'}</div>
                <div className="text-xs text-muted-foreground">{network.latency}ms</div>
              </div>
            </div>

            <Separator />

            {/* Location & Device */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground">City:</span> {location.city || 'Unknown'}</div>
                  <div><span className="text-muted-foreground">State:</span> {location.region || 'Unknown'}</div>
                  <div><span className="text-muted-foreground">Country:</span> {location.country_name || 'Unknown'}</div>
                  <div><span className="text-muted-foreground">IP:</span> {location.ip || 'Unknown'}</div>
                  <div><span className="text-muted-foreground">Carrier:</span> {location.carrierName || 'Unknown'}</div>
                  <div><span className="text-muted-foreground">ISP:</span> {location.org || 'Unknown'}</div>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <Monitor className="h-4 w-4" />
                  Device Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground">Platform:</span> {device.platform || 'Unknown'}</div>
                  <div><span className="text-muted-foreground">Screen:</span> {device.screenWidth}x{device.screenHeight}</div>
                  <div><span className="text-muted-foreground">Viewport:</span> {device.viewportWidth}x{device.viewportHeight}</div>
                  <div><span className="text-muted-foreground">Touch Points:</span> {device.touchPoints || 0}</div>
                  <div><span className="text-muted-foreground">Timezone:</span> {device.timezone || 'Unknown'}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Device:</span>
                    {device.touchPoints > 0 ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                    {device.touchPoints > 0 ? 'Mobile' : 'Desktop'}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Performance & Hardware */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <Cpu className="h-4 w-4" />
                  Hardware
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-3 w-3" />
                    {device.hardwareConcurrency || 0} CPU cores
                  </div>
                  {device.memory?.jsHeapSizeLimit && (
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-3 w-3" />
                      {device.memory.jsHeapSizeLimit}MB heap limit
                    </div>
                  )}
                  {device.battery?.level !== undefined && (
                    <div className="flex items-center gap-2">
                      <Battery className="h-3 w-3" />
                      {device.battery.level}% {device.battery.charging && '(Charging)'}
                    </div>
                  )}
                  {device.gpu && device.gpu !== 'Unknown' && (
                    <div className="text-xs text-muted-foreground">GPU: {device.gpu.slice(0, 30)}...</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <Activity className="h-4 w-4" />
                  Performance
                </h3>
                <div className="space-y-2 text-sm">
                  {performance.loadTime && (
                    <div><span className="text-muted-foreground">Load Time:</span> {performance.loadTime}ms</div>
                  )}
                  {performance.domContentLoaded && (
                    <div><span className="text-muted-foreground">DOM Ready:</span> {performance.domContentLoaded}ms</div>
                  )}
                  {performance.responseTime && (
                    <div><span className="text-muted-foreground">Response:</span> {performance.responseTime}ms</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <Shield className="h-4 w-4" />
                  Security
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {security.hasAdBlocker ? 
                      <Badge variant="destructive">Ad Blocker</Badge> : 
                      <Badge variant="secondary">No Ad Blocker</Badge>
                    }
                  </div>
                  {security.vpnDetected && (
                    <Badge variant="outline" className="text-orange-500">VPN Detected</Badge>
                  )}
                  {security.proxyDetected && (
                    <Badge variant="outline" className="text-orange-500">Proxy Detected</Badge>
                  )}
                  {latestActivity.fingerprint && (
                    <div className="text-xs text-muted-foreground">
                      Fingerprint: {latestActivity.fingerprint.slice(0, 16)}...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Behavioral Metrics */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <MousePointer className="h-4 w-4" />
                Behavior Patterns
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {userActivities.some(a => a.activity_type === 'copy') && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Copy className="h-3 w-3" />
                      Copy Events
                    </div>
                    <div className="font-bold">
                      {userActivities.filter(a => a.activity_type === 'copy').length}
                    </div>
                  </div>
                )}
                {userActivities.some(a => a.activity_type === 'rage_click') && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-red-500 mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      Rage Clicks
                    </div>
                    <div className="font-bold">
                      {userActivities.filter(a => a.activity_type === 'rage_click').length}
                    </div>
                  </div>
                )}
                {userActivities.some(a => a.activity_type === 'dead_click') && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <MousePointer className="h-3 w-3" />
                      Dead Clicks
                    </div>
                    <div className="font-bold">
                      {userActivities.filter(a => a.activity_type === 'dead_click').length}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Activity Timeline */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <Clock className="h-4 w-4" />
                Activity Timeline
              </h3>
              <div className="space-y-2">
                {userActivities.slice(0, 20).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2 border rounded text-sm">
                    <div className="text-xs text-muted-foreground min-w-[140px]">
                      {formatDate(activity.timestamp)}
                    </div>
                    <Badge variant="outline">{activity.activity_type}</Badge>
                    <div className="text-xs text-muted-foreground flex-1">
                      {activity.activity_data?.path || activity.activity_data?.element || 'No details'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
