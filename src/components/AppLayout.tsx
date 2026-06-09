import { Link, Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-ozon-bg">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-[74px] md:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-ozon-border bg-navy py-10 text-white/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 md:px-6">
          <div>
            <p className="text-sm font-bold text-white">
              Анализ гемблинга (лудомании) на примере создания собственной программы и сводки результатов
            </p>
            <p className="mt-1 text-xs">Дипломная работа · 2026 · учебный исследовательский проект</p>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm">
            <Link to="/" className="no-underline hover:text-accent-light">Главная</Link>
            <Link to="/theory" className="no-underline hover:text-accent-light">Теория</Link>
            <Link to="/games" className="no-underline hover:text-accent-light">Программа</Link>
            <Link to="/results" className="no-underline hover:text-accent-light">Итоги</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
