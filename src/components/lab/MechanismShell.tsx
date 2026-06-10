import { AnimatePresence, motion } from "framer-motion";
import { useTelemetry } from "../../context/TelemetryContext";
import { MECHANISMS } from "../../math/mechanisms";
import { CryptoDice } from "../games/CryptoDice";
import { CyberWheel } from "../games/CyberWheel";
import { QuantumCrash } from "../games/QuantumCrash";
import { RetroSlots } from "../games/RetroSlots";

export function MechanismShell() {
  const {
    activeMechanism,
    sessions,
    isPlaying,
    params,
    provablyFair,
    rotateSeeds,
    revealSeed,
    playGame,
    customRules,
  } = useTelemetry();

  const session = sessions[activeMechanism];
  const info = MECHANISMS[activeMechanism];
  const canPlay = session.balance > 0 && !isPlaying;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{info.gameShell}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{info.technicalName}</p>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-600">{info.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-slate-500">Текущий капитал</p>
          <p className="text-xl font-bold tabular-nums text-slate-900">
            {session.balance.toLocaleString("ru-RU")} ₽
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {[
          { label: "Итераций", val: session.betsPlayed },
          { label: "Положит.", val: session.wins },
          { label: "Отрицат.", val: session.losses },
          { label: "Серия −", val: session.consecutiveLosses },
        ].map((s) => (
          <div key={s.label} className="lab-stat-pill">
            <p className="text-[10px] uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="text-lg font-semibold text-slate-900">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-1 items-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMechanism}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeMechanism === "lcg" && (
              <RetroSlots lastResult={session.lastResult} isSpinning={isPlaying} />
            )}
            {activeMechanism === "csprng" && (
              <QuantumCrash
                lastResult={session.lastResult}
                isPlaying={isPlaying}
                crashTarget={params.crashTarget}
              />
            )}
            {activeMechanism === "weightedWheel" && (
              <CyberWheel lastResult={session.lastResult} isSpinning={isPlaying} />
            )}
            {activeMechanism === "provablyFair" && (
              <CryptoDice
                lastResult={session.lastResult}
                isRolling={isPlaying}
                provablyFair={provablyFair}
                diceThreshold={customRules.winThreshold}
                onRotateSeeds={() => void rotateSeeds()}
                onRevealSeed={revealSeed}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          disabled={!canPlay}
          onClick={() => void playGame()}
          className="lab-btn-primary flex-1 disabled:opacity-40"
        >
          {isPlaying
            ? "Выполняется итерация…"
            : session.balance <= 0
              ? "Капитал исчерпан"
              : "Выполнить итерацию"}
        </button>
      </div>
    </div>
  );
}
