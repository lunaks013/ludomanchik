import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Главная", end: true },
  { to: "/theory", label: "Теория" },
  { to: "/games", label: "Программа" },
  { to: "/results", label: "Итоги" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-navbar fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto flex h-[58px] max-w-6xl items-stretch px-4 md:px-6">
        <NavLink to="/" className="flex items-center gap-2 no-underline">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold text-sm font-black text-navy">
            А
          </span>
          <span className="text-sm font-bold text-white">
            Анализ гемблинга
          </span>
        </NavLink>

        <nav className="mx-auto hidden items-stretch md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : "nav-link-inactive"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <NavLink to="/games" className="btn-primary my-2 hidden !px-4 !py-2 text-xs md:inline-flex">
          Демо
        </NavLink>

        <button
          type="button"
          className="ml-auto flex h-10 w-10 items-center justify-center text-white md:ml-0 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-navy-light px-4 py-3 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 text-sm no-underline ${isActive ? "font-semibold text-gold" : "text-white/70"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/games" onClick={() => setOpen(false)} className="btn-primary mt-3 w-full text-center text-sm">
            Демо
          </NavLink>
        </nav>
      )}
    </header>
  );
}
