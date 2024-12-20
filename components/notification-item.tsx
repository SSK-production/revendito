import React, { useState, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./progress-bar";

const notificationVariants = cva(
  "fixed flex flex-col w-full max-w-sm overflow-hidden rounded-lg shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "bg-success/15 text-success-foreground",
        error: "bg-destructive/15 text-destructive-foreground",
        warning: "bg-warning/15 text-warning-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const NotificationItem: React.FC<NotificationProps> = ({
  className,
  variant,
  message,
  onClose,
  duration = 5000,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(timer);
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for fade out animation
          return 0;
        }
        return prevProgress - 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const Icon =
    variant === "success"
      ? CheckCircle2
      : variant === "error"
      ? XCircle
      : variant === "warning"
      ? AlertCircle
      : Info;

  return (
    <div
      className={cn(
        notificationVariants({ variant }),
        "transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-center space-x-4 p-4">
        <Icon
          className={cn(
            "h-6 w-6 flex-shrink-0",
            variant === "success" && "text-success",
            variant === "error" && "text-destructive",
            variant === "warning" && "text-warning"
          )}
        />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-full hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ProgressBar
        progress={progress}
        variant={variant}
        className="rounded-none"
      />
    </div>
  );
};
