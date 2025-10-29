import { useDevMode } from "@/contexts/DevModeContext";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export const DevModeBadge = () => {
  const { isDevMode } = useDevMode();

  if (!isDevMode) return null;

  return (
    <Badge className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white border-0 animate-pulse px-3 py-1.5 font-black">
      <Zap className="w-4 h-4 mr-1.5" />
      PLATINUM MODE
    </Badge>
  );
};
