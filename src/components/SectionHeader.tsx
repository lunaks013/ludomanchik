interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  light?: boolean;
}

export function SectionHeader({ label, title, description, light }: SectionHeaderProps) {
  return (
    <div className={`section-header ${light ? "section-header-light" : ""}`}>
      {label && <p className="section-label">{label}</p>}
      <h2 className={`heading-lg ${label ? "mt-2" : ""}`}>{title}</h2>
      {description && <p className="body-text mt-2 max-w-2xl">{description}</p>}
    </div>
  );
}
