import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Wifi, Shield, Lock, Eye, Database, Zap } from "lucide-react";

export default function HackerScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);

  const [ipAddresses, setIpAddresses] = useState<string[]>([]);
  const [networkActivity, setNetworkActivity] = useState(0);

  const hackerLines = [
    { text: "INITIALIZING QUANTUM CORE v3.7.2...", color: "text-green-400", delay: 250 },
    { text: "LOADING NEURAL NETWORK PROTOCOLS...", color: "text-cyan-400", delay: 280 },
    { text: "ESTABLISHING ENCRYPTED TUNNEL [192.168.1.1]", color: "text-blue-400", delay: 300 },
    { text: "CONNECTING TO SECURE NETWORK... [SSH-2.0]", color: "text-cyan-400", delay: 320 },
    { text: "HANDSHAKE COMPLETE: TLS 1.3 ACTIVE", color: "text-green-400", delay: 290 },
    { text: "ACCESSING MAINFRAME... [PORT 8443 OPEN]", color: "text-yellow-400", delay: 310 },
    { text: "BYPASSING FIREWALL LAYER 1 OF 3...", color: "text-orange-400", delay: 280 },
    { text: "FIREWALL LAYER 2 PENETRATED [AES-256]", color: "text-orange-400", delay: 300 },
    { text: "FIREWALL LAYER 3 BYPASSED ✓", color: "text-green-400", delay: 290 },
    { text: "INJECTING POLYMORPHIC CODE...", color: "text-red-400", delay: 320 },
    { text: "DECRYPTING DATA STREAMS [RSA-4096]", color: "text-red-400", delay: 310 },
    { text: "SCANNING SOCIAL MEDIA DATABASES...", color: "text-purple-400", delay: 330 },
    { text: "INSTAGRAM API: 234 PROFILES INDEXED", color: "text-purple-400", delay: 290 },
    { text: "FACEBOOK GRAPH: 512 CONNECTIONS MAPPED", color: "text-pink-400", delay: 300 },
    { text: "TWITTER STREAM: 89 ACCOUNTS ANALYZED", color: "text-blue-400", delay: 280 },
    { text: "TIKTOK METADATA: 156 VIDEOS CATALOGED", color: "text-cyan-400", delay: 290 },
    { text: "GPS COORDINATES: 37.7749°N, 122.4194°W", color: "text-yellow-400", delay: 310 },
    { text: "DEVICE FINGERPRINTS: 23 UNIQUE SIGNATURES", color: "text-blue-400", delay: 300 },
    { text: "MAC ADDRESSES: [12:34:56:78:9A:BC, ...]", color: "text-green-400", delay: 280 },
    { text: "COMPILING THREAT ASSESSMENT MATRIX...", color: "text-orange-400", delay: 320 },
    { text: "BEHAVIORAL PATTERNS: 94% CONFIDENCE", color: "text-cyan-400", delay: 290 },
    { text: "ESTABLISHING SECURE QUANTUM CHANNEL...", color: "text-green-400", delay: 310 },
    { text: "SYNCHRONIZING TEMPORAL DATABASES...", color: "text-purple-400", delay: 280 },
    { text: "ALL SYSTEMS NOMINAL - ACCESS GRANTED ✓", color: "text-green-500", delay: 400 },
  ];

  useEffect(() => {
    // Generate random IP addresses for effect
    const ips = Array.from({ length: 8 }, () => 
      `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
    );
    setIpAddresses(ips);

    // Simulate network activity
    const activityTimer = setInterval(() => {
      setNetworkActivity(Math.floor(Math.random() * 100));
    }, 800);

    return () => clearInterval(activityTimer);
  }, []);

  useEffect(() => {
    // Auto-advance lines
    if (currentLine < hackerLines.length) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, hackerLines[currentLine]?.delay || 400);
      return () => clearTimeout(timer);
    }
  }, [currentLine, hackerLines]);

  useEffect(() => {
    // Progress bar - slower progression (8 seconds total)
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          // Navigate to home after completion
          setTimeout(() => navigate("/"), 800);
          return 100;
        }
        return prev + 1.25; // Slower increment
      });
    }, 100); // Check more frequently for smoother animation

    return () => clearInterval(progressTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .05) 25%, rgba(0, 255, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .05) 75%, rgba(0, 255, 0, .05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-scan" />
      </div>

      {/* Main content */}
      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="border-2 border-green-500 p-6 mb-8 bg-black/80 backdrop-blur animate-pulse-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-500 animate-pulse" />
              <h1 className="text-2xl font-bold text-green-500">SYSTEM ACCESS TERMINAL</h1>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 animate-pulse" />
                <span>ENCRYPTED</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>SECURE</span>
              </div>
            </div>
          </div>
          <div className="h-2 bg-green-900/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-600 via-green-400 to-green-600 transition-all duration-300 animate-gradient-shift"
              style={{ width: `${progress}%`, backgroundSize: '200% 100%' }}
            />
          </div>
          <div className="text-right text-xs mt-2 text-green-400">{progress}% COMPLETE</div>
        </div>

        {/* Terminal output grid - Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left panel - Main terminal */}
          <div className="border border-green-500 p-4 bg-black/80 backdrop-blur min-h-[450px]">
            <div className="flex items-center gap-2 mb-4 border-b border-green-500/30 pb-2">
              <Terminal className="w-5 h-5" />
              <span className="text-sm">MAIN_TERMINAL.log</span>
              <span className="text-[10px] text-green-600 ml-auto">ROOT@INPERSON-TLC</span>
            </div>
            <div className="space-y-1 text-xs max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-700 scrollbar-track-green-950">
              {hackerLines.slice(0, currentLine).map((line, idx) => (
                <div key={idx} className={`${line.color} flex items-start gap-2 font-mono`}>
                  <span className="text-green-600 flex-shrink-0">[{String(idx).padStart(2, '0')}]</span>
                  <span className="leading-relaxed">{line.text}</span>
                </div>
              ))}
              {currentLine < hackerLines.length && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-green-600">[{String(currentLine).padStart(2, '0')}]</span>
                  <span className="text-green-500 animate-pulse">█</span>
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Network Monitor */}
          <div className="border border-cyan-500 p-4 bg-black/80 backdrop-blur">
            <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/30 pb-2">
              <Wifi className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-cyan-400">NETWORK_MONITOR.sys</span>
              <span className="text-[10px] text-cyan-600 ml-auto">ACTIVE</span>
            </div>
            <div className="space-y-3 text-xs text-cyan-400">
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-cyan-500/30 p-2 bg-cyan-950/10">
                  <div className="text-cyan-600 text-[10px]">BANDWIDTH</div>
                  <div className="text-lg font-bold text-cyan-400">{networkActivity} MB/s</div>
                </div>
                <div className="border border-green-500/30 p-2 bg-green-950/10">
                  <div className="text-green-600 text-[10px]">LATENCY</div>
                  <div className="text-lg font-bold text-green-400">12ms</div>
                </div>
              </div>
              
              <div className="border border-cyan-500/30 p-3 bg-cyan-950/20">
                <div className="text-purple-400 mb-2 font-bold">ACTIVE CONNECTIONS:</div>
                <div className="space-y-1 text-[10px] max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-700">
                  {ipAddresses.slice(0, 6).map((ip, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-cyan-300">{ip}</span>
                      <span className="text-green-400">SECURED</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-purple-500/30 p-3 bg-purple-950/20">
                <div className="text-purple-400 mb-2 font-bold">SOCIAL INTEL:</div>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span>Instagram:</span>
                    <span className="text-yellow-400">234 profiles</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Facebook:</span>
                    <span className="text-yellow-400">512 friends</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Twitter:</span>
                    <span className="text-yellow-400">89 followers</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TikTok:</span>
                    <span className="text-yellow-400">156 videos</span>
                  </div>
                  <div className="text-green-400 animate-pulse mt-2 text-center border-t border-purple-500/30 pt-2">
                    ✓ ANALYSIS COMPLETE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Grid - Additional Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* File System */}
          <div className="border border-yellow-500 p-3 bg-black/80 backdrop-blur">
            <div className="flex items-center gap-2 mb-3 border-b border-yellow-500/30 pb-2">
              <Database className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-400">FILESYSTEM</span>
            </div>
            <div className="text-[10px] text-yellow-300 space-y-1">
              <div className="flex justify-between">
                <span>/root/data</span>
                <span className="text-green-400">8.4GB</span>
              </div>
              <div className="flex justify-between">
                <span>/var/logs</span>
                <span className="text-cyan-400">2.1GB</span>
              </div>
              <div className="flex justify-between">
                <span>/tmp/cache</span>
                <span className="text-purple-400">512MB</span>
              </div>
              <div className="flex justify-between">
                <span>/etc/config</span>
                <span className="text-orange-400">87MB</span>
              </div>
              <div className="h-2 bg-yellow-900/30 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-yellow-500 w-[73%]"></div>
              </div>
              <div className="text-center text-yellow-400 animate-pulse mt-1">73% UTILIZED</div>
            </div>
          </div>

          {/* System Resources */}
          <div className="border border-orange-500 p-3 bg-black/80 backdrop-blur">
            <div className="flex items-center gap-2 mb-3 border-b border-orange-500/30 pb-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-orange-400">RESOURCES</span>
            </div>
            <div className="text-[10px] text-orange-300 space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span>CPU Usage:</span>
                  <span className="text-yellow-400">87%</span>
                </div>
                <div className="h-1.5 bg-orange-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-[87%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>RAM:</span>
                  <span className="text-cyan-400">4.2/8GB</span>
                </div>
                <div className="h-1.5 bg-orange-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-[52%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>GPU:</span>
                  <span className="text-purple-400">34%</span>
                </div>
                <div className="h-1.5 bg-orange-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[34%]"></div>
                </div>
              </div>
              <div className="text-green-400 animate-pulse text-center border-t border-orange-500/30 pt-2 mt-2">
                ⚡ OPTIMAL
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="border border-red-500 p-3 bg-black/80 backdrop-blur">
            <div className="flex items-center gap-2 mb-3 border-b border-red-500/30 pb-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400">SECURITY</span>
            </div>
            <div className="text-[10px] text-red-300 space-y-2">
              <div className="flex justify-between items-center">
                <span>Firewall:</span>
                <span className="text-green-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Encryption:</span>
                <span className="text-green-400 font-bold">AES-256</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Threats:</span>
                <span className="text-green-400 font-bold">0 DETECTED</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Intrusions:</span>
                <span className="text-green-400 font-bold">BLOCKED</span>
              </div>
              <div className="border border-green-500/30 p-2 bg-green-950/20 mt-2">
                <div className="text-green-400 text-center font-bold animate-pulse">
                  🛡️ PROTECTED
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Command Bar */}
        <div className="border-2 border-blue-500 p-4 bg-black/90 backdrop-blur">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">SYSTEM ONLINE</span>
              </div>
              <div className="text-blue-400">
                SESSION: <span className="text-cyan-400 font-mono">0x{Math.random().toString(16).substr(2, 8).toUpperCase()}</span>
              </div>
              <div className="text-purple-400">
                UPTIME: <span className="text-pink-400">99.97%</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-yellow-400">
                THREAT LEVEL: <span className="text-green-400 font-bold">MINIMAL</span>
              </div>
              <div className="text-orange-400">
                {new Date().toLocaleTimeString('en-US', { hour12: false })}
              </div>
            </div>
          </div>
        </div>

        {/* Warning message at bottom */}
        {progress > 95 && (
          <div className="mt-8 border-2 border-green-500 p-4 bg-green-950/30 animate-pulse">
            <div className="text-center text-green-400 text-lg font-bold">
              ✓ ACCESS GRANTED - REDIRECTING TO SECURE PORTAL...
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgb(34 197 94); box-shadow: 0 0 10px rgb(34 197 94 / 0.5); }
          50% { border-color: rgb(74 222 128); box-shadow: 0 0 20px rgb(74 222 128 / 0.8); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
