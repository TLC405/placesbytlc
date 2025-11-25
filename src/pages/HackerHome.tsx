import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Zap,
  Shield,
  Activity,
  Database,
  Users,
  MapPin,
  Heart,
  Sparkles,
  Calendar,
  Gamepad2,
  Crown,
  TrendingUp,
  MessageSquare,
  Code,
} from "lucide-react";
import { useDevMode } from "@/contexts/DevModeContext";

export default function HackerHome() {
  const { isDevMode } = useDevMode();
  const [time, setTime] = useState(new Date());
  const [stats] = useState({
    activeSessions: 42,
    dataProcessed: "1.2TB",
    requests: "15.3K",
    uptime: "99.9%",
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "Place Discovery",
      icon: MapPin,
      desc: "AI-powered location finder",
      path: "/",
      color: "from-blue-500 to-cyan-500",
      stats: "70K+ Places",
    },
    {
      title: "Couple Mode",
      icon: Heart,
      desc: "Shared planning & sync",
      path: "/couple-mode",
      color: "from-pink-500 to-rose-500",
      stats: "Live Sync",
    },
    {
      title: "AI Recommender",
      icon: Sparkles,
      desc: "Smart suggestions engine",
      path: "/ai-recommender",
      color: "from-purple-500 to-violet-500",
      stats: "GPT-Powered",
    },
    {
      title: "Period Tracker V2",
      icon: Calendar,
      desc: "Survival mode for guys",
      path: "/period-tracker",
      color: "from-red-500 to-orange-500",
      stats: "SMS Alerts",
    },
    {
      title: "OKC Legend Forge",
      icon: MapPin,
      desc: "8 epic adventure zones",
      path: "/okc-legend",
      color: "from-orange-500 to-yellow-500",
      stats: "70+ Spots",
    },
    {
      title: "Quizzes",
      icon: MessageSquare,
      desc: "Love language & MBTI",
      path: "/quizzes",
      color: "from-green-500 to-emerald-500",
      stats: "2 Quizzes",
    },
    {
      title: "Gamification",
      icon: Gamepad2,
      desc: "Achievements & levels",
      path: "/gamification",
      color: "from-indigo-500 to-blue-500",
      stats: "XP System",
    },
    {
      title: "TeeFeeMe",
      icon: Sparkles,
      desc: "AI cartoonifier",
      path: "/cartoonifier",
      color: "from-yellow-500 to-amber-500",
      stats: "AI Magic",
    },
  ];

  if (isDevMode) {
    features.push({
      title: "Admin Panel",
      icon: Shield,
      desc: "Full system control",
      path: "/admin",
      color: "from-red-600 to-purple-600",
      stats: "PLATINUM",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-green-400 font-mono p-4 sm:p-6">
      {/* Matrix Rain Effect Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgzNCwxOTcsOTQsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
      </div>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] animate-pulse opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Terminal Header */}
        <Card className="border-2 border-green-500/30 bg-black/80 backdrop-blur-sm shadow-2xl shadow-green-500/20">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-pulse">
                  <Terminal className="w-6 h-6 text-black" />
                </div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-black text-green-400 tracking-wider">
                    [SYSTEM_ACCESS] INPERSON.TLC
                  </CardTitle>
                  <p className="text-xs text-green-500/70 mt-1">
                    {time.toLocaleTimeString()} • {time.toLocaleDateString()} • SECURE CONNECTION
                  </p>
                </div>
              </div>
              
              {isDevMode && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black px-4 py-2 text-sm animate-pulse">
                  <Crown className="w-4 h-4 mr-1" />
                  PLATINUM MODE
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* System Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "ACTIVE_SESSIONS", value: stats.activeSessions, icon: Activity, color: "text-cyan-400" },
            { label: "DATA_PROCESSED", value: stats.dataProcessed, icon: Database, color: "text-purple-400" },
            { label: "REQUESTS_24H", value: stats.requests, icon: TrendingUp, color: "text-yellow-400" },
            { label: "UPTIME", value: stats.uptime, icon: Zap, color: "text-green-400" },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="border border-green-500/30 bg-black/60 backdrop-blur-sm hover:border-green-500 transition-all group"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-green-500/70">{stat.label}</span>
                </div>
                <p className={`text-xl sm:text-2xl font-black ${stat.color} group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Features Grid */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            <h2 className="text-xl font-black text-green-400 tracking-wider">
              [AVAILABLE_MODULES]
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card className="border border-green-500/30 bg-black/60 backdrop-blur-sm hover:border-green-500 hover:shadow-xl hover:shadow-green-500/20 transition-all group h-full">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs">
                          {feature.stats}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="font-black text-green-400 text-lg mb-1 group-hover:text-green-300 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-green-500/70 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-green-500/50 group-hover:text-green-400 transition-colors">
                        <Code className="w-3 h-3" />
                        <span>ACCESS_MODULE</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Terminal Footer */}
        <Card className="border border-green-500/30 bg-black/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4 text-xs text-green-500/70">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>SECURE_MODE: ENABLED</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>SYSTEM_STATUS: OPERATIONAL</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>ACCESS_LEVEL: {isDevMode ? "PLATINUM" : "STANDARD"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
