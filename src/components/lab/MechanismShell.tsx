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
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{info.gameShell}</h2>
          <p className="text-xs text-slate-400">{info.technicalName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Баланс</p>
          <motion.p
            key={session.balance}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-black tabular-nums text-white"
          >
            {session.balance.toLocaleString("ru-RU")} ₽
          </motion.p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {[
          { label: "Ставок", val: session.betsPlayed },
          { label: "Побед", val: session.wins },
          { label: "Проигр.", val: session.losses },
          { label: "Серия −", val: session.consecutiveLosses },
        ].map((s) => (
          <div key={s.label} className="lab-stat-pill">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="text-lg font-bold text-white">{s.val}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMechanism}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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

      <div className="mt-4 flex gap-3">
        <motion.button
          type="button"
          disabled={!canPlay}
          onClick={() => void playGame()}
          whileHover={{ scale: canPlay ? 1.02 : 1 }}
          whileTap={{ scale: canPlay ? 0.98 : 1 }}
          className="lab-btn-primary flex-1 disabled:opacity-40"
        >
          {isPlaying ? "Обработка…" : session.balance <= 0 ? "Банкротство" : "Играть"}
        </motion.button>
      </div>
    </div>
  );
}
