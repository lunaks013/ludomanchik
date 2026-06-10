import type { MechanismId } from "../types";

const base = import.meta.env.BASE_URL;

/** Компактные SVG-иконки для карточек (не фотографии) */
export const ICONS = {
  analytics: `${base}images/analytics.svg`,
  dice: `${base}images/dice.svg`,
  slot: `${base}images/slot.svg`,
  psychology: `${base}images/psychology.svg`,
} as const;

export const MECHANISM_ICONS: Record<MechanismId, string> = {
  lcg: `${base}images/slot.svg`,
  csprng: `${base}images/analytics.svg`,
  weightedWheel: `${base}images/roulette.svg`,
  provablyFair: `${base}images/dice.svg`,
};
