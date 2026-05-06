/**
 * Custom React hooks for API operations
 * Provides easy access to backend endpoints with loading states and error handling
 */

import { useEffect, useState, useCallback } from "react";
import { apiClient, fallbackData } from "./apiClient";
import type {
  PatientSummary,
  PredictionResponse,
  RiskPoint,
  FeatureImportanceItem,
  ReportResponse,
  DashboardSummary,
  AnalyticsOverview,
  UploadResponse,
} from "./types";

// ============================================================
// Hook State Types
// ============================================================

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// ============================================================
// Generic useAsync Hook
// ============================================================

const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  onError?: (error: Error) => void,
): UseAsyncState<T> & { refetch: () => Promise<void> } => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: err });
      onError?.(err);
      throw err;
    }
  }, [asyncFunction, onError]);

  useEffect(() => {
    if (!immediate) return;
    execute();
  }, [execute, immediate]);

  return { ...state, refetch: execute };
};

// ============================================================
// Patient Hooks
// ============================================================

/**
 * Fetch all patients for current dataset
 */
export const usePatients = (datasetId: string | null) => {
  const [state, setState] = useState<UseAsyncState<PatientSummary[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!datasetId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.listPatients(datasetId);
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      console.warn("Failed to fetch patients, using mock data");
      const mockResult = fallbackData.mockPatientsList();
      setState({ data: mockResult, loading: false, error: null });
    }
  }, [datasetId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
};

/**
 * Fetch single patient by ID
 */
export const usePatient = (patientId: string | null, datasetId: string | null) => {
  const [state, setState] = useState<UseAsyncState<PatientSummary>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!patientId || !datasetId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.getPatientById(patientId, datasetId);
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      console.warn("Failed to fetch patient, using mock data");
      const mockResult = fallbackData.mockPatient(patientId);
      setState({ data: mockResult, loading: false, error: null });
    }
  }, [patientId, datasetId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
};

// ============================================================
// Prediction Hooks
// ============================================================

/**
 * Run sepsis prediction for a patient
 */
export const useRunPrediction = () => {
  const [state, setState] = useState<UseAsyncState<PredictionResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const runPrediction = useCallback(async (patientId: string, datasetId: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.runPrediction(patientId, datasetId);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      console.warn("Failed to run prediction, using mock data");
      const mockResult = fallbackData.mockPrediction(patientId);
      setState({ data: mockResult, loading: false, error: null });
      return mockResult;
    }
  }, []);

  return { ...state, runPrediction };
};

/**
 * Fetch risk trend for a patient
 */
export const useRiskTrend = (patientId: string | null, datasetId: string | null) => {
  const [state, setState] = useState<UseAsyncState<RiskPoint[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!patientId || !datasetId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.getRiskTrend(patientId, datasetId);
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      console.warn("Failed to fetch risk trend, using mock data");
      const mockResult = fallbackData.mockRiskTrend(0.76);
      setState({ data: mockResult, loading: false, error: null });
    }
  }, [patientId, datasetId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
};

/**
 * Fetch feature importance for a patient
 */
export const useFeatureImportance = (patientId: string | null, datasetId: string | null) => {
  const [state, setState] = useState<UseAsyncState<FeatureImportanceItem[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!patientId || !datasetId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.getFeatureImportance(patientId, datasetId);
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      console.warn("Failed to fetch feature importance, using mock data");
      const mockResult = fallbackData.mockFeatureImportance();
      setState({ data: mockResult, loading: false, error: null });
    }
  }, [patientId, datasetId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
};

// ============================================================
// Report Hooks
// ============================================================

/**
 * Download explainability report for a patient
 */
export const useDownloadReport = () => {
  const [state, setState] = useState<UseAsyncState<string>>({
    data: null,
    loading: false,
    error: null,
  });

  const downloadReport = useCallback(async (patientId: string, datasetId: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.downloadExplainabilityReport(patientId, datasetId);
      setState({ data: result.report_url, loading: false, error: null });
      return result.report_url;
    } catch (error) {
      console.warn("Failed to download report");
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, []);

  return { ...state, downloadReport };
};

// ============================================================
// Dashboard & Analytics Hooks
// ============================================================

/**
 * Fetch dashboard summary statistics
 */
export const useDashboardSummary = (datasetId: string | null) => {
  const [state, setState] = useState<UseAsyncState<DashboardSummary>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!datasetId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.getDashboardSummary(datasetId);
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      console.warn("Failed to fetch dashboard summary, using mock data");
      const mockResult = fallbackData.mockDashboardSummary();
      setState({ data: mockResult, loading: false, error: null });
    }
  }, [datasetId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
};

/**
 * Fetch comprehensive analytics overview
 */
export const useAnalyticsOverview = (datasetId: string | null) => {
  const [state, setState] = useState<UseAsyncState<AnalyticsOverview>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!datasetId) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.getAnalyticsOverview(datasetId);
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      console.warn("Failed to fetch analytics overview, using mock data");
      const mockResult = fallbackData.mockAnalyticsOverview();
      setState({ data: mockResult, loading: false, error: null });
    }
  }, [datasetId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
};

// ============================================================
// File Upload Hook
// ============================================================

/**
 * Upload EHR CSV file
 */
export const useUploadEhr = () => {
  const [state, setState] = useState<UseAsyncState<UploadResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  const uploadEhr = useCallback(async (file: File) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiClient.uploadEhr(file);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, []);

  return { ...state, uploadEhr };
};

/**
 * Reset patient session
 */
export const useResetSession = () => {
  const [state, setState] = useState<{ loading: boolean; error: Error | null }>({
    loading: false,
    error: null,
  });

  const resetSession = useCallback(async () => {
    setState({ loading: true, error: null });
    try {
      await apiClient.resetPatientSession();
      setState({ loading: false, error: null });
    } catch (error) {
      // Graceful fallback - consider reset successful even if API fails
      console.warn("Reset session API call failed, but clearing locally");
      setState({ loading: false, error: null });
    }
  }, []);

  return { ...state, resetSession };
};
