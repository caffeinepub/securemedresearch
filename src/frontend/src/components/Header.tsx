import { Bell, Cross } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : "Guest";

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Cross className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-bold text-base tracking-tight">
            MED<span className="text-primary">REACH</span>
          </span>
        </div>
        {title && (
          <>
            <span className="text-border">|</span>
            <span className="text-sm text-muted-foreground">{title}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="w-9 h-9 rounded-lg border border-border hover:border-primary/40 flex items-center justify-center transition-colors relative"
          data-ocid="header.button"
        >
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card">
          <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40" />
          <span className="text-xs font-mono text-muted-foreground">
            {shortPrincipal}
          </span>
        </div>
      </div>
    </header>
  );
}
