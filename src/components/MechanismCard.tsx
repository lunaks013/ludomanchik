import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { MechanismInfo } from "../types";
import { MECHANISM_IMAGES } from "../lib/images";
import { SiteImage } from "./SiteImage";

interface MechanismCardProps {
  mechanism: MechanismInfo;
}

export function MechanismCard({ mechanism }: MechanismCardProps) {
  const image = MECHANISM_IMAGES[mechanism.id];

  return (
    <Link to="/games" className="mechanism-card group no-underline">
      <div className="mechanism-card-img-wrap">
        <SiteImage
          src={image}
          alt={`${mechanism.gameShell} — ${mechanism.label}`}
          className="mechanism-card-img h-full"
        />
        <div className="mechanism-card-overlay">
          <h3 className="text-xl font-bold text-white">{mechanism.gameShell}</h3>
          <p className="text-sm text-white/80">{mechanism.label}</p>
        </div>
        <span className="mechanism-card-badge">−{mechanism.houseEdge}%</span>
      </div>
      <div className="mechanism-card-body">
        <p className="text-sm text-ozon-muted">{mechanism.technicalName}</p>
        <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-gold">
          Открыть в программе
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  );
}
