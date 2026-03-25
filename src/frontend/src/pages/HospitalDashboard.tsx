import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Brain, Check, Clock, Shield, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RequestStatus } from "../backend";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const kpis = [
  { label: "Pending Requests", value: "4", icon: Clock, color: "#f59e0b" },
  { label: "Approved", value: "12", icon: Check, color: "#19D3A2" },
  { label: "Patient Consents", value: "238", icon: Shield, color: "#19B6D2" },
  { label: "Active Training", value: "2", icon: Brain, color: "#ec4899" },
];

type RequestItem = {
  id: number;
  studyTitle: string;
  researcher: string;
  institution: string;
  dataTypes: string;
  date: string;
  status: RequestStatus;
};

const initialRequests: RequestItem[] = [
  {
    id: 1,
    studyTitle: "Cardiac Arrhythmia Detection",
    researcher: "Dr. Sarah Chen",
    institution: "MIT Medical Lab",
    dataTypes: "ECG, Vitals",
    date: "2026-03-20",
    status: RequestStatus.pending,
  },
  {
    id: 2,
    studyTitle: "Alzheimer's Biomarker Study",
    researcher: "Prof. James Wright",
    institution: "Oxford Neuroscience",
    dataTypes: "MRI, Blood markers",
    date: "2026-03-18",
    status: RequestStatus.pending,
  },
  {
    id: 3,
    studyTitle: "Diabetic Retinopathy AI",
    researcher: "Dr. Priya Patel",
    institution: "Stanford Health AI",
    dataTypes: "Retinal scans",
    date: "2026-03-10",
    status: RequestStatus.approved,
  },
  {
    id: 4,
    studyTitle: "ICU Sepsis Prediction",
    researcher: "Dr. Lucas Müller",
    institution: "Berlin Charité",
    dataTypes: "ICU vitals, Labs",
    date: "2026-03-05",
    status: RequestStatus.rejected,
  },
];

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  approved: "bg-primary/10 text-primary border-primary/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function HospitalDashboard() {
  const [requests, setRequests] = useState(initialRequests);

  const updateStatus = (id: number, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    toast.success(
      `Request ${status === RequestStatus.approved ? "approved" : "rejected"}`,
    );
  };

  const pendingCount = requests.filter(
    (r) => r.status === RequestStatus.pending,
  ).length;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userRole="hospital" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Hospital Dashboard" />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
              <div
                key={kpi.label}
                className="card-surface rounded-xl p-4"
                data-ocid={`hospital.card.${i + 1}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">
                    {kpi.label}
                  </span>
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: kpi.color }}
                >
                  {kpi.label === "Pending Requests" ? pendingCount : kpi.value}
                </div>
              </div>
            ))}
          </div>

          <div className="card-surface rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Incoming Research Requests</h2>
              <Badge
                variant="outline"
                className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/30"
              >
                {pendingCount} Pending
              </Badge>
            </div>
            <Table data-ocid="hospital.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Study</TableHead>
                  <TableHead className="text-muted-foreground">
                    Researcher
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Data Types
                  </TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req, i) => (
                  <TableRow
                    key={req.id}
                    className="border-border"
                    data-ocid={`hospital.row.${i + 1}`}
                  >
                    <TableCell>
                      <div className="font-medium text-sm">
                        {req.studyTitle}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {req.institution}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {req.researcher}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {req.dataTypes}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {req.date}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusColor[req.status]}`}
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {req.status === RequestStatus.pending && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-7 px-2.5 bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 text-xs"
                            onClick={() =>
                              updateStatus(req.id, RequestStatus.approved)
                            }
                            data-ocid={`hospital.confirm_button.${i + 1}`}
                          >
                            <Check className="w-3 h-3 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2.5 border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
                            onClick={() =>
                              updateStatus(req.id, RequestStatus.rejected)
                            }
                            data-ocid={`hospital.delete_button.${i + 1}`}
                          >
                            <X className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="card-surface rounded-xl p-5">
            <h2 className="font-semibold mb-4">Patient Consent Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Consents", value: 238, color: "#19B6D2" },
                { label: "Active", value: 201, color: "#19D3A2" },
                { label: "Withdrawn", value: 37, color: "#f59e0b" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center p-4 rounded-lg border border-border"
                >
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-xl p-5">
            <h2 className="font-semibold mb-4">Active AI Training Jobs</h2>
            <div className="space-y-3">
              {[
                {
                  name: "Cardiac Arrhythmia Detection",
                  round: 7,
                  total: 10,
                  progress: 72,
                },
                {
                  name: "Alzheimer's Biomarker Study",
                  round: 4,
                  total: 10,
                  progress: 45,
                },
              ].map((job, i) => (
                <div
                  key={job.name}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border"
                  data-ocid={`hospital.item.${i + 1}`}
                >
                  <Activity className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {job.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Round {job.round}/{job.total}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-32">
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {job.progress}%
                    </span>
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
