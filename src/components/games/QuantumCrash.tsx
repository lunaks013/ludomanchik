import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface QuantumCrashProps {
  lastResult: string | null;
  isPlaying: boolean;
  crashTarget: number;
}

function parseCrashData(message: string | null): { crashPoint: number; won: boolean } | null {
  if (!message) return null;
  const match = message.match(/Crash @ ([\d.]+)/i);
  if (!match) return null;
  return {
    crashPoint: parseFloat(match[1]),
    won: message.includes("+"),
  };
}

export function QuantumCrash({ lastResult, isPlaying, crashTarget }: QuantumCrashProps) {
  const parsed = parseCrashData(lastResult);
  const [multiplier, setMultiplier] = useState(1.0);
  const [animating, setAnimating] = useState(false);
  const controls = useAnimation();
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) return;

    setAnimating(true);
    setMultiplier(1.0);
    const target = parsed?.crashPoint ?? 1 + Math.random() * 4;
    const start = performance.now();
    const duration = Math.min(3000, target * 600);

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = 1 + (target - 1) * eased;
      setMultiplier(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setAnimating(false);
        void controls.start({
          scale: parsed?.won ? [1, 1.05, 1] : [1, 0.95, 1],
          transition: { duration: 0.4 },
        });
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, lastResult]); // eslint-disable-line react-hooks/exhaustive-deps

  const crashed = parsed && !parsed.won && !animating;
  const won = parsed?.won && !animating;

  return (
    <div className="relative flex h-80 w-full flex-col items-center justify-end overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-t from-[#030712] via-[#0b1329] to-[#0f1a3a]">
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-white"
            style={{ left: `${(i * 17) % 100}%`, bottom: `${(i * 23) % 60}%` }}
            animate={{ y: [0, -300], opacity: [0.8, 0] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>

      <motion.div animate={controls} className="relative z-10 mb-8 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-400/60">
          Quantum Crash · CSPRNG
        </p>
        <motion.p
          className={`text-6xl font-black tabular-nums ${
            crashed ? "text-red-500" : won ? "text-emerald-400" : "text-cyan-300"
          }`}
          animate={crashed ? { color: ["#22d3ee", "#ef4444"] } : {}}
        >
          {multiplier.toFixed(2)}×
        </motion.p>
        <p className="mt-2 text-sm text-slate-400">
          Цель кэшаута: <span className="font-bold text-cyan-300">{crashTarget.toFixed(2)}×</span>
        </p>
      </motion.div>

      <svg className="absolute bottom-0 w-full" viewBox="0 0 400 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="crashGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={crashed ? "#ef4444" : "#22d3ee"} stopOpacity="0.6" />
            <stop offset="100%" stopColor={crashed ? "#ef4444" : "#22d3ee"} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={`M 0 120 Q 100 ${120 - multiplier * 15} 200 ${120 - multiplier * 25} T 400 ${120 - multiplier * 35}`}
          fill="url(#crashGrad)"
          stroke={crashed ? "#ef4444" : "#22d3ee"}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: animating || parsed ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        />
      </svg>

      {lastResult && !animating && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`relative z-10 mb-4 text-sm font-medium ${won ? "text-emerald-400" : "text-red-400"}`}
        >
          {lastResult}
        </motion.p>
      )}
    </div>
  );
}
