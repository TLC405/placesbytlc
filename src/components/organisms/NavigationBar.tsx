import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavigationBarProps {
  logo: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function NavigationBar({ logo, actions, className }: NavigationBarProps) {
  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50",
      "bg-background/80 backdrop-blur-xl border-b border-primary/20",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {logo}
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </div>
    </div>
  );
}
