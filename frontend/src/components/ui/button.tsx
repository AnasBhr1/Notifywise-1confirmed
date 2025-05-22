import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-600 before:via-purple-600 before:to-indigo-600 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-2xl hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98]",
        outline: "border-2 border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 p-[2px] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-[2px] before:rounded-[10px] before:bg-background before:transition-all before:duration-300 group-hover:before:bg-gradient-to-r group-hover:before:from-indigo-50 group-hover:before:to-purple-50 dark:group-hover:before:from-indigo-950 dark:group-hover:before:to-purple-950",
        secondary: "bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-900 dark:text-slate-100 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        ghost: "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950 dark:hover:to-purple-950 hover:text-indigo-700 dark:hover:text-indigo-300 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]",
        glass: "bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 text-slate-900 dark:text-white hover:bg-white/20 dark:hover:bg-black/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] shadow-lg",
        glow: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl shadow-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/75 hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400 before:to-blue-400 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        premium: "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow-400 before:via-red-500 before:to-pink-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg font-bold",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : icon ? (
            icon
          ) : null}
          {children}
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }