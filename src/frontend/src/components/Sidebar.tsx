import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Brain,
  Building2,
  ChevronRight,
  ClipboardList,
  FileCheck,
  FlaskConical,
  LayoutDashboard,
  Lock,
  Send,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

type UserRole = "researcher" | "hospital" | "patient";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navByRole: Record<UserRole, NavItem[]> = {
  researcher: [
    { label: "Dashboard", path: "/researcher", icon: LayoutDashboard },
    { label: "My Studies", path: "/researcher", icon: FlaskConical },
    { label: "Hospitals", path: "/researcher", icon: Building2 },
    { label: "Requests", path: "/researcher", icon: Send },
    { label: "AI Training", path: "/training", icon: Brain },
    { label: "Results", path: "/results", icon: Activity },
  ],
  hospital: [
    { label: "Dashboard", path: "/hospital", icon: LayoutDashboard },
    { label: "Incoming Requests", path: "/hospital", icon: ClipboardList },
    { label: "My Patients", path: "/hospital", icon: Users },
    { label: "AI Status", path: "/training", icon: Brain },
    { label: "Settings", path: "/hospital", icon: Settings },
  ],
  patient: [
    { label: "Dashboard", path: "/patient", icon: LayoutDashboard },
    { label: "Research Requests", path: "/patient", icon: ClipboardList },
    { label: "My Consents", path: "/patient", icon: FileCheck },
    { label: "Privacy", path: "/patient", icon: Lock },
  ],
};

const roleMeta: Record<
  UserRole,
  { label: string; icon: React.ElementType; color: string }
> = {
  researcher: { label: "Researcher", icon: FlaskConical, color: "#19B6D2" },
  hospital: { label: "Hospital Admin", icon: Building2, color: "#6366f1" },
  patient: { label: "Patient", icon: UserCheck, color: "#19D3A2" },
};

interface SidebarProps {
  userRole: UserRole;
}

export default function Sidebar({ userRole }: SidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const nav = navByRole[userRole];
  const meta = roleMeta[userRole];

  return (
    <aside className="w-60 flex-shrink-0 border-r border-border bg-sidebar flex flex-col">
      <div className="p-4 border-b border-border">
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
          style={{
            backgroundColor: `${meta.color}10`,
            borderColor: `${meta.color}25`,
          }}
        >
          <meta.icon className="w-4 h-4" style={{ color: meta.color }} />
          <div>
            <div className="text-xs text-muted-foreground">Signed in as</div>
            <div
              className="text-sm font-semibold"
              style={{ color: meta.color }}
            >
              {meta.label}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1" data-ocid="sidebar.panel">
        {nav.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              data-ocid="sidebar.link"
            >
              <item.icon
                className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          to="/role-select"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="sidebar.link"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Switch Role
        </Link>
      </div>
    </aside>
  );
}
