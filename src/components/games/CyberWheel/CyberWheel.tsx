import { motion } from "framer-motion";
import { WEIGHTED_SECTORS } from "../../../math/weightedRandom";
import { RANDOMIZER_META } from "../../../math/researchEngine";
import { useTelemetry } from "../../../state/useTelemetry";

export function CyberWheel() {
  const { lastOutcome, isRoundRunning } = useTelemetry();
  const dopamine = Number(lastOutcome?.details.dopamineSpike ?? 0);
  const selectedSector = String(lastOutcome?.details.sector ?? "—");
  const slice = 360 / WEIGHTED_SECTORS.length;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300/80">Механизм 3</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Weighted Dynamic Randomizer</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              {RANDOMIZER_META.weighted.researchFocus}
            </p>
          </div>
          <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-200">
            RTP 88%
          </span>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-[330px_1fr]">
          <div className="relative mx-auto h-72 w-72">
            <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-x-[10px] border-b-[18px] border-x-transparent border-b-cyan-300" />
            <motion.svg
              viewBox="0 0 200 200"
              className="h-full w-full rounded-full border border-white/10 bg-slate-950 shadow-[0_0_60px_rgba(16,185,129,0.12)]"
              animate={{ rotate: isRoundRunning ? 1440 : 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              {WEIGHTED_SECTORS.map((sector, index) => {
                const start = (index * slice - 90) * (Math.PI / 180);
                const end = ((index + 1) * slice - 90) * (Math.PI / 180);
                const x1 = 100 + 92 * Math.cos(start);
                const y1 = 100 + 92 * Math.sin(start);
                const x2 = 100 + 92 * Math.cos(end);
                const y2 = 100 + 92 * Math.sin(end);
                const labelAngle = ((index + 0.5) * slice - 90) * (Math.PI / 180);
                return (
                  <g key={sector.id}>
                    <path d={`M100 100 L${x1} ${y1} A92 92 0 0 1 ${x2} ${y2} Z`} fill={sector.color} opacity={0.8} />
                    <text
                      x={100 + 57 * Math.cos(labelAngle)}
                      y={100 + 57 * Math.sin(labelAngle)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="7"
                      fill="white"
                      fontWeight={700}
                    >
                      {sector.label}
                    </text>
                  </g>
                );
              })}
              <circle cx="100" cy="100" r="20" fill="#020617" stroke="rgba(255,255,255,0.25)" />
            </motion.svg>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Выбранный сектор</p>
              <p className="mt-2 text-3xl font-black text-white">{selectedSector}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>Индикатор дофаминового подкрепления</span>
                <span>{dopamine}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400"
                  animate={{ width: `${dopamine}%` }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-50">
              Near-miss предупреждение: высокий визуальный сектор рядом с выигрышем повышает субъективную
              мотивацию продолжать, хотя финансовый исход остаётся отрицательным.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
