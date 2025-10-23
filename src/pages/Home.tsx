import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import { AuthPanel } from "@/components/AuthPanel";
import { supabase } from "@/integrations/supabase/client";

const CupidAnimation = lazy(() => import("@/components/CupidAnimation").then(m => ({ default: m.CupidAnimation })));

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
    <>
      <Suspense fallback={<div className="h-20" />}>
        <CupidAnimation />
      </Suspense>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Hero Section */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl">
                Start your date night
              </CardTitle>
              <CardDescription className="text-base">
                Find amazing spots, build your perfect date night plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/explore">
                <Button size="lg" className="w-full gap-2">
                  <Play className="w-5 h-5" />
                  Start Date Night
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Auth Panel */}
          {!user && <AuthPanel />}
        </div>
      </div>
    </>
  );
}
