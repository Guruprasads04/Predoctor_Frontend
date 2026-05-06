/**
 * Centralized API client for all backend endpoints
 * Handles request/response, error handling, and fallback to mock data
 */

import type {
  UploadResponse,
  SessionResetResponse,
  PatientSummary,
  PredictionResponse,
  RiskPoint,
  FeatureImportanceItem,
  ReportResponse,
  DashboardSummary,
  AnalyticsOverview,
  RequestOptions,
} from "./types";

import * as mockData from "@/lib/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Generic request handler with error handling and fallback
   */
  private async request<T>(
    path: string,
    method: "GET" | "POST" | "DELETE" = "GET",
    options?: RequestOptions,
  ): Promise<T> {
    try {
      const url = new URL(path, this.baseUrl);
      const response = await fetch(url.toString(), {
        method,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${path}:`, error);
      throw error;
    }
  }

  /**
   * Helper to add dataset_id query parameter
   */
  private withDatasetId(path: string, datasetId?: string): string {
    if (!datasetId) return path;
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}dataset_id=${encodeURIComponent(datasetId)}`;
  }

  // ============================================================
  // Upload & Session Management
  // ============================================================

  /**
   * POST /api/uploads/ehr
   * Upload EHR CSV file and create new dataset session
   */
  async uploadEhr(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${this.baseUrl}/api/uploads/ehr`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("EHR upload failed:", error);
      throw error;
    }
  }

  /**
   * POST /api/reset
   * Reset session and clear current dataset
   */
  async resetPatientSession(): Promise<SessionResetResponse> {
    return this.request<SessionResetResponse>("/api/reset", "POST");
  }

  // ============================================================
  // Patient Management
  // ============================================================

  /**
   * GET /api/patients
   * List all patients in current dataset
   */
  async listPatients(datasetId: string): Promise<PatientSummary[]> {
    const path = this.withDatasetId("/api/patients", datasetId);
    return this.request<PatientSummary[]>(path, "GET");
  }

  /**
   * GET /api/patients/{patientId}
   * Get single patient details
   */
  async getPatientById(patientId: string, datasetId: string): Promise<PatientSummary> {
    const path = this.withDatasetId(`/api/patients/${patientId}`, datasetId);
    return this.request<PatientSummary>(path, "GET");
  }

  // ============================================================
  // Predictions
  // ============================================================

  /**
   * POST /api/patients/{patientId}/predict
   * Run ML model prediction for sepsis risk
   */
  async runPrediction(patientId: string, datasetId: string): Promise<PredictionResponse> {
    const path = this.withDatasetId(`/api/patients/${patientId}/predict`, datasetId);
    return this.request<PredictionResponse>(path, "POST");
  }

  /**
   * GET /api/patients/{patientId}/risk-trend
   * Get historical risk score progression
   */
  async getRiskTrend(patientId: string, datasetId: string): Promise<RiskPoint[]> {
    const path = this.withDatasetId(`/api/patients/${patientId}/risk-trend`, datasetId);
    return this.request<RiskPoint[]>(path, "GET");
  }

  /**
   * GET /api/patients/{patientId}/feature-importance
   * Get ML model feature weights affecting prediction
   */
  async getFeatureImportance(patientId: string, datasetId: string): Promise<FeatureImportanceItem[]> {
    const path = this.withDatasetId(`/api/patients/${patientId}/feature-importance`, datasetId);
    return this.request<FeatureImportanceItem[]>(path, "GET");
  }

  // ============================================================
  // Reports & Explainability
  // ============================================================

  /**
   * GET /api/patients/{patientId}/report
   * Generate and download PDF explainability report
   */
  async downloadExplainabilityReport(
    patientId: string,
    datasetId: string,
  ): Promise<ReportResponse> {
    const path = this.withDatasetId(`/api/patients/${patientId}/report`, datasetId);
    return this.request<ReportResponse>(path, "GET");
  }

  // ============================================================
  // Dashboard & Analytics
  // ============================================================

  /**
   * GET /api/dashboard/summary
   * Get high-level dashboard statistics
   */
  async getDashboardSummary(datasetId: string): Promise<DashboardSummary> {
    const path = this.withDatasetId("/api/dashboard/summary", datasetId);
    return this.request<DashboardSummary>(path, "GET");
  }

  /**
   * GET /api/analytics/overview
   * Get comprehensive analytics with model performance metrics
   */
  async getAnalyticsOverview(datasetId: string): Promise<AnalyticsOverview> {
    const path = this.withDatasetId("/api/analytics/overview", datasetId);
    return this.request<AnalyticsOverview>(path, "GET");
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// ============================================================
// Fallback Mock Data Functions (for error scenarios)
// ============================================================

export const fallbackData = {
  /**
   * Return mock patient list when API fails
   */
  mockPatientsList(): PatientSummary[] {
    return mockData.mockPatients;
  },

  /**
   * Return mock patient when API fails
   */
  mockPatient(patientId?: string): PatientSummary {
    return (
      mockData.mockPatients.find((p) => p.id === patientId) ||
      mockData.mockPatients[0]
    );
  },

  /**
   * Return mock prediction when API fails
   */
  mockPrediction(patientId: string): PredictionResponse {
    return {
      patientId,
      riskScore: 0.76,
      riskLabel: "High Risk",
      predictionWindowHours: 6,
      modelName: "Random Forest",
    };
  },

  /**
   * Return mock risk trend when API fails
   */
  mockRiskTrend(score: number): RiskPoint[] {
    return mockData.mockRiskTrend(score).map((item, index) => ({
      id: `rt${index + 1}`,
      time: item.time,
      score: item.score,
    }));
  },

  /**
   * Return mock feature importance when API fails
   */
  mockFeatureImportance(): FeatureImportanceItem[] {
    return mockData.mockFeatureImportance.map((item, index) => ({
      id: `fi${index + 1}`,
      feature: item.feature,
      importance: item.importance,
    }));
  },

  /**
   * Return mock dashboard summary when API fails
   */
  mockDashboardSummary(): DashboardSummary {
    return {
      totalPatients: mockData.mockPatients.length,
      highRisk: mockData.mockPatients.filter((p) => p.riskLevel === "High").length,
      critical: mockData.mockPatients.filter((p) => p.riskLevel === "Critical").length,
    };
  },

  /**
   * Return mock analytics overview when API fails
   */
  mockAnalyticsOverview(): AnalyticsOverview {
    return mockData.analyticsOverview;
  },
};
