import { RefreshCw, RotateCcw, Wallet } from "lucide-react";
import { useTelemetry } from "../../context/TelemetryContext";
import { getStrategyDescription, getStrategyLabel } from "../../math/betting";
import { ALL_MECHANISM_IDS, MECHANISMS } from "../../math/mechanisms";
import type { BettingStrategy } from "../../types";
import { RuleCompiler } from "./RuleCompiler";

const STRATEGIES: BettingStrategy[] = ["flat", "martingale", "dalembert"];

export function ControlSidebar() {
  const {
    activeMechanism,
    setActiveMechanism,
    params,
    setParams,
    topUp,
    resetSession,
    sessions,
    showBankruptcyAlert,
  } = useTelemetry();

  const session = sessions[activeMechanism];

  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div>
        <p className="lab-label">Механизмы рандомизации</p>
        <div className="mt-2 space-y-1">
          {ALL_MECHANISM_IDS.map((id) => {
            const m = MECHANISMS[id];
            const active = activeMechanism === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveMechanism(id)}
                className={`w-full rounded-md border px-3 py-2.5 text-left transition ${
                  active
                    ? "border-[#1e3a5f] bg-slate-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <p className={`text-sm font-medium ${active ? "text-[#1e3a5f]" : "text-slate-800"}`}>
                  {m.label}
                </p>
                <p className="text-[11px] text-slate-500">{m.technicalName}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="lab-panel">
        <p className="lab-label">Параметры эксперимента</p>

        <label className="lab-field">
          <span>Начальный капитал, ₽</span>
          <input
            type="number"
            min={100}
            step={100}
            value={params.initialBalance}
            onChange={(e) =>
              setParams({ initialBalance: Math.max(100, Number(e.target.value) || 100) })
            }
            className="lab-input"
          />
        </label>

        <label className="lab-field">
          <span>Базовый размер ставки, ₽</span>
          <input
            type="number"
            min={1}
            value={params.baseBet}
            onChange={(e) => setParams({ baseBet: Math.max(1, Number(e.target.value) || 1) })}
            className="lab-input"
          />
        </label>

        <div className="lab-field">
          <span>Стратегия управления ставкой</span>
          <div className="mt-1.5 space-y-1">
            {STRATEGIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setParams({ strategy: s })}
                className={`w-full rounded-md border px-3 py-2 text-left text-xs transition ${
                  params.strategy === s
                    ? "border-[#1e3a5f] bg-slate-50 text-[#1e3a5f]"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="font-medium">{getStrategyLabel(s)}</span>
                <p className="mt-0.5 text-[11px] text-slate-500">{getStrategyDescription(s)}</p>
              </button>
            ))}
          </div>
        </div>

        {activeMechanism === "csprng" && (
          <label className="lab-field">
            <span>Порог фиксации t* (CSPRNG)</span>
            <input
              type="number"
              min={1.1}
              max={10}
              step={0.1}
              value={params.crashTarget}
              onChange={(e) =>
                setParams({ crashTarget: Math.min(10, Math.max(1.1, Number(e.target.value) || 2)) })
              }
              className="lab-input"
            />
          </label>
        )}
      </div>

      <RuleCompiler />

      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={topUp}
          className={`lab-btn-accent w-full ${showBankruptcyAlert ? "border-amber-400 bg-amber-50" : ""}`}
        >
          <RotateCcw className="h-4 w-4" />
          Симуляция повторного пополнения счёта
        </button>

        <button type="button" onClick={resetSession} className="lab-btn-secondary w-full">
          <RefreshCw className="h-4 w-4" />
          Сброс экспериментальной сессии
        </button>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Wallet className="h-3.5 w-3.5" />
            <span>Внесено средств: {session.totalDeposited.toLocaleString("ru-RU")} ₽</span>
          </div>
          <p className="mt-1">Количество пополнений: {session.topUpCount}</p>
        </div>
      </div>
    </aside>
  );
}
