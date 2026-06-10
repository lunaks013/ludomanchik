import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { WHEEL_SECTORS } from "../../math/weightedWheel";

interface CyberWheelProps {
  lastResult: string | null;
  isSpinning: boolean;
}

function parseSector(message: string | null): string | null {
  if (!message) return null;
  const match = message.match(/«([^»]+)»/);
  return match?.[1] ?? null;
}

export function CyberWheel({ lastResult, isSpinning }: CyberWheelProps) {
  const sectorLabel = parseSector(lastResult);
  const sectorIndex = sectorLabel
    ? WHEEL_SECTORS.findIndex((s) => s.label === sectorLabel)
    : 0;
  const [rotation, setRotation] = useState(0);
  const isNearMiss = lastResult?.includes("NEAR-MISS") ?? false;

  useEffect(() => {
    if (isSpinning) {
      setRotation((prev) => prev + 1800 + Math.random() * 360);
    } else if (lastResult && sectorIndex >= 0) {
      const sliceAngle = 360 / WHEEL_SECTORS.length;
      const target = 360 * 5 + sectorIndex * sliceAngle + sliceAngle / 2;
      setRotation(target);
    }
  }, [isSpinning, lastResult, sectorIndex]);

  const sliceAngle = 360 / WHEEL_SECTORS.length;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
          <div className="h-0 w-0 border-x-[10px] border-b-[18px] border-x-transparent border-b-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]" />
        </div>

        <motion.div
          className="relative h-72 w-72 rounded-full border-2 border-fuchsia-500/30 shadow-[0_0_80px_rgba(192,38,211,0.15)]"
          animate={{ rotate: rotation }}
          transition={
            isSpinning
              ? { duration: 0.3, ease: "linear", repeat: Infinity }
              : { type: "spring", stiffness: 40, damping: 12 }
          }
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            {WHEEL_SECTORS.map((sector, i) => {
              const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);
              const x1 = 100 + 90 * Math.cos(startAngle);
              const y1 = 100 + 90 * Math.sin(startAngle);
              const x2 = 100 + 90 * Math.cos(endAngle);
              const y2 = 100 + 90 * Math.sin(endAngle);
              const largeArc = sliceAngle > 180 ? 1 : 0;
              const midAngle = ((i + 0.5) * sliceAngle - 90) * (Math.PI / 180);
              const tx = 100 + 60 * Math.cos(midAngle);
              const ty = 100 + 60 * Math.sin(midAngle);

              return (
                <g key={sector.id}>
                  <path
                    d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={sector.color}
                    opacity={0.85}
                    stroke="#030712"
                    strokeWidth="1"
                  />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                    transform={`rotate(${i * sliceAngle + sliceAngle / 2}, ${tx}, ${ty})`}
                  >
                    {sector.label}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="15" fill="#0b1329" stroke="#c026d3" strokeWidth="2" />
          </svg>
        </motion.div>

        {isNearMiss && !isSpinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 rounded-full border-2 border-orange-400 shadow-[0_0_40px_rgba(251,146,60,0.5)]"
          />
        )}
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.3em] text-fuchsia-400/70">
        Кибер-колесо · Weighted Near-Miss
      </p>

      {lastResult && !isSpinning && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-sm text-center text-sm font-medium ${
            isNearMiss ? "text-orange-400" : lastResult.includes("+") ? "text-emerald-400" : "text-slate-400"
          }`}
        >
          {lastResult}
        </motion.p>
      )}
    </div>
  );
}
