import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  badge?: {
    text: string;
    icon?: LucideIcon;
  };
  title: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function HeroSection({ title, subtitle, description, actions, className }: HeroSectionProps) {
  return (
    <section className={cn("relative text-center space-y-6", className)}>
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-black leading-tight text-foreground">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {subtitle}
          </p>
        )}
        
        {description && (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          {actions}
        </div>
      )}
    </section>
  );
}
