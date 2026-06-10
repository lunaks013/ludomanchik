import { TerminalSquare } from "lucide-react";
import { useTelemetry } from "../../state/useTelemetry";

export function PsychLog() {
  const { events } = useTelemetry();
  return (
    <section className="rounded-2xl border border-white/5 bg-slate-950/70 p-4">
      <div className="mb-3 flex items-center gap-2">
        <TerminalSquare className="h-4 w-4 text-cyan-300" />
        <h3 className="text-sm font-bold text-white">Psych-Log · поведенческая телеметрия</h3>
      </div>
      <div className="h-56 overflow-y-auto rounded-xl border border-white/5 bg-black/30 p-3 font-mono text-[11px] leading-relaxed">
        {events.map((event) => (
          <div key={event.id} className="border-b border-white/5 py-2 last:border-0">
            <p className={event.type === "bankruptcy" ? "text-red-300" : event.type === "nearMiss" ? "text-amber-200" : "text-slate-300"}>
              {event.message}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
