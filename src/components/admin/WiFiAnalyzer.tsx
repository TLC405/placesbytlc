import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Signal, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export const WiFiAnalyzer = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [signalQuality, setSignalQuality] = useState<string>("Unknown");

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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${isOnline ? 'bg-gradient-to-br from-green-600 to-emerald-600' : 'bg-gradient-to-br from-red-600 to-orange-600'} flex items-center justify-center shadow-lg`}>
            {isOnline ? <Wifi className="w-6 h-6 text-white" /> : <WifiOff className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h2 className="text-2xl font-black gradient-text">WiFi Analyzer</h2>
            <p className="text-sm text-muted-foreground">Network status & performance</p>
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
  );
};
