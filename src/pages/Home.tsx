import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Heart, Sparkles } from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { supabase } from "@/integrations/supabase/client";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
              Places by TLC
            </CardTitle>
            <CardDescription className="text-base sm:text-lg md:text-xl leading-relaxed text-center max-w-2xl mx-auto pt-2">
              Your AI-powered companion for discovering perfect date spots and relationship tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 md:px-12 pb-6 sm:pb-8">
            <div className="text-center text-sm sm:text-base text-muted-foreground font-medium">
              ✨ AI-Powered • 🗺️ Smart Discovery • 💝 Made with Love
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Interface */}
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-xl border-2 border-primary/20">
            <TabsTrigger 
              value="features" 
              className="text-base font-semibold data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Features
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="text-base font-semibold data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all"
            >
              <Heart className="w-5 h-5 mr-2" />
              My Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="mt-6 space-y-6">

            {/* Other Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

          </TabsContent>

          <TabsContent value="account" className="mt-6">
            {!user ? (
              <div className="max-w-2xl mx-auto">
                <AuthPanel />
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto shadow-glow border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl gradient-text">Welcome back!</CardTitle>
                  <CardDescription>
                    You're signed in as {user.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={async () => {
                      await supabase.auth.signOut();
                    }}
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
