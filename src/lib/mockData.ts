// Mock data for dashboard pages — frontend-only sample data
// Aligned with API types from src/services/types.ts

export type RiskLevel = "Low" | "Medium" | "High";
export type Status = "Stable" | "Critical";

export interface Patient {
  id: string;
  age: number;
  gender: "Male" | "Female";
  icuStay: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: Status;
}

export const mockPatients: Patient[] = [
  { id: "P-1047", age: 67, gender: "Male", icuStay: 4, riskScore: 0.78, riskLevel: "High", status: "Critical" },
  { id: "P-1052", age: 54, gender: "Female", icuStay: 2, riskScore: 0.42, riskLevel: "Medium", status: "Stable" },
  { id: "P-1063", age: 71, gender: "Male", icuStay: 7, riskScore: 0.91, riskLevel: "High", status: "Critical" },
  { id: "P-1078", age: 38, gender: "Female", icuStay: 1, riskScore: 0.18, riskLevel: "Low", status: "Stable" },
  { id: "P-1085", age: 62, gender: "Male", icuStay: 3, riskScore: 0.56, riskLevel: "Medium", status: "Stable" },
  { id: "P-1091", age: 79, gender: "Female", icuStay: 9, riskScore: 0.84, riskLevel: "High", status: "Critical" },
  { id: "P-1104", age: 45, gender: "Male", icuStay: 2, riskScore: 0.27, riskLevel: "Low", status: "Stable" },
  { id: "P-1112", age: 58, gender: "Female", icuStay: 5, riskScore: 0.63, riskLevel: "Medium", status: "Stable" },
  { id: "P-1125", age: 81, gender: "Male", icuStay: 11, riskScore: 0.94, riskLevel: "High", status: "Critical" },
  { id: "P-1133", age: 49, gender: "Female", icuStay: 3, riskScore: 0.31, riskLevel: "Low", status: "Stable" },
];

export const mockRiskTrend = (score: number) => [
  { id: "rt1", time: "T-6h", score: Math.max(0.05, score - 0.55) },
  { id: "rt2", time: "T-5h", score: Math.max(0.08, score - 0.48) },
  { id: "rt3", time: "T-4h", score: Math.max(0.12, score - 0.40) },
  { id: "rt4", time: "T-3h", score: Math.max(0.15, score - 0.30) },
  { id: "rt5", time: "T-2h", score: Math.max(0.18, score - 0.20) },
  { id: "rt6", time: "T-1h", score: Math.max(0.22, score - 0.10) },
  { id: "rt7", time: "Now", score },
];

export const mockFeatureImportance = [
  { id: "fi1", feature: "Heart Rate", importance: 0.28 },
  { id: "fi2", feature: "WBC Count", importance: 0.24 },
  { id: "fi3", feature: "Temperature", importance: 0.19 },
  { id: "fi4", feature: "Resp. Rate", importance: 0.16 },
  { id: "fi5", feature: "Blood Pressure", importance: 0.13 },
];

export const riskBadgeClasses = (level: RiskLevel) => {
  switch (level) {
    case "Critical":
      return "bg-destructive/15 text-destructive border-destructive/30";
    case "High":
      return "bg-destructive/10 text-destructive border-destructive/25";
    case "Medium":
      return "bg-accent/15 text-accent-foreground border-accent/30";
    case "Low":
      return "bg-cyan/15 text-cyan border-cyan/30";
  }
};

export const statusBadgeClasses = (status: Status) =>
  status === "Critical"
    ? "bg-destructive/15 text-destructive border-destructive/30"
    : "bg-primary/15 text-primary-glow border-primary/30";

export const analyticsOverview = {
  totalPatientsAnalyzed: 1247,
  highRiskPercentage: 25.6,
  averageRiskScore: 0.42,
  alertsTriggered: 89,
  riskDistribution: [
    { id: "rd1", name: "Low Risk", value: 625, color: "#10b981" },
    { id: "rd2", name: "Medium Risk", value: 302, color: "#f59e0b" },
    { id: "rd3", name: "High Risk", value: 320, color: "#ef4444" },
  ],
  patientTrends: [
    { id: "pt1", month: "Jan", avgRisk: 0.35 },
    { id: "pt2", month: "Feb", avgRisk: 0.38 },
    { id: "pt3", month: "Mar", avgRisk: 0.41 },
    { id: "pt4", month: "Apr", avgRisk: 0.39 },
    { id: "pt5", month: "May", avgRisk: 0.45 },
    { id: "pt6", month: "Jun", avgRisk: 0.42 },
  ],
  featureImportance: [
    { id: "fi1", feature: "Heart Rate", importance: 0.28 },
    { id: "fi2", feature: "WBC Count", importance: 0.24 },
  ],
  modelMetrics: { accuracy: 94.3, precision: 92.1, recall: 91.8, f1Score: 92.0, auc: 0.96 },
  confusionMatrix: { truePositive: 287, falsePositive: 24, falseNegative: 26, trueNegative: 663 },
};
