import { useEffect, useRef, useState } from "react";
import type { SlotSymbol } from "../../math/lcg";
import { SLOT_SYMBOLS } from "../../math/lcg";

interface RetroSlotsProps {
  lastResult: string | null;
  isSpinning: boolean;
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

export function RetroSlots({ lastResult, isSpinning }: RetroSlotsProps) {
  const parsed = parseReels(lastResult);
  const [displayReels, setDisplayReels] = useState<[SlotSymbol, SlotSymbol, SlotSymbol] | null>(parsed);
  const prevSpinning = useRef(false);

  useEffect(() => {
    if (isSpinning) {
      setDisplayReels(null);
    } else if (parsed) {
      setDisplayReels(parsed);
    }
    prevSpinning.current = isSpinning;
  }, [isSpinning, parsed]);

  const isWin = lastResult?.includes("положительный") ?? false;
  const isNearMiss = lastResult?.includes("near-miss") ?? false;

  return (
    <div className="lab-module-frame">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <h3 className="text-sm font-semibold text-slate-800">Модуль I — LCG PRNG</h3>
        <p className="mt-1 text-xs text-slate-500">
          Трёхкомпонентная выборка на базе линейного конгруэнтного генератора
        </p>
      </div>

      <table className="lab-data-table mb-4">
        <thead>
          <tr>
            <th>Компонент</th>
            <th>R₁</th>
            <th>R₂</th>
            <th>R₃</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-medium text-slate-600">Значение</td>
            {isSpinning ? (
              <td colSpan={3} className="text-center text-slate-400 italic">
                Выполняется итерация…
              </td>
            ) : displayReels ? (
              displayReels.map((sym, i) => (
                <td key={i} className="text-center font-mono font-semibold">
                  {sym}
                </td>
              ))
            ) : (
              <td colSpan={3} className="text-center text-slate-400">
                Ожидание данных
              </td>
            )}
          </tr>
        </tbody>
      </table>

      {lastResult && !isSpinning && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            isWin
              ? "border-emerald-200 bg-emerald-50 lab-result-positive"
              : isNearMiss
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-slate-200 bg-slate-50 lab-result-neutral"
          }`}
        >
          {lastResult}
        </div>
      )}
    </div>
  );
}
