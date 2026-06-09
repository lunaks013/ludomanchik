import { MECHANISMS } from "../lib/mechanisms";
import type { ExcitementEvent, ExcitementType } from "../types";

const LABELS: Record<ExcitementType, string> = {
  top_up: "Пополнение",
  win_streak: "Серия побед",
  near_miss: "Near-miss",
  recovery: "Восстановление баланса",
  big_win: "Крупный положительный исход",
};

interface ExcitementLogProps {
  events: ExcitementEvent[];
}

export function ExcitementLog({ events }: ExcitementLogProps) {
  return (
    <div className="glass p-5">
      <p className="text-sm font-semibold text-ozon-text">
        Журнал поведенческих событий {events.length > 0 && <span className="text-ozon-muted">({events.length})</span>}
      </p>

      {events.length === 0 ? (
        <p className="mt-2 text-xs text-ozon-muted">
          Проведите симуляцию или пополните баланс — события появятся здесь.
        </p>
      ) : (
        <ul className="mt-3 max-h-40 space-y-2 overflow-y-auto">
          {events.map((e, i) => (
            <li key={`${e.timestamp}-${i}`} className="border-b border-ozon-border pb-2 text-xs last:border-0">
              <span className="font-medium text-ozon-text">{LABELS[e.type]}</span>
              <span className="text-ozon-muted"> · {MECHANISMS[e.mechanism].gameShell}</span>
              <p className="mt-0.5 text-ozon-muted">{e.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
