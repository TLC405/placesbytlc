import { useDevMode } from "@/contexts/DevModeContext";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Zap } from "lucide-react";

export const DevModeBadge = () => {
  const { isDevMode } = useDevMode();
  
  if (!isDevMode) return null;
  
  return (
    <div className="flex items-center gap-2 animate-fade-in">
      <Badge className="bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 text-white border-0 shadow-glow font-black px-4 py-2 text-sm animate-pulse">
        <Crown className="w-4 h-4 mr-1 animate-bounce" />
        💎 PLATINUM MODE 💎
        <Zap className="w-4 h-4 ml-1 animate-pulse" />
      </Badge>
      <div className="hidden lg:block text-xs font-bold text-primary animate-pulse">
        <Sparkles className="w-3 h-3 inline mr-1" />
        Super Developer Edition Active
      </div>
    </div>
  );
};
