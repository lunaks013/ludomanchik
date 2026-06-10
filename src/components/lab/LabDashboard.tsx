import { ControlSidebar } from "./ControlSidebar";
import { MechanismShell } from "./MechanismShell";
import { TelemetryPanel } from "./TelemetryPanel";
import { BankruptcyAlert } from "./BankruptcyAlert";

export function LabDashboard() {
  return (
    <div className="lab-root">
      <header className="lab-header">
        <div>
          <p className="lab-label">Лаборатория поведенческих исследований</p>
          <h1 className="text-lg font-black text-white md:text-xl">
            Телеметрическая панель · Анализ лудомании
          </h1>
        </div>
        <div className="hidden text-right text-xs text-slate-500 md:block">
          <p>Дипломная работа · 2026</p>
          <p className="text-slate-600">E[profit] &lt; 0 ∀ механизмов рандомизации</p>
        </div>
      </header>

      <div className="lab-grid">
        <div className="lab-sidebar-left">
          <ControlSidebar />
        </div>

        <main className="lab-center">
          <MechanismShell />
        </main>

        <div className="lab-sidebar-right">
          <TelemetryPanel />
        </div>
      </div>

      <BankruptcyAlert />
    </div>
  );
}
