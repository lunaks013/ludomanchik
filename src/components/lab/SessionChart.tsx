import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MONTE_CARLO_PATHWAYS } from "../../context/TelemetryContext";
import type { SimulationResult } from "../../types";

interface SessionChartProps {
  result: SimulationResult | null;
  livePathway: number[];
  startingBalance: number;
}

const PATHWAY_COLORS = [
  "#94a3b8", "#64748b", "#cbd5e1", "#475569", "#a1a1aa",
  "#78716c", "#9ca3af", "#6b7280", "#71717a", "#525252",
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-semibold text-slate-700">Итерация #{label}</p>
      {payload.slice(0, 5).map((p) => (
        <p key={p.name} className="text-slate-600">
          {p.name}: <span className="font-semibold">{Math.round(p.value).toLocaleString("ru-RU")} ₽</span>
        </p>
      ))}
      {payload.length > 5 && (
        <p className="text-slate-400">+{payload.length - 5} траекторий…</p>
      )}
    </div>
  );
}

export function SessionChart({ result, livePathway, startingBalance }: SessionChartProps) {
  const runs = result?.runs ?? [];
  const maxLen = Math.max(
    livePathway.length,
    ...runs.map((r) => r.balances.length),
    20,
  );

  const chartData = Array.from({ length: maxLen }, (_, i) => {
    const point: Record<string, number | string> = { bet: i };
    if (i < livePathway.length) {
      point.live = livePathway[i];
    }
    runs.slice(0, MONTE_CARLO_PATHWAYS).forEach((run, ri) => {
      point[`p${ri}`] = run.balances[i] ?? run.balances[run.balances.length - 1] ?? 0;
    });
    return point;
  });

  const hasData = livePathway.length > 1 || runs.length > 0;

  if (!hasData) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        Выполните итерацию или расчёт Монте-Карло для построения графика
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="bet"
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={{ stroke: "#e2e8f0" }}
          tickLine={false}
          label={{ value: "Итерация", position: "insideBottom", offset: -2, fontSize: 10, fill: "#94a3b8" }}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={50}
          tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={startingBalance} stroke="#94a3b8" strokeDasharray="4 4" />
        {runs.slice(0, MONTE_CARLO_PATHWAYS).map((_, i) => (
          <Line
            key={`p${i}`}
            type="monotone"
            dataKey={`p${i}`}
            name={`MC-${i + 1}`}
            stroke={PATHWAY_COLORS[i % PATHWAY_COLORS.length]}
            strokeWidth={1}
            dot={false}
            strokeOpacity={0.5}
            isAnimationActive={false}
          />
        ))}
        {livePathway.length > 1 && (
          <Line
            type="monotone"
            dataKey="live"
            name="Текущая сессия"
            stroke="#1e3a5f"
            strokeWidth={2}
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
