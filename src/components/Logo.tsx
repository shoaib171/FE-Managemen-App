
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 transition-all", className)}>
      <CheckCircle className="h-6 w-6 text-sidebar-primary animate-fade-in" />
      {!collapsed && (
        <span className="font-semibold text-xl tracking-tight animate-enter-from-left">
          TaskFlow
        </span>
      )}
    </div>
  );
}
