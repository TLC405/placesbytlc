import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Palette, MapPin, Shield, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Landing() {
  const navigate = useNavigate();
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      const hasAdminRole = roles?.some(r => (r.role as string) === 'admin') ?? false;
      setIsAdmin(hasAdminRole);
    };
    
    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const handleAdminPinSubmit = () => {
    if (adminPin === "1309") {
      if (isAdmin) {
        toast.success("🎖️ Admin Access Granted");
        navigate("/admin");
      } else {
        toast.error("Invalid credentials. You don't have admin privileges.");
      }
    } else {
      toast.error("Invalid PIN");
    }
    setAdminPin("");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 animate-gradient-shift" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6 animate-fade-in">
          <div className="inline-block animate-float">
            <div className="text-8xl mb-4">💝</div>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black gradient-text tracking-tight mb-4">
            Places by TLC
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Where Love & Technology Create Magic
          </p>
        </div>

        {/* Dual Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          
          {/* For Couples Portal */}
          <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-glow cursor-pointer bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-950/20 dark:to-purple-950/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative p-8 space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-variant flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-black gradient-text">For Couples</h2>
                <p className="text-muted-foreground text-lg">
                  Create magic together with our love-powered tools
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => navigate("/teefeeme")}
                  size="lg"
                  className="w-full h-14 text-lg gap-3 shadow-soft hover:shadow-glow transition-all group/btn"
                >
                  <Palette className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  TeeFee Me
                  <Sparkles className="w-4 h-4 opacity-50" />
                </Button>

                <Button
                  onClick={() => navigate("/")}
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-lg gap-3 hover:bg-primary/5 transition-all group/btn"
                >
                  <MapPin className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  Discover Places
                  <Zap className="w-4 h-4 opacity-50" />
                </Button>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Love Tools</span>
              </div>
            </div>
          </Card>

          {/* Admin/Alpha Portal */}
          <Card className="group relative overflow-hidden border-2 hover:border-accent/50 transition-all duration-500 hover:shadow-glow cursor-pointer bg-gradient-to-br from-slate-50/50 to-zinc-50/50 dark:from-slate-950/20 dark:to-zinc-950/20">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative p-8 space-y-6">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-zinc-800 dark:from-slate-600 dark:to-zinc-700 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-black bg-gradient-to-r from-slate-700 to-zinc-700 dark:from-slate-300 dark:to-zinc-300 bg-clip-text text-transparent">
                  Admin Access
                </h2>
                <p className="text-muted-foreground text-lg">
                  Advanced controls & system management
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => setShowAdminDialog(true)}
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-lg gap-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group/btn"
                >
                  <Shield className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  Enter Admin PIN
                </Button>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span>Protected Area</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto text-center">
          <div className="space-y-2">
            <div className="text-4xl mb-2">🎨</div>
            <h3 className="font-bold text-lg">AI Cartoons</h3>
            <p className="text-sm text-muted-foreground">Transform photos into art</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl mb-2">📍</div>
            <h3 className="font-bold text-lg">Smart Discovery</h3>
            <p className="text-sm text-muted-foreground">Find perfect date spots</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl mb-2">💖</div>
            <h3 className="font-bold text-lg">Made with Love</h3>
            <p className="text-sm text-muted-foreground">For couples, by love</p>
          </div>
        </div>
      </div>

      {/* Admin PIN Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin PIN Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdminPinSubmit()}
              maxLength={4}
              className="text-center text-2xl tracking-widest"
            />
            <Button
              onClick={handleAdminPinSubmit}
              className="w-full"
              disabled={adminPin.length !== 4}
            >
              Access Admin
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
