import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { SlotSymbol } from "../../math/lcg";
import { SLOT_SYMBOLS } from "../../math/lcg";

const SYMBOL_DISPLAY: Record<SlotSymbol, { label: string; color: string }> = {
  "7": { label: "7", color: "#fbbf24" },
  BAR: { label: "BAR", color: "#ef4444" },
  CH: { label: "♣", color: "#22c55e" },
  LM: { label: "♦", color: "#f97316" },
  OR: { label: "●", color: "#a78bfa" },
};

interface RetroSlotsProps {
  lastResult: string | null;
  isSpinning: boolean;
  onSpinComplete?: () => void;
}

function parseReels(message: string | null): [SlotSymbol, SlotSymbol, SlotSymbol] | null {
  if (!message) return null;
  const match = message.match(/([7BARCHLMOR|]+)/);
  if (!match) return null;
  const parts = match[1].split("|").map((s) => s.trim()) as SlotSymbol[];
  if (parts.length === 3 && parts.every((p) => SLOT_SYMBOLS.includes(p))) {
    return [parts[0], parts[1], parts[2]];
  }
  return null;
}

function Reel({ symbol, spinning, delay }: { symbol: SlotSymbol; spinning: boolean; delay: number }) {
  const display = SYMBOL_DISPLAY[symbol];
  return (
    <div className="relative h-32 w-24 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-slate-800/80 to-slate-950/90 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]">
      <motion.div
        className="flex flex-col items-center"
        animate={
          spinning
            ? { y: [0, -800, 0] }
            : { y: 0 }
        }
        transition={
          spinning
            ? { duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }
            : { type: "spring", stiffness: 300, damping: 25 }
        }
      >
        {spinning
          ? Array.from({ length: 12 }).map((_, i) => {
              const sym = SLOT_SYMBOLS[i % SLOT_SYMBOLS.length];
              const d = SYMBOL_DISPLAY[sym];
              return (
                <div
                  key={i}
                  className="flex h-32 w-24 items-center justify-center text-2xl font-black"
                  style={{ color: d.color }}
                >
                  {d.label}
                </div>
              );
            })
          : (
            <div
              className="flex h-32 w-24 items-center justify-center text-3xl font-black"
              style={{ color: display.color }}
            >
              {display.label}
            </div>
          )}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-cyan-400/40 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
    </div>
  );
}

export function RetroSlots({ lastResult, isSpinning }: RetroSlotsProps) {
  const parsed = parseReels(lastResult);
  const defaultReels: [SlotSymbol, SlotSymbol, SlotSymbol] = parsed ?? ["OR", "LM", "CH"];
  const [displayReels, setDisplayReels] = useState(defaultReels);
  const prevSpinning = useRef(false);

  useEffect(() => {
    if (isSpinning && !prevSpinning.current) {
      setDisplayReels(["OR", "LM", "CH"]);
    }
    if (!isSpinning && prevSpinning.current && parsed) {
      setDisplayReels(parsed);
    }
    prevSpinning.current = isSpinning;
  }, [isSpinning, parsed]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-slate-950/50 p-8 shadow-[0_0_60px_rgba(251,191,36,0.08)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-amber-400/70">
          Retro Slots · LCG PRNG
        </p>
        <div className="flex gap-3">
          {displayReels.map((sym, i) => (
            <Reel key={i} symbol={sym} spinning={isSpinning} delay={i * 0.15} />
          ))}
        </div>
      </div>
      {lastResult && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-md text-center text-sm font-medium ${
            lastResult.includes("+") ? "text-emerald-400" : lastResult.includes("NEAR") ? "text-orange-400" : "text-slate-400"
          }`}
        >
          {lastResult}
        </motion.p>
      )}
    </div>
  );
}
