import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ExcitementLog } from "../components/ExcitementLog";
import { MechanismCompare } from "../components/MechanismCompare";
import { PageHeader } from "../components/PageHeader";
import { SiteImage } from "../components/SiteImage";
import { StatCard } from "../components/StatCard";
import { useGameContext } from "../context/GameContext";
import { IMAGES } from "../lib/images";
import { MECHANISMS } from "../lib/mechanisms";
import { compareAllMechanisms, MONTE_CARLO_ITERATIONS } from "../lib/monteCarlo";
import type { MechanismComparison } from "../types";

function formatMoney(n: number): string {
  return n.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " ₽";
}

function formatProfit(n: number): string {
  const sign = n >= 0 ? "+" : "−";
  return sign + formatMoney(Math.abs(n)).replace(" ₽", "") + " ₽";
}

export function ResultsPage() {
  const { params, mcResults, activeMechanism, excitementLog, sessions } = useGameContext();
  const [comparison, setComparison] = useState<MechanismComparison[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setComparison(compareAllMechanisms(params));
      setLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [params]);

  const lastResult = mcResults[activeMechanism];
  const stats = lastResult?.stats;
  const info = MECHANISMS[activeMechanism];

  const totalTopUps = Object.values(sessions).reduce((s, sess) => s + sess.topUpCount, 0);
  const totalDeposited = Object.values(sessions).reduce((s, sess) => s + sess.totalDeposited, 0);

  return (
    <div>
      <PageHeader
        label="Сводка результатов"
        title="Итоги анализа"
        description="Сравнение всех 4 механизмов рандома. Какой бы генератор ни использовался — средний профит отрицательный."
      />

      <SiteImage
        src={IMAGES.analytics}
        alt="Сводка результатов"
        className="illustration-banner mb-8 md:min-h-[200px]"
        aspect="banner"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard title="Пополнений баланса" value={String(totalTopUps)} hint="триггер «отыграюсь»" />
        <StatCard title="Всего внесено" value={formatMoney(totalDeposited)} hint="по всем моделям" />
      </div>

      {lastResult ? (
        <>
          <p className="mb-4 text-sm text-ozon-muted">
            Последний анализ: <strong className="text-ozon-text">{info.gameShell}</strong> ({info.label})
          </p>
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Средний баланс" value={formatMoney(stats!.averageFinalBalance)} hint={`старт ${formatMoney(params.startingBalance)}`} />
            <StatCard title="Средний профит" value={formatProfit(stats!.averageProfit)} valueClassName={stats!.averageProfit >= 0 ? "text-pos" : "text-neg"} />
            <StatCard title="Банкротство" value={`${stats!.bankruptcyRate.toFixed(1)}%`} valueClassName={stats!.bankruptcyRate > 20 ? "text-neg" : ""} />
            <StatCard title="Винрейт" value={`${stats!.winRate.toFixed(1)}%`} hint={`теория ${stats!.theoreticalWinRate.toFixed(1)}%`} />
          </div>
        </>
      ) : (
        <div className="glass mb-10 p-10 text-center">
          <p className="text-ozon-muted">Монте-Карло ещё не запускался.</p>
          <Link to="/games" className="btn-primary mt-4 inline-flex">Открыть программу</Link>
        </div>
      )}

      <section className="mb-10">
        <h2 className="heading-lg mb-1">Сравнение механизмов</h2>
        <p className="mb-5 text-sm text-ozon-muted">
          Банк {formatMoney(params.startingBalance)} · ставка {formatMoney(params.baseBet)} ·{" "}
          {params.numberOfBets} раундов · {MONTE_CARLO_ITERATIONS} прогонов
        </p>
        {loading || !comparison ? (
          <div className="glass p-12 text-center text-ozon-muted">Считаем статистику…</div>
        ) : (
          <MechanismCompare data={comparison} />
        )}
      </section>

      {comparison && (
        <div className="glass mb-10 overflow-hidden">
          <table>
            <thead>
              <tr>
                <th>Механизм</th>
                <th>Модель</th>
                <th className="text-right">Мат. ожидание</th>
                <th className="text-right">Профит</th>
                <th className="hidden text-right sm:table-cell">Банкротство</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => {
                const m = MECHANISMS[row.mechanism];
                return (
                  <tr key={row.mechanism}>
                    <td className="font-semibold">{row.label}</td>
                    <td className="text-ozon-muted">{row.gameShell}</td>
                    <td className="text-right text-neg">−{m.houseEdge}%</td>
                    <td className={`text-right font-medium ${row.stats.averageProfit >= 0 ? "text-pos" : "text-neg"}`}>
                      {formatProfit(row.stats.averageProfit)}
                    </td>
                    <td className="hidden text-right text-ozon-muted sm:table-cell">
                      {row.stats.bankruptcyRate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ExcitementLog events={excitementLog} />

      <div className="mt-8 flex gap-4">
        <Link to="/games" className="btn-primary">Программа</Link>
        <Link to="/theory" className="btn-outline">Теория</Link>
      </div>
    </div>
  );
}
