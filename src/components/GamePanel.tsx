import { MECHANISMS } from "../lib/mechanisms";
import { useGameContext } from "../context/GameContext";
import type { MechanismId } from "../types";

const TAB_IDS: MechanismId[] = ["prng", "xorshift", "fisherYates", "weighted"];

export function GamePanel() {
  const { activeMechanism, setActiveMechanism, sessions, bet, setBet, playGame, topUp } =
    useGameContext();

  const session = sessions[activeMechanism];
  const info = MECHANISMS[activeMechanism];
  const canPlay = session.balance >= bet && bet > 0;

  return (
    <div className="space-y-5">
      <div className="tab-bar">
        {TAB_IDS.map((id) => {
          const m = MECHANISMS[id];
          const active = activeMechanism === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveMechanism(id)}
              className={`tab-btn ${active ? "tab-btn-active" : "tab-btn-inactive"}`}
            >
              {m.gameShell}
            </button>
          );
        })}
      </div>

      <div className="glass p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-ozon-border pb-5">
          <div>
            <h2 className="text-xl font-bold text-ozon-text">Модель: {info.gameShell}</h2>
            <p className="text-sm text-accent">{info.technicalName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ozon-muted">Баланс</p>
            <p className="text-3xl font-bold text-ozon-text">{session.balance} ₽</p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Ставок", val: session.betsPlayed },
            { label: "Побед", val: session.wins },
            { label: "Пополнений", val: session.topUpCount },
            { label: "Внесено", val: `${session.totalDeposited} ₽` },
          ].map((s) => (
            <div key={s.label} className="rounded-card bg-slate-50 py-3 text-center">
              <p className="text-xs text-ozon-muted">{s.label}</p>
              <p className="mt-1 font-bold text-ozon-text">{s.val}</p>
            </div>
          ))}
        </div>

        {session.lastResult && (
          <p
            className={`mb-5 rounded-card px-4 py-3 text-sm font-medium ${
              session.lastResult.includes("+")
                ? "bg-green-50 text-pos"
                : session.lastResult.includes("почти")
                  ? "bg-red-50 text-neg"
                  : "bg-slate-50 text-ozon-muted"
            }`}
          >
            {session.lastResult}
          </p>
        )}

        <div className="flex flex-wrap items-end gap-3">
          <label>
            <span className="mb-1 block text-xs font-medium text-ozon-muted">Ставка</span>
            <input
              type="number"
              min={1}
              value={bet}
              onChange={(e) => setBet(Math.max(1, Number(e.target.value) || 1))}
              className="input-field w-28"
            />
          </label>
          <button type="button" disabled={!canPlay} onClick={playGame} className="btn-primary disabled:opacity-40">
            Симуляция
          </button>
          <button type="button" onClick={() => topUp(500)} className="btn-outline">
            Пополнение +500 ₽
          </button>
        </div>
        <p className="mt-4 text-xs text-ozon-muted">
          Пополнение баланса фиксируется в журнале как поведенческий маркер.
        </p>
      </div>
    </div>
  );
}
