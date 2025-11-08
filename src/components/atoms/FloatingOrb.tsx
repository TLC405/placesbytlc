import { cn } from "@/lib/utils";

interface FloatingOrbProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: "primary" | "accent" | "secondary";
  delay?: number;
}

const positionClasses = {
  "top-left": "top-20 left-10",
  "top-right": "top-20 right-10",
  "bottom-left": "bottom-20 left-10",
  "bottom-right": "bottom-20 right-10",
};

const colorClasses = {
  primary: "bg-primary/20",
  accent: "bg-accent/20",
  secondary: "bg-secondary/20",
};

export function FloatingOrb({ position, color = "primary", delay = 0 }: FloatingOrbProps) {
  return (
    <div 
      className={cn(
        "absolute w-96 h-96 rounded-full blur-3xl animate-pulse pointer-events-none",
        positionClasses[position],
        colorClasses[color]
      )}
      style={{ animationDelay: `${delay}ms` }}
      aria-hidden="true"
    />
  );
}
