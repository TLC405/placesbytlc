import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconBadgeProps {
  icon: LucideIcon;
  gradient?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-10 h-10 p-2",
  md: "w-14 h-14 p-3",
  lg: "w-20 h-20 p-4",
};

export function IconBadge({ icon: Icon, gradient = "from-primary to-accent", size = "md", className }: IconBadgeProps) {
  return (
    <div className={cn(
      "rounded-2xl bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform flex items-center justify-center",
      `bg-gradient-to-br ${gradient}`,
      sizeClasses[size],
      className
    )}>
      <Icon className="w-full h-full text-white" />
    </div>
  );
}
