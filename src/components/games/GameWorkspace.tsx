import { AnimatePresence, motion } from "framer-motion";
import { Play, TrendingDown } from "lucide-react";
import { CryptoDice } from "./CryptoDice/CryptoDice";
import { CyberWheel } from "./CyberWheel/CyberWheel";
import { QuantumCrash } from "./QuantumCrash/QuantumCrash";
import { RetroSlots } from "./RetroSlots/RetroSlots";
import { calculateNextBet } from "../../math/bettingStrategies";
import { RANDOMIZER_META } from "../../math/researchEngine";
import { useTelemetry } from "../../state/useTelemetry";

export function GameWorkspace() {
  const { settings, stats, previousBetUnavailable, lastOutcome, isRoundRunning, playRound } = useWorkspaceData();
  const meta = RANDOMIZER_META[settings.activeRandomizer];

  return (
    <main className="min-w-0 overflow-y-auto p-5 xl:p-6">
      <div className="mb-5 rounded-3xl border border-white/5 bg-slate-900/40 p-5 backdrop-blur-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300/80">
              Поведенческая телеметрия · активный модуль
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white xl:text-3xl">{meta.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{meta.subtitle}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/70 px-5 py-4 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Баланс</p>
            <p className="mt-1 text-3xl font-black tabular-nums text-white">
              {settings.balance.toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <InfoPill label="Раундов" value={stats.totalRounds.toString()} />
          <InfoPill label="Серия проигрышей" value={stats.lossStreak.toString()} risk={stats.lossStreak >= 3} />
          <InfoPill label="Следующая ставка" value={`${previousBetUnavailable.toLocaleString("ru-RU")} ₽`} />
          <InfoPill label="Маржа системы" value={`${Math.round(stats.accumulatedHouseMargin).toLocaleString("ru-RU")} ₽`} risk />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={settings.activeRandomizer}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.22 }}
        >
          {settings.activeRandomizer === "lcg" && <RetroSlots />}
          {settings.activeRandomizer === "csprng" && <QuantumCrash />}
          {settings.activeRandomizer === "weighted" && <CyberWheel />}
          {settings.activeRandomizer === "provablyFair" && <CryptoDice />}
        </motion.div>
      </AnimatePresence>

      {lastOutcome && (
        <div className="mt-5 rounded-2xl border border-white/5 bg-slate-900/40 p-4 text-sm text-slate-300">
          <p className={lastOutcome.profit >= 0 ? "font-semibold text-emerald-300" : "font-semibold text-red-300"}>
            Последний исход: {lastOutcome.message}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={settings.balance <= 0 || isRoundRunning}
          onClick={() => void playRound()}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.22)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Play className="h-4 w-4" />
          {isRoundRunning ? "Выполняется расчёт…" : "Выполнить научную итерацию"}
        </button>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          <TrendingDown className="h-4 w-4" />
          Демонстрация отрицательного математического ожидания
        </div>
      </div>
    </main>
  );
}

function useWorkspaceData() {
  const telemetry = useTelemetry();
  const nextBet = calculateNextBet(telemetry.settings.strategy, {
    balance: telemetry.settings.balance,
    baseBet: telemetry.settings.baseBet,
    previousBet: telemetry.settings.baseBet,
    lastRoundWon: null,
    lossStreak: telemetry.stats.lossStreak,
    maxBet: telemetry.settings.balance,
  }).nextBet;
  return { ...telemetry, previousBetUnavailable: nextBet };
}

function InfoPill({ label, value, risk = false }: { label: string; value: string; risk?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className={risk ? "mt-1 text-xl font-black text-red-200" : "mt-1 text-xl font-black text-white"}>{value}</p>
    </div>
  );
}
