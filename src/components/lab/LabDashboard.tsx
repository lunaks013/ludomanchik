import { ControlSidebar } from "./ControlSidebar";
import { MechanismShell } from "./MechanismShell";
import { TelemetryPanel } from "./TelemetryPanel";
import { BankruptcyAlert } from "./BankruptcyAlert";

export function LabDashboard() {
  return (
    <div className="lab-root">
      <header className="lab-header">
        <div>
          <p className="lab-label">Программный комплекс · Практическая часть дипломной работы</p>
          <h1 className="text-base font-bold text-slate-900 md:text-lg">
            Исследовательская платформа анализа лудомании
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Сравнительный анализ четырёх механизмов генерации случайных чисел
          </p>
        </div>
        <div className="hidden text-right text-xs text-slate-500 md:block">
          <p className="font-medium text-slate-700">Дипломная работа · 2026</p>
          <p>Математическое ожидание E[Δ] &lt; 0 при всех механизмах</p>
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
