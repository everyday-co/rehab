import { cn } from "@/lib/utils";

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md";
  rounded?: "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

const shadowMap = {
  none: "",
  sm: "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_6px_20px_rgba(0,0,0,0.04)]",
  md: "shadow-[0_4px_12px_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.06)]",
};

const radiusMap = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
};

export function Surface({
  className,
  padding = "md",
  shadow = "sm",
  rounded = "md",
  ...props
}: SurfaceProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border/80",
        paddingMap[padding],
        shadowMap[shadow],
        radiusMap[rounded],
        "transition-shadow duration-150 ease-out",
        "hover:shadow-[0_6px_16px_rgba(0,0,0,0.08),0_16px_36px_rgba(0,0,0,0.06)]",
        className
      )}
      {...props}
    />
  );
}

