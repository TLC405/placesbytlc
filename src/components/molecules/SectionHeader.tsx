import { LucideIcon } from "lucide-react";
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
      <h2 className={cn("font-black flex items-center gap-3 text-foreground", titleSizes[size], centered && "justify-center")}>
        {Icon && <Icon className="w-8 h-8 text-primary" />}
        {title}
        {emoji && <span className="text-4xl">{emoji}</span>}
      </h2>
      {description && (
        <p className={cn("text-muted-foreground font-medium", descSizes[size])}>
          {description}
        </p>
      )}
    </div>
  );
}
