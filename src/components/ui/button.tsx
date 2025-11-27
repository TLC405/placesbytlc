import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold ring-offset-background transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 shadow-premium before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-card hover:shadow-elevated hover:scale-105",
        outline: "border-2 border-primary/30 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/60 hover:shadow-glow shadow-card hover:scale-105",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted shadow-card hover:shadow-elevated hover:scale-105",
        ghost: "border border-border/30 bg-transparent hover:bg-accent/50 hover:text-accent-foreground hover:border-primary/40 hover:scale-105 backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline rounded-none hover:scale-105",
        premium: "glass-premium gradient-primary text-primary-foreground hover:shadow-premium hover:scale-105 border-2 border-primary/20 hover:border-primary/40",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-9 px-5 text-xs",
        lg: "h-16 px-12 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
