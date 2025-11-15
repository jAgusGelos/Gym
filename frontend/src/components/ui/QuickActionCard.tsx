import { LucideIcon } from "lucide-react";
import { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";
import { Card, CardContent } from "./Card";

type ColorVariant = "blue" | "green" | "purple" | "orange" | "red" | "emerald" | "amber" | "indigo" | "primary";

interface QuickActionCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconColor?: ColorVariant;
  onClick?: () => void;
}

const colorClasses: Record<ColorVariant, { bg: string; icon: string }> = {
  blue: {
    bg: "bg-blue-100",
    icon: "text-blue-600"
  },
  green: {
    bg: "bg-green-100",
    icon: "text-green-600"
  },
  purple: {
    bg: "bg-purple-100",
    icon: "text-purple-600"
  },
  orange: {
    bg: "bg-orange-100",
    icon: "text-orange-600"
  },
  red: {
    bg: "bg-red-100",
    icon: "text-red-600"
  },
  emerald: {
    bg: "bg-emerald-100",
    icon: "text-emerald-600"
  },
  amber: {
    bg: "bg-amber-100",
    icon: "text-amber-600"
  },
  indigo: {
    bg: "bg-indigo-100",
    icon: "text-indigo-600"
  },
  primary: {
    bg: "bg-primary-100",
    icon: "text-primary-600"
  }
};

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  iconColor = "primary",
  onClick,
  className,
  ...props
}: QuickActionCardProps) {
  const colors = colorClasses[iconColor];

  return (
    <Card
      className={cn(
        "h-full hover:shadow-md transition-shadow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardContent className="pt-6 text-center">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3",
          colors.bg
        )}>
          <Icon className={cn("w-6 h-6", colors.icon)} />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
