import { useEffect, useState } from "react";
import { Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface QuantumCrashProps {
  lastResult: string | null;
  isPlaying: boolean;
  crashTarget: number;
}

function parseCrashData(message: string | null): { crashPoint: number; won: boolean } | null {
  if (!message) return null;
  const match = message.match(/t\*=([\d.]+)/i);
  if (!match) return null;
  return {
    crashPoint: parseFloat(match[1]),
    won: message.includes("положительный"),
  };
}

export function QuantumCrash({ lastResult, isPlaying, crashTarget }: QuantumCrashProps) {
  const parsed = parseCrashData(lastResult);
  const [chartData, setChartData] = useState<{ step: number; value: number }[]>([]);

  useEffect(() => {
    if (!isPlaying && parsed) {
      const points = Array.from({ length: 20 }, (_, i) => {
        const progress = (i + 1) / 20;
        const value = 1 + (parsed.crashPoint - 1) * progress;
        return { step: i + 1, value: Math.round(value * 100) / 100 };
      });
      setChartData(points);
    } else if (isPlaying) {
      setChartData([]);
    }
  }, [isPlaying, lastResult]); // eslint-disable-line react-hooks/exhaustive-deps

  const isWin = parsed?.won ?? false;

  return (
    <div className="lab-module-frame">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <h3 className="text-sm font-semibold text-slate-800">Модуль II — CSPRNG</h3>
        <p className="mt-1 text-xs text-slate-500">
          Экспоненциальная модель прекращения роста (crypto.getRandomValues)
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs text-slate-500">Порог фиксации t*</span>
          <p className="font-mono font-semibold text-slate-800">{crashTarget.toFixed(2)}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-xs text-slate-500">Фактическое t*</span>
          <p className="font-mono font-semibold text-slate-800">
            {isPlaying ? "…" : parsed ? parsed.crashPoint.toFixed(2) : "—"}
          </p>
        </div>
      </div>

      <div className="mb-4 h-48 rounded-md border border-slate-200 bg-slate-50 p-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis dataKey="step" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} domain={[1, "auto"]} />
              <ReferenceLine y={crashTarget} stroke="#1e3a5f" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="value" stroke="#1e3a5f" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            {isPlaying ? "Выполняется итерация…" : "График траектории появится после итерации"}
          </div>
        )}
      </div>

      {lastResult && !isPlaying && (
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
