import { Link, Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-cosmic-950">
      <Navbar />
      <main className="mx-auto max-w-[1600px]">
        <Outlet />
      </main>
      <footer className="border-t border-white/5 bg-cosmic-900/80 py-8 text-slate-500 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 md:px-6">
          <div>
            <p className="text-sm font-bold text-slate-300">Анализ гемблинга (лудомании)</p>
            <p className="mt-1 text-xs">Дипломная работа · 2026 · научно-исследовательская платформа</p>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm">
            <Link to="/" className="no-underline hover:text-cyan-400">Главная</Link>
            <Link to="/theory" className="no-underline hover:text-cyan-400">Теория</Link>
            <Link to="/games" className="no-underline hover:text-cyan-400">Лаборатория</Link>
            <Link to="/results" className="no-underline hover:text-cyan-400">Итоги</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
