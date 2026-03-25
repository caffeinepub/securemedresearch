import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Brain, Plus, Send, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StudyStatus } from "../backend";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const mockStudies = [
  {
    id: 1n,
    title: "Cardiac Arrhythmia Detection via ECG Patterns",
    status: StudyStatus.active,
    hospitals: 4,
    consents: 238,
    progress: 72,
  },
  {
    id: 2n,
    title: "Early Alzheimer's Biomarker Classification",
    status: StudyStatus.active,
    hospitals: 3,
    consents: 156,
    progress: 45,
  },
  {
    id: 3n,
    title: "Diabetic Retinopathy Screening Model",
    status: StudyStatus.complete,
    hospitals: 6,
    consents: 412,
    progress: 100,
  },
  {
    id: 4n,
    title: "Sepsis Prediction from ICU Vitals",
    status: StudyStatus.draft,
    hospitals: 0,
    consents: 0,
    progress: 0,
  },
];

const mockHospitals = [
  {
    id: 1n,
    name: "St. Mary's Medical Center",
    specialization: "Cardiology",
    location: "London",
    status: "connected",
  },
  {
    id: 2n,
    name: "New York Presbyterian",
    specialization: "Neurology",
    location: "New York",
    status: "connected",
  },
  {
    id: 3n,
    name: "Tokyo University Hospital",
    specialization: "Oncology",
    location: "Tokyo",
    status: "pending",
  },
  {
    id: 4n,
    name: "Singapore General Hospital",
    specialization: "Internal Medicine",
    location: "Singapore",
    status: "available",
  },
];

const statusColor: Record<string, string> = {
  active: "bg-primary/10 text-primary border-primary/30",
  complete: "bg-accent/10 text-accent border-accent/30",
  draft: "bg-muted text-muted-foreground border-border",
};

const kpis = [
  { label: "Active Studies", value: "2", icon: Brain, color: "#19B6D2" },
  { label: "Pending Requests", value: "5", icon: Send, color: "#f59e0b" },
  { label: "Consented Patients", value: "394", icon: Users, color: "#19D3A2" },
  { label: "AI Jobs Running", value: "3", icon: Activity, color: "#ec4899" },
];

export default function ResearcherDashboard() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;
    toast.success("Study created successfully!");
    setOpen(false);
    setTitle("");
    setDescription("");
    setPurpose("");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userRole="researcher" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Researcher Dashboard" />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="card-surface rounded-xl p-4">
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
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          <div className="card-surface rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Research Studies</h2>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground"
                    data-ocid="researcher.open_modal_button"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Create Study
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="bg-card border-border"
                  data-ocid="researcher.dialog"
                >
                  <DialogHeader>
                    <DialogTitle>Create New Study</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div>
                      <Label htmlFor="study-title">Study Title</Label>
                      <Input
                        id="study-title"
                        placeholder="e.g. Cardiac Arrhythmia Detection"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1.5 bg-background border-border"
                        data-ocid="researcher.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="study-desc">Description</Label>
                      <Textarea
                        id="study-desc"
                        placeholder="Describe the research objectives..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1.5 bg-background border-border resize-none"
                        rows={3}
                        data-ocid="researcher.textarea"
                      />
                    </div>
                    <div>
                      <Label htmlFor="study-purpose">Research Purpose</Label>
                      <Input
                        id="study-purpose"
                        placeholder="e.g. Improve early detection accuracy"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="mt-1.5 bg-background border-border"
                        data-ocid="researcher.input"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      data-ocid="researcher.cancel_button"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary text-primary-foreground"
                      onClick={handleCreate}
                      data-ocid="researcher.submit_button"
                    >
                      Create Study
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Table data-ocid="researcher.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">
                    Study Title
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Hospitals
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Consents
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Progress
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudies.map((study, i) => (
                  <TableRow
                    key={String(study.id)}
                    className="border-border"
                    data-ocid={`researcher.row.${i + 1}`}
                  >
                    <TableCell className="font-medium text-sm">
                      {study.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${statusColor[study.status]}`}
                      >
                        {study.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {study.hospitals}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {study.consents}
                    </TableCell>
                    <TableCell className="w-32">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={study.progress}
                          className="h-1.5 flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-8">
                          {study.progress}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="card-surface rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Available Hospitals</h2>
            </div>
            <div className="divide-y divide-border">
              {mockHospitals.map((h, i) => (
                <div
                  key={String(h.id)}
                  className="flex items-center justify-between p-4"
                  data-ocid={`hospital.item.${i + 1}`}
                >
                  <div>
                    <div className="font-medium text-sm">{h.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {h.specialization} · {h.location}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary/40 text-primary hover:bg-primary/10 text-xs"
                    onClick={() => toast.success(`Request sent to ${h.name}`)}
                    data-ocid={`hospital.primary_button.${i + 1}`}
                  >
                    <Send className="w-3 h-3 mr-1.5" /> Send Request
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
