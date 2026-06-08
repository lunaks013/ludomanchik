import { useState } from "react";

interface SiteImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  aspect?: "banner" | "card" | "wide" | "square" | "none";
}

const aspectClasses = {
  banner: "aspect-[7/3]",
  card: "aspect-[8/5]",
  wide: "aspect-[9/4]",
  square: "aspect-square",
  none: "",
} as const;

export function SiteImage({
  src,
  alt,
  className = "",
  eager = false,
  aspect = "none",
}: SiteImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectClass = aspectClasses[aspect];

  if (error) {
    return (
      <div
        className={`flex items-center justify-center rounded-card bg-navy/5 ${aspectClass} ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="px-4 text-center text-sm text-ozon-muted">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative block w-full overflow-hidden ${aspectClass} ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200" />
      )}
      <img
        src={src}
        alt={alt}
        className={`relative z-10 block h-full w-full object-cover object-center transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        {...(eager ? { fetchPriority: "high" as const } : {})}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
