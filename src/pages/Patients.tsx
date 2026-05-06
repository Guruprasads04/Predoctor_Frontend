import { useMemo, useState } from "react";
import { Search, Users, AlertCircle, Download, Loader2 } from "lucide-react";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { riskBadgeClasses, statusBadgeClasses, type RiskLevel } from "@/lib/mockData";
import { useDataset } from "@/services/DatasetContext";
import { usePredictionHistory } from "@/services/PredictionContext";
import { usePatients, useDownloadReport } from "@/services";
import type { PatientSummary } from "@/services/types";

const cardCls = "glass-strong glow-border rounded-2xl p-5 shadow-card";

const Patients = () => {
  const { datasetId } = useDataset();
  const { recentPredictedIds } = usePredictionHistory();
  const { data: patients = [], loading, error } = usePatients(datasetId);
  const { downloadReport } = useDownloadReport();
  
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState<"All" | RiskLevel>("All");
  const [downloading, setDownloading] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!patients || patients.length === 0) return [];
    const recentSet = new Set(recentPredictedIds);
    return (patients as PatientSummary[])
      .filter((p) => recentSet.has(p.id))
      .filter((p) => {
      const q = query.toLowerCase();
      const matchesQ = !q || p.id.toLowerCase().includes(q);
      const matchesR = risk === "All" || p.riskLevel === risk;
      return matchesQ && matchesR;
      });
  }, [patients, query, recentPredictedIds, risk]);

  const counts = useMemo(() => {
    const recentSet = new Set(recentPredictedIds);
    const patientList = (patients || []).filter((patient) => recentSet.has(patient.id));
    return {
      predicted: patientList.length,
      critical: patientList.filter((p) => p.riskLevel === "High").length,
      medium: patientList.filter((p) => p.riskLevel === "Medium").length,
    };
  }, [patients, recentPredictedIds]);

  const handleDownload = async (id: string) => {
    if (!datasetId) {
      window.alert("Please upload a dataset first");
      return;
    }
    
    setDownloading(id);
    try {
      const url = await downloadReport(id, datasetId);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Failed to download report:", err);
      window.alert("Failed to download report. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  if (!datasetId) {
    return (
      <DashLayout title="Patients" subtitle="Search, filter, and review predicted ICU patients.">
        <div className={`${cardCls} text-center py-12`}>
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please upload a dataset first to view patients.</p>
        </div>
      </DashLayout>
    );
  }

  return (
    <DashLayout title="Patients" subtitle="Search, filter, and review predicted ICU patients.">
      {error && (
        <div className="mb-6 p-4 bg-destructive/15 border border-destructive/30 rounded-lg text-destructive">
          Error loading patients: {error.message}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard icon={Users} label="Predicted Patients" value={counts.predicted} accent="primary" />
        <SummaryCard icon={AlertCircle} label="High Risk" value={counts.critical} accent="destructive" />
        <SummaryCard icon={AlertCircle} label="Medium Risk" value={counts.medium} accent="accent" />
      </div>

      {/* Controls */}
      <div className={`${cardCls} mb-5`}>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Patient ID"
              className="pl-9 bg-secondary/40 border-border/60 h-11"
            />
          </div>
          <Select value={risk} onValueChange={(v) => setRisk(v as never)}>
            <SelectTrigger className="md:w-56 bg-secondary/40 border-border/60 h-11">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Risk Levels</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className={`${cardCls} overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Latest Prediction</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="border-border/60 hover:bg-secondary/30">
                    <TableCell className="font-mono text-primary-glow">{p.id}</TableCell>
                    <TableCell className="text-muted-foreground">6-hour sepsis risk</TableCell>
                    <TableCell className="font-mono">{p.riskScore.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-md text-xs border ${riskBadgeClasses(p.riskLevel)}`}>
                        {p.riskLevel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-md text-xs border ${statusBadgeClasses(p.status)}`}>
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(p.id)}
                        disabled={downloading === p.id}
                        className="border-border/60 hover:border-primary/50 hover:bg-primary/10"
                      >
                        {downloading === p.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                        <span className="ml-1.5">Report</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                      {recentPredictedIds.length === 0
                        ? 'No recent predictions yet. Run a prediction from the Dashboard first.'
                        : "No predicted patients match your filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashLayout>
  );
};

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent: "primary" | "destructive" | "accent";
}) => {
  const accentMap = {
    primary: "bg-primary/15 text-primary-glow border-primary/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
    accent: "bg-accent/15 text-accent-glow border-accent/30",
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="text-3xl font-display font-semibold mt-1.5">{value}</div>
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${accentMap[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default Patients;
