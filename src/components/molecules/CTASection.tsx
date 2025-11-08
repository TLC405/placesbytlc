import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTAButton {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "outline";
}

interface CTASectionProps {
  title: string;
  description: string;
  buttons: CTAButton[];
  className?: string;
}

export function CTASection({ title, description, buttons, className }: CTASectionProps) {
  return (
    <Card className={cn("gradient-primary border-0 shadow-2xl shadow-primary/30", className)}>
      <CardContent className="py-12 text-center space-y-6">
        <h2 className="text-4xl font-black text-primary-foreground">{title}</h2>
        <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">{description}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          {buttons.map((button, idx) => {
            const Icon = button.icon;
            return (
              <Button
                key={idx}
                size="lg"
                onClick={button.onClick}
                variant={button.variant}
                className={cn(
                  "font-bold text-lg px-8 py-6 shadow-xl hover:scale-110 transition-transform",
                  button.variant === "outline" 
                    ? "bg-transparent border-2 border-background text-primary-foreground hover:bg-background hover:text-foreground"
                    : "bg-background text-foreground hover:bg-background/90"
                )}
              >
                {Icon && <Icon className="w-6 h-6 mr-2" />}
                {button.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
