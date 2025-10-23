import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Hero Section */}
          <Card className="shadow-soft border-primary/30 overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="gradient-primary h-2" />
            <CardHeader>
              <CardTitle className="text-3xl md:text-5xl font-black gradient-text">
                ✨ Welcome to FELICIA.TLC ✨
              </CardTitle>
              <CardDescription className="text-base md:text-lg leading-relaxed">
                Your personalized AI-powered love journey awaits. Discover enchanting date spots, curated just for you! 💕
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/explore">
                <Button size="lg" className="w-full gap-2 h-16 text-lg font-bold shadow-glow hover:shadow-romantic transition-all hover:scale-105">
                  <Play className="w-6 h-6" />
                  Start Your Love Journey
                </Button>
              </Link>
              <div className="text-center text-sm text-muted-foreground">
                🎯 Personalized • 🤖 AI-Powered • 💖 Made with Love
              </div>
            </CardContent>
          </Card>

          {/* Auth Panel */}
          {!user && <AuthPanel />}
        </div>
    </div>
  );
}
