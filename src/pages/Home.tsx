import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Shield, Activity } from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { supabase } from "@/integrations/supabase/client";

const CommandStation = lazy(() => import("@/components/admin/CommandStation").then(m => ({ default: m.CommandStation })));
const FeliciaModPanel = lazy(() => import("@/components/FeliciaModPanel"));

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      const { data } = await supabase.rpc('has_role', { 
        _user_id: user.id, 
        _role: 'admin' 
      });
      
      setIsAdmin(!!data);
    };
    
    checkAdmin();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 sm:space-y-8 pb-12 px-2 sm:px-4 animate-in fade-in duration-700">
      {/* Hero Section - Full Width */}
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-glow border-2 border-primary/40 overflow-hidden hover:shadow-2xl transition-all duration-500 hover-lift">
          <div className="h-3 bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-[length:200%_100%]" />
          <CardHeader className="pb-4 px-4 sm:px-6">
            <CardTitle className="text-2xl sm:text-4xl md:text-6xl font-black gradient-text text-center tracking-tight">
              Welcome to FELICIA.TLC
            </CardTitle>
            <CardDescription className="text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-2xl mx-auto pt-2">
              Your AI-powered love companion for discovering perfect date spots, romance insights, and relationship tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 md:px-12 pb-6 sm:pb-8">
            <Link to="/explore">
              <Button size="lg" className="w-full gap-2 sm:gap-3 h-14 sm:h-16 md:h-20 text-base sm:text-lg md:text-xl font-bold shadow-glow hover:shadow-romantic transition-all hover:scale-105 group">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
                Start Your Love Journey
              </Button>
            </Link>
            <div className="text-center text-sm sm:text-base text-muted-foreground font-medium">
              ✨ AI-Powered • 🗺️ Smart Discovery • 💝 Made with Love
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Explore Card */}
        <Link to="/explore">
          <Card className="hover-lift shadow-soft border-primary/20 h-full cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                🗺️ Explore
              </CardTitle>
              <CardDescription className="text-base leading-relaxed pt-2">
                Discover romantic restaurants, fun activities, and perfect date spots nearby.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Period Tracker Card */}
        <Link to="/period-tracker">
          <Card className="hover-lift shadow-soft border-primary/20 h-full cursor-pointer group bg-gradient-to-br from-rose-50 to-purple-50 dark:from-rose-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                📅 Peripod Tracker
              </CardTitle>
              <CardDescription className="text-base leading-relaxed pt-2">
                Send him hilarious survival reminders. Because he WILL forget. (BETA)
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Quizzes Card */}
        <Link to="/quizzes">
          <Card className="hover-lift shadow-soft border-primary/20 h-full cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 group-hover:text-primary transition-colors">
                🎯 Quizzes
              </CardTitle>
              <CardDescription className="text-base leading-relaxed pt-2">
                Discover your love language, personality type, and compatibility insights.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Admin Command Station */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto">
          <Card className="border-amber-500/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                Command Station - Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Real-time user activity, geographic data, and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                </div>
              }>
                <CommandStation />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Felicia Mod Panel */}
      {isAdmin && (
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <FeliciaModPanel />
          </Suspense>
        </div>
      )}

      {/* Auth Panel - Full Width if Not Logged In */}
      {!user && (
        <div className="max-w-2xl mx-auto">
          <AuthPanel />
        </div>
      )}
    </div>
  );
}
