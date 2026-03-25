import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import {
  Brain,
  Building2,
  ChevronRight,
  FlaskConical,
  Lock,
  Network,
  Shield,
  UserCheck,
} from "lucide-react";

const flowSteps = [
  {
    icon: FlaskConical,
    label: "Researcher",
    desc: "Defines study & sends request",
    color: "#19B6D2",
  },
  {
    icon: Building2,
    label: "Hospital",
    desc: "Reviews & approves access",
    color: "#6366f1",
  },
  {
    icon: UserCheck,
    label: "Patient",
    desc: "Gives informed consent",
    color: "#19D3A2",
  },
  {
    icon: Network,
    label: "Federated Learning",
    desc: "AI trains locally, never moves data",
    color: "#f59e0b",
  },
  {
    icon: Brain,
    label: "AI Model",
    desc: "Model updates aggregated securely",
    color: "#ec4899",
  },
  {
    icon: Shield,
    label: "Results",
    desc: "Researcher receives insights",
    color: "#19B6D2",
  },
];

const features = [
  {
    icon: Lock,
    title: "Zero Data Exposure",
    desc: "Raw patient data never leaves the hospital. Only model gradients are shared.",
  },
  {
    icon: Network,
    title: "Federated Learning",
    desc: "Distributed AI training across multiple hospital nodes without centralizing data.",
  },
  {
    icon: Shield,
    title: "Patient Consent",
    desc: "Every research request requires explicit patient approval before any computation begins.",
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen gradient-mesh">
      <header className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="text-primary text-sm font-bold">M</span>
            </div>
            <span className="font-bold text-lg tracking-tight">
              MED<span className="text-primary">REACH</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#flow" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
          </nav>
          <Button
            size="sm"
            onClick={() => router.navigate({ to: "/login" })}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="home.primary_button"
          >
            Get Started
          </Button>
        </div>
      </header>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Federated Learning · Privacy-First · Decentralized
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6">
            Secure Medical Research
            <br />
            <span className="text-primary text-glow-cyan">
              via Federated Learning
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Enable breakthrough medical AI research while keeping patient data
            completely private. Hospitals train models locally — only insights
            are shared, never raw data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.navigate({ to: "/login" })}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan px-8"
              data-ocid="home.primary_button"
            >
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("flow")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-border hover:border-primary/50"
              data-ocid="home.secondary_button"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section id="flow" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">System Flow</h2>
          <p className="text-muted-foreground text-center mb-14">
            From research request to AI insights — completely secure
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {flowSteps.map((step, i) => (
              <div
                key={step.label}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="flex flex-col items-center text-center w-36">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 border"
                    style={{
                      backgroundColor: `${step.color}15`,
                      borderColor: `${step.color}30`,
                      boxShadow: `0 0 20px ${step.color}20`,
                    }}
                  >
                    <step.icon
                      className="w-7 h-7"
                      style={{ color: step.color }}
                    />
                  </div>
                  <span className="font-semibold text-sm mb-1">
                    {step.label}
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    {step.desc}
                  </span>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-4 my-2 md:my-0">
                    <ChevronRight className="w-5 h-5 text-muted-foreground rotate-90 md:rotate-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">
            Why MedReach?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-surface rounded-xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="text-primary hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
