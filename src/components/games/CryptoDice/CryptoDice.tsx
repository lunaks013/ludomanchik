import { motion } from "framer-motion";
import { Fingerprint, RefreshCw } from "lucide-react";
import { RANDOMIZER_META } from "../../../math/researchEngine";
import { useTelemetry } from "../../../state/useTelemetry";

export function CryptoDice() {
  const {
    settings,
    serverHash,
    clientSeed,
    nonce,
    setClientSeed,
    rotateProvablyFairSeeds,
    lastOutcome,
    isRoundRunning,
  } = useTelemetry();
  const roll = lastOutcome?.details.roll ?? "—";
  const hash = lastOutcome?.details.hash ?? "—";

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300/80">Механизм 4</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Provably Fair SHA-256 Dice</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              {RANDOMIZER_META.provablyFair.researchFocus}
            </p>
          </div>
          <Fingerprint className="h-8 w-8 text-violet-200" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
          <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-950/60 p-4">
            <ReadOnlyField label="Server seed hash (preview до броска)" value={serverHash || "генерация…"} />
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-[0.18em] text-slate-500">Client seed</span>
              <input
                value={clientSeed}
                onChange={(event) => setClientSeed(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 font-mono text-xs text-slate-100 outline-none focus:border-violet-300/40"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              <ReadOnlyField label="Nonce" value={String(nonce)} />
              <ReadOnlyField label="Порог" value={`≥ ${settings.diceThreshold}`} />
              <ReadOnlyField label="Hash фрагмент" value={String(hash)} />
            </div>
            <button
              type="button"
              onClick={() => void rotateProvablyFairSeeds()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-200"
            >
              <RefreshCw className="h-4 w-4" />
              Новые seed
            </button>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-950/60 p-5">
            <motion.div
              animate={isRoundRunning ? { y: [0, -18, 0], rotate: [0, 8, -8, 0] } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.7 }}
              className="flex h-28 w-28 items-center justify-center rounded-3xl border border-violet-300/30 bg-violet-300/10 text-5xl font-black text-violet-100 shadow-[0_0_40px_rgba(167,139,250,0.15)]"
            >
              {isRoundRunning ? "…" : roll}
            </motion.div>
            <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
              Исход детерминированно вычисляется из SHA-256(serverSeed + clientSeed + nonce).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="overflow-hidden text-ellipsis rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 font-mono text-xs text-slate-200">
        {value}
      </p>
    </div>
  );
}
