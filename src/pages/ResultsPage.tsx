import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MechanismCompare } from "../components/MechanismCompare";
import { PageHeader } from "../components/PageHeader";
import { PsychLog } from "../components/lab/PsychLog";
import { StatCard } from "../components/StatCard";
import { useTelemetry, MONTE_CARLO_PATHWAYS } from "../context/TelemetryContext";
import { compareAllMechanisms } from "../math/monteCarlo";
import { MECHANISMS } from "../math/mechanisms";
import type { MechanismComparison } from "../math/monteCarlo";

function formatMoney(n: number): string {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " ₽";
}

function formatProfit(n: number): string {
  const sign = n >= 0 ? "+" : "−";
  return sign + formatMoney(Math.abs(n)).replace(" ₽", "") + " ₽";
}

export function ResultsPage() {
  const { params, mcResult, activeMechanism, sessions, customRules } = useTelemetry();
  const [comparison, setComparison] = useState<MechanismComparison[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setComparison(compareAllMechanisms(params, customRules));
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [params, customRules]);

  const stats = mcResult?.stats;
  const info = MECHANISMS[activeMechanism];

  const totalTopUps = Object.values(sessions).reduce((s, sess) => s + sess.topUpCount, 0);
  const totalDeposited = Object.values(sessions).reduce((s, sess) => s + sess.totalDeposited, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-[74px] md:px-6">
      <PageHeader
        label="Сводка результатов"
        title="Итоги анализа"
        description="Сравнительная таблица по четырём механизмам RNG. Независимо от алгоритма средний профит остаётся отрицательным."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard title="Пополнений счёта" value={String(totalTopUps)} hint="поведенческий маркер" />
        <StatCard title="Всего внесено" value={formatMoney(totalDeposited)} hint="по всем модулям" />
      </div>

      {mcResult ? (
        <>
          <p className="mb-4 text-sm text-slate-600">
            Последний расчёт: <strong className="text-slate-900">{info.gameShell}</strong> ({info.label})
          </p>
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Средний остаток"
              value={formatMoney(stats!.averageFinalBalance)}
              hint={`старт ${formatMoney(params.initialBalance)}`}
            />
            <StatCard
              title="Средний Δ"
              value={formatProfit(stats!.averageProfit)}
              valueClassName={stats!.averageProfit >= 0 ? "text-pos" : "text-neg"}
            />
            <StatCard
              title="Исчерпание капитала"
              value={`${stats!.bankruptcyRate.toFixed(1)}%`}
              valueClassName={stats!.bankruptcyRate > 20 ? "text-neg" : ""}
            />
            <StatCard
              title="Доля положит. исходов"
              value={`${stats!.winRate.toFixed(1)}%`}
              hint={`теория ${stats!.theoreticalWinRate.toFixed(1)}%`}
            />
          </div>
        </>
      ) : (
        <div className="glass mb-10 p-10 text-center">
          <p className="text-slate-600">Расчёт Монте-Карло ещё не выполнялся.</p>
          <Link to="/games" className="btn-primary mt-4 inline-flex">
            Открыть программу
          </Link>
        </div>
      )}

      <section className="mb-10">
        <h2 className="heading-lg mb-1">Сравнение механизмов</h2>
        <p className="mb-5 text-sm text-slate-600">
          Капитал {formatMoney(params.initialBalance)} · ставка {formatMoney(params.baseBet)} ·{" "}
          {MONTE_CARLO_PATHWAYS} траекторий Монте-Карло
        </p>
        {loading || !comparison ? (
          <div className="glass p-12 text-center text-slate-500">Выполняется расчёт…</div>
        ) : (
          <MechanismCompare data={comparison} />
        )}
      </section>

      {comparison && (
        <div className="glass mb-10 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Механизм</th>
                <th>Модуль</th>
                <th className="text-right">Edge</th>
                <th className="text-right">Средний Δ</th>
                <th className="hidden text-right sm:table-cell">Исчерпание</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => {
                const m = MECHANISMS[row.mechanism];
                return (
                  <tr key={row.mechanism}>
                    <td className="font-medium text-slate-900">{row.label}</td>
                    <td className="text-slate-600">{row.gameShell}</td>
                    <td className="text-right text-neg">−{m.houseEdge}%</td>
                    <td
                      className={`text-right font-medium ${row.stats.averageProfit >= 0 ? "text-pos" : "text-neg"}`}
                    >
                      {formatProfit(row.stats.averageProfit)}
                    </td>
                    <td className="hidden text-right text-slate-600 sm:table-cell">
                      {row.stats.bankruptcyRate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <PsychLog />

      <div className="mt-8 flex gap-4">
        <Link to="/games" className="btn-primary">
          Программа
        </Link>
        <Link to="/theory" className="btn-outline">
          Теория
        </Link>
      </div>
    </div>
  );
}
