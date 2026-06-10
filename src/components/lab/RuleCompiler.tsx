import { AlertTriangle } from "lucide-react";
import { useTelemetry } from "../../context/TelemetryContext";

export function RuleCompiler() {
  const { customRules, setCustomRules, activeMechanism } = useTelemetry();

  const showDiceThreshold = activeMechanism === "provablyFair" || activeMechanism === "lcg";

  return (
    <div className="lab-panel">
      <p className="lab-label">Компилятор игровой логики</p>
      <p className="mb-3 text-[10px] leading-relaxed text-slate-500">
        Ручное изменение условий выигрыша. Активирует когнитивную иллюзию контроля.
      </p>

      {showDiceThreshold && (
        <label className="lab-field">
          <span>Порог выигрыша (0–99)</span>
          <input
            type="range"
            min={10}
            max={90}
            value={customRules.winThreshold}
            onChange={(e) => setCustomRules({ winThreshold: Number(e.target.value) })}
            className="w-full accent-violet-500"
          />
          <span className="text-sm font-bold text-violet-300">{customRules.winThreshold}</span>
        </label>
      )}

      <label className="lab-field">
        <span>Множитель выплат</span>
        <input
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={customRules.payoutMultiplier}
          onChange={(e) => setCustomRules({ payoutMultiplier: Number(e.target.value) })}
          className="w-full accent-amber-500"
        />
        <span className="text-sm font-bold text-amber-300">×{customRules.payoutMultiplier.toFixed(1)}</span>
      </label>

      {customRules.modified && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
          <p className="text-[11px] leading-relaxed text-orange-300">
            <strong>Предупреждение:</strong> активирована когнитивная иллюзия контроля.
            Изменение правил не меняет отрицательное матожидание E[profit] &lt; 0.
          </p>
        </div>
      )}
    </div>
  );
}
