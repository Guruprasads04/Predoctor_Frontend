import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Activity,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockRiskTrend,
  riskBadgeClasses,
  statusBadgeClasses,
} from "@/lib/mockData";
import { useDataset } from "@/services/DatasetContext";
import {
  useUploadEhr,
  usePatients,
  useRunPrediction,
  useRiskTrend,
  useFeatureImportance,
} from "@/services";
import type { PatientSummary } from "@/services/types";

const cardCls = "glass-strong glow-border rounded-2xl p-5 md:p-6 shadow-card";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};

const Dashboard = () => {
  const [params] = useSearchParams();
  const initialId = params.get("patientId");
  
  const { datasetId, setDatasetId } = useDataset();
  const { data: patients = [], loading: patientsLoading } = usePatients(datasetId);
  const { uploadEhr, loading: uploading } = useUploadEhr();
  const { runPrediction, loading: predicting } = useRunPrediction();
  
  const [selectedId, setSelectedId] = useState<string>(initialId ?? "");
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");
  const [hasPrediction, setHasPrediction] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Set initial patient when patients load
  useMemo(() => {
    if (patients && patients.length > 0 && !selectedId) {
      setSelectedId(patients[0].id);
    }
  }, [patients, selectedId]);

  const selected: PatientSummary | undefined = useMemo(
    () => patients ? patients.find((p) => p.id === selectedId) : undefined,
    [patients, selectedId],
  );

  const { data: trendData = [] } = useRiskTrend(selectedId, datasetId);
  const { data: featureImportance = [] } = useFeatureImportance(selectedId, datasetId);

  // Fallback to mock data if API not available
  const displayTrendData = trendData.length > 0 ? trendData : selected ? mockRiskTrend(selected.riskScore) : [];
  const displayFeatureData = featureImportance.length > 0 ? featureImportance : [];

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setUploadState("error");
      setUploadError("Only CSV files are supported.");
      return;
    }
    setFileName(file.name);
    setUploadError("");
    setUploadState("uploading");
    
    try {
      const result = await uploadEhr(file);
      setDatasetId(result.dataset_id);
      setUploadState("success");
    } catch (error) {
      setUploadState("error");
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const handleRunPrediction = async () => {
    if (!selectedId || !datasetId) {
      alert("Please select a patient and upload a dataset first");
      return;
    }

    try {
      await runPrediction(selectedId, datasetId);
      setHasPrediction(true);
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  const riskBand =
    selected && selected.riskScore >= 0.75 ? "High" : selected && selected.riskScore >= 0.5 ? "Medium" : "Low";
  
  const trendDelta = displayTrendData.length > 0 ? displayTrendData[displayTrendData.length - 1].score - displayTrendData[0].score : 0;
  const trendKind =
    trendDelta > 0.4 ? "sharp-rise" : trendDelta > 0.15 ? "rise" : trendDelta < -0.1 ? "fall" : "stable";
  const TrendIcon =
    trendKind === "sharp-rise" || trendKind === "rise"
      ? TrendingUp
      : trendKind === "fall"
      ? TrendingDown
      : Minus;

  const trendStats = useMemo(() => {
    const scores = displayTrendData.map((d) => d.score);
    if (scores.length === 0) return { avg: 0, peak: 0, trough: 0, aboveCrit: 0 };
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const peak = Math.max(...scores);
    const trough = Math.min(...scores);
    const aboveCrit = (scores.filter((s) => s >= 0.75).length / scores.length) * 100;
    return { avg, peak, trough, aboveCrit };
  }, [displayTrendData]);

  const recommendations =
    riskBand === "High"
      ? [
          "Immediate sepsis bundle: lactate, blood cultures, broad-spectrum antibiotics within 1h.",
          "Aggressive IV fluid resuscitation (30 mL/kg crystalloid) and reassess.",
          "Escalate to ICU senior and consider vasopressor support.",
        ]
      : riskBand === "Medium"
      ? [
          "Repeat vitals every 30 minutes; trend lactate within 2 hours.",
          "Review antibiotic coverage and source control.",
          "Set early-warning threshold alarms on monitor.",
        ]
      : [
          "Continue routine monitoring on current schedule.",
          "Trend WBC and temperature on next labs.",
          "Reassess if any vital crosses warning band.",
        ];

  return (
    <DashLayout title="Clinician Dashboard" subtitle="Upload data, select a patient, and run a 6-hour sepsis risk prediction.">
      <div className="space-y-4">
        <div className={`${cardCls} p-8 text-center`}>
          <h2 className="text-2xl font-display mb-4">Dashboard Loading...</h2>
          <p className="text-muted-foreground mb-6">Upload a CSV file to get started</p>
        </div>
      </div>
    </DashLayout>
  );
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-semibold">Upload EHR Data</h2>
              <p className="text-xs text-muted-foreground mt-0.5">CSV file · multipart upload</p>
            </div>
            {uploadState === "success" && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan">
                <CheckCircle2 className="h-3.5 w-3.5" /> Imported
              </span>
            )}
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            onClick={() => fileRef.current?.click()}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-8 text-center ${
              dragOver
                ? "border-primary-glow bg-primary/10"
                : "border-border/60 bg-secondary/30 hover:bg-secondary/50"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow mb-3">
              {uploadState === "uploading" ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : uploadState === "success" ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
            </div>
            <p className="text-sm font-medium">
              {uploadState === "success"
                ? fileName
                : uploadState === "uploading"
                ? "Uploading & processing…"
                : "Drag & drop CSV or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {uploadState === "success"
                ? "125 records imported · dataset_abc123"
                : "Schema: timestamped vitals + labs per patient"}
            </p>
            {uploadState === "error" && (
              <p className="text-xs text-destructive mt-2 inline-flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {uploadError}
              </p>
            )}
          </div>
        </div>

        {/* Patient selector */}
        <div className={cardCls}>
          <h2 className="font-display text-lg font-semibold mb-4">Patient Selection</h2>
          
          {!datasetId ? (
            <div className="text-sm text-muted-foreground text-center py-6">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Upload a dataset first to see patients</p>
            </div>
          ) : patientsLoading ? (
            <div className="text-center py-6">
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            </div>
          ) : (
            <>
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="bg-secondary/40 border-border/60 h-11">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.id} · {p.gender} · {p.age}y
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selected && (
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <Stat label="Patient ID" value={selected.id} mono />
                  <Stat label="Age" value={`${selected.age}y`} />
                  <Stat label="Gender" value={selected.gender} />
                  <Stat label="ICU Stay" value={`${selected.icuStay}d`} />
                </div>
              )}
            </>
          )}

          <Button
            onClick={handleRunPrediction}
            disabled={predicting || !selected}
            className="w-full mt-4 bg-gradient-primary hover:shadow-glow-strong transition-all"
          >
            {predicting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" /> Run Prediction
              </>
            )}
          </Button>
        </div>
      </div>

      {!hasPrediction && !predicting && datasetId && (
        <div className={`${cardCls} mb-5 text-center`}>
          <p className="text-muted-foreground text-sm">Click "Run Prediction" to generate a risk score.</p>
        </div>
      )}

      {/* Charts row */}
      {hasPrediction && selected && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
          {/* Risk trend */}
          <div className={`${cardCls} lg:col-span-3`}>
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <h3 className="font-display text-base font-semibold">Sepsis Risk Trend</h3>
                <p className="text-xs text-muted-foreground">6-hour horizon · live</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-display font-semibold text-gradient-brand">
                  {selected.riskScore.toFixed(2)}
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md border ${riskBadgeClasses(
                    selected.riskLevel,
                  )}`}
                >
                  <TrendIcon className="h-3 w-3" /> {selected.riskLevel}
                </span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lg" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
                      <stop offset="100%" stopColor="hsl(var(--accent-glow))" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="3 4" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis domain={[0, 1]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="url(#lg)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "hsl(var(--primary-glow))" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Feature importance */}
          <div className={`${cardCls} lg:col-span-2`}>
            <h3 className="font-display text-base font-semibold mb-1">Feature Importance</h3>
            <p className="text-xs text-muted-foreground mb-3">Top 5 contributing signals</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayFeatureData.length > 0 ? displayFeatureData : []
} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <defs>
                    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="3 4" horizontal={false} />
                  <XAxis type="number" domain={[0, 0.35]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis type="category" dataKey="feature" stroke="hsl(var(--muted-foreground))" fontSize={11} width={90} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="importance" fill="url(#bg)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* AI Clinical Insights */}
      {hasPrediction && (
        <div className={cardCls}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">AI Clinical Insights</h3>
              <p className="text-xs text-muted-foreground">Explainable reasoning for {selected.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightBlock title="Prediction Summary" defaultOpen>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-2 py-1 rounded-md text-xs border font-medium ${riskBadgeClasses(
                    selected.riskLevel,
                  )}`}
                >
                  {riskBand} band
                </span>
                <span className="text-2xl font-display font-semibold text-gradient-brand">
                  {(selected.riskScore * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Predicted probability of sepsis onset within the next 6 hours, derived from time-series vitals
                and labs.
              </p>
            </InsightBlock>

            <InsightBlock title="Trend Analysis" defaultOpen>
              <div className="flex items-center gap-2 mb-2 text-sm">
                <TrendIcon className="h-4 w-4 text-primary-glow" />
                <span className="font-medium capitalize">{trendKind.replace("-", " ")}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <Mini label="avg" value={trendStats.avg.toFixed(2)} />
                <Mini label="peak" value={trendStats.peak.toFixed(2)} />
                <Mini label="trough" value={trendStats.trough.toFixed(2)} />
                <Mini label=">crit %" value={`${trendStats.aboveCrit.toFixed(0)}%`} />
              </div>
            </InsightBlock>

            <InsightBlock title="Top Feature Contributions" defaultOpen>
              <ul className="space-y-2 text-sm">
                {(displayFeatureData.length > 0 ? displayFeatureData : []).slice(0, 3).map((f) => (
                  <li key={f.feature} className="flex items-center justify-between gap-3">
                    <span>{f.feature}</span>
                    <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                      <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${(f.importance / 0.35) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground w-10 text-right">
                        {f.importance.toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </InsightBlock>

            <InsightBlock title="Clinical Recommendations" defaultOpen>
              <ul className="space-y-2 text-sm">
                {recommendations.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <Activity className="h-4 w-4 mt-0.5 text-primary-glow shrink-0" />
                    <span className="text-muted-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            </InsightBlock>
          </div>
        </div>
      )}
    </DashLayout>
  );
};

const Stat = ({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) => (
  <div className="rounded-lg bg-secondary/40 border border-border/60 px-3 py-2">
    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
    <div className={`text-sm font-medium mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</div>
  </div>
);

const Mini = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between rounded-md bg-secondary/40 border border-border/60 px-2 py-1.5">
    <span className="text-muted-foreground">{label}</span>
    <span>{value}</span>
  </div>
);

const InsightBlock = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl bg-secondary/30 border border-border/60 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-secondary/50 transition-colors"
      >
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

export default Dashboard;
