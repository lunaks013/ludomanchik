import { ArrowRight, BarChart3, Dices, Layers, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import type { MechanismId, MechanismInfo } from "../types";

const ICONS: Record<MechanismId, typeof Dices> = {
  prng: Shuffle,
  xorshift: Dices,
  fisherYates: Layers,
  weighted: BarChart3,
};

interface MechanismCardProps {
  mechanism: MechanismInfo;
}

export function MechanismCard({ mechanism }: MechanismCardProps) {
  const Icon = ICONS[mechanism.id];

  return (
    <Link to="/games" className="mechanism-card group no-underline">
      <div className="mechanism-card-header">
        <div className="mechanism-card-icon">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-ozon-text">{mechanism.label}</h3>
          <p className="text-sm text-ozon-muted">Модель: {mechanism.gameShell}</p>
        </div>
        <span className="mechanism-card-edge">−{mechanism.houseEdge}%</span>
      </div>
      <div className="mechanism-card-body">
        <p className="text-sm text-ozon-muted">{mechanism.technicalName}</p>
        <p className="mt-3 flex items-center gap-1 text-sm font-medium text-accent">
          Открыть в программе
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  );
}
