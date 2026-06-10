import {
  CartesianGrid,
  Line,
  LineChart,
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
  "#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#f472b6",
  "#60a5fa", "#fb923c", "#4ade80", "#e879f9", "#38bdf8",
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
    <div className="rounded-lg border border-white/10 bg-slate-900/95 px-3 py-2 text-xs shadow-xl backdrop-blur-xl">
      <p className="mb-1 font-semibold text-slate-300">Ставка #{label}</p>
      {payload.slice(0, 5).map((p) => (
        <p key={p.name} className="text-slate-400">
          {p.name}: <span className="font-bold text-white">{Math.round(p.value).toLocaleString("ru-RU")} ₽</span>
        </p>
      ))}
      {payload.length > 5 && (
        <p className="text-slate-500">+{payload.length - 5} траекторий…</p>
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
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Запустите игру или Монте-Карло для визуализации траекторий
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="bet"
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={50}
          tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        {runs.slice(0, MONTE_CARLO_PATHWAYS).map((_, i) => (
          <Line
            key={`p${i}`}
            type="monotone"
            dataKey={`p${i}`}
            name={`MC-${i + 1}`}
            stroke={PATHWAY_COLORS[i % PATHWAY_COLORS.length]}
            strokeWidth={1}
            dot={false}
            strokeOpacity={0.35}
            isAnimationActive={false}
          />
        ))}
        {livePathway.length > 1 && (
          <Line
            type="monotone"
            dataKey="live"
            name="Текущая сессия"
            stroke="#ffffff"
            strokeWidth={2.5}
            dot={false}
            strokeOpacity={1}
          />
        )}
        <Line
          type="monotone"
          dataKey={() => startingBalance}
          name="Старт"
          stroke="#475569"
          strokeWidth={1}
          strokeDasharray="4 4"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
