import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonteCarloResult } from "../../types/simulation";

interface MonteCarloChartProps {
  result: MonteCarloResult | null;
  livePath: number[];
}

const palette = ["#22d3ee", "#a78bfa", "#34d399", "#64748b", "#818cf8", "#14b8a6", "#f87171"];

export function MonteCarloChart({ result, livePath }: MonteCarloChartProps) {
  const maxLength = Math.max(livePath.length, ...(result?.paths.map((path) => path.balances.length) ?? [0]), 2);
  const data = Array.from({ length: maxLength }, (_, round) => {
    const point: Record<string, number> = { round };
    if (livePath[round] !== undefined) point.live = livePath[round];
    result?.paths.slice(0, 50).forEach((path) => {
      point[`s${path.id}`] = path.balances[round] ?? path.finalBalance;
    });
    if (result?.averagePath[round] !== undefined) point.average = result.averagePath[round];
    return point;
  });

  if (!result && livePath.length < 2) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/5 bg-slate-950/50 text-sm text-slate-500">
        Запустите Монте-Карло или выполните несколько итераций
      </div>
    );
  }

  return (
    <div className="h-72 rounded-2xl border border-white/5 bg-slate-950/50 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <XAxis dataKey="round" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} width={46} />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.96)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              color: "#e2e8f0",
              fontSize: 12,
            }}
            labelFormatter={(value) => `Раунд ${value}`}
          />
          {result?.paths.slice(0, 50).map((path, index) => (
            <Line
              key={path.id}
              type="monotone"
              dataKey={`s${path.id}`}
              stroke={palette[index % palette.length]}
              strokeWidth={1}
              strokeOpacity={0.24}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <Line type="monotone" dataKey="live" stroke="#ffffff" strokeWidth={2} dot={false} name="Текущая сессия" />
          <Line
            type="monotone"
            dataKey="average"
            stroke="#22d3ee"
            strokeWidth={3}
            dot={false}
            name="Средняя траектория"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
