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
      <div className="mx-auto flex h-[52px] max-w-6xl items-stretch px-4 md:px-6">
        <NavLink to="/" className="flex items-center gap-2.5 no-underline">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-accent text-xs font-bold text-white">
            А
          </span>
          <span className="text-sm font-semibold text-ozon-text">
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

        <button
          type="button"
          className="ml-auto flex h-10 w-10 items-center justify-center text-ozon-muted md:ml-0 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-ozon-border bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 text-sm no-underline ${isActive ? "font-semibold text-accent" : "text-ozon-muted"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
