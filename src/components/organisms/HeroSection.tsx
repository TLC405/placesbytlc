import { ReactNode } from "react";
import { GlowingBadge } from "@/components/atoms/GlowingBadge";
import { GradientText } from "@/components/atoms/GradientText";
import { FloatingOrb } from "@/components/atoms/FloatingOrb";
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

export function HeroSection({ badge, title, subtitle, description, actions, className }: HeroSectionProps) {
  return (
    <section className={cn("relative text-center space-y-6 animate-fade-in", className)}>
      <FloatingOrb position="top-left" color="primary" />
      <FloatingOrb position="bottom-right" color="accent" delay={1000} />
      
      {badge && (
        <div className="relative z-10">
          <GlowingBadge icon={badge.icon} size="lg">
            {badge.text}
          </GlowingBadge>
        </div>
      )}

      <div className="relative z-10 space-y-4">
        <GradientText as="h1" className="text-5xl md:text-7xl font-black leading-tight">
          {title}
        </GradientText>
        
        {subtitle && (
          <GradientText as="p" className="text-2xl md:text-3xl font-bold">
            {subtitle}
          </GradientText>
        )}
        
        {description && (
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="relative z-10 flex flex-wrap gap-4 justify-center pt-4">
          {actions}
        </div>
      )}
    </section>
  );
}
