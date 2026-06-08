import { MONTE_CARLO_ITERATIONS } from "../lib/monteCarlo";
import type { SimulationResult } from "../types";
import { MonteCarloChart } from "./MonteCarloChart";
import { StatCard } from "./StatCard";

interface DashboardProps {
  result: SimulationResult | null;
  numberOfBets: number;
  startingBalance: number;
}

function formatMoney(n: number): string {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: 0 });
}

function formatProfit(n: number): string {
  const sign = n >= 0 ? "+" : "−";
  return `${sign}${formatMoney(Math.abs(n))} ₽`;
}

export function Dashboard({ result, numberOfBets, startingBalance }: DashboardProps) {
  const stats = result?.stats;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Средний баланс"
          value={stats ? `${formatMoney(stats.averageFinalBalance)} ₽` : "—"}
          hint={`старт ${formatMoney(startingBalance)} ₽`}
        />
        <StatCard
          title="Средний профит"
          value={stats ? formatProfit(stats.averageProfit) : "—"}
          hint="итог − старт"
          valueClassName={stats ? (stats.averageProfit >= 0 ? "text-pos" : "text-neg") : ""}
        />
        <StatCard
          title="Банкротство"
          value={stats ? `${stats.bankruptcyRate.toFixed(1)}%` : "—"}
          hint="доля с нулевым балансом"
          valueClassName={stats && stats.bankruptcyRate > 20 ? "text-neg" : ""}
        />
        <StatCard
          title="Винрейт"
          value={stats ? `${stats.winRate.toFixed(1)}%` : "—"}
          hint={`теория ${stats?.theoreticalWinRate.toFixed(1) ?? "—"}%`}
        />
      </div>

      <div className="glass p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ozon-text">Траектории баланса</h3>
          <span className="text-xs text-ozon-muted">{MONTE_CARLO_ITERATIONS} игроков</span>
        </div>
        <MonteCarloChart result={result} numberOfBets={numberOfBets} />
      </div>
    </div>
  );
}
