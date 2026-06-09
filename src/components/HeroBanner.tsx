import type { ReactNode } from "react";

interface HeroBannerProps {
  label: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function HeroBanner({ label, title, subtitle, children }: HeroBannerProps) {
  return (
    <section className="academic-hero mb-10">
      <p className="academic-hero-label">{label}</p>
      <h1 className="academic-hero-title">{title}</h1>
      {subtitle && <p className="academic-hero-subtitle">{subtitle}</p>}
      <p className="academic-disclaimer mt-4">
        Учебный исследовательский проект. Не является рекламой азартных игр.
      </p>
      {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
    </section>
  );
}
