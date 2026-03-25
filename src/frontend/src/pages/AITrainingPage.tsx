import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { JobStatus } from "../backend.d";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type UserRole = "researcher" | "hospital" | "patient";

type Job = {
  id: number;
  studyName: string;
  status: JobStatus;
  round: number;
  totalRounds: number;
  progress: number;
  hospitals: string[];
};

const initialJobs: Job[] = [
  {
    id: 1,
    studyName: "Cardiac Arrhythmia Detection",
    status: JobStatus.training,
    round: 7,
    totalRounds: 10,
    progress: 72,
    hospitals: ["London", "New York", "Berlin"],
  },
  {
    id: 2,
    studyName: "Alzheimer's Biomarker Study",
    status: JobStatus.training,
    round: 4,
    totalRounds: 10,
    progress: 45,
    hospitals: ["Tokyo", "Singapore", "Sydney"],
  },
  {
    id: 3,
    studyName: "Diabetic Retinopathy Screening",
    status: JobStatus.complete,
    round: 10,
    totalRounds: 10,
    progress: 100,
    hospitals: ["London", "New York", "Tokyo", "Singapore", "Sydney", "Berlin"],
  },
  {
    id: 4,
    studyName: "Sepsis Prediction from ICU Vitals",
    status: JobStatus.pending,
    round: 0,
    totalRounds: 10,
    progress: 0,
    hospitals: [],
  },
];

const hospitalNodes = [
  { id: "london", label: "London", x: 480, y: 110 },
  { id: "new-york", label: "New York", x: 200, y: 140 },
  { id: "tokyo", label: "Tokyo", x: 780, y: 145 },
  { id: "singapore", label: "Singapore", x: 740, y: 230 },
  { id: "sydney", label: "Sydney", x: 820, y: 300 },
  { id: "berlin", label: "Berlin", x: 510, y: 105 },
];

const statusConfig: Record<
  JobStatus,
  { label: string; color: string; bg: string }
> = {
  [JobStatus.pending]: {
    label: "Pending",
    color: "#9AAAC0",
    bg: "bg-muted/50 text-muted-foreground border-border",
  },
  [JobStatus.training]: {
    label: "Training",
    color: "#19B6D2",
    bg: "bg-primary/10 text-primary border-primary/30",
  },
  [JobStatus.complete]: {
    label: "Complete",
    color: "#19D3A2",
    bg: "bg-accent/10 text-accent border-accent/30",
  },
};

function getArcPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 40;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

const savedRole =
  (localStorage.getItem("medreach_role") as UserRole) || "researcher";

export default function AITrainingPage() {
  const [jobs, setJobs] = useState(initialJobs);

  useEffect(() => {
    const id = setInterval(() => {
      setJobs((prev) =>
        prev.map((job) => {
          if (job.status !== JobStatus.training) return job;
          const newProgress = Math.min(100, job.progress + Math.random() * 2);
          const newRound = Math.floor((newProgress / 100) * job.totalRounds);
          const newStatus =
            newProgress >= 100 ? JobStatus.complete : JobStatus.training;
          return {
            ...job,
            progress: Math.round(newProgress),
            round: newRound,
            status: newStatus,
          };
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const activeJobHospitalIds = new Set(
    jobs
      .filter((j) => j.status === JobStatus.training)
      .flatMap((j) =>
        j.hospitals.map((h) => h.toLowerCase().replace(" ", "-")),
      ),
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userRole={savedRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="AI Training" />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <div className="card-surface rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Federated Learning Network</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hospital nodes training locally — only model updates shared
              </p>
            </div>
            <div className="relative bg-background/50 p-4">
              <svg
                viewBox="0 0 1000 400"
                className="w-full h-56"
                style={{ background: "oklch(0.12 0.025 240)" }}
                aria-label="Federated learning network map showing hospital nodes"
                role="img"
              >
                <path
                  d="M 120 80 L 280 70 L 310 90 L 320 160 L 290 200 L 240 210 L 200 190 L 160 160 L 120 130 Z"
                  fill="oklch(0.23 0.03 240)"
                />
                <path
                  d="M 220 220 L 280 215 L 300 250 L 290 310 L 260 340 L 230 330 L 210 290 L 205 250 Z"
                  fill="oklch(0.23 0.03 240)"
                />
                <path
                  d="M 440 60 L 560 55 L 575 90 L 560 110 L 520 120 L 470 115 L 445 95 Z"
                  fill="oklch(0.23 0.03 240)"
                />
                <path
                  d="M 460 130 L 560 125 L 580 170 L 570 240 L 540 280 L 500 285 L 470 250 L 455 190 Z"
                  fill="oklch(0.23 0.03 240)"
                />
                <path
                  d="M 570 50 L 840 45 L 870 100 L 860 160 L 800 180 L 720 185 L 640 170 L 580 140 L 565 100 Z"
                  fill="oklch(0.23 0.03 240)"
                />
                <path
                  d="M 770 265 L 870 260 L 890 300 L 875 330 L 820 340 L 775 320 L 760 295 Z"
                  fill="oklch(0.23 0.03 240)"
                />

                {hospitalNodes.flatMap((nodeA, i) =>
                  hospitalNodes.slice(i + 1).map((nodeB) => {
                    const aActive = activeJobHospitalIds.has(nodeA.id);
                    const bActive = activeJobHospitalIds.has(nodeB.id);
                    if (!aActive || !bActive) return null;
                    return (
                      <path
                        key={`arc-${nodeA.id}-${nodeB.id}`}
                        d={getArcPath(nodeA.x, nodeA.y, nodeB.x, nodeB.y)}
                        fill="none"
                        stroke="oklch(0.68 0.12 210)"
                        strokeWidth="1.5"
                        className="animate-flow"
                      />
                    );
                  }),
                )}

                {hospitalNodes.map((node) => {
                  const isActive = activeJobHospitalIds.has(node.id);
                  return (
                    <g key={node.id}>
                      {isActive && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="12"
                          fill="oklch(0.68 0.12 210 / 0.1)"
                          className="pulse-dot"
                        />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isActive ? 5 : 4}
                        fill={
                          isActive
                            ? "oklch(0.68 0.12 210)"
                            : "oklch(0.23 0.03 240)"
                        }
                        stroke={
                          isActive
                            ? "oklch(0.68 0.12 210 / 0.5)"
                            : "oklch(0.35 0.04 240)"
                        }
                        strokeWidth="2"
                        className={isActive ? "pulse-dot" : ""}
                      />
                      <text
                        x={node.x}
                        y={node.y + 16}
                        textAnchor="middle"
                        fill="oklch(0.65 0.025 240)"
                        fontSize="9"
                        fontFamily="Plus Jakarta Sans"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="flex items-center gap-4 mt-3 px-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  Active Node
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary border border-border" />
                  Idle Node
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-4">Training Jobs</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map((job, i) => (
                <div
                  key={job.id}
                  className="card-surface rounded-xl p-5"
                  data-ocid={`training.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-sm">{job.studyName}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {job.hospitals.length > 0
                          ? job.hospitals.join(", ")
                          : "No hospitals assigned"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${statusConfig[job.status].bg}`}
                    >
                      {statusConfig[job.status].label}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Round Progress
                      </span>
                      <span className="font-mono text-foreground">
                        Round {job.round}/{job.totalRounds}
                      </span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {job.hospitals.length} hospital
                        {job.hospitals.length !== 1 ? "s" : ""} participating
                      </span>
                      <span
                        className="font-mono"
                        style={{ color: statusConfig[job.status].color }}
                      >
                        {job.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
