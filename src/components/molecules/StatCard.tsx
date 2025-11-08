import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, color = "text-primary", className }: StatCardProps) {
  return (
    <Card
      className={cn(
        "bg-card/80 backdrop-blur-xl border-2 border-primary/30",
        "shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300",
        className
      )}
      role="article"
      aria-label={`${label}: ${value}`}
    >
      <CardContent className="pt-6 text-center">
        <Icon className={cn("w-8 h-8 mx-auto mb-2", color)} aria-hidden="true" />
        <div className="text-3xl font-black text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground font-medium">{label}</div>
      </CardContent>
    </Card>
  );
}
