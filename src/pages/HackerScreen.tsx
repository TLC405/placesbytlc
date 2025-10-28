import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Wifi, Shield, Lock, Eye, Database, Zap } from "lucide-react";

export default function HackerScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);

  const hackerLines = [
    { text: "INITIALIZING SYSTEM...", color: "text-green-400", delay: 300 },
    { text: "CONNECTING TO SECURE NETWORK...", color: "text-cyan-400", delay: 400 },
    { text: "ACCESSING MAINFRAME...", color: "text-yellow-400", delay: 350 },
    { text: "BYPASSING FIREWALL...", color: "text-orange-400", delay: 450 },
    { text: "DECRYPTING DATA STREAMS...", color: "text-red-400", delay: 400 },
    { text: "SOCIAL MEDIA PROFILES: 847 FOUND", color: "text-purple-400", delay: 500 },
    { text: "LOCATION DATA: TRACKING...", color: "text-pink-400", delay: 350 },
    { text: "DEVICE SIGNATURES: 23 ACTIVE", color: "text-blue-400", delay: 400 },
    { text: "ESTABLISHING SECURE CONNECTION...", color: "text-green-400", delay: 450 },
    { text: "ACCESS GRANTED ✓", color: "text-green-500", delay: 600 },
  ];

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
    // Progress bar
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          // Navigate to home after completion
          setTimeout(() => navigate("/"), 800);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

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

        {/* Terminal output grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left panel - Main terminal */}
          <div className="border border-green-500 p-4 bg-black/80 backdrop-blur min-h-[400px]">
            <div className="flex items-center gap-2 mb-4 border-b border-green-500/30 pb-2">
              <Terminal className="w-5 h-5" />
              <span className="text-sm">MAIN_TERMINAL.log</span>
            </div>
            <div className="space-y-2 text-sm">
              {hackerLines.slice(0, currentLine).map((line, idx) => (
                <div key={idx} className={`${line.color} flex items-start gap-2`}>
                  <span className="text-green-600">&gt;</span>
                  <span className="animate-typewriter">{line.text}</span>
                </div>
              ))}
              {currentLine < hackerLines.length && (
                <div className="flex items-center gap-1">
                  <span className="text-green-500 animate-pulse">█</span>
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Device info */}
          <div className="border border-cyan-500 p-4 bg-black/80 backdrop-blur">
            <div className="flex items-center gap-2 mb-4 border-b border-cyan-500/30 pb-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-cyan-400">DEVICE_MONITOR.sys</span>
            </div>
            <div className="space-y-3 text-xs text-cyan-400">
              <div className="flex justify-between">
                <span>Active Devices:</span>
                <span className="text-yellow-400 animate-pulse">23</span>
              </div>
              <div className="flex justify-between">
                <span>GPS Coordinates:</span>
                <span className="text-green-400">TRACKING...</span>
              </div>
              <div className="flex justify-between">
                <span>Network Status:</span>
                <span className="text-green-400">SECURED</span>
              </div>
              <div className="flex justify-between">
                <span>Encryption:</span>
                <span className="text-green-400">AES-256</span>
              </div>
              <div className="mt-4 p-3 border border-cyan-500/30 bg-cyan-950/20">
                <div className="text-purple-400 mb-2">SOCIAL PROFILES FOUND:</div>
                <div className="space-y-1 text-[10px]">
                  <div>Instagram: 234 connections</div>
                  <div>Facebook: 512 friends</div>
                  <div>Twitter: 89 followers</div>
                  <div className="text-yellow-400 animate-pulse mt-2">*Data collection complete*</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status bars */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-purple-500 p-3 bg-black/80 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-400">DATABASE</span>
            </div>
            <div className="text-[10px] text-purple-300">
              <div>Records: 8,472</div>
              <div className="text-green-400 animate-pulse">Status: SYNCED</div>
            </div>
          </div>
          
          <div className="border border-orange-500 p-3 bg-black/80 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-orange-400">POWER</span>
            </div>
            <div className="text-[10px] text-orange-300">
              <div>CPU: 87%</div>
              <div className="text-green-400">RAM: 4.2/8 GB</div>
            </div>
          </div>
          
          <div className="border border-red-500 p-3 bg-black/80 backdrop-blur">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400">SECURITY</span>
            </div>
            <div className="text-[10px] text-red-300">
              <div>Threats: 0</div>
              <div className="text-green-400 animate-pulse">Status: PROTECTED</div>
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
