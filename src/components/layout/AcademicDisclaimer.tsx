import { ShieldAlert } from "lucide-react";

export function AcademicDisclaimer() {
  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-relaxed text-cyan-50 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
      <div className="flex gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
        <p>
          <strong className="text-white">Научное позиционирование:</strong> данный программный комплекс
          предназначен исключительно для научного анализа игровой зависимости, моделирования финансовых
          рисков и демонстрации отрицательного математического ожидания. Он не является азартной игрой
          и не предназначен для использования в развлекательных или коммерческих целях.
        </p>
      </div>
    </section>
  );
}
