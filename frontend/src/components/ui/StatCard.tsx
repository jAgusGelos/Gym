import { LucideIcon } from "lucide-react";
import { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { Card, CardContent } from "./Card";

type ColorVariant = "blue" | "green" | "purple" | "orange" | "red" | "emerald" | "amber" | "indigo" | "gray";
type SizeVariant = "sm" | "md" | "lg";
type StyleVariant = "standard" | "gradient";

interface StatCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: ColorVariant;
  size?: SizeVariant;
  variant?: StyleVariant;
  suffix?: string;
  loading?: boolean;
}

const colorClasses: Record<ColorVariant, { bg: string; icon: string; gradient?: string }> = {
  blue: {
    bg: "bg-blue-100",
    icon: "text-blue-600",
    gradient: "from-blue-500 to-blue-600"
  },
  green: {
    bg: "bg-green-100",
    icon: "text-green-600",
    gradient: "from-green-500 to-emerald-600"
  },
  purple: {
    bg: "bg-purple-100",
    icon: "text-purple-600",
    gradient: "from-purple-500 to-pink-600"
  },
  orange: {
    bg: "bg-orange-100",
    icon: "text-orange-600",
    gradient: "from-orange-500 to-amber-600"
  },
  red: {
    bg: "bg-red-100",
    icon: "text-red-600",
    gradient: "from-red-500 to-rose-600"
  },
  emerald: {
    bg: "bg-emerald-100",
    icon: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-600"
  },
  amber: {
    bg: "bg-amber-100",
    icon: "text-amber-600",
    gradient: "from-amber-500 to-orange-500"
  },
  indigo: {
    bg: "bg-indigo-100",
    icon: "text-indigo-600",
    gradient: "from-indigo-500 to-purple-500"
  },
  gray: {
    bg: "bg-gray-100",
    icon: "text-gray-600",
    gradient: "from-gray-500 to-slate-600"
  }
};

const sizeClasses: Record<SizeVariant, { value: string; label: string; icon: string; iconContainer: string }> = {
  sm: {
    value: "text-2xl font-bold",
    label: "text-xs",
    icon: "w-5 h-5",
    iconContainer: "w-10 h-10"
  },
  md: {
    value: "text-3xl font-bold",
    label: "text-sm",
    icon: "w-6 h-6",
    iconContainer: "w-12 h-12"
  },
  lg: {
    value: "text-4xl font-bold",
    label: "text-sm",
    icon: "w-8 h-8",
    iconContainer: "w-14 h-14"
  }
};

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "blue",
  size = "md",
  variant = "standard",
  suffix,
  loading = false,
  className,
  ...props
}: StatCardProps) {
  const colors = colorClasses[iconColor];
  const sizes = sizeClasses[size];

  // Variant: Gradient
  if (variant === "gradient") {
    return (
      <div
        className={cn(
          "rounded-xl shadow-lg p-6 text-white bg-gradient-to-r",
          colors.gradient,
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={cn("opacity-90 mb-1", sizes.label)}>{label}</p>
            <p className={sizes.value}>
              {loading ? "..." : value}
              {suffix && <span className="text-2xl ml-1">{suffix}</span>}
            </p>
          </div>
          <Icon className={cn(sizes.iconContainer, "opacity-50")} />
        </div>
      </div>
    );
  }

  // Variant: Standard
  return (
    <Card className={cn("h-full", className)} {...props}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn("text-gray-600 dark:text-gray-400", sizes.label)}>
              {label}
            </p>
            <p className={cn("text-gray-900 dark:text-white", sizes.value)}>
              {loading ? "..." : value}
              {suffix && <span className="text-sm ml-1 text-gray-600">{suffix}</span>}
            </p>
          </div>
          <div className={cn(
            "rounded-full flex items-center justify-center",
            sizes.iconContainer,
            colors.bg
          )}>
            <Icon className={cn(sizes.icon, colors.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
