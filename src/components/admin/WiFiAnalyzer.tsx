import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Signal, RefreshCw, MapPin, Globe } from "lucide-react";
import { toast } from "sonner";

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  timezone: string;
}

export const WiFiAnalyzer = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [signalQuality, setSignalQuality] = useState<string>("Unknown");
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loadingIP, setLoadingIP] = useState(false);

  const fetchIPInfo = async () => {
    setLoadingIP(true);
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        setIpInfo({
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          loc: `${data.latitude}, ${data.longitude}`,
          org: data.org,
          timezone: data.timezone,
        });
        toast.success("IP info updated!");
      }
    } catch (error) {
      console.error("Failed to fetch IP info:", error);
      toast.error("Failed to fetch IP info");
    } finally {
      setLoadingIP(false);
    }
  };

  const checkNetwork = () => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const info: NetworkInfo = {
        effectiveType: connection.effectiveType || "unknown",
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
      };
      
      setNetworkInfo(info);
      
      // Determine signal quality
      if (info.downlink >= 10) {
        setSignalQuality("Excellent");
      } else if (info.downlink >= 5) {
        setSignalQuality("Good");
      } else if (info.downlink >= 1) {
        setSignalQuality("Fair");
      } else {
        setSignalQuality("Poor");
      }
      
      toast.success("Network info updated!");
    } else {
      toast.error("Network API not supported");
    }
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);
    checkNetwork();
    fetchIPInfo();

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online!");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Connection lost!");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Network Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${isOnline ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-red-600 to-orange-600'} flex items-center justify-center shadow-lg`}>
              {isOnline ? <Wifi className="w-6 h-6 text-white" /> : <WifiOff className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h3 className="text-xl font-black gradient-text">Network Status</h3>
              <p className="text-sm text-muted-foreground">Connection & performance</p>
            </div>
          </div>
          <Button size="sm" onClick={checkNetwork} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Connection Status</span>
            <span className={`text-sm font-bold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          {networkInfo && (
            <>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Signal className="w-4 h-4" />
                  Network Type
                </span>
                <span className="text-sm font-bold uppercase">{networkInfo.effectiveType}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Signal Quality</span>
                <span className={`text-sm font-bold ${
                  signalQuality === 'Excellent' ? 'text-green-500' :
                  signalQuality === 'Good' ? 'text-blue-500' :
                  signalQuality === 'Fair' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {signalQuality}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Download Speed</span>
                <span className="text-sm font-bold">{networkInfo.downlink} Mbps</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Latency (RTT)</span>
                <span className="text-sm font-bold">{networkInfo.rtt} ms</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Data Saver</span>
                <span className={`text-sm font-bold ${networkInfo.saveData ? 'text-yellow-500' : 'text-green-500'}`}>
                  {networkInfo.saveData ? "ENABLED" : "DISABLED"}
                </span>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* IP Information Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black gradient-text">IP Information</h3>
              <p className="text-sm text-muted-foreground">Location & network details</p>
            </div>
          </div>
          <Button size="sm" onClick={fetchIPInfo} variant="outline" disabled={loadingIP}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingIP ? 'animate-spin' : ''}`} />
            {loadingIP ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {ipInfo ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">IP Address</span>
              <span className="text-sm font-bold font-mono">{ipInfo.ip}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </span>
              <span className="text-sm font-bold">{ipInfo.city}, {ipInfo.region}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Country</span>
              <span className="text-sm font-bold">{ipInfo.country}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Coordinates</span>
              <span className="text-sm font-bold font-mono">{ipInfo.loc}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">ISP</span>
              <span className="text-sm font-bold text-xs">{ipInfo.org}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Timezone</span>
              <span className="text-sm font-bold">{ipInfo.timezone}</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Click refresh to load IP information</p>
          </div>
        )}
      </Card>
    </div>
  );
};
