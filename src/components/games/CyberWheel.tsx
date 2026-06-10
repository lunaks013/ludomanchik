import { WHEEL_SECTORS } from "../../math/weightedWheel";

interface CyberWheelProps {
  lastResult: string | null;
  isSpinning: boolean;
}

function parseSector(message: string | null): string | null {
  if (!message) return null;
  const match = message.match(/сектор «([^»]+)»/i);
  return match?.[1] ?? null;
}

export function CyberWheel({ lastResult, isSpinning }: CyberWheelProps) {
  const sectorLabel = parseSector(lastResult);
  const sector = sectorLabel ? WHEEL_SECTORS.find((s) => s.label === sectorLabel) : null;
  const isNearMiss = lastResult?.includes("near-miss") ?? false;
  const isWin = lastResult?.includes("положительный") ?? false;

  return (
    <div className="lab-module-frame">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <h3 className="text-sm font-semibold text-slate-800">Модуль III — Weighted RNG</h3>
        <p className="mt-1 text-xs text-slate-500">
          Взвешенное секторное распределение с возможным near-miss эффектом
        </p>
      </div>

      <table className="lab-data-table mb-4">
        <thead>
          <tr>
            <th>Сектор</th>
            <th>Вес</th>
            <th>Множитель</th>
            <th>Near-miss</th>
          </tr>
        </thead>
        <tbody>
          {WHEEL_SECTORS.map((s) => (
            <tr
              key={s.id}
              className={sector?.id === s.id ? "bg-slate-100 font-semibold" : ""}
            >
              <td>{s.label}</td>
              <td className="font-mono">{s.weight}</td>
              <td className="font-mono">×{s.multiplier}</td>
              <td>{s.isJackpot ? "—" : s.multiplier === 0 ? "возможен" : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs text-slate-500">Выбранный сектор</span>
          <p className="font-semibold text-slate-800">
            {isSpinning ? "…" : sectorLabel ?? "—"}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs text-slate-500">Near-miss</span>
          <p className="font-semibold text-slate-800">
            {isSpinning ? "…" : isNearMiss ? "Зафиксирован" : "Не зафиксирован"}
          </p>
        </div>
      </div>

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
