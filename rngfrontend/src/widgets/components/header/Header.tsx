import { NavLink } from "react-router-dom";
import { SunMedium, Home } from "lucide-react";

const tabs = [
  { to: "/lottery", label: "Розыгрыш" },
  { to: "/checker", label: "Чекер" },
  { to: "/generate", label: "Генератор" },
];

export default function Header() {
  return (
    <nav className="mx-auto mt-3 max-w-6xl rounded-2xl border border-white/10 bg-[#0f141a]/95 text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur supports-[backdrop-filter]:bg-[#0f141a]/80">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="inline-flex items-center gap-1 rounded-xl bg-white/4">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end
              className={({ isActive }) =>
                [
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-white bg-white/15 shadow-inner ring-1 ring-inset ring-white/15"
                    : "text-zinc-300 hover:text-white hover:bg-white/10",
                ].join(" ")
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Переключить тему"
            onClick={() => document.documentElement.classList.toggle("light")}
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/4 transition-colors hover:bg-white/10"
          >
            <SunMedium className="size-4 opacity-70" />
          </button>

          <NavLink
            to="/"
            aria-label="Главная"
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/4 transition-colors hover:bg-white/10"
          >
            <Home className="size-4 opacity-70" />
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
