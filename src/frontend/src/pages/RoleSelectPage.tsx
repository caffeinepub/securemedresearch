import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { Building2, FlaskConical, UserRound } from "lucide-react";

const roles = [
  {
    id: "researcher",
    icon: FlaskConical,
    title: "Researcher",
    desc: "Define studies, discover hospitals, send research requests, and receive AI model results.",
    route: "/researcher",
    color: "#19B6D2",
    highlights: [
      "Create research studies",
      "Send hospital requests",
      "Access AI training results",
    ],
  },
  {
    id: "hospital",
    icon: Building2,
    title: "Hospital Admin",
    desc: "Manage incoming research requests, verify data availability, and oversee patient consent.",
    route: "/hospital",
    color: "#6366f1",
    highlights: [
      "Review research requests",
      "Approve/reject access",
      "Monitor AI training jobs",
    ],
  },
  {
    id: "patient",
    icon: UserRound,
    title: "Patient",
    desc: "View research studies involving your data and grant or revoke consent at any time.",
    route: "/patient",
    color: "#19D3A2",
    highlights: [
      "View research requests",
      "Control your consent",
      "Full privacy dashboard",
    ],
  },
] as const;

export default function RoleSelectPage() {
  const router = useRouter();

  const handleSelect = (role: (typeof roles)[number]) => {
    localStorage.setItem("medreach_role", role.id);
    router.navigate({ to: role.route });
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Select Your Role</h1>
          <p className="text-muted-foreground">
            Choose how you interact with the MedReach platform
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <div
              key={role.id}
              className="card-surface rounded-2xl p-7 hover:border-primary/40 transition-all cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
              data-ocid={`role.item.${i + 1}`}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border transition-all group-hover:scale-110"
                style={{
                  backgroundColor: `${role.color}15`,
                  borderColor: `${role.color}30`,
                  boxShadow: `0 0 20px ${role.color}20`,
                }}
              >
                <role.icon className="w-7 h-7" style={{ color: role.color }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{role.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {role.desc}
              </p>
              <ul className="space-y-2 mb-6">
                {role.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    {h}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                style={{ backgroundColor: role.color, color: "#070B12" }}
                onClick={() => handleSelect(role)}
                data-ocid={`role.primary_button.${i + 1}`}
              >
                Select {role.title}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
