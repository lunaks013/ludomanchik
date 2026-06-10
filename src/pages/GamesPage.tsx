import { useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import { useTelemetry } from "../context/TelemetryContext";
import type { MechanismId } from "../types";

export function GamesPage() {
  const {
    activeMechanism,
    setActiveMechanism,
    sessions,
    params,
    setParams,
    playGame,
    topUp,
    runMonteCarloSim,
    isPlaying,
    isSimulating,
    mcResult,
  } = useTelemetry();

  const tabs = useMemo(
    () =>
      [
        { id: "lcg", label: "Рулетка", title: "Рулетка", image: "/images/roulette.svg" },
        { id: "csprng", label: "Кости", title: "Кости", image: "/images/dice.svg" },
        { id: "provablyFair", label: "Карты", title: "Карты", image: "/images/cards.svg" },
        { id: "weightedWheel", label: "Слот", title: "Слот", image: "/images/slot.svg" },
      ] satisfies Array<{ id: MechanismId; label: string; title: string; image: string }>,
    [],
  );

  const active = tabs.find((tab) => tab.id === activeMechanism) ?? tabs[0];
  const session = sessions[activeMechanism];
  const result = mcResult?.stats;

  return (
    <div className="px-4 pb-20 pt-[74px] md:px-6">
      <PageHeader
        label="Практическая часть"
        title="Программа"
        description="4 механизма рандома в 4 игровых оболочках. Играйте, пополняйте баланс, запускайте Монте-Карло."
      />

      <div className="tab-bar mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveMechanism(tab.id)}
            className={`tab-btn ${activeMechanism === tab.id ? "tab-btn-active" : "tab-btn-inactive"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-5 overflow-hidden rounded-card bg-navy">
        <img src={active.image} alt={active.title} className="game-preview-img" />
      </div>

      <section className="glass p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-ozon-border pb-5">
          <div>
            <h2 className="text-2xl font-bold text-ozon-text">{active.title}</h2>
            <p className="mt-1 text-sm text-gold">
              Демонстрационная игровая оболочка для исследования поведения пользователя
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ozon-muted">Баланс</p>
            <p className="text-3xl font-bold text-ozon-text">{session.balance.toLocaleString("ru-RU")} ₽</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Ставок", val: session.betsPlayed },
            { label: "Побед", val: session.wins },
            { label: "Пополнений", val: session.topUpCount },
            { label: "Внесено", val: `${session.totalDeposited.toLocaleString("ru-RU")} ₽` },
          ].map((item) => (
            <div key={item.label} className="rounded-card bg-slate-50 py-3 text-center">
              <p className="text-xs text-ozon-muted">{item.label}</p>
              <p className="mt-1 font-bold text-ozon-text">{item.val}</p>
            </div>
          ))}
        </div>

        {session.lastResult && (
          <p
            className={`mb-5 rounded-card px-4 py-3 text-sm font-medium ${
              session.lastResult.includes("+") || session.lastResult.includes("положительный")
                ? "bg-green-50 text-pos"
                : session.lastResult.toLowerCase().includes("near") || session.lastResult.includes("почти")
                  ? "bg-amber-50 text-amber-700"
                  : "bg-slate-50 text-ozon-muted"
            }`}
          >
            {session.lastResult}
          </p>
        )}

        <div className="flex flex-wrap items-end gap-3">
          <label>
            <span className="mb-1 block text-xs font-medium text-ozon-muted">Ставка</span>
            <input
              type="number"
              min={1}
              value={params.baseBet}
              onChange={(event) => setParams({ baseBet: Math.max(1, Number(event.target.value) || 1) })}
              className="input-field w-28"
            />
          </label>
          <button
            type="button"
            disabled={isPlaying || session.balance <= 0}
            onClick={() => void playGame()}
            className="btn-primary disabled:opacity-40"
          >
            {isPlaying ? "Играем…" : "Играть"}
          </button>
          <button type="button" onClick={topUp} className="btn-outline">
            Пополнить +{params.initialBalance.toLocaleString("ru-RU")} ₽
          </button>
          <button type="button" disabled={isSimulating} onClick={runMonteCarloSim} className="btn-outline">
            {isSimulating ? "Считаем…" : "Монте-Карло"}
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="glass p-5">
          <p className="text-xs text-ozon-muted">Банкротство</p>
          <p className="mt-2 text-2xl font-bold text-ozon-text">{result ? `${result.bankruptcyRate.toFixed(1)}%` : "—"}</p>
        </div>
        <div className="glass p-5">
          <p className="text-xs text-ozon-muted">Средний баланс</p>
          <p className="mt-2 text-2xl font-bold text-ozon-text">
            {result ? `${Math.round(result.averageFinalBalance).toLocaleString("ru-RU")} ₽` : "—"}
          </p>
        </div>
        <div className="glass p-5">
          <p className="text-xs text-ozon-muted">Средний профит</p>
          <p className={`mt-2 text-2xl font-bold ${result && result.averageProfit < 0 ? "text-neg" : "text-pos"}`}>
            {result ? `${Math.round(result.averageProfit).toLocaleString("ru-RU")} ₽` : "—"}
          </p>
        </div>
        <div className="glass p-5">
          <p className="text-xs text-ozon-muted">Винрейт</p>
          <p className="mt-2 text-2xl font-bold text-ozon-text">{result ? `${result.winRate.toFixed(1)}%` : "—"}</p>
        </div>
      </section>
    </div>
  );
}
