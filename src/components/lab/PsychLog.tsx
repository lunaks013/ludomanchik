import { FileText } from "lucide-react";
import { useTelemetry } from "../../context/TelemetryContext";

const TYPE_LABELS: Record<string, string> = {
  near_miss: "Near-miss",
  martingale_trap: "Мартингейл",
  illusion_of_control: "Иллюзия контроля",
  top_up: "Пополнение",
  bankruptcy: "Исчерпание капитала",
  win_streak: "Серия положит.",
  loss_streak: "Серия отрицат.",
  big_win: "Крупный исход",
  chase_loss: "Chasing losses",
  parameter_change: "Изменение параметра",
  dalembert_escalation: "Д'Аламбер",
};

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function PsychLog() {
  const { psychLog } = useTelemetry();

  return (
    <div className="lab-panel">
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-slate-500" />
        <p className="text-xs font-semibold text-slate-700">Журнал поведенческих наблюдений</p>
      </div>

      <div className="max-h-52 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-2 font-mono text-[10px] leading-relaxed">
        {psychLog.length === 0 ? (
          <p className="p-2 text-slate-400">Ожидание событий экспериментальной сессии…</p>
        ) : (
          psychLog.map((event) => (
            <div key={event.id} className="border-b border-slate-200 py-2 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{formatTime(event.timestamp)}</span>
                <span className="font-semibold text-[#1e3a5f]">
                  [{TYPE_LABELS[event.type] ?? event.type}]
                </span>
              </div>
              <p className="mt-1 text-slate-700">{event.message}</p>
              {event.brainRegion && (
                <p className="mt-0.5 text-slate-500">Нейрокогнитивный коррелят: {event.brainRegion}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
