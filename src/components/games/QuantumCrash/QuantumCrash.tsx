import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { RANDOMIZER_META } from "../../../math/researchEngine";
import { useTelemetry } from "../../../state/useTelemetry";

export function QuantumCrash() {
  const { settings, lastOutcome, isRoundRunning } = useTelemetry();
  const crashPoint = Number(lastOutcome?.details.crashPoint ?? 1);
  const points = Array.from({ length: 28 }, (_, index) => {
    const progress = (index + 1) / 28;
    return {
      step: index + 1,
      value: Math.max(1, 1 + (crashPoint - 1) * Math.pow(progress, 1.45)),
    };
  });

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300/80">Механизм 2</p>
            <h2 className="mt-2 text-2xl font-bold text-white">CSPRNG / Quantum Crash</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              {RANDOMIZER_META.csprng.researchFocus}
            </p>
          </div>
          <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-200">
            EV −4%
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
          <div className="h-72 rounded-2xl border border-white/5 bg-slate-950/60 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points}>
                <defs>
                  <linearGradient id="crashLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="step" hide />
                <YAxis hide domain={[1, "auto"]} />
                <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="url(#crashLine)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-center rounded-2xl border border-white/5 bg-slate-950/60 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Multiplier</p>
            <motion.p
              animate={isRoundRunning ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={{ repeat: isRoundRunning ? Infinity : 0, duration: 0.7 }}
              className="mt-2 text-5xl font-black tabular-nums text-cyan-100"
            >
              {isRoundRunning ? "…" : `${crashPoint.toFixed(2)}×`}
            </motion.p>
            <p className="mt-4 text-sm text-slate-400">
              Целевой cash-out: <span className="font-semibold text-white">{settings.crashCashOut.toFixed(2)}×</span>
            </p>
            <button
              type="button"
              className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100"
            >
              Cash-out является параметром модели
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 text-sm leading-relaxed text-slate-300">
        Криптографически стойкий источник энтропии делает исход непредсказуемым, но отрицательное
        математическое ожидание задаётся правилами выплаты, а не качеством случайности.
      </div>
    </div>
  );
}
