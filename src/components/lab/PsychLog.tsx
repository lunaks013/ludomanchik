import { AnimatePresence, motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useTelemetry } from "../../context/TelemetryContext";

const TYPE_COLORS: Record<string, string> = {
  near_miss: "text-orange-400",
  martingale_trap: "text-red-400",
  illusion_of_control: "text-amber-400",
  top_up: "text-fuchsia-400",
  bankruptcy: "text-red-500",
  win_streak: "text-emerald-400",
  loss_streak: "text-slate-400",
  big_win: "text-yellow-400",
  chase_loss: "text-orange-300",
  parameter_change: "text-cyan-400",
  dalembert_escalation: "text-violet-400",
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
        <Brain className="h-4 w-4 text-violet-400" />
        <p className="text-xs font-bold text-slate-300">Псих-лог (научный терминал)</p>
      </div>

      <div className="max-h-52 overflow-y-auto rounded-lg border border-white/5 bg-[#030712]/80 p-2 font-mono text-[10px] leading-relaxed">
        <AnimatePresence initial={false}>
          {psychLog.length === 0 ? (
            <p className="p-2 text-slate-600">Ожидание поведенческих событий…</p>
          ) : (
            psychLog.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="border-b border-white/5 py-2 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">{formatTime(event.timestamp)}</span>
                  <span className={`font-bold uppercase ${TYPE_COLORS[event.type] ?? "text-slate-400"}`}>
                    [{event.type}]
                  </span>
                </div>
                <p className="mt-1 text-slate-300">{event.message}</p>
                {event.brainRegion && (
                  <p className="mt-0.5 text-violet-400/70">
                    → Активированный регион: {event.brainRegion}
                  </p>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
