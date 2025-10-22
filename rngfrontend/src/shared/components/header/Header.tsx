import { NavLink } from "react-router-dom";
import { SunMedium, Home } from "lucide-react";

const tabs = [
  { to: "/generate", label: "Генератор" },
  { to: "/checker", label: "Чекер" },
  { to: "/lottery", label: "Розыгрыш" },
];

export default function Header() {
  const base = "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors";
  const idle = "text-zinc-300 hover:text-white hover:bg-white/10";
  const active =
    "text-white bg-white/15 shadow-inner ring-1 ring-inset ring-white/15";

  return (
    <nav className="mx-auto mt-3 max-w-6xl rounded-2xl border border-white/10 bg-[#0f141a]/95 text-white/90 shadow-[0_8px_30px_rgba(0,0,0,.35)] backdrop-blur supports-[backdrop-filter]:bg-[#0f141a]/80">
      <div className="flex items-center justify-between px-3 py-2">
        {/* группа табов */}
        <div className="inline-flex items-center gap-1 rounded-xl bg-white/[.04] p-1">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end
              className={({ isActive }) =>
                [base, isActive ? active : idle].join(" ")
              }
            >
              {t.label}
            </NavLink>
          ))}
        </div>

        {/* иконки справа */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Тема"
            onClick={() => document.documentElement.classList.toggle("dark")}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[.04] transition-colors hover:bg-white/10"
          >
            <SunMedium className="h-4 w-4 opacity-70" />
          </button>

          <NavLink
            to="/"
            aria-label="Главная"
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[.04] transition-colors hover:bg-white/10"
          >
            <Home className="h-4 w-4 opacity-70" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
