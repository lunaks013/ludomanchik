import { ArrowRight, Binary, Fingerprint, PieChart, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { MechanismId, MechanismInfo } from "../types";

const MECHANISM_ICON: Record<MechanismId, typeof Binary> = {
  lcg: Binary,
  csprng: ShieldCheck,
  weightedWheel: PieChart,
  provablyFair: Fingerprint,
};

interface MechanismCardProps {
  mechanism: MechanismInfo;
}

export function MechanismCard({ mechanism }: MechanismCardProps) {
  const Icon = MECHANISM_ICON[mechanism.id];

  return (
    <Link to="/games" className="mechanism-card group no-underline">
      <div className="mechanism-card-body">
        <div className="flex items-start gap-4">
          <div className="mechanism-card-icon">
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-slate-900">{mechanism.label}</h3>
              <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                edge −{mechanism.houseEdge}%
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{mechanism.technicalName}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{mechanism.researchFocus}</p>
          </div>
        </div>
        <p className="mt-4 flex items-center gap-1 text-sm font-medium text-[#1e3a5f]">
          Перейти к модулю
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </p>
      </div>
    </Link>
  );
}
