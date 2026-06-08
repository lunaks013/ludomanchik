import type { ReactNode } from "react";
import { SiteImage } from "./SiteImage";

interface HeroBannerProps {
  image: string;
  label: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  compact?: boolean;
}

export function HeroBanner({ image, label, title, subtitle, children, compact }: HeroBannerProps) {
  return (
    <section
      className={`hero-banner relative -mx-4 mb-10 overflow-hidden md:-mx-6 ${compact ? "min-h-[220px]" : "min-h-[380px] md:min-h-[440px]"}`}
    >
      <SiteImage
        src={image}
        alt={title}
        eager
        className="absolute inset-0 h-full w-full"
      />
      <div className="hero-overlay absolute inset-0" />
      <div className={`relative z-10 flex h-full flex-col justify-end ${compact ? "p-6 md:p-8" : "p-8 md:p-12"}`}>
        <p className="hero-label">{label}</p>
        <h1 className="hero-title mt-2">{title}</h1>
        {subtitle && <p className="hero-subtitle mt-3 max-w-xl">{subtitle}</p>}
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
