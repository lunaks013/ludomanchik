import { Link, Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <Navbar />
      <main className="mx-auto max-w-[1600px]">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-8 text-slate-500">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 md:px-6">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Анализ гемблинга (лудомании) на примере программного комплекса
            </p>
            <p className="mt-1 text-xs">Дипломная работа · 2026 · исследовательское ПО, не коммерческий продукт</p>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm">
            <Link to="/" className="no-underline text-slate-600 hover:text-[#1e3a5f]">Главная</Link>
            <Link to="/theory" className="no-underline text-slate-600 hover:text-[#1e3a5f]">Теория</Link>
            <Link to="/games" className="no-underline text-slate-600 hover:text-[#1e3a5f]">Программа</Link>
            <Link to="/results" className="no-underline text-slate-600 hover:text-[#1e3a5f]">Итоги</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
