import { motion } from "framer-motion";
import type { ProvablyFairState } from "../../types";

interface CryptoDiceProps {
  lastResult: string | null;
  isRolling: boolean;
  provablyFair: ProvablyFairState;
  diceThreshold: number;
  onRotateSeeds: () => void;
  onRevealSeed: () => void;
}

function parseRoll(message: string | null): number | null {
  if (!message) return null;
  const match = message.match(/Кости: (\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function parseHash(message: string | null): string | null {
  if (!message) return null;
  const match = message.match(/хеш ([a-f0-9]+)/i);
  return match?.[1] ?? null;
}

export function CryptoDice({
  lastResult,
  isRolling,
  provablyFair,
  diceThreshold,
  onRotateSeeds,
  onRevealSeed,
}: CryptoDiceProps) {
  const roll = parseRoll(lastResult);
  const hash = parseHash(lastResult);
  const won = lastResult?.includes("+") ?? false;

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <div className="rounded-xl border border-violet-500/20 bg-slate-900/40 p-4 backdrop-blur-xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-violet-400/70">
          Provably Fair · SHA-256
        </p>
        <div className="space-y-2 font-mono text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500">Хеш серверного seed (до броска):</span>
            <span className="break-all text-violet-300">{provablyFair.serverSeedHash || "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500">Клиентский seed:</span>
            <span className="break-all text-slate-300">{provablyFair.clientSeed || "—"}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-slate-500">Nonce: <span className="text-white">{provablyFair.nonce}</span></span>
            {provablyFair.revealed && (
              <span className="text-slate-500">Server: <span className="break-all text-emerald-400">{provablyFair.serverSeed}</span></span>
            )}
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={onRotateSeeds} className="lab-btn-secondary text-xs">
            Новые seed
          </button>
          <button type="button" onClick={onRevealSeed} className="lab-btn-secondary text-xs">
            Раскрыть server seed
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8">
        <motion.div
          className="relative flex h-28 w-28 items-center justify-center rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/50 to-slate-950 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
          animate={
            isRolling
              ? { rotate: [0, 360, 720], scale: [1, 1.1, 1] }
              : roll !== null
                ? { rotate: 0, scale: won ? [1, 1.08, 1] : 1 }
                : {}
          }
          transition={isRolling ? { duration: 0.8, ease: "easeInOut" } : { type: "spring" }}
        >
          <span
            className={`text-5xl font-black tabular-nums ${
              roll === null ? "text-slate-600" : roll >= diceThreshold ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {isRolling ? "?" : roll ?? "—"}
          </span>
        </motion.div>

        <div className="text-left">
          <p className="text-sm text-slate-400">Порог выигрыша</p>
          <p className="text-3xl font-bold text-violet-300">≥ {diceThreshold}</p>
          {hash && (
            <p className="mt-2 font-mono text-xs text-slate-500">
              SHA-256: {hash}…
            </p>
          )}
        </div>
      </div>

      {lastResult && !isRolling && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center text-sm font-medium ${won ? "text-emerald-400" : "text-red-400"}`}
        >
          {lastResult}
        </motion.p>
      )}
    </div>
  );
}
