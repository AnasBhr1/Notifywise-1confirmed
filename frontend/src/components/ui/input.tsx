import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border-border hover:border-primary/50 focus:border-primary shadow-sm hover:shadow-md focus:shadow-lg",
        glass: "bg-white/10 dark:bg-black/10 backdrop-blur-xl border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 focus:bg-white/30 dark:focus:bg-black/30 shadow-lg",
        gradient: "border-transparent bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900 dark:hover:to-pink-900 focus:ring-purple-500 shadow-lg",
        glow: "border-cyan-200 dark:border-cyan-800 bg-cyan-50/50 dark:bg-cyan-950/50 hover:shadow-lg hover:shadow-cyan-500/20 focus:shadow-xl focus:shadow-cyan-500/30 focus:border-cyan-400",
        premium: "border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 hover:shadow-lg hover:shadow-amber-500/20 focus:shadow-xl focus:shadow-amber-500/30 focus:border-amber-400",
      },
      inputSize: {
        default: "h-12 px-4 py-3",
        sm: "h-10 px-3 py-2 text-sm rounded-lg",
        lg: "h-14 px-6 py-4 text-base rounded-xl",
        xl: "h-16 px-8 py-5 text-lg rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, icon, rightIcon, type, ...props }, ref) => {
    return (
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ variant, inputSize }),
            icon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }