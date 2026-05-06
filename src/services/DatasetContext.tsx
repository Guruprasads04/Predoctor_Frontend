/**
 * Dataset Context - Manages dataset_id for the current page session only.
 * A browser refresh resets the upload flow back to a clean state.
 */

import React, { createContext, useContext, useEffect, useState } from "react";

interface DatasetContextType {
  datasetId: string | null;
  setDatasetId: (id: string | null) => void;
  clearDataset: () => void;
  isDatasetLoaded: boolean;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [datasetId, setDatasetIdState] = useState<string | null>(null);
  const [isDatasetLoaded, setIsDatasetLoaded] = useState(false);

  useEffect(() => {
    // Clear any stale persisted dataset from older app versions.
    localStorage.removeItem("predocter_dataset_id");
    setIsDatasetLoaded(true);
  }, []);

  const setDatasetId = (id: string | null) => {
    setDatasetIdState(id);
  };

  const clearDataset = () => {
    setDatasetIdState(null);
  };

  const value: DatasetContextType = {
    datasetId,
    setDatasetId,
    clearDataset,
    isDatasetLoaded,
  };

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
};

/**
 * Hook to access dataset context
 * Must be used within DatasetProvider
 */
export const useDataset = () => {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error("useDataset must be used within DatasetProvider");
  }
  return context;
};
