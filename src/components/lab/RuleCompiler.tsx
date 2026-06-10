import { AlertTriangle } from "lucide-react";
import { useTelemetry } from "../../context/TelemetryContext";

export function RuleCompiler() {
  const { customRules, setCustomRules, activeMechanism } = useTelemetry();

  const showThreshold = activeMechanism === "provablyFair" || activeMechanism === "lcg";

  return (
    <div className="lab-panel">
      <p className="lab-label">Настройка условий исхода</p>
      <p className="mb-3 text-[11px] leading-relaxed text-slate-500">
        Изменение параметров моделирует субъективное ощущение контроля над результатом.
      </p>

      {showThreshold && (
        <label className="lab-field">
          <span>Порог положительного исхода (0–99)</span>
          <input
            type="range"
            min={10}
            max={90}
            value={customRules.winThreshold}
            onChange={(e) => setCustomRules({ winThreshold: Number(e.target.value) })}
            className="w-full accent-[#1e3a5f]"
          />
          <span className="text-sm font-medium text-slate-800">{customRules.winThreshold}</span>
        </label>
      )}

      <label className="lab-field">
        <span>Коэффициент выплат</span>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={customRules.payoutMultiplier}
          onChange={(e) => setCustomRules({ payoutMultiplier: Number(e.target.value) })}
          className="w-full accent-[#1e3a5f]"
        />
        <span className="text-sm font-medium text-slate-800">×{customRules.payoutMultiplier.toFixed(1)}</span>
      </label>

      {customRules.modified && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <p className="text-[11px] leading-relaxed text-amber-900">
            <strong>Примечание:</strong> изменение условий активирует когнитивную иллюзию контроля.
            Математическое ожидание E[Δ] остаётся отрицательным.
          </p>
        </div>
      )}
    </div>
  );
}
