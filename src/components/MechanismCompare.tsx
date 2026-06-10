import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MechanismComparison } from "../math/monteCarlo";

interface MechanismCompareProps {
  data: MechanismComparison[];
}

const tooltipStyle = {
  background: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  fontSize: 12,
  color: "#e2e8f0",
};

export function MechanismCompare({ data }: MechanismCompareProps) {
  const profitData = data.map((d) => ({
    name: d.gameShell,
    value: Math.round(d.stats.averageProfit),
  }));

  const bustData = data.map((d) => ({
    name: d.gameShell,
    value: +d.stats.bankruptcyRate.toFixed(1),
  }));

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="glass p-5">
        <h3 className="text-sm font-semibold text-white">Средний профит</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={profitData} layout="vertical" margin={{ left: 4, right: 12 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={64} tick={{ fill: "#64748b", fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill="#22d3ee" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass p-5">
        <h3 className="text-sm font-semibold text-white">Банкротство, %</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={bustData} layout="vertical" margin={{ left: 4, right: 12 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={64} tick={{ fill: "#64748b", fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill="#f87171" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
