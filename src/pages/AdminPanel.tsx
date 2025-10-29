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

  // Skip loading screen for faster access
  if (roleLoading) {
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card border-2 border-primary/30 shadow-2xl shadow-primary/20 animate-scale-in">
          <CardHeader className="text-center space-y-6 border-b border-primary/20">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-3xl gradient-primary p-4 shadow-xl animate-pulse">
                <Heart className="w-full h-full text-white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-black gradient-text">
              Admin Portal
            </CardTitle>
            <p className="text-muted-foreground">Sign in to manage your love empire 💖</p>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSigningIn}
                className="w-full h-14 gradient-primary text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {isSigningIn ? "Signing in..." : <><LogIn className="w-5 h-5 mr-2" />Sign In</>}
              </Button>
            </form>
            <Button variant="ghost" onClick={() => navigate("/")} className="w-full mt-6 text-primary hover:text-primary/80">
              ← Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-card border-2 border-destructive/30 shadow-2xl shadow-destructive/20 animate-scale-in">
          <CardHeader className="text-center space-y-6 border-b border-destructive/20">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-3xl bg-destructive/10 p-5 border-2 border-destructive/50">
                <Lock className="w-full h-full text-destructive" />
              </div>
            </div>
            <CardTitle className="text-4xl font-black text-destructive">Access Denied</CardTitle>
            <div className="space-y-3">
              <p className="text-destructive/80">You don't have admin privileges</p>
              <Badge variant="outline" className="bg-accent border-primary/30 text-foreground px-4 py-2">
                Your Role: {roles.join(', ').toUpperCase() || 'USER'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="p-6 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-2xl">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-3">
                  <p className="text-yellow-700 font-bold">First-Time Setup?</p>
                  <p className="text-sm text-muted-foreground">If no admin exists yet, you can grant yourself admin access right now.</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleBootstrapAdmin}
              disabled={isBootstrapping}
              className="w-full h-14 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-xl shadow-lg"
            >
              {isBootstrapping ? (
                <><Cpu className="w-5 h-5 mr-2 animate-spin" />Granting Access...</>
              ) : (
                <><Crown className="w-5 h-5 mr-2" />Grant Myself Admin Access</>
              )}
            </Button>
            <Button onClick={() => navigate("/")} variant="ghost" className="w-full text-primary hover:text-primary/80">
              ← Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-pink-950 dark:via-rose-950 dark:to-purple-950">
      {/* ROMANTIC ADMIN HEADER */}
      <div className="border-b border-primary/20 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary p-3 shadow-xl animate-pulse">
                <Heart className="w-full h-full text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black gradient-text">
                  Admin Love Center
                </h1>
                <p className="text-sm text-muted-foreground">Manage your romantic empire with care 💖</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="gradient-primary text-white border-0 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                {user.email}
              </Badge>
              <Badge className="bg-accent text-accent-foreground px-4 py-2">
                <Crown className="w-4 h-4 mr-2" />
                {roles.map(r => r.toUpperCase()).join(' + ')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN ADMIN PANEL */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="glass-card border-2 border-primary/20 p-2 h-auto flex flex-wrap gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:gradient-primary data-[state=active]:text-white rounded-xl px-4 py-2">
              <BarChart3 className="w-4 h-4 mr-2" />Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:gradient-primary data-[state=active]:text-white rounded-xl px-4 py-2">
              <Users className="w-4 h-4 mr-2" />Users
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:gradient-primary data-[state=active]:text-white rounded-xl px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />Content
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:gradient-primary data-[state=active]:text-white rounded-xl px-4 py-2">
              <Activity className="w-4 h-4 mr-2" />Activity
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:gradient-primary data-[state=active]:text-white rounded-xl px-4 py-2">
              <Code2 className="w-4 h-4 mr-2" />Tools
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:gradient-primary data-[state=active]:text-white rounded-xl px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card className="glass-card border-2 border-primary/20 hover-lift">
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center gap-2">
                    <Terminal className="w-5 h-5" />Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CommandStation />
                </CardContent>
              </Card>
              <Card className="glass-card border-2 border-primary/20 hover-lift">
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center gap-2">
                    <Zap className="w-5 h-5" />System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WiFiAnalyzer />
                </CardContent>
              </Card>
              <Card className="glass-card border-2 border-primary/20 hover-lift col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center gap-2">
                    <Activity className="w-5 h-5" />App Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AppReadinessChecklist />
                </CardContent>
              </Card>
            </div>
            <Card className="glass-card border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="gradient-text flex items-center gap-2">
                  <Activity className="w-5 h-5" />Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentUpdates />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="animate-fade-in">
            <Card className="glass-card border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="gradient-text">User Analytics & Management</CardTitle>
              </CardHeader>
              <CardContent>
                <UserAnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6 animate-fade-in">
            <Card className="glass-card border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="gradient-text">Content Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <CupidSettingsPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="animate-fade-in">
            <Card className="glass-card border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="gradient-text">Activity Logs & History</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityLogViewer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="gradient-text">Update Logger</CardTitle>
                </CardHeader>
                <CardContent>
                  <UpdateLogger />
                </CardContent>
              </Card>
              <Card className="glass-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="gradient-text">Export System</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComprehensiveExportSystem />
                </CardContent>
              </Card>
            </div>
            <Card className="glass-card border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="gradient-text">SMS Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <SMSNotificationPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6 animate-fade-in">
            <Card className="glass-card border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="gradient-text">AI Prompt Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <AIPromptInterface />
              </CardContent>
            </Card>
            <Card className="glass-card border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="gradient-text">Prompt Library</CardTitle>
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
