import { motion } from "framer-motion";
import { RotateCcw, SlidersHorizontal, Zap } from "lucide-react";
import { getStrategyDescription, getStrategyName } from "../../math/bettingStrategies";
import { RANDOMIZER_META } from "../../math/researchEngine";
import { useTelemetry } from "../../state/useTelemetry";
import type { BettingStrategyId, RandomizerId } from "../../types/simulation";

const randomizers = Object.values(RANDOMIZER_META);
const strategies: BettingStrategyId[] = ["flat", "martingale", "dalembert"];

export function ControlSidebar() {
  const {
    settings,
    updateSettings,
    setRandomizer,
    setStrategy,
    applyCustomRule,
    topUp,
    resetSession,
  } = useTelemetry();

  return (
    <aside className="h-full overflow-y-auto border-r border-white/5 bg-slate-950/50 p-4 backdrop-blur-2xl">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300/80">Механизм RNG</p>
        <div className="mt-3 space-y-2">
          {randomizers.map((item) => {
            const active = settings.activeRandomizer === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRandomizer(item.id as RandomizerId)}
                className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                  active
                    ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_28px_rgba(34,211,238,0.12)]"
                    : "border-white/5 bg-slate-900/40 hover:border-white/15"
                }`}
              >
                <p className={active ? "text-sm font-semibold text-cyan-100" : "text-sm font-semibold text-slate-100"}>
                  {item.shortTitle}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-slate-400">{item.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-900/40 p-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-violet-300" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Параметры</p>
        </div>

        <NumberField
          label="Начальный баланс"
          value={settings.initialBalance}
          min={100}
          step={100}
          onChange={(value) => updateSettings({ initialBalance: value, balance: value })}
        />
        <NumberField
          label="Базовая ставка"
          value={settings.baseBet}
          min={1}
          step={10}
          onChange={(value) => updateSettings({ baseBet: value })}
        />
        <NumberField
          label="Seed LCG"
          value={settings.lcgSeed}
          min={1}
          step={1}
          onChange={(value) => updateSettings({ lcgSeed: value })}
        />

        {settings.activeRandomizer === "csprng" && (
          <NumberField
            label="Cash-out множитель"
            value={settings.crashCashOut}
            min={1.1}
            step={0.1}
            onChange={(value) => updateSettings({ crashCashOut: value })}
          />
        )}

        {settings.activeRandomizer === "provablyFair" && (
          <NumberField
            label="Порог dice"
            value={settings.diceThreshold}
            min={5}
            max={95}
            step={1}
            onChange={(value) => updateSettings({ diceThreshold: value })}
          />
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-white/5 bg-slate-900/40 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Стратегия ставок</p>
        <div className="mt-3 space-y-2">
          {strategies.map((strategy) => (
            <button
              key={strategy}
              type="button"
              onClick={() => setStrategy(strategy)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-xs transition ${
                settings.strategy === strategy
                  ? "border-violet-400/50 bg-violet-400/10 text-violet-100"
                  : "border-white/5 bg-slate-950/40 text-slate-300 hover:border-white/15"
              }`}
            >
              <span className="font-semibold">{getStrategyName(strategy)}</span>
              <span className="mt-1 block text-[11px] text-slate-500">{getStrategyDescription(strategy)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/5 bg-slate-900/40 p-4">
        <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
          Компилятор правил
        </label>
        <textarea
          value={settings.customRule}
          onChange={(event) => updateSettings({ customRule: event.target.value })}
          className="mt-3 h-28 w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs leading-relaxed text-slate-200 outline-none focus:border-cyan-400/40"
        />
        <button
          type="button"
          onClick={() => applyCustomRule(settings.customRule)}
          className="mt-3 w-full rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Применить правило
        </button>
        <p className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-[11px] leading-relaxed text-amber-100">
          Предупреждение: изменение правил может формировать иллюзию контроля, но не отменяет
          отрицательное математическое ожидание.
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <motion.button
          type="button"
          onClick={topUp}
          whileTap={{ scale: 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm font-semibold text-amber-100"
        >
          <Zap className="h-4 w-4" />
          Симулировать дофаминовое пополнение
        </motion.button>
        <button
          type="button"
          onClick={resetSession}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-200"
        >
          <RotateCcw className="h-4 w-4" />
          Сбросить сессию
        </button>
      </div>
    </aside>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max?: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-400">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Math.max(min, Number(event.target.value) || min))}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/40"
      />
    </label>
  );
}
