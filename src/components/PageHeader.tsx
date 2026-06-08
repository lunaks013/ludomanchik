interface PageHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    <header className="page-header">
      <p className="section-label">{label}</p>
      <h1 className="heading-xl mt-1">{title}</h1>
      {description && <p className="body-text mt-2 max-w-2xl">{description}</p>}
    </header>
  );
}
