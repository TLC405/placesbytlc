import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlowingBadgeProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantClasses = {
  primary: "gradient-primary text-primary-foreground shadow-glow",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
};

const sizeClasses = {
  sm: "px-3 py-1 text-xs",
  md: "px-6 py-2 text-sm",
  lg: "px-8 py-3 text-lg",
};

export function GlowingBadge({ children, icon: Icon, variant = "primary", size = "md", className }: GlowingBadgeProps) {
  return (
    <Badge className={cn(
      "border-0 font-bold animate-pulse",
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Badge>
  );
}
