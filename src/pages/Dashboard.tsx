import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
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
import { mockRiskTrend, riskBadgeClasses } from "@/lib/mockData";
import { useDataset } from "@/services/DatasetContext";
import { usePredictionHistory } from "@/services/PredictionContext";
import {
  useUploadEhr,
  usePatients,
  useRunPrediction,
  useRiskTrend,
  useFeatureImportance,
} from "@/services";

const cardCls = "glass-strong glow-border rounded-2xl p-5 md:p-6 shadow-card";
type PatientSnapshot = Record<string, string>;

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};

export default function Dashboard() {
  const { datasetId, setDatasetId } = useDataset();
  const { markPredicted, clearPredictions } = usePredictionHistory();
  const { data: patientsData, loading: patientsLoading } = usePatients(datasetId);
  const { uploadEhr, loading: uploading } = useUploadEhr();
  const {
    data: predictionData,
    runPrediction,
    loading: predicting,
  } = useRunPrediction();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [hasPrediction, setHasPrediction] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [patientSnapshots, setPatientSnapshots] = useState<Record<string, PatientSnapshot>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const patients = Array.isArray(patientsData) ? patientsData : [];

  useEffect(() => {
    if (!selectedId && patients.length > 0) {
      setSelectedId(patients[0].id);
    }
  }, [patients, selectedId]);

  useEffect(() => {
    setHasPrediction(false);
  }, [selectedId, datasetId]);

  const selected = useMemo(() => {
    if (patients.length === 0) return null;
    return patients.find((patient) => patient.id === selectedId) ?? patients[0];
  }, [patients, selectedId]);

  const { data: riskTrendRaw } = useRiskTrend(selectedId, datasetId);
  const { data: featureRaw } = useFeatureImportance(selectedId, datasetId);

  const liveTrendData = Array.isArray(riskTrendRaw) ? riskTrendRaw : [];
  const liveFeatureData = Array.isArray(featureRaw) ? featureRaw : [];

  const displayRiskScore =
    hasPrediction && predictionData?.patientId === selectedId
      ? predictionData.riskScore
      : selected?.riskScore ?? 0;

  const displayRiskLabel = useMemo(() => {
    if (hasPrediction && predictionData?.patientId === selectedId) {
      const normalized = predictionData.riskLabel.toLowerCase();
      if (normalized.includes("high")) return "High";
      if (normalized.includes("medium")) return "Medium";
      if (normalized.includes("critical")) return "High";
      return "Low";
    }

    return selected?.riskLevel ?? "Low";
  }, [hasPrediction, predictionData, selected, selectedId]);

  const displayTrendData = useMemo(() => {
    if (liveTrendData.length > 0) return liveTrendData;
    if (selected) return mockRiskTrend(displayRiskScore);
    return [];
  }, [displayRiskScore, liveTrendData, selected]);

  const displayFeatureData = useMemo(() => {
    return liveFeatureData.slice(0, 5);
  }, [liveFeatureData]);

  const selectedSnapshot = selectedId ? patientSnapshots[selectedId] ?? null : null;

  const featureItems = useMemo(() => {
    return displayFeatureData.map((feature) => ({
      ...feature,
      displayLabel: formatFeatureLabel(feature.feature),
      patientValue: getPatientFeatureValue(feature.feature, selectedSnapshot),
    }));
  }, [displayFeatureData, selectedSnapshot]);

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
    setHasPrediction(false);
    clearPredictions();

    try {
      const snapshots = await parsePatientSnapshots(file);
      const result = await uploadEhr(file);
      setPatientSnapshots(snapshots);
      setUploadState("success");
      if (result.dataset_id) {
        setDatasetId(result.dataset_id);
      }
    } catch (error) {
      setUploadState("error");
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const handleRunPrediction = async () => {
    if (!selectedId || !datasetId) return;

    try {
      await runPrediction(selectedId, datasetId);
      markPredicted(selectedId);
      setHasPrediction(true);
    } catch (error) {
      console.error("Prediction failed:", error);
    }
  };

  const trendDelta =
    displayTrendData.length > 1
      ? displayTrendData[displayTrendData.length - 1].score - displayTrendData[0].score
      : 0;

  const trendKind =
    trendDelta > 0.4 ? "sharp-rise" : trendDelta > 0.15 ? "rise" : trendDelta < -0.1 ? "fall" : "stable";

  const TrendIcon =
    trendKind === "sharp-rise" || trendKind === "rise"
      ? TrendingUp
      : trendKind === "fall"
      ? TrendingDown
      : Minus;

  const trendStats = useMemo(() => {
    const scores = displayTrendData.map((item) => item.score);
    if (scores.length === 0) {
      return { avg: 0, peak: 0, trough: 0, aboveCrit: 0 };
    }

    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const peak = Math.max(...scores);
    const trough = Math.min(...scores);
    const aboveCrit = (scores.filter((score) => score >= 0.75).length / scores.length) * 100;

    return { avg, peak, trough, aboveCrit };
  }, [displayTrendData]);

  const recommendations =
    displayRiskLabel === "High"
      ? [
          "Immediate sepsis bundle: lactate, blood cultures, broad-spectrum antibiotics within 1h.",
          "Aggressive IV fluid resuscitation (30 mL/kg crystalloid) and reassess.",
          "Escalate to ICU senior and consider vasopressor support.",
        ]
      : displayRiskLabel === "Medium"
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
    <DashLayout
      title="Clinician Dashboard"
      subtitle="Upload data, select a patient, and run a 6-hour sepsis risk prediction."
    >
      <div className="grid grid-cols-1 xl:grid-cols-[1.75fr_1fr] gap-6 mb-6">
        <div className={cardCls}>
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
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              handleFile(event.dataTransfer.files?.[0]);
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
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow mb-3">
              {uploading ? (
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
                ? "Uploading & processing..."
                : "Drag & drop CSV or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {uploadState === "success"
                ? "Data imported · dataset ready"
                : "Schema: timestamped vitals + labs per patient"}
            </p>
            {uploadState === "error" && (
              <p className="text-xs text-destructive mt-2 inline-flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {uploadError}
              </p>
            )}
          </div>
        </div>

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
              <Select value={selectedId ?? ""} onValueChange={setSelectedId}>
                <SelectTrigger className="bg-secondary/40 border-border/60 h-11">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.id} · {patient.gender} · {patient.age}y
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
            disabled={predicting || !selected || !datasetId}
            className="w-full mt-4 bg-gradient-primary hover:shadow-glow-strong transition-all"
          >
            {predicting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Analyzing...
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
        <div className={`${cardCls} mb-6 text-center`}>
          <p className="text-muted-foreground text-sm">Click "Run Prediction" to generate a risk score.</p>
        </div>
      )}

      {hasPrediction && selected && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
            <div className={`${cardCls} lg:col-span-3`}>
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <h3 className="font-display text-base font-semibold">Sepsis Risk Trend</h3>
                  <p className="text-xs text-muted-foreground">6-hour horizon · live</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-semibold text-gradient-brand">
                    {displayRiskScore.toFixed(2)}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md border ${riskBadgeClasses(
                      displayRiskLabel,
                    )}`}
                  >
                    <TrendIcon className="h-3 w-3" /> {displayRiskLabel}
                  </span>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="risk-line-gradient" x1="0" x2="1" y1="0" y2="0">
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
                      stroke="url(#risk-line-gradient)"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "hsl(var(--primary-glow))" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${cardCls} lg:col-span-2`}>
              <h3 className="font-display text-base font-semibold mb-1">Feature Importance</h3>
              <p className="text-xs text-muted-foreground mb-3">Top 5 contributing signals</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureItems} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <defs>
                      <linearGradient id="feature-bar-gradient" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="3 4" horizontal={false} />
                    <XAxis type="number" domain={[0, 0.35]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis
                      type="category"
                      dataKey="displayLabel"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      width={90}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="importance" fill="url(#feature-bar-gradient)" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

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
                    className={`px-2 py-1 rounded-md text-xs border font-medium ${riskBadgeClasses(displayRiskLabel)}`}
                  >
                    {displayRiskLabel} band
                  </span>
                  <span className="text-2xl font-display font-semibold text-gradient-brand">
                    {(displayRiskScore * 100).toFixed(1)}%
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
                  {featureItems.slice(0, 3).map((feature) => (
                    <li key={feature.feature} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div>{feature.displayLabel}</div>
                        {feature.patientValue && (
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">
                            {feature.patientValue}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                        <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${Math.min((feature.importance / 0.35) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground w-10 text-right">
                          {feature.importance.toFixed(2)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </InsightBlock>

              <InsightBlock title="Clinical Recommendations" defaultOpen>
                <ul className="space-y-2 text-sm">
                  {recommendations.map((recommendation) => (
                    <li key={recommendation} className="flex gap-2">
                      <Activity className="h-4 w-4 mt-0.5 text-primary-glow shrink-0" />
                      <span className="text-muted-foreground">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </InsightBlock>
            </div>
          </div>
        </>
      )}
    </DashLayout>
  );
}

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
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl bg-secondary/30 border border-border/60 overflow-hidden">
      <button
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-secondary/50 transition-colors"
      >
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

const parsePatientSnapshots = async (file: File): Promise<Record<string, PatientSnapshot>> => {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return {};

  const headers = splitCsvLine(lines[0]);
  const snapshots: Record<string, { hour: number; values: PatientSnapshot }> = {};

  for (const line of lines.slice(1)) {
    const values = splitCsvLine(line);
    if (values.length === 0) continue;

    const row: PatientSnapshot = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    const patientId = row.id;
    if (!patientId) continue;

    const hour = Number(row.hour ?? "-9999");
    const current = snapshots[patientId];
    if (!current || hour >= current.hour) {
      snapshots[patientId] = { hour, values: row };
    }
  }

  return Object.fromEntries(
    Object.entries(snapshots).map(([patientId, snapshot]) => [patientId, snapshot.values]),
  );
};

const splitCsvLine = (line: string) => {
  return line
    .split(",")
    .map((value) => value.trim().replace(/^"(.*)"$/, "$1"));
};

const formatFeatureLabel = (feature: string) => {
  const normalized = feature.toLowerCase();
  const knownLabels: Record<string, string> = {
    heart_rate: "Heart Rate",
    respiratory_rate: "Resp. Rate",
    resp_rate: "Resp. Rate",
    wbc_count: "WBC Count",
    spo2_pct: "SpO2",
    systolic_bp: "Systolic BP",
    diastolic_bp: "Diastolic BP",
    blood_pressure: "Blood Pressure",
    temperature_c: "Temperature",
    crp_level: "CRP",
    lactate: "Lactate",
  };

  if (knownLabels[normalized]) return knownLabels[normalized];

  return feature
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getPatientFeatureValue = (feature: string, snapshot: PatientSnapshot | null) => {
  if (!snapshot) return null;

  const normalized = feature.toLowerCase();
  const aliases: Record<string, string[]> = {
    lactate: ["lactate"],
    wbc_count: ["wbc_count"],
    heart_rate: ["heart_rate"],
    respiratory_rate: ["respiratory_rate"],
    resp_rate: ["respiratory_rate"],
    spo2_pct: ["spo2_pct"],
    temperature: ["temperature_c"],
    temperature_c: ["temperature_c"],
    systolic_bp: ["systolic_bp"],
    diastolic_bp: ["diastolic_bp"],
    blood_pressure: ["systolic_bp", "diastolic_bp"],
    creatinine: ["creatinine"],
    crp_level: ["crp_level"],
  };

  const units: Record<string, string> = {
    lactate: "mmol/L",
    wbc_count: "K/uL",
    heart_rate: "bpm",
    respiratory_rate: "rpm",
    spo2_pct: "%",
    temperature_c: "C",
    systolic_bp: "mmHg",
    diastolic_bp: "mmHg",
    creatinine: "mg/dL",
    crp_level: "mg/L",
  };

  const columns = aliases[normalized] ?? [normalized];

  if (normalized === "blood_pressure") {
    const systolic = snapshot.systolic_bp;
    const diastolic = snapshot.diastolic_bp;
    if (systolic && diastolic) {
      return `${systolic}/${diastolic} mmHg`;
    }
  }

  for (const column of columns) {
    const value = snapshot[column];
    if (value) {
      const unit = units[column];
      return unit ? `${value} ${unit}` : value;
    }
  }

  return null;
};
