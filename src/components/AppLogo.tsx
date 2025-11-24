import { Zap, Stars } from "lucide-react";

export const AppLogo = () => {
  return (
    <div className="flex items-center gap-3 group">
      {/* Futuristic icon container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
        <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
          <Zap className="w-7 h-7 text-white drop-shadow-lg" />
        </div>
      </div>
      
      {/* Brand text with gradient */}
      <div className="flex flex-col leading-tight">
        <span className="toon-text text-3xl sm:text-4xl font-black">
          TeeFeeMee
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            by TLC
          </span>
          <Stars className="w-3 h-3 text-accent animate-pulse" />
        </div>
      </div>
    </div>
  );
};
