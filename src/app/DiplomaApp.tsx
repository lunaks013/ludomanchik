import { motion } from "framer-motion";
import { AcademicDisclaimer } from "../components/layout/AcademicDisclaimer";
import { ControlSidebar } from "../components/controls/ControlSidebar";
import { GameWorkspace } from "../components/games/GameWorkspace";
import { AnalyticsDashboard } from "../components/telemetry/AnalyticsDashboard";
import { SimulationProvider } from "../state/SimulationContext";

export function DiplomaApp() {
  return (
    <SimulationProvider>
      <div className="min-h-screen overflow-hidden bg-[#030712] text-slate-100">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.13),transparent_30%),linear-gradient(135deg,#030712_0%,#0b1329_55%,#030712_100%)]" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="border-b border-white/5 bg-slate-950/60 px-5 py-4 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300/80">
                  Дипломная работа · научно-исследовательский программный комплекс
                </p>
                <h1 className="mt-1 text-xl font-black tracking-tight text-white lg:text-2xl">
                  Анализ лудомании: отрицательное математическое ожидание и поведенческая телеметрия
                </h1>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-2 text-right text-xs text-slate-400">
                <p className="font-semibold text-slate-200">React · TypeScript · Crypto · Monte Carlo</p>
                <p>4 механизма RNG · 50 сессий × 100 раундов</p>
              </div>
            </motion.div>
          </header>

          <div className="mx-auto w-full max-w-[1800px] px-4 py-4">
            <AcademicDisclaimer />
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_390px]">
            <ControlSidebar />
            <GameWorkspace />
            <div className="hidden xl:block">
              <AnalyticsDashboard />
            </div>
          </div>

          <div className="block xl:hidden">
            <AnalyticsDashboard />
          </div>
        </div>
      </div>
    </SimulationProvider>
  );
}
