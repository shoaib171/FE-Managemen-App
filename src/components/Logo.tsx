
import { CheckCircle } from "lucide-react";

interface LogoProps {
  collapsed?: boolean;
}

export function Logo({ collapsed = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2 transition-all">
      <CheckCircle className="h-6 w-6 text-sidebar-primary animate-fade-in" />
      {!collapsed && (
        <span className="font-semibold text-xl tracking-tight animate-enter-from-left">
          TaskFlow
        </span>
      )}
    </div>
  );
}
