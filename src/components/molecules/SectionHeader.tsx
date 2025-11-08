import { LucideIcon } from "lucide-react";
import { GradientText } from "@/components/atoms/GradientText";
import { AnimatedEmoji } from "@/components/atoms/AnimatedEmoji";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  emoji?: string;
  centered?: boolean;
  size?: "sm" | "md" | "lg";
}

const titleSizes = {
  sm: "text-2xl",
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl lg:text-6xl",
};

const descSizes = {
  sm: "text-sm",
  md: "text-base lg:text-lg",
  lg: "text-lg lg:text-xl",
};

export function SectionHeader({ title, description, icon: Icon, emoji, centered = true, size = "md" }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-3", centered && "text-center")}>
      <GradientText as="h2" className={cn("font-black flex items-center gap-3", titleSizes[size], centered && "justify-center")}>
        {Icon && <Icon className="w-8 h-8 text-primary animate-pulse" />}
        {title}
        {emoji && <AnimatedEmoji emoji={emoji} size={size === "sm" ? "sm" : size === "lg" ? "lg" : "md"} />}
      </GradientText>
      {description && (
        <p className={cn("text-muted-foreground font-medium", descSizes[size])}>
          {description}
        </p>
      )}
    </div>
  );
}
