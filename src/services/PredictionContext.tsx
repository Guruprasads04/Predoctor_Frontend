import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface PredictionContextType {
  recentPredictedIds: string[];
  markPredicted: (patientId: string) => void;
  clearPredictions: () => void;
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider = ({ children }: { children: ReactNode }) => {
  const [recentPredictedIds, setRecentPredictedIds] = useState<string[]>([]);

  const markPredicted = (patientId: string) => {
    setRecentPredictedIds((current) => [patientId, ...current.filter((id) => id !== patientId)]);
  };

  const clearPredictions = () => {
    setRecentPredictedIds([]);
  };

  const value = useMemo(
    () => ({
      recentPredictedIds,
      markPredicted,
      clearPredictions,
    }),
    [recentPredictedIds],
  );

  return <PredictionContext.Provider value={value}>{children}</PredictionContext.Provider>;
};

export const usePredictionHistory = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error("usePredictionHistory must be used within PredictionProvider");
  }

  return context;
};
