import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SimulationResult } from "../types";

interface MonteCarloChartProps {
  result: SimulationResult | null;
  numberOfBets: number;
}

export function MonteCarloChart({ result, numberOfBets }: MonteCarloChartProps) {
  if (!result) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ozon-muted">
        Запустите анализ, чтобы увидеть график
      </div>
    );
  }

  const length = numberOfBets + 1;
  const data = Array.from({ length }, (_, i) => {
    const point: Record<string, number> = { bet: i };
    result.runs.forEach((run, idx) => {
      point[`p${idx}`] = run.balances[i] ?? 0;
    });
    point.average = result.averageBalances[i] ?? 0;
    return point;
  });

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="bet" tick={{ fill: "#64748b", fontSize: 11 }} stroke="#e2e8f0" />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} stroke="#e2e8f0" width={50} />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              fontSize: 12,
            }}
            labelFormatter={(l) => `Ставка №${l}`}
          />
          {result.runs.map((_, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={`p${idx}`}
              stroke="rgba(30, 58, 95, 0.08)"
              strokeWidth={1}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <Line
            type="monotone"
            dataKey="average"
            stroke="#c9a227"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
