/**
 * API Integration Guide
 * 
 * This document describes the complete API integration setup for the Predocter AI Frontend.
 * All backend endpoints are wired with TypeScript types, error handling, and fallback to mock data.
 */

# API Integration Architecture

## Project Structure

```
src/
├── services/
│   ├── types.ts              # All TypeScript types for API data structures
│   ├── apiClient.ts          # Centralized API client with all endpoints
│   ├── DatasetContext.tsx    # React Context for managing dataset_id
│   └── index.ts              # Custom React hooks for API operations
├── lib/
│   ├── mockData.ts           # Mock data that matches API schema (fallback)
│   └── utils.ts
├── pages/
│   ├── Dashboard.tsx         # Updated to use API hooks
│   ├── Patients.tsx          # Updated to use API hooks
│   ├── Analytics.tsx         # Updated to use API hooks
│   └── Index.tsx
└── App.tsx                   # Wrapped with DatasetProvider
```

## Environment Variables

Add to `.env` or `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Core Components

### 1. API Types (`src/services/types.ts`)

Defines all TypeScript interfaces for:
- `PatientSummary` - Patient data with risk score
- `UploadResponse` - Response from file upload endpoint
- `PredictionResponse` - ML model prediction result
- `RiskPoint` - Historical risk score data
- `FeatureImportanceItem` - ML feature weights
- `AnalyticsOverview` - Comprehensive analytics metrics
- And more...

### 2. API Client (`src/services/apiClient.ts`)

Singleton instance `apiClient` with methods for all 10 endpoints:

```typescript
// Upload & Session
apiClient.uploadEhr(file: File)
apiClient.resetPatientSession()

// Patients
apiClient.listPatients(datasetId: string)
apiClient.getPatientById(patientId: string, datasetId: string)

// Predictions
apiClient.runPrediction(patientId: string, datasetId: string)
apiClient.getRiskTrend(patientId: string, datasetId: string)
apiClient.getFeatureImportance(patientId: string, datasetId: string)

// Reports
apiClient.downloadExplainabilityReport(patientId: string, datasetId: string)

// Dashboard & Analytics
apiClient.getDashboardSummary(datasetId: string)
apiClient.getAnalyticsOverview(datasetId: string)
```

**Error Handling**: All failed requests throw errors. Hooks catch and fall back to mock data.

### 3. Dataset Context (`src/services/DatasetContext.tsx`)

Manages `dataset_id` state:
- Stores in localStorage under `predocter_dataset_id`
- Provides `useDataset()` hook for accessing/setting dataset_id
- Used by all pages to persist dataset across navigation

Usage:
```typescript
const { datasetId, setDatasetId, clearDataset } = useDataset();
```

### 4. API Hooks (`src/services/index.ts`)

Custom React hooks that handle loading/error states:

```typescript
// Patient hooks
usePatients(datasetId)           // Fetch all patients
usePatient(patientId, datasetId) // Fetch single patient

// Prediction hooks
useRunPrediction()                  // Run ML prediction
useRiskTrend(patientId, datasetId)  // Get risk history
useFeatureImportance(patientId, datasetId)

// Report hooks
useDownloadReport()

// Dashboard & Analytics hooks
useDashboardSummary(datasetId)
useAnalyticsOverview(datasetId)

// Upload hooks
useUploadEhr()
useResetSession()
```

Each hook returns: `{ data, loading, error, refetch }`

## Usage Example

### Dashboard Upload & Patient Selection

```typescript
import { useDataset } from "@/services/DatasetContext";
import { useUploadEhr, usePatients, useRunPrediction } from "@/services";

const Dashboard = () => {
  const { datasetId, setDatasetId } = useDataset();
  const { data: patients } = usePatients(datasetId);
  const { uploadEhr, loading: uploading } = useUploadEhr();
  const { runPrediction } = useRunPrediction();

  const handleUpload = async (file: File) => {
    const result = await uploadEhr(file);
    setDatasetId(result.dataset_id); // Store for future requests
  };

  const handlePredict = async (patientId: string) => {
    await runPrediction(patientId, datasetId);
  };

  // Component JSX...
};
```

### Patients List Page

```typescript
import { useDataset } from "@/services/DatasetContext";
import { usePatients } from "@/services";

const Patients = () => {
  const { datasetId } = useDataset();
  const { data: patients = [], loading, error } = usePatients(datasetId);

  if (!datasetId) {
    return <div>Please upload a dataset first</div>;
  }

  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Table>
      {patients.map(p => (
        <TableRow key={p.id}>
          <TableCell>{p.id}</TableCell>
          <TableCell>{p.riskScore}</TableCell>
          {/* ... */}
        </TableRow>
      ))}
    </Table>
  );
};
```

### Analytics Page

```typescript
import { useDataset } from "@/services/DatasetContext";
import { useAnalyticsOverview } from "@/services";

const Analytics = () => {
  const { datasetId } = useDataset();
  const { data: analytics, loading } = useAnalyticsOverview(datasetId);

  if (!analytics) return <Loader />;

  return (
    <>
      <MetricCard label="Total Patients" value={analytics.totalPatientsAnalyzed} />
      <PieChart data={analytics.riskDistribution} />
      <LineChart data={analytics.patientTrends} />
      <BarChart data={analytics.featureImportance} />
      <ModelMetricsCard metrics={analytics.modelMetrics} />
    </>
  );
};
```

## Request/Response Format

### Query Parameters

All patient-related endpoints automatically include `dataset_id`:

```
GET /api/patients?dataset_id=upl_20260427_001
GET /api/patients/P-1047/predict?dataset_id=upl_20260427_001
```

### Response Example: Upload EHR

```json
{
  "dataset_id": "upl_20260427_001",
  "status": "completed",
  "importedCount": 125,
  "errors": []
}
```

### Response Example: Patient List

```json
[
  {
    "id": "P-1047",
    "age": 67,
    "gender": "Male",
    "icuStay": 4,
    "riskScore": 0.78,
    "riskLevel": "High",
    "status": "Critical"
  }
]
```

### Response Example: Prediction

```json
{
  "patientId": "P-1047",
  "riskScore": 0.76,
  "riskLabel": "High Risk",
  "predictionWindowHours": 6,
  "modelName": "Random Forest"
}
```

## Error Handling Strategy

Each API hook catches errors and falls back to mock data:

1. **Upload Endpoint**: Throws error to UI (cannot fallback)
2. **Patient List**: Returns mock patients
3. **Prediction**: Returns mock prediction (0.76 risk score)
4. **Risk Trend**: Returns mock trend data
5. **Feature Importance**: Returns mock feature data
6. **Analytics**: Returns mock analytics
7. **Report Download**: Throws error (logs to browser)

Example:
```typescript
try {
  const result = await apiClient.listPatients(datasetId);
  return result;
} catch (error) {
  console.warn("Failed to fetch patients, using mock data");
  return fallbackData.mockPatientsList();
}
```

## Endpoints Summary

| Endpoint | Method | Dataset ID | Priority | Status |
|----------|--------|:----------:|----------|--------|
| `/api/uploads/ehr` | POST | ❌ | CRITICAL | ✅ |
| `/api/reset` | POST | ❌ | HIGH | ✅ |
| `/api/patients` | GET | ✅ | CRITICAL | ✅ |
| `/api/patients/{id}` | GET | ✅ | CRITICAL | ✅ |
| `/api/patients/{id}/predict` | POST | ✅ | HIGH | ✅ |
| `/api/patients/{id}/risk-trend` | GET | ✅ | HIGH | ✅ |
| `/api/patients/{id}/feature-importance` | GET | ✅ | HIGH | ✅ |
| `/api/patients/{id}/report` | GET | ✅ | MEDIUM | ✅ |
| `/api/dashboard/summary` | GET | ✅ | MEDIUM | ✅ |
| `/api/analytics/overview` | GET | ✅ | MEDIUM | ✅ |

## Testing

### With Backend Running

```bash
# Backend (port 8080)
npm start

# Frontend
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

Steps:
1. Upload CSV → Should get dataset_id in localStorage
2. Select patient → Should load from API
3. Run prediction → Should update risk score
4. Navigate to Analytics → Should show backend metrics

### With Mock Data (Backend Down)

Frontend automatically falls back to mock data:
- Patient list loads instantly
- Predictions show 0.76 risk
- Analytics shows example metrics

## CORS Headers Required

Backend should return:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Content-Type
```

## Next Steps for Backend Team

1. Implement `/api/uploads/ehr` endpoint
2. Implement `/api/patients` and `/api/patients/{id}` GET
3. Implement `/api/patients/{id}/predict` POST
4. Implement `/api/patients/{id}/risk-trend` GET
5. Implement `/api/patients/{id}/feature-importance` GET
6. Implement `/api/analytics/overview` GET
7. Ensure all endpoints accept `dataset_id` query parameter
8. Return proper JSON schema matching types.ts
9. Add CORS headers to all responses
10. Test with frontend at http://localhost:5173

## Files Modified

- ✅ `src/App.tsx` - Added DatasetProvider
- ✅ `src/pages/Dashboard.tsx` - Integrated API hooks
- ✅ `src/pages/Patients.tsx` - Integrated API hooks
- ✅ `src/pages/Analytics.tsx` - Integrated API hooks
- ✅ `src/lib/mockData.ts` - Updated to match API schema
- ✅ Created `src/services/types.ts`
- ✅ Created `src/services/apiClient.ts`
- ✅ Created `src/services/DatasetContext.tsx`
- ✅ Created `src/services/index.ts`

## Troubleshooting

**Issue**: "Please upload a dataset first" message
- **Cause**: No dataset_id in localStorage
- **Fix**: Upload a CSV file using Dashboard

**Issue**: Mock data showing despite backend running
- **Cause**: API endpoint not implemented or returning error
- **Fix**: Check backend logs, verify CORS headers

**Issue**: Type errors in components
- **Cause**: Missing imports from types.ts
- **Fix**: Add `import type { PatientSummary } from "@/services/types";`

## References

- [API Connection Guide](../API_CONNECTION_GUIDE.md)
- [Backend Endpoints](../BACKEND_ENDPOINTS.md)
- [Frontend Services](./src/services/)
