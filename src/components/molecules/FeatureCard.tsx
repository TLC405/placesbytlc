import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/atoms/IconBadge";
import { AnimatedEmoji } from "@/components/atoms/AnimatedEmoji";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  emoji?: string;
  gradient?: string;
  onClick?: () => void;
  className?: string;
}

export function FeatureCard({ 
  title, 
  description, 
  icon, 
  emoji, 
  gradient = "from-primary to-accent", 
  onClick,
  className 
}: FeatureCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group cursor-pointer border-2 border-primary/30 hover:border-primary/60",
        "shadow-lg hover:shadow-2xl hover:shadow-primary/20",
        "transition-all duration-300 hover:-translate-y-2",
        "bg-card/95 backdrop-blur-md",
        className
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <IconBadge icon={icon} gradient={gradient} />
          {emoji && <AnimatedEmoji emoji={emoji} />}
        </div>
        <CardTitle className="text-xl font-black group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground font-medium">{description}</p>
      </CardContent>
    </Card>
  );
}
