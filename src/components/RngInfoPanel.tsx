import { MECHANISMS } from "../lib/mechanisms";
import type { MechanismId } from "../types";

interface RngInfoPanelProps {
  mechanism: MechanismId;
}

export function RngInfoPanel({ mechanism }: RngInfoPanelProps) {
  const info = MECHANISMS[mechanism];

  return (
    <div className="glass p-5">
      <p className="text-xs font-medium text-ozon-muted">Техническая реализация</p>
      <h3 className="mt-1 text-sm font-semibold text-ozon-text">{info.technicalName}</h3>
      <p className="mt-2 text-sm text-ozon-muted">{info.description}</p>
      <pre className="mt-3 overflow-x-auto rounded-btn bg-slate-50 px-3 py-2 text-xs text-ozon-text">
        {info.implementation}
      </pre>
      <p className="mt-3 text-xs text-ozon-muted">
        Edge казино: <span className="font-medium text-neg">−{info.houseEdge}%</span>
        {" · "}
        Винрейт: {info.theoreticalWinRate.toFixed(1)}%
      </p>
    </div>
  );
}
