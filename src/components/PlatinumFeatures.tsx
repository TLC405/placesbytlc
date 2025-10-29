import { useDevMode } from "@/contexts/DevModeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Sparkles, Rocket, Star, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PlatinumFeatures = () => {
  const { isDevMode } = useDevMode();
  
  if (!isDevMode) return null;
  
  return (
    <Card className="border-4 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 via-purple-500/10 to-pink-500/10 shadow-2xl animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-black flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-500 animate-bounce" />
            <span className="bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              PLATINUM DEVELOPER EDITION
            </span>
            <Zap className="w-8 h-8 text-purple-500 animate-pulse" />
          </CardTitle>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-black px-4 py-2">
            🚀 UNLIMITED ACCESS
          </Badge>
        </div>
        <CardDescription className="text-lg font-bold">
          🎮 Super-charged features for the ultimate developer experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-blue-400 animate-spin" />
              <h3 className="font-black text-xl">4 Premium Themes</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Romance • Man Mode (CoD) • Cyberpunk • Nature - Switch anytime in header
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50">
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="w-6 h-6 text-green-400 animate-pulse" />
              <h3 className="font-black text-xl">Enhanced OKC Legend</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive maps • Route builder • Stats tracking • Adventure creator
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/50">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-red-400 animate-bounce" />
              <h3 className="font-black text-xl">Admin Superpowers</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Full analytics • User tracking • Activity logs • System control
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-purple-400 animate-pulse" />
              <h3 className="font-black text-xl">Double Options</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              2x features everywhere • Advanced settings • Beta access • Priority support
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link to="/admin">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 font-black text-lg">
              🛡️ Open Admin Panel
            </Button>
          </Link>
          <Link to="/okc-legend">
            <Button size="lg" className="bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 font-black text-lg">
              🔥 Enhanced OKC Legend
            </Button>
          </Link>
        </div>

        <div className="text-center p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-purple-500/10 border border-yellow-500/30">
          <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
            ⚡ You're learning to build your first app! Explore everything - the sky is the limit! ⚡
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
