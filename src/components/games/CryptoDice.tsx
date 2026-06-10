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
  const match = message.match(/значение=(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function parseHash(message: string | null): string | null {
  if (!message) return null;
  const match = message.match(/хеш=([a-f0-9]+)/i);
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
  const isWin = lastResult?.includes("положительный") ?? false;

  return (
    <div className="lab-module-frame">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <h3 className="text-sm font-semibold text-slate-800">Модуль IV — Provably Fair</h3>
        <p className="mt-1 text-xs text-slate-500">
          Верифицируемый исход на базе SHA-256(serverSeed + clientSeed + nonce)
        </p>
      </div>

      <table className="lab-data-table mb-4 text-xs">
        <tbody>
          <tr>
            <td className="w-40 font-medium text-slate-600">Хеш server seed</td>
            <td className="break-all font-mono text-[11px]">{provablyFair.serverSeedHash || "—"}</td>
          </tr>
          <tr>
            <td className="font-medium text-slate-600">Client seed</td>
            <td className="break-all font-mono text-[11px]">{provablyFair.clientSeed || "—"}</td>
          </tr>
          <tr>
            <td className="font-medium text-slate-600">Nonce</td>
            <td className="font-mono">{provablyFair.nonce}</td>
          </tr>
          {provablyFair.revealed && (
            <tr>
              <td className="font-medium text-slate-600">Server seed (раскрыт)</td>
              <td className="break-all font-mono text-[11px] text-emerald-700">{provablyFair.serverSeed}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mb-4 flex gap-2">
        <button type="button" onClick={onRotateSeeds} className="lab-btn-secondary text-xs">
          Сгенерировать новые seed
        </button>
        <button type="button" onClick={onRevealSeed} className="lab-btn-secondary text-xs">
          Раскрыть server seed
        </button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-center">
          <span className="text-xs text-slate-500">Порог</span>
          <p className="font-mono font-semibold">≥ {diceThreshold}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-center">
          <span className="text-xs text-slate-500">Значение</span>
          <p className="font-mono font-semibold">{isRolling ? "…" : roll ?? "—"}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-center">
          <span className="text-xs text-slate-500">SHA-256</span>
          <p className="truncate font-mono text-[10px]">{hash ? `${hash}…` : "—"}</p>
        </div>
      </div>

      {lastResult && !isRolling && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            isWin ? "border-emerald-200 bg-emerald-50 lab-result-positive" : "border-red-200 bg-red-50 lab-result-negative"
          }`}
        >
          {lastResult}
        </div>
      )}
    </div>
  );
}
