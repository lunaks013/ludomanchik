import { motion } from "framer-motion";
import { Zap, RefreshCw, Wallet } from "lucide-react";
import { useTelemetry } from "../../context/TelemetryContext";
import { getStrategyDescription, getStrategyLabel } from "../../math/betting";
import { ALL_MECHANISM_IDS, MECHANISMS } from "../../math/mechanisms";
import type { BettingStrategy, MechanismId } from "../../types";
import { RuleCompiler } from "./RuleCompiler";

const STRATEGIES: BettingStrategy[] = ["flat", "martingale", "dalembert"];

const MECHANISM_ICONS: Record<MechanismId, string> = {
  lcg: "🎰",
  csprng: "🚀",
  weightedWheel: "🎡",
  provablyFair: "🎲",
};

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
        <div className="mt-2 space-y-1.5">
          {ALL_MECHANISM_IDS.map((id) => {
            const m = MECHANISMS[id];
            const active = activeMechanism === id;
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => setActiveMechanism(id)}
                whileHover={{ x: 2 }}
                className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                  active
                    ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                    : "border-white/5 bg-slate-900/30 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{MECHANISM_ICONS[id]}</span>
                  <div>
                    <p className={`text-sm font-semibold ${active ? "text-cyan-300" : "text-white"}`}>
                      {m.gameShell}
                    </p>
                    <p className="text-[10px] text-slate-500">{m.label}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="lab-panel">
        <p className="lab-label">Телеметрия сессии</p>

        <label className="lab-field">
          <span>Начальный баланс</span>
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
          <span>Базовая ставка</span>
          <input
            type="number"
            min={1}
            value={params.baseBet}
            onChange={(e) => setParams({ baseBet: Math.max(1, Number(e.target.value) || 1) })}
            className="lab-input"
          />
        </label>

        <div className="lab-field">
          <span>Стратегия ставок</span>
          <div className="mt-1.5 space-y-1">
            {STRATEGIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setParams({ strategy: s })}
                className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition ${
                  params.strategy === s
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-white/5 text-slate-400 hover:border-white/10"
                }`}
              >
                <span className="font-semibold">{getStrategyLabel(s)}</span>
                <p className="mt-0.5 text-[10px] opacity-70">{getStrategyDescription(s)}</p>
              </button>
            ))}
          </div>
        </div>

        {activeMechanism === "csprng" && (
          <label className="lab-field">
            <span>Цель кэшаута (Crash)</span>
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
        <motion.button
          type="button"
          onClick={topUp}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`lab-btn-dopamine w-full ${showBankruptcyAlert ? "animate-pulse ring-2 ring-red-500/60" : ""}`}
        >
          <Zap className="h-4 w-4" />
          Симуляция мгновенного дофаминового пополнения
        </motion.button>

        <button type="button" onClick={resetSession} className="lab-btn-secondary w-full">
          <RefreshCw className="h-4 w-4" />
          Сброс сессии
        </button>

        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-slate-400">
            <Wallet className="h-3.5 w-3.5" />
            <span>Внесено: {session.totalDeposited.toLocaleString("ru-RU")} ₽</span>
          </div>
          <p className="mt-1">Пополнений: {session.topUpCount}</p>
        </div>
      </div>
    </aside>
  );
}
