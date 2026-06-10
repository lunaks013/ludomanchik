const base = import.meta.env.BASE_URL;
const v = "1";

/** Иллюстрации в научном стиле (дипломная работа) */
export const IMAGES = {
  hero: `${base}images/hero-academic.png?v=${v}`,
  psychology: `${base}images/psychology-research.png?v=${v}`,
  analytics: `${base}images/analytics-montecarlo.png?v=${v}`,
  rng: `${base}images/rng-algorithms.png?v=${v}`,
} as const;
