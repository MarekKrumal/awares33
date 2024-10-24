import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-filter backdrop-blur-lg border border-transparent", // Glass effect with blur
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-sky-400 to-sky-600 text-white shadow-lg hover:bg-gradient-to-l", // Lighter gradient for a more ethereal look
        destructive: "bg-red-500 text-white shadow-lg hover:bg-red-600", // Slightly lighter red
        outline:
          "border border-sky-600 bg-transparent text-sky-600 hover:bg-sky-600 hover:text-white", // More visible outline with better contrast
        secondary:
          "bg-gradient-to-r from-sky-300 to-sky-500 text-white hover:bg-gradient-to-l", // Lighter secondary variant
        ghost: "hover:bg-sky-100 hover:text-sky-800", // Subtle hover effect for ghost variant
        link: "text-sky-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
