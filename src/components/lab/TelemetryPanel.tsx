import { motion } from "framer-motion";
import { Activity, AlertTriangle, TrendingDown, Wallet } from "lucide-react";
import { useTelemetry, MONTE_CARLO_PATHWAYS } from "../../context/TelemetryContext";
import { MECHANISMS } from "../../math/mechanisms";
import { PsychLog } from "./PsychLog";
import { SessionChart } from "./SessionChart";

function MetricWidget({
  icon,
  label,
  value,
  unit,
  accent,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  accent: string;
  hint?: string;
}) {
  return (
    <motion.div
      layout
      className="lab-metric-widget"
      style={{ borderColor: `${accent}20` }}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-lg p-2" style={{ background: `${accent}15`, color: accent }}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black tabular-nums text-white">
        {value}
        {unit && <span className="ml-1 text-sm font-semibold text-slate-400">{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-[10px] text-slate-500">{hint}</p>}
    </motion.div>
  );
}

export function TelemetryPanel() {
  const {
    activeMechanism,
    sessions,
    params,
    mcResult,
    metrics,
    isSimulating,
    runMonteCarloSim,
  } = useTelemetry();

  const session = sessions[activeMechanism];
  const info = MECHANISMS[activeMechanism];
  const stats = mcResult?.stats;

  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div>
        <p className="lab-label">Аналитическая сетка</p>
        <p className="text-xs text-slate-500">{info.researchFocus}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MetricWidget
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Индекс вероятности банкротства"
          value={(stats?.bankruptcyRate ?? metrics.bankruptcyProbabilityIndex).toFixed(1)}
          unit="%"
          accent="#ef4444"
          hint={`${MONTE_CARLO_PATHWAYS} траекторий Монте-Карло`}
        />
        <MetricWidget
          icon={<TrendingDown className="h-4 w-4" />}
          label="Средняя скорость декапитализации"
          value={(stats?.capitalDecayRate ?? metrics.averageCapitalDecayRate).toFixed(1)}
          unit="%"
          accent="#f97316"
          hint="Δ капитала / начальный баланс"
        />
        <MetricWidget
          icon={<Wallet className="h-4 w-4" />}
          label="Накопленная маржа дома"
          value={Math.round(stats?.houseMargin ?? metrics.accumulatedHouseMargin).toLocaleString("ru-RU")}
          unit="₽"
          accent="#a78bfa"
          hint="Сумма, поглощённая системой"
        />
        <MetricWidget
          icon={<Activity className="h-4 w-4" />}
          label="Винрейт / теория"
          value={stats ? stats.winRate.toFixed(1) : session.betsPlayed > 0 ? ((session.wins / session.betsPlayed) * 100).toFixed(1) : "—"}
          unit="%"
          accent="#22d3ee"
          hint={`теория ${stats?.theoreticalWinRate.toFixed(1) ?? info.theoreticalWinRate}%`}
        />
      </div>

      <div className="lab-panel flex-1">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-300">Траектории баланса</p>
          <button
            type="button"
            disabled={isSimulating}
            onClick={runMonteCarloSim}
            className="lab-btn-secondary px-3 py-1.5 text-[10px] disabled:opacity-40"
          >
            {isSimulating ? "Расчёт…" : `Монте-Карло ×${MONTE_CARLO_PATHWAYS}`}
          </button>
        </div>
        <SessionChart
          result={mcResult}
          livePathway={session.pathway}
          startingBalance={params.initialBalance}
        />
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-white/5 bg-slate-900/30 p-2">
            <span className="text-slate-500">Средний итог</span>
            <p className="font-bold text-white">{Math.round(stats.averageFinalBalance).toLocaleString("ru-RU")} ₽</p>
          </div>
          <div className="rounded-lg border border-white/5 bg-slate-900/30 p-2">
            <span className="text-slate-500">Средний профит</span>
            <p className={`font-bold ${stats.averageProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {stats.averageProfit >= 0 ? "+" : ""}{Math.round(stats.averageProfit).toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>
      )}

      <PsychLog />
    </aside>
  );
}
