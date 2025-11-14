import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border-2 border-primary/20 bg-card/50 backdrop-blur-sm px-4 py-3 text-base font-medium text-foreground transition-all duration-300",
          "placeholder:text-muted-foreground/60 placeholder:font-normal",
          "hover:border-primary/40 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:border-primary focus-visible:shadow-xl focus-visible:shadow-primary/10",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-primary/20",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
