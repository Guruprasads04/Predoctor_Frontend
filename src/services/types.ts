/**
 * Type definitions for all API endpoints and data structures
 * Aligned with backend API specification
 */

// ============================================================
// Patient-related Types
// ============================================================

export type RiskLevel = "Low" | "Medium" | "High";
export type Status = "Stable" | "Critical";

export interface PatientSummary {
  id: string;
  age: number;
  gender: "Male" | "Female";
  icuStay: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: Status;
}

// ============================================================
// Upload/Session Types
// ============================================================

export interface UploadResponse {
  dataset_id: string;
  status: "completed" | "processing" | "failed";
  importedCount: number;
  errors: string[];
}

export interface SessionResetResponse {
  message: string;
}

// ============================================================
// Prediction Types
// ============================================================

export interface PredictionResponse {
  patientId: string;
  riskScore: number;
  riskLabel: string;
  predictionWindowHours: number;
  modelName: string;
}

// ============================================================
// Risk Trend Types
// ============================================================

export interface RiskPoint {
  id: string;
  time: string;
  score: number;
}

// ============================================================
// Feature Importance Types
// ============================================================

export interface FeatureImportanceItem {
  id: string;
  feature: string;
  importance: number;
}

// ============================================================
// Report Types
// ============================================================

export interface ReportResponse {
  report_url: string;
}

// ============================================================
// Dashboard Summary Types
// ============================================================

export interface DashboardSummary {
  totalPatients: number;
  highRisk: number;
  critical: number;
}

// ============================================================
// Analytics Overview Types
// ============================================================

export interface RiskDistributionItem {
  id: string;
  name: string;
  value: number;
  color?: string;
}

export interface PatientTrendItem {
  id: string;
  month: string;
  avgRisk: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
}

export interface ConfusionMatrix {
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
}

export interface AnalyticsOverview {
  totalPatientsAnalyzed: number;
  highRiskPercentage: number;
  averageRiskScore: number;
  alertsTriggered: number;
  riskDistribution: RiskDistributionItem[];
  patientTrends: PatientTrendItem[];
  featureImportance: FeatureImportanceItem[];
  modelMetrics: ModelMetrics;
  confusionMatrix: ConfusionMatrix;
}

// ============================================================
// Error Types
// ============================================================

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// ============================================================
// Request Options
// ============================================================

export interface RequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
}
