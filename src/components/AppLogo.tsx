import { Heart, Sparkles } from "lucide-react";
import feliciaCrownImage from "@/assets/felicia-crown.png";

export const AppLogo = () => {
  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 text-primary animate-pulse">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <div className="absolute -top-4 -right-4 text-primary animate-pulse" style={{ animationDelay: "0.5s" }}>
          <Sparkles className="w-8 h-8" />
        </div>
        
        {/* Main Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <img 
              src={feliciaCrownImage} 
              alt="Crown" 
              className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg animate-float"
            />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-primary via-primary-variant to-primary bg-clip-text text-transparent">
                PLACES
              </span>
            </h1>
            <img 
              src={feliciaCrownImage} 
              alt="Crown" 
              className="w-12 h-12 md:w-16 md:h-16 drop-shadow-lg animate-float"
              style={{ animationDelay: "1s" }}
            />
          </div>
          <p className="text-lg md:text-xl font-bold text-muted-foreground tracking-wide">
            by <span className="text-primary">TLC</span> for <span className="text-primary">FeeFee</span>
          </p>
          <p className="text-sm text-muted-foreground italic">
            Your legendary date night companion
          </p>
        </div>

        {/* Decorative bottom elements */}
        <div className="absolute -bottom-4 -left-4 text-primary animate-pulse" style={{ animationDelay: "1s" }}>
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="absolute -bottom-4 -right-4 text-primary animate-pulse" style={{ animationDelay: "1.5s" }}>
          <Heart className="w-6 h-6 fill-current" />
        </div>
      </div>
    </div>
  );
};
