import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:scale-105",
        secondary: "border-secondary/30 bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20 hover:bg-secondary/80 hover:shadow-xl hover:shadow-secondary/30 hover:scale-105",
        destructive: "border-destructive/30 bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/80 hover:shadow-xl hover:shadow-destructive/30 hover:scale-105",
        outline: "border-primary/40 bg-card/50 text-foreground backdrop-blur-sm hover:bg-card hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 hover:scale-105",
        premium: "border-primary bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-110",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
