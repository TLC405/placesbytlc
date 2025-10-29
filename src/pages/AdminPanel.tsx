import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Users, BarChart3, Terminal, Activity, Sparkles, Heart,
  Shield, Zap, Crown, Lock, LogIn, AlertCircle, Code2, Cpu
} from "lucide-react";
import { CommandStation } from "@/components/admin/CommandStation";
import { UserAnalyticsDashboard } from "@/components/admin/UserAnalyticsDashboard";
import { UserProfileViewer } from "@/components/admin/UserProfileViewer";
import { SMSNotificationPanel } from "@/components/admin/SMSNotificationPanel";
import { AIPromptInterface } from "@/components/admin/AIPromptInterface";
import { WiFiAnalyzer } from "@/components/admin/WiFiAnalyzer";
import { AppReadinessChecklist } from "@/components/admin/AppReadinessChecklist";
import { RecentUpdates } from "@/components/RecentUpdates";
import CupidSettingsPanel from "@/components/admin/CupidSettingsPanel";
import ActivityLogViewer from "@/components/admin/ActivityLogViewer";
import ComprehensiveExportSystem from "@/components/admin/ComprehensiveExportSystem";
import { UpdateLogger } from "@/components/admin/UpdateLogger";
import { PromptLibrary } from "@/components/admin/PromptLibrary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasRole, roles, isLoading: roleLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  
  const isAdmin = hasRole('admin');

  const handleBootstrapAdmin = async () => {
    setIsBootstrapping(true);
    try {
      const { data, error } = await supabase.functions.invoke('bootstrap-admin');
      
      if (error) throw error;
      
      if (data.success) {
        toast.success("🎉 Admin access granted! Refreshing...");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(data.message || "Failed to bootstrap admin");
      }
    } catch (error: any) {
      console.error('Bootstrap error:', error);
      toast.error(error.message || "Failed to grant admin access");
    } finally {
      setIsBootstrapping(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("✨ Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    if (!roleLoading) {
      setLoading(false);
    }
  }, [roleLoading]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Cpu className="w-16 h-16 text-cyan-400 animate-spin mx-auto" />
          <p className="text-cyan-400 font-mono text-lg">INITIALIZING ADMIN CONSOLE...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-cyan-500/30 bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-cyan-500/20">
          <CardHeader className="text-center space-y-4 border-b border-cyan-500/20">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-3 shadow-lg shadow-cyan-500/50 animate-pulse">
                <Terminal className="w-full h-full text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-mono">
              ADMIN TERMINAL
            </CardTitle>
            <p className="text-cyan-400/70 font-mono text-sm">AUTHENTICATE TO CONTINUE</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-cyan-400 font-mono">EMAIL</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@system.local"
                  required
                  className="bg-slate-950 border-cyan-500/30 text-cyan-100 placeholder:text-gray-600 font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-cyan-400 font-mono">PASSWORD</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-slate-950 border-cyan-500/30 text-cyan-100 placeholder:text-gray-600 font-mono"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSigningIn}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-6 font-mono"
              >
                {isSigningIn ? "AUTHENTICATING..." : <><LogIn className="w-5 h-5 mr-2" />AUTHENTICATE</>}
              </Button>
            </form>
            <Button variant="ghost" onClick={() => navigate("/")} className="w-full mt-4 text-cyan-400 hover:text-cyan-300 font-mono">
              ← RETURN TO SYSTEM
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-red-500/30 bg-slate-900/90 backdrop-blur-xl shadow-2xl shadow-red-500/20">
          <CardHeader className="text-center space-y-4 border-b border-red-500/20">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-lg bg-red-500/20 p-4 border-2 border-red-500/50">
                <Lock className="w-full h-full text-red-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black text-red-500 font-mono">ACCESS DENIED</CardTitle>
            <div className="space-y-2">
              <p className="text-red-400/80 font-mono text-sm">INSUFFICIENT PRIVILEGES</p>
              <Badge variant="outline" className="bg-slate-950 border-cyan-500/30 text-cyan-400 font-mono">
                YOUR ROLE: {roles.join(', ').toUpperCase() || 'USER'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-yellow-400 font-mono text-sm font-bold">FIRST-TIME SETUP?</p>
                  <p className="text-gray-300 text-sm">If no admin exists yet, you can bootstrap yourself as the first admin.</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleBootstrapAdmin}
              disabled={isBootstrapping}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-6 font-mono"
            >
              {isBootstrapping ? (
                <><Cpu className="w-5 h-5 mr-2 animate-spin" />GRANTING ACCESS...</>
              ) : (
                <><Crown className="w-5 h-5 mr-2" />GRANT MYSELF ADMIN ACCESS</>
              )}
            </Button>
            <Button onClick={() => navigate("/")} variant="ghost" className="w-full text-cyan-400 hover:text-cyan-300 font-mono">
              ← RETURN TO SYSTEM
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900">
      {/* MAN-MODE HEADER */}
      <div className="border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-2 shadow-lg shadow-cyan-500/50">
                <Terminal className="w-full h-full text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-mono">
                  ADMIN COMMAND CENTER
                </h1>
                <p className="text-xs text-cyan-400/60 font-mono">SYSTEM CONTROL INTERFACE v2.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300 font-mono">
                <Shield className="w-3 h-3 mr-1" />
                {user.email}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300 font-mono">
                <Zap className="w-3 h-3 mr-1" />
                {roles.map(r => r.toUpperCase()).join(' + ')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONSOLE */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-cyan-500/20 p-1 font-mono">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              <BarChart3 className="w-4 h-4 mr-2" />OVERVIEW
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              <Users className="w-4 h-4 mr-2" />ANALYTICS
            </TabsTrigger>
            <TabsTrigger value="cupid" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
              <Heart className="w-4 h-4 mr-2" />CUPID
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              <Activity className="w-4 h-4 mr-2" />LOGS
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
              <Code2 className="w-4 h-4 mr-2" />DEV TOOLS
            </TabsTrigger>
            <TabsTrigger value="prompts" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
              <Sparkles className="w-4 h-4 mr-2" />PROMPTS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-cyan-300 font-mono flex items-center gap-2">
                    <Terminal className="w-5 h-5" />COMMAND STATION
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CommandStation />
                </CardContent>
              </Card>
              <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-cyan-300 font-mono flex items-center gap-2">
                    <Zap className="w-5 h-5" />WIFI ANALYZER
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WiFiAnalyzer />
                </CardContent>
              </Card>
            </div>
            <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-cyan-300 font-mono flex items-center gap-2">
                  <Activity className="w-5 h-5" />RECENT UPDATES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentUpdates />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-cyan-300 font-mono">USER ANALYTICS DASHBOARD</CardTitle>
              </CardHeader>
              <CardContent>
                <UserAnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cupid">
            <Card className="border-pink-500/20 bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-pink-300 font-mono">CUPID SETTINGS</CardTitle>
              </CardHeader>
              <CardContent>
                <CupidSettingsPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-cyan-300 font-mono">ACTIVITY LOGS</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityLogViewer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-cyan-300 font-mono">UPDATE LOGGER</CardTitle>
                </CardHeader>
                <CardContent>
                  <UpdateLogger />
                </CardContent>
              </Card>
              <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-cyan-300 font-mono">EXPORT SYSTEM</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComprehensiveExportSystem />
                </CardContent>
              </Card>
            </div>
            <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-cyan-300 font-mono">AI INTERFACE</CardTitle>
              </CardHeader>
              <CardContent>
                <AIPromptInterface />
              </CardContent>
            </Card>
            <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-cyan-300 font-mono">SMS PANEL</CardTitle>
              </CardHeader>
              <CardContent>
                <SMSNotificationPanel />
              </CardContent>
            </Card>
            <Card className="border-cyan-500/20 bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-cyan-300 font-mono">APP READINESS</CardTitle>
              </CardHeader>
              <CardContent>
                <AppReadinessChecklist />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prompts">
            <Card className="border-purple-500/20 bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-purple-300 font-mono">PROMPT LIBRARY</CardTitle>
              </CardHeader>
              <CardContent>
                <PromptLibrary />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
