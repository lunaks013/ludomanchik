interface AcademicFigureProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}

export function AcademicFigure({ src, alt, caption, className = "" }: AcademicFigureProps) {
  return (
    <figure className={`academic-figure ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="academic-figure-img" />
      {caption && (
        <figcaption className="academic-figure-caption">{caption}</figcaption>
      )}
    </figure>
  );
}
