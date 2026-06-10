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
    <div className="px-4 pb-20 pt-[74px] md:px-6">
      <PageHeader
        label="Сводка результатов"
        title="Итоги анализа"
        description="Сравнение всех 4 механизмов рандома. Какой бы генератор ни использовался — средний профит отрицательный."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard title="Пополнений баланса" value={String(totalTopUps)} hint="триггер «отыграюсь»" />
        <StatCard title="Всего внесено" value={formatMoney(totalDeposited)} hint="по всем играм" />
      </div>

      {mcResult ? (
        <>
          <p className="mb-4 text-sm text-slate-400">
            Последний анализ: <strong className="text-white">{info.gameShell}</strong> ({info.label})
          </p>
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Средний баланс" value={formatMoney(stats!.averageFinalBalance)} hint={`старт ${formatMoney(params.initialBalance)}`} />
            <StatCard title="Средний профит" value={formatProfit(stats!.averageProfit)} valueClassName={stats!.averageProfit >= 0 ? "text-pos" : "text-neg"} />
            <StatCard title="Банкротство" value={`${stats!.bankruptcyRate.toFixed(1)}%`} valueClassName={stats!.bankruptcyRate > 20 ? "text-neg" : ""} />
            <StatCard title="Винрейт" value={`${stats!.winRate.toFixed(1)}%`} hint={`теория ${stats!.theoreticalWinRate.toFixed(1)}%`} />
          </div>
        </>
      ) : (
        <div className="glass mb-10 p-10 text-center">
          <p className="text-slate-400">Монте-Карло ещё не запускался.</p>
          <Link to="/games" className="btn-primary mt-4 inline-flex">Открыть лабораторию</Link>
        </div>
      )}

      <section className="mb-10">
        <h2 className="heading-lg mb-1">Сравнение механизмов</h2>
        <p className="mb-5 text-sm text-slate-400">
          Банк {formatMoney(params.initialBalance)} · ставка {formatMoney(params.baseBet)} ·{" "}
          {MONTE_CARLO_PATHWAYS} траекторий Монте-Карло
        </p>
        {loading || !comparison ? (
          <div className="glass p-12 text-center text-slate-400">Считаем статистику…</div>
        ) : (
          <MechanismCompare data={comparison} />
        )}
      </section>

      {comparison && (
        <div className="glass mb-10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-slate-400">
                <th className="px-4 py-3">Механизм</th>
                <th className="px-4 py-3">Игра</th>
                <th className="px-4 py-3 text-right">Edge</th>
                <th className="px-4 py-3 text-right">Профит</th>
                <th className="hidden px-4 py-3 text-right sm:table-cell">Банкротство</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => {
                const m = MECHANISMS[row.mechanism];
                return (
                  <tr key={row.mechanism} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 font-semibold text-white">{row.label}</td>
                    <td className="px-4 py-3 text-slate-400">{row.gameShell}</td>
                    <td className="px-4 py-3 text-right text-neg">−{m.houseEdge}%</td>
                    <td className={`px-4 py-3 text-right font-medium ${row.stats.averageProfit >= 0 ? "text-pos" : "text-neg"}`}>
                      {formatProfit(row.stats.averageProfit)}
                    </td>
                    <td className="hidden px-4 py-3 text-right text-slate-400 sm:table-cell">
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
        <Link to="/games" className="btn-primary">Лаборатория</Link>
        <Link to="/theory" className="btn-outline">Теория</Link>
      </div>
    </div>
  );
}
