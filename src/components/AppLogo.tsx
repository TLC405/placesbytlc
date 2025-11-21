export const AppLogo = () => {
  return (
    <div className="relative group">
      <div className="flex items-center gap-3">
        {/* Cartoon logo badge */}
        <div className="relative">
          <div className="w-14 h-14 bg-primary border-4 border-foreground/90 rounded-2xl flex items-center justify-center transform -rotate-3 shadow-[4px_4px_0px_0px] shadow-foreground/30">
            <span className="text-3xl transform rotate-3">🎨</span>
          </div>
        </div>
        
        {/* Brand text */}
        <div className="flex flex-col -space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tighter toon-text text-primary">
              TeeFeeMee
            </span>
            <span className="text-xs font-black text-accent uppercase border-2 border-foreground/60 px-2 py-0.5 rounded bg-accent/20 transform rotate-2">
              by TLC
            </span>
          </div>
          <span className="text-xs font-bold text-muted-foreground tracking-wide">
            Your Face. Your Cartoon Universe.
          </span>
        </div>
      </div>
    </div>
  );
};
