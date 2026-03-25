import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type UserRole = "researcher" | "hospital" | "patient";

const savedRole =
  (localStorage.getItem("medreach_role") as UserRole) || "researcher";

const completedStudies = [
  {
    id: 1,
    title: "Diabetic Retinopathy Screening Model",
    accuracy: 94.2,
    rounds: 10,
    hospitals: 6,
    date: "2026-03-15",
    improvement: 18.4,
  },
  {
    id: 2,
    title: "Cardiac Arrhythmia Detection",
    accuracy: 91.7,
    rounds: 10,
    hospitals: 4,
    date: "2026-02-28",
    improvement: 14.2,
  },
];

const accuracyData = [62, 68, 73, 78, 82, 85, 87, 90, 92, 94.2];

function AccuracyChart({ data }: { data: number[] }) {
  const width = 600;
  const height = 160;
  const padX = 40;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;
  const minVal = Math.min(...data) - 5;
  const maxVal = 100;
  const range = maxVal - minVal;

  const points = data.map((val, idx) => ({
    x: padX + (idx / (data.length - 1)) * chartW,
    y: padY + chartH - ((val - minVal) / range) * chartH,
    val,
    round: idx + 1,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${padX} ${height - padY} Z`;

  const yAxisVals = [minVal, (minVal + maxVal) / 2, maxVal];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-40"
      aria-label="Accuracy improvement chart over training rounds"
      role="img"
    >
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="oklch(0.68 0.12 210)"
            stopOpacity="0.3"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.68 0.12 210)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padX}
          y1={padY + t * chartH}
          x2={width - padX}
          y2={padY + t * chartH}
          stroke="oklch(0.23 0.03 240)"
          strokeWidth="1"
        />
      ))}
      <path d={areaD} fill="url(#area-grad)" />
      <path
        d={pathD}
        fill="none"
        stroke="oklch(0.68 0.12 210)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p) => (
        <circle
          key={`dot-${p.round}`}
          cx={p.x}
          cy={p.y}
          r={p.round === data.length ? 5 : 3}
          fill="oklch(0.68 0.12 210)"
        />
      ))}
      {points.map((p) => (
        <text
          key={`label-${p.round}`}
          x={p.x}
          y={height - 4}
          textAnchor="middle"
          fill="oklch(0.65 0.025 240)"
          fontSize="10"
        >
          R{p.round}
        </text>
      ))}
      {yAxisVals.map((val) => (
        <text
          key={`yaxis-${Math.round(val)}`}
          x={padX - 6}
          y={padY + chartH - ((val - minVal) / range) * chartH + 4}
          textAnchor="end"
          fill="oklch(0.65 0.025 240)"
          fontSize="9"
        >
          {Math.round(val)}%
        </text>
      ))}
    </svg>
  );
}

export default function ResultsPage() {
  const [downloading, setDownloading] = useState<number | null>(null);

  const handleDownload = (id: number, title: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      toast.success(`Results for "${title}" downloaded`);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userRole={savedRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Results" />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-surface rounded-xl p-6 md:col-span-1 flex flex-col items-center justify-center text-center">
              <div className="text-xs text-muted-foreground mb-2">
                Best Model Accuracy
              </div>
              <div className="text-6xl font-bold text-primary mb-2">94.2%</div>
              <div className="text-xs text-muted-foreground">
                Diabetic Retinopathy Model
              </div>
              <div
                className="flex items-center gap-1 mt-3 text-xs"
                style={{ color: "oklch(0.75 0.14 165)" }}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                +18.4% improvement over baseline
              </div>
            </div>
            <div className="md:col-span-2 card-surface rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-sm">
                  Accuracy Over Training Rounds
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Diabetic Retinopathy — 10 rounds, 6 hospitals
                </p>
              </div>
              <div className="p-4">
                <AccuracyChart data={accuracyData} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Rounds Completed", value: "10", unit: "rounds" },
              { label: "Participating Hospitals", value: "6", unit: "nodes" },
              { label: "Training Time", value: "4.2", unit: "hours" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="card-surface rounded-xl p-4 text-center"
                data-ocid={`results.card.${i + 1}`}
              >
                <div className="text-3xl font-bold text-foreground">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {s.unit}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="card-surface rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Completed Studies</h2>
            </div>
            <div className="divide-y divide-border">
              {completedStudies.map((study, i) => (
                <div
                  key={study.id}
                  className="flex items-center gap-4 p-4"
                  data-ocid={`results.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">
                      {study.title}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{study.rounds} rounds</span>
                      <span>·</span>
                      <span>{study.hospitals} hospitals</span>
                      <span>·</span>
                      <span>Completed {study.date}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 mr-4">
                    <div className="text-xl font-bold text-primary">
                      {study.accuracy}%
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "oklch(0.75 0.14 165)" }}
                    >
                      +{study.improvement}%
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs bg-accent/10 text-accent border-accent/30 flex-shrink-0"
                  >
                    Complete
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border hover:border-primary/40 text-xs flex-shrink-0"
                    disabled={downloading === study.id}
                    onClick={() => handleDownload(study.id, study.title)}
                    data-ocid={`results.secondary_button.${i + 1}`}
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    {downloading === study.id ? "..." : "Download"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
