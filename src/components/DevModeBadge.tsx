import { useDevMode } from "@/contexts/DevModeContext";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Zap } from "lucide-react";

export const DevModeBadge = () => {
  const { isDevMode } = useDevMode();
  
  if (!isDevMode) return null;
  
  return (
    <div className="flex items-center gap-2 animate-fade-in" role="status" aria-label="Developer mode active">
      <Badge className="bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 text-white border-0 shadow-glow font-black px-3 sm:px-4 py-2 text-xs sm:text-sm animate-pulse">
        <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-bounce" aria-hidden="true" />
        💎 PLATINUM MODE 💎
        <Zap className="w-3 h-3 sm:w-4 sm:h-4 ml-1 animate-pulse" aria-hidden="true" />
      </Badge>
      <div className="hidden lg:block text-xs font-bold text-primary animate-pulse">
        <Sparkles className="w-3 h-3 inline mr-1" aria-hidden="true" />
        Super Developer Edition Active
      </div>
    </div>
  );
};
