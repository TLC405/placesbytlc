import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, Zap, Target, Activity, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FeedbackDialog } from "@/components/FeedbackDialog";

export default function Landing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showWarlordDialog, setShowWarlordDialog] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [warlordCode, setWarlordCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessLevel, setAccessLevel] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentFeature, setCurrentFeature] = useState("");

  useEffect(() => {
    const level = sessionStorage.getItem("access_level");
    setAccessLevel(level);
    
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
        toast.success("🎖️ WARLORD ACCESS GRANTED");
        navigate("/admin");
      } else {
        toast.error("Invalid credentials. You don't have admin privileges.");
      }
    } else {
      toast.error("Invalid PIN");
    }
    setAdminPin("");
  };

  const handleFeatureClick = (feature: string, route: string) => {
    if (accessLevel === "admin") {
      navigate(route);
    } else if (accessLevel === "tester") {
      navigate(route);
      // Show feedback after 5 seconds
      setTimeout(() => {
        setCurrentFeature(feature);
        setShowFeedback(true);
      }, 5000);
    } else {
      toast.info(`🔒 ${feature} - Coming Soon! Enter access code to test.`);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
      {/* Epic 3D Background Effects */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,107,0,0.05) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,107,0,0.05) 2px, transparent 2px),
            linear-gradient(rgba(255,107,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
          backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px',
          animation: 'gridScroll 20s linear infinite',
        }} />
      </div>

      {/* Animated Radar Sweeps */}
      <div className="fixed top-10 right-10 w-64 h-64 border-4 border-orange-500/20 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
      <div className="fixed bottom-20 left-10 w-48 h-48 border-4 border-red-500/20 animate-pulse" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      
      {/* TLC Soldier Command Center */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* MASSIVE COD-Style Header */}
        <div className="text-center mb-16 space-y-8 relative">
          {/* Military Badge */}
          <div className="inline-block relative animate-float">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-700 rounded-full opacity-20 blur-2xl animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 rounded-full border-4 border-orange-500 flex items-center justify-center shadow-2xl">
                <Shield className="w-16 h-16 text-orange-400" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                TLC ARMY
              </div>
            </div>
          </div>

          {/* Epic Title */}
          <div className="space-y-4">
            <h1 className="text-7xl sm:text-8xl font-black tracking-tight mb-2" style={{
              background: 'linear-gradient(to bottom, #ff6b00, #cc0000)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 60px rgba(255,107,0,0.5)',
            }}>
              COMMAND CENTER
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              <p className="text-orange-400 font-bold text-2xl tracking-widest font-mono">
                FELICIA.TLC
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            </div>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Strategic Love Operations Platform • Alpha Phase Active
            </p>
          </div>

          {/* Access Level Badge */}
          {accessLevel && (
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600/20 to-red-600/20 border-2 border-orange-500 rounded-full backdrop-blur-sm">
              <Target className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="text-orange-300 font-bold text-sm uppercase tracking-wider">
                {accessLevel === "admin" ? "WARLORD ACCESS" : "ALPHA TESTER"}
              </span>
            </div>
          )}
        </div>

        {/* Main Command Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          
          {/* TeeFee Me Mission */}
          <Card className="group relative overflow-hidden border-2 border-slate-700 hover:border-orange-500/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer"
            onClick={() => handleFeatureClick("TeeFee Me", "/teefeeme")}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🎨</span>
                </div>
                {accessLevel && <Activity className="w-5 h-5 text-green-400 animate-pulse" />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">TEEFEE ME</h3>
                <p className="text-slate-400 text-sm">AI Cartoonification Mission • Transform photos into epic art</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs px-2 py-1 bg-pink-500/20 text-pink-300 rounded border border-pink-500/30">Art</span>
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">AI</span>
                <span className="text-xs px-2 py-1 bg-slate-500/20 text-slate-300 rounded border border-slate-500/30">Fun</span>
              </div>
            </div>
          </Card>

          {/* Places Search Mission */}
          <Card className="group relative overflow-hidden border-2 border-slate-700 hover:border-orange-500/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer"
            onClick={() => handleFeatureClick("Places by TLC", "/")}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📍</span>
                </div>
                {accessLevel && <Activity className="w-5 h-5 text-green-400 animate-pulse" />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">PLACES BY TLC</h3>
                <p className="text-slate-400 text-sm">Strategic Location Discovery • Find perfect date spots • Bring couples together</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded border border-red-500/30">Search</span>
                <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">Discovery</span>
                <span className="text-xs px-2 py-1 bg-pink-500/20 text-pink-300 rounded border border-pink-500/30">Love</span>
              </div>
            </div>
          </Card>

          {/* Quizzes Mission */}
          <Card className="group relative overflow-hidden border-2 border-slate-700 hover:border-orange-500/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer"
            onClick={() => handleFeatureClick("Quizzes", "/quizzes")}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" />
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🧠</span>
                </div>
                {accessLevel && <Activity className="w-5 h-5 text-green-400 animate-pulse" />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">QUIZZES</h3>
                <p className="text-slate-400 text-sm">Personality Assessment • Discover your love language & compatibility</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">MBTI</span>
                <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">Love</span>
                <span className="text-xs px-2 py-1 bg-slate-500/20 text-slate-300 rounded border border-slate-500/30">Test</span>
              </div>
            </div>
          </Card>

          {/* Places Search Mission */}
          <Card className="group relative overflow-hidden border-2 border-slate-700 hover:border-orange-500/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 cursor-pointer"
            onClick={() => handleFeatureClick("Places by TLC", "/")}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📍</span>
                </div>
                {accessLevel && <Activity className="w-5 h-5 text-green-400 animate-pulse" />}
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">PLACES BY TLC</h3>
                <p className="text-slate-400 text-sm">Strategic Location Discovery • Find perfect date spots • Bring couples together</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded border border-red-500/30">Search</span>
                <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-300 rounded border border-orange-500/30">Discovery</span>
                <span className="text-xs px-2 py-1 bg-pink-500/20 text-pink-300 rounded border border-pink-500/30">Love</span>
              </div>
            </div>
          </Card>
                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">MBTI</span>
                <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">Love</span>
                <span className="text-xs px-2 py-1 bg-slate-500/20 text-slate-300 rounded border border-slate-500/30">Test</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Command Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => setShowWarlordDialog(true)}
            className="w-full sm:w-auto h-16 px-8 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 border-2 border-orange-400 text-white font-black text-lg shadow-2xl hover:shadow-orange-500/50 transition-all"
          >
            <Shield className="w-6 h-6 mr-2" />
            ENTER WARLORD CODE
          </Button>

          {isAdmin && (
            <Button
              size="lg"
              onClick={() => setShowAdminDialog(true)}
              variant="outline"
              className="w-full sm:w-auto h-16 px-8 border-2 border-slate-600 hover:border-orange-500 text-slate-300 hover:text-orange-400 font-bold text-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              ADMIN LOGIN (1309)
            </Button>
          )}
        </div>

        {/* Status Footer */}
        <div className="mt-12 text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              SYSTEM OPERATIONAL
            </span>
            <span>•</span>
            <span>ALPHA BUILD v1.0.0</span>
            <span>•</span>
            <span>SECURE CONNECTION</span>
          </div>
        </div>
      </div>

      {/* Warlord Code Dialog */}
      <Dialog open={showWarlordDialog} onOpenChange={setShowWarlordDialog}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-2 border-orange-500">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-400 text-2xl font-black">
              <Shield className="w-6 h-6" />
              ENTER WARLORD CODE
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Alpha testers use <span className="text-orange-400 font-bold">CRIP4LYFE</span> • Admins use <span className="text-red-400 font-bold">1309</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter access code..."
              value={warlordCode}
              onChange={(e) => setWarlordCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const code = warlordCode.trim().toLowerCase();
                  if (code === "crip4lyfe") {
                    sessionStorage.setItem("access_level", "tester");
                    setAccessLevel("tester");
                    toast.success("✅ ALPHA TESTER ACCESS GRANTED");
                    setShowWarlordDialog(false);
                  } else if (code === "1309") {
                    setShowWarlordDialog(false);
                    setShowAdminDialog(true);
                  } else {
                    toast.error("🚫 INVALID CODE");
                  }
                  setWarlordCode("");
                }
              }}
              className="text-center text-xl tracking-widest uppercase font-mono bg-slate-800 border-orange-500/50 text-orange-300"
              autoFocus
            />
            <Button
              onClick={() => {
                const code = warlordCode.trim().toLowerCase();
                if (code === "crip4lyfe") {
                  sessionStorage.setItem("access_level", "tester");
                  setAccessLevel("tester");
                  toast.success("✅ ALPHA TESTER ACCESS GRANTED");
                  setShowWarlordDialog(false);
                } else if (code === "1309") {
                  setShowWarlordDialog(false);
                  setShowAdminDialog(true);
                } else {
                  toast.error("🚫 INVALID CODE");
                }
                setWarlordCode("");
              }}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
            >
              AUTHENTICATE
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin PIN Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-2 border-red-500">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400 text-2xl font-black">
              <Shield className="w-6 h-6" />
              ADMIN PIN REQUIRED
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
              className="text-center text-2xl tracking-widest bg-slate-800 border-red-500/50 text-red-300"
            />
            <Button
              onClick={handleAdminPinSubmit}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
              disabled={adminPin.length !== 4}
            >
              ACCESS ADMIN
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <FeedbackDialog
        open={showFeedback}
        onOpenChange={setShowFeedback}
        featureName={currentFeature}
      />

      <style>{`
        @keyframes gridScroll {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(100px); }
        }
      `}</style>
    </div>
  );
}
