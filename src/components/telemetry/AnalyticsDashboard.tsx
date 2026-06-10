import { Activity, AlertTriangle, Banknote, BarChart3, Brain, Gauge, TrendingDown, Waves } from "lucide-react";
import { useTelemetry } from "../../state/useTelemetry";
import { MonteCarloChart } from "./MonteCarloChart";
import { PsychLog } from "./PsychLog";

export function AnalyticsDashboard() {
  const { settings, stats, monteCarlo, balancePath, runMonteCarlo, isRunningMonteCarlo } = useTelemetry();
  const addictionRisk = Math.min(
    100,
    stats.lossStreak * 9 +
      stats.nearMissEvents * 5 +
      stats.dopamineTopUps * 13 +
      stats.strategyChanges * 4 +
      stats.stakeChanges * 3,
  );
  const stakeChangeRate = stats.totalRounds > 0 ? (stats.stakeChanges / stats.totalRounds) * 100 : 0;

  return (
    <aside className="h-full overflow-y-auto border-l border-white/5 bg-slate-950/50 p-4 backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300/80">Аналитика</p>
          <h2 className="mt-1 text-lg font-black text-white">Сводка рисков</h2>
        </div>
        <button
          type="button"
          onClick={runMonteCarlo}
          disabled={isRunningMonteCarlo}
          className="rounded-xl bg-violet-400 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-violet-300 disabled:opacity-50"
        >
          {isRunningMonteCarlo ? "Расчёт…" : "Monte Carlo"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric icon={<AlertTriangle />} label="Вероятность банкротства" value={`${(monteCarlo?.bankruptcyProbability ?? 0).toFixed(1)}%`} risk />
        <Metric icon={<TrendingDown />} label="Убывание капитала" value={`${(monteCarlo?.averageCapitalDecayRate ?? 0).toFixed(1)}%`} risk />
        <Metric icon={<Banknote />} label="Маржа системы" value={`${Math.round(stats.accumulatedHouseMargin).toLocaleString("ru-RU")} ₽`} />
        <Metric icon={<Activity />} label="Количество раундов" value={stats.totalRounds.toString()} />
        <Metric icon={<Waves />} label="Серия проигрышей" value={stats.lossStreak.toString()} risk={stats.lossStreak >= 3} />
        <Metric icon={<Gauge />} label="Почти выигрыш" value={stats.nearMissEvents.toString()} risk={stats.nearMissEvents > 0} />
        <Metric icon={<Brain />} label="Индекс риска" value={`${addictionRisk.toFixed(0)}/100`} risk={addictionRisk >= 50} />
        <Metric icon={<BarChart3 />} label="Изм. ставок" value={`${stakeChangeRate.toFixed(1)}%`} />
      </div>

      <section className="mt-4 rounded-2xl border border-white/5 bg-slate-900/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Траектории капитала</h3>
          <span className="text-xs text-slate-500">50×100</span>
        </div>
        <MonteCarloChart result={monteCarlo} livePath={balancePath.length > 0 ? balancePath : [settings.balance]} />
      </section>

      <section className="mt-4 rounded-2xl border border-white/5 bg-slate-900/40 p-4">
        <h3 className="text-sm font-bold text-white">Математический вывод</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          При отрицательном математическом ожидании средняя траектория капитала убывает.
          Качество случайности влияет на предсказуемость, но не устраняет маржу системы.
        </p>
        <p className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-xs leading-relaxed text-red-100">
          EV: {monteCarlo ? `${monteCarlo.expectedValue.toFixed(2)} ₽/раунд` : "рассчитывается после Monte Carlo"}
        </p>
      </section>

      <div className="mt-4">
        <PsychLog />
      </div>
    </aside>
  );
}

function Metric({ icon, label, value, risk = false }: { icon: React.ReactNode; label: string; value: string; risk?: boolean }) {
  return (
    <div
      className={`rounded-2xl border bg-slate-900/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${
        risk ? "border-red-400/20" : "border-white/5"
      }`}
    >
      <div className={risk ? "mb-2 text-red-300" : "mb-2 text-cyan-300"}>{icon}</div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</p>
      <p className={risk ? "mt-1 text-xl font-black text-red-100" : "mt-1 text-xl font-black text-white"}>{value}</p>
    </div>
  );
}
