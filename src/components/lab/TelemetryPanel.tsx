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
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  hint?: string;
}) {
  return (
    <div className="lab-metric-widget">
      <div className="mb-2 text-slate-500">{icon}</div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-[10px] text-slate-400">{hint}</p>}
    </div>
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
        <p className="lab-label">Панель аналитики</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{info.researchFocus}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MetricWidget
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Вероятность исчерпания капитала"
          value={(stats?.bankruptcyRate ?? metrics.bankruptcyProbabilityIndex).toFixed(1)}
          unit="%"
          hint={`${MONTE_CARLO_PATHWAYS} траекторий Монте-Карло`}
        />
        <MetricWidget
          icon={<TrendingDown className="h-4 w-4" />}
          label="Скорость декапитализации"
          value={(stats?.capitalDecayRate ?? metrics.averageCapitalDecayRate).toFixed(1)}
          unit="%"
          hint="Δ капитала / начальный баланс"
        />
        <MetricWidget
          icon={<Wallet className="h-4 w-4" />}
          label="Системная маржа"
          value={Math.round(stats?.houseMargin ?? metrics.accumulatedHouseMargin).toLocaleString("ru-RU")}
          unit="₽"
          hint="Накопленная разница в пользу системы"
        />
        <MetricWidget
          icon={<Activity className="h-4 w-4" />}
          label="Доля положит. исходов"
          value={
            stats
              ? stats.winRate.toFixed(1)
              : session.betsPlayed > 0
                ? ((session.wins / session.betsPlayed) * 100).toFixed(1)
                : "—"
          }
          unit="%"
          hint={`теоретическая ${stats?.theoreticalWinRate.toFixed(1) ?? info.theoreticalWinRate}%`}
        />
      </div>

      <div className="lab-panel flex-1">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-700">Динамика капитала</p>
          <button
            type="button"
            disabled={isSimulating}
            onClick={runMonteCarloSim}
            className="lab-btn-secondary px-3 py-1.5 text-[10px] disabled:opacity-40"
          >
            {isSimulating ? "Расчёт…" : `Монте-Карло (n=${MONTE_CARLO_PATHWAYS})`}
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
          <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
            <span className="text-slate-500">Средний итог</span>
            <p className="font-semibold text-slate-900">
              {Math.round(stats.averageFinalBalance).toLocaleString("ru-RU")} ₽
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
            <span className="text-slate-500">Средний Δ</span>
            <p className={`font-semibold ${stats.averageProfit >= 0 ? "text-pos" : "text-neg"}`}>
              {stats.averageProfit >= 0 ? "+" : ""}
              {Math.round(stats.averageProfit).toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>
      )}

      <PsychLog />
    </aside>
  );
}
