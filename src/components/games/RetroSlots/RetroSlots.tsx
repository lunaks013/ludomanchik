import { motion } from "framer-motion";
import { useMemo } from "react";
import { RANDOMIZER_META } from "../../../math/researchEngine";
import { useTelemetry } from "../../../state/useTelemetry";

const symbols = ["Σ", "μ", "σ", "R", "λ", "7"];

export function RetroSlots() {
  const { lastOutcome, isRoundRunning } = useTelemetry();
  const displayed = useMemo(() => {
    const reels = String(lastOutcome?.details.reels ?? "Σ, μ, σ").split(", ");
    return reels.length === 3 ? reels : ["Σ", "μ", "σ"];
  }, [lastOutcome]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300/80">Механизм 1</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Seedable PRNG / LCG</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              {RANDOMIZER_META.lcg.researchFocus}
            </p>
          </div>
          <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-200">
            EV −12%
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {displayed.map((symbol, index) => (
            <div
              key={`${symbol}-${index}`}
              className="relative h-36 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70"
            >
              <motion.div
                className="flex flex-col items-center"
                animate={isRoundRunning ? { y: [0, -520, 0] } : { y: 0 }}
                transition={{ duration: 0.9 + index * 0.12, ease: "easeInOut" }}
              >
                {(isRoundRunning ? Array.from({ length: 8 }, (_, i) => symbols[i % symbols.length]) : [symbol]).map(
                  (item, itemIndex) => (
                    <div
                      key={`${item}-${itemIndex}`}
                      className="flex h-36 w-full items-center justify-center font-mono text-4xl font-black text-cyan-100"
                    >
                      {item}
                    </div>
                  ),
                )}
              </motion.div>
              <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-300/30" />
            </div>
          ))}
        </div>
      </div>

      <ScientificExplanation
        title="Научная интерпретация"
        text="LCG позволяет воспроизвести последовательность по seed. Предсказуемость или равномерность генератора не меняет правила выплат: при house edge капитал убывает на длинной дистанции."
      />
    </div>
  );
}

function ScientificExplanation({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 text-sm leading-relaxed text-slate-300">
      <p className="mb-1 font-semibold text-white">{title}</p>
      {text}
    </div>
  );
}
