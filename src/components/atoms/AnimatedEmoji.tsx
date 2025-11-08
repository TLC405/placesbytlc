import { cn } from "@/lib/utils";

interface AnimatedEmojiProps {
  emoji: string;
  animation?: "bounce" | "spin" | "pulse" | "scale";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

const animationClasses = {
  bounce: "animate-bounce",
  spin: "animate-spin",
  pulse: "animate-pulse",
  scale: "hover:scale-125 transition-transform",
};

export function AnimatedEmoji({ emoji, animation = "scale", size = "md", className }: AnimatedEmojiProps) {
  return (
    <span className={cn(sizeClasses[size], animationClasses[animation], className)} role="img" aria-label={emoji}>
      {emoji}
    </span>
  );
}
