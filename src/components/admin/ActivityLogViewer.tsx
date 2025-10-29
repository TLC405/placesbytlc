import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, RefreshCw, Download, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  timestamp: string;
  ip_address?: string;
}

export default function ActivityLogViewer() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
    
    // Realtime subscription
    const channel = supabase
      .channel('activity-logs')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'user_activity_log' },
        (payload) => {
          setLogs(prev => [payload.new as ActivityLog, ...prev].slice(0, 100));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      toast.error("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const csv = logs.map(log => 
      `${log.timestamp},${log.activity_type},${log.user_id},${log.ip_address || 'N/A'},${JSON.stringify(log.activity_data)}`
    ).join('\n');
    
    const blob = new Blob([`Timestamp,Type,User ID,IP,Data\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${Date.now()}.csv`;
    a.click();
    toast.success("Logs exported!");
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.activity_type === filter);

  const activityTypes = Array.from(new Set(logs.map(l => l.activity_type)));

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      'page_visit': 'bg-blue-500',
      'search': 'bg-green-500',
      'place_view': 'bg-purple-500',
      'admin_action': 'bg-red-500',
      'error': 'bg-orange-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Activity Logs
            </CardTitle>
            <CardDescription>
              Real-time user activity and system events
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchLogs} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={exportLogs} variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
          >
            <Filter className="w-3 h-3 mr-1" />
            All ({logs.length})
          </Button>
          {activityTypes.map(type => (
            <Button
              key={type}
              onClick={() => setFilter(type)}
              variant={filter === type ? 'default' : 'outline'}
              size="sm"
            >
              {type.replace('_', ' ')} ({logs.filter(l => l.activity_type === type).length})
            </Button>
          ))}
        </div>

        {/* Logs Display */}
        <ScrollArea className="h-[400px] rounded-lg border p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No activity logs found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getActivityColor(log.activity_type)}>
                          {log.activity_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(log.timestamp), 'MMM d, HH:mm:ss')}
                        </span>
                      </div>
                      <p className="text-sm font-mono truncate">
                        User: {log.user_id.slice(0, 8)}...
                        {log.ip_address && ` | IP: ${log.ip_address}`}
                      </p>
                      {log.activity_data && (
                        <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto">
                          {JSON.stringify(log.activity_data, null, 2).slice(0, 200)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{logs.length}</div>
            <div className="text-xs text-muted-foreground">Total Logs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(logs.map(l => l.user_id)).size}
            </div>
            <div className="text-xs text-muted-foreground">Unique Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{activityTypes.length}</div>
            <div className="text-xs text-muted-foreground">Event Types</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
