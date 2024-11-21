import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const progressBarVariants = cva("h-1 w-full transition-all", {
  variants: {
    variant: {
      default: "bg-primary",
      success: "bg-success",
      error: "bg-destructive",
      warning: "bg-warning",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressBarVariants> {
  progress: number;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, variant, progress, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className={cn(progressBarVariants({ variant }))}
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";

export { ProgressBar, progressBarVariants };
