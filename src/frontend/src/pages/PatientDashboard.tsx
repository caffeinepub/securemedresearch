import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, FileCheck, Shield, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type ConsentStatus = "pending" | "approved" | "rejected";

type ResearchRequest = {
  id: number;
  studyTitle: string;
  researcher: string;
  institution: string;
  purpose: string;
  dataTypes: string;
  duration: string;
  status: ConsentStatus;
};

const initialRequests: ResearchRequest[] = [
  {
    id: 1,
    studyTitle: "Cardiac Arrhythmia Detection via ECG Patterns",
    researcher: "Dr. Sarah Chen",
    institution: "MIT Medical Lab",
    purpose:
      "Develop AI model to detect irregular heart rhythms with higher accuracy",
    dataTypes: "ECG recordings, heart rate variability",
    duration: "12 months",
    status: "pending",
  },
  {
    id: 2,
    studyTitle: "Early Alzheimer's Biomarker Classification",
    researcher: "Prof. James Wright",
    institution: "Oxford Neuroscience",
    purpose:
      "Identify early-stage cognitive decline markers using MRI and blood tests",
    dataTypes: "MRI scans, blood protein markers",
    duration: "18 months",
    status: "approved",
  },
  {
    id: 3,
    studyTitle: "Diabetic Retinopathy Screening Model",
    researcher: "Dr. Priya Patel",
    institution: "Stanford Health AI",
    purpose: "Screen for diabetic eye disease using retinal photography",
    dataTypes: "Retinal photographs",
    duration: "6 months",
    status: "pending",
  },
];

const statusConfig: Record<ConsentStatus, { label: string; color: string }> = {
  pending: {
    label: "Awaiting Consent",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  approved: {
    label: "Consented",
    color: "bg-accent/10 text-accent border-accent/30",
  },
  rejected: {
    label: "Declined",
    color: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

export default function PatientDashboard() {
  const [requests, setRequests] = useState(initialRequests);

  const updateConsent = (id: number, status: ConsentStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    toast.success(
      status === "approved" ? "Consent granted" : "Request declined",
    );
  };

  const approved = requests.filter((r) => r.status === "approved").length;
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userRole="patient" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Patient Dashboard" />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Total Requests",
                value: requests.length,
                icon: FileCheck,
                color: "#19B6D2",
              },
              {
                label: "Consented",
                value: approved,
                icon: Check,
                color: "#19D3A2",
              },
              {
                label: "Pending Review",
                value: pending,
                icon: Shield,
                color: "#f59e0b",
              },
            ].map((kpi, i) => (
              <div
                key={kpi.label}
                className="card-surface rounded-xl p-4"
                data-ocid={`patient.card.${i + 1}`}
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
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          <div
            className="card-surface rounded-xl p-5"
            style={{ borderColor: "oklch(0.68 0.12 210 / 0.2)" }}
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm mb-1">
                  Your Privacy is Protected
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your medical data never leaves our hospital's systems.
                  Research uses federated learning — only anonymized AI model
                  updates are shared. You can withdraw consent at any time.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-4">
              Research Requests Involving Your Data
            </h2>
            <div className="space-y-4">
              {requests.map((req, i) => (
                <div
                  key={req.id}
                  className="card-surface rounded-xl p-5"
                  data-ocid={`patient.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">
                        {req.studyTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {req.researcher} · {req.institution}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs flex-shrink-0 ${statusConfig[req.status].color}`}
                    >
                      {statusConfig[req.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {req.purpose}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                    <span>
                      <span className="text-foreground font-medium">
                        Data:{" "}
                      </span>
                      {req.dataTypes}
                    </span>
                    <span>
                      <span className="text-foreground font-medium">
                        Duration:{" "}
                      </span>
                      {req.duration}
                    </span>
                  </div>
                  {req.status === "pending" && (
                    <div className="flex gap-3 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        className="bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20"
                        onClick={() => updateConsent(req.id, "approved")}
                        data-ocid={`patient.confirm_button.${i + 1}`}
                      >
                        <Check className="w-3.5 h-3.5 mr-1.5" /> Grant Consent
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={() => updateConsent(req.id, "rejected")}
                        data-ocid={`patient.delete_button.${i + 1}`}
                      >
                        <X className="w-3.5 h-3.5 mr-1.5" /> Decline
                      </Button>
                    </div>
                  )}
                  {req.status === "approved" && (
                    <div className="pt-3 border-t border-border">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs"
                        onClick={() => updateConsent(req.id, "rejected")}
                        data-ocid={`patient.delete_button.${i + 1}`}
                      >
                        Withdraw Consent
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
