export const AppLogo = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-4 px-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-primary">Built for men</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-foreground leading-none">
          DEEP<span className="text-primary">ER</span>
        </h1>
        <p className="text-xs font-medium text-muted-foreground max-w-[220px] mx-auto leading-snug">
          Self-awareness, dating game, and the stuff nobody teaches you.
        </p>
      </div>
    </div>
  );
};
