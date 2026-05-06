import { Users, TrendingUp, BarChart3, Activity, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { DashLayout } from "@/components/dashboard/DashLayout";
import { useDataset } from "@/services/DatasetContext";
import { useAnalyticsOverview } from "@/services";

const cardCls = "glass-strong glow-border rounded-2xl p-5 shadow-card";

const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 12,
  fontSize: 12,
  color: "hsl(var(--popover-foreground))",
};
const tooltipItemStyle = { color: "hsl(var(--popover-foreground))" };
const tooltipLabelStyle = { color: "hsl(var(--popover-foreground))" };

// Use design tokens for chart colors
const RISK_COLORS = ["hsl(var(--cyan))", "hsl(var(--accent-glow))", "hsl(var(--destructive))"];

const Analytics = () => {
  const { datasetId } = useDataset();
  const { data: analyticsData, loading, error } = useAnalyticsOverview(datasetId);

  if (!datasetId) {
    return (
      <DashLayout title="Analytics" subtitle="Population-level trends, model quality, and confusion matrix.">
        <div className={`${cardCls} text-center py-12`}>
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please upload a dataset first to view analytics.</p>
        </div>
      </DashLayout>
    );
  }

  if (loading || !analyticsData) {
    return (
      <DashLayout title="Analytics" subtitle="Population-level trends, model quality, and confusion matrix.">
        <div className={`${cardCls} text-center py-12`}>
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      </DashLayout>
    );
  }

  if (error) {
    return (
      <DashLayout title="Analytics" subtitle="Population-level trends, model quality, and confusion matrix.">
        <div className={`${cardCls} text-center py-12 border border-destructive/30 bg-destructive/10`}>
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Failed to load analytics: {error.message}</p>
        </div>
      </DashLayout>
    );
  }

  const o = analyticsData;

  return (
    <DashLayout title="Analytics" subtitle="Population-level trends, model quality, and confusion matrix.">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Metric icon={Users} label="Patients Analyzed" value={o.totalPatientsAnalyzed.toLocaleString()} accent="primary" />
        <Metric icon={TrendingUp} label="High Risk %" value={`${o.highRiskPercentage}%`} accent="destructive" />
        <Metric icon={BarChart3} label="Avg Risk Score" value={o.averageRiskScore.toFixed(2)} accent="accent" />
        <Metric icon={Activity} label="Alerts Triggered" value={o.alertsTriggered} accent="cyan" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className={cardCls}>
          <h3 className="font-display text-base font-semibold mb-1">Risk Distribution</h3>
          <p className="text-xs text-muted-foreground mb-3">Population breakdown by band</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={o.riskDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  stroke="hsl(var(--background))"
                >
                  {o.riskDistribution.map((_, i) => (
                    <Cell key={i} fill={RISK_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="font-display text-base font-semibold mb-1">Patient Risk Trends</h3>
          <p className="text-xs text-muted-foreground mb-3">Average risk over the last 6 months</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={o.patientTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lg2" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
                    <stop offset="100%" stopColor="hsl(var(--accent-glow))" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="3 4" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis domain={[0, 1]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
                <Line type="monotone" dataKey="avgRisk" stroke="url(#lg2)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature importance */}
      <div className={`${cardCls} mb-5`}>
        <h3 className="font-display text-base font-semibold mb-1">Overall Feature Importance</h3>
        <p className="text-xs text-muted-foreground mb-3">Top contributing signals across the population</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={o.featureImportance} layout="vertical" margin={{ left: 10, right: 10 }}>
              <defs>
                <linearGradient id="bg2" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(var(--border) / 0.4)" strokeDasharray="3 4" horizontal={false} />
              <XAxis type="number" domain={[0, 0.35]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis type="category" dataKey="feature" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipItemStyle} labelStyle={tooltipLabelStyle} />
              <Bar dataKey="importance" fill="url(#bg2)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model metrics */}
      <div className={`${cardCls} mb-5`}>
        <h3 className="font-display text-base font-semibold mb-4">Model Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <ModelMetric label="Accuracy" value={`${o.modelMetrics.accuracy}%`} />
          <ModelMetric label="Precision" value={`${o.modelMetrics.precision}%`} />
          <ModelMetric label="Recall" value={`${o.modelMetrics.recall}%`} />
          <ModelMetric label="F1 Score" value={`${o.modelMetrics.f1Score}%`} />
          <ModelMetric label="AUC" value={o.modelMetrics.auc.toFixed(2)} />
        </div>
      </div>

      {/* Confusion matrix */}
      <div className={cardCls}>
        <h3 className="font-display text-base font-semibold mb-4">Confusion Matrix</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ConfusionCell icon={CheckCircle2} label="True Positive" value={o.confusionMatrix.truePositive} tone="cyan" />
          <ConfusionCell icon={AlertCircle} label="False Positive" value={o.confusionMatrix.falsePositive} tone="destructive" />
          <ConfusionCell icon={AlertCircle} label="False Negative" value={o.confusionMatrix.falseNegative} tone="accent" />
          <ConfusionCell icon={CheckCircle2} label="True Negative" value={o.confusionMatrix.trueNegative} tone="primary" />
        </div>
      </div>
    </DashLayout>
  );
};

const Metric = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  accent: "primary" | "destructive" | "accent" | "cyan";
}) => {
  const accentMap = {
    primary: "bg-primary/15 text-primary-glow border-primary/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
    accent: "bg-accent/15 text-accent-glow border-accent/30",
    cyan: "bg-cyan/15 text-cyan border-cyan/30",
  };
  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="text-2xl md:text-3xl font-display font-semibold mt-1.5">{value}</div>
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${accentMap[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

const ModelMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-secondary/40 border border-border/60 px-4 py-3 text-center">
    <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</div>
    <div className="text-xl font-display font-semibold mt-1 text-gradient-brand">{value}</div>
  </div>
);

const ConfusionCell = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "cyan" | "destructive" | "accent" | "primary";
}) => {
  const map = {
    cyan: "bg-cyan/10 border-cyan/30 text-cyan",
    destructive: "bg-destructive/10 border-destructive/30 text-destructive",
    accent: "bg-accent/10 border-accent/30 text-accent-glow",
    primary: "bg-primary/10 border-primary/30 text-primary-glow",
  };
  return (
    <div className={`rounded-xl border px-4 py-4 ${map[tone]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider opacity-90">{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-2xl font-display font-semibold text-foreground">{value}</div>
    </div>
  );
};

export default Analytics;
