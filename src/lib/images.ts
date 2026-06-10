import type { MechanismId } from "../types";

const base = import.meta.env.BASE_URL;
const v = "5";

/** Фотографии для дипломной работы — локальные JPG */
export const IMAGES = {
  hero: `${base}images/hero.jpg?v=${v}`,
  psychology: `${base}images/psychology.jpg?v=${v}`,
  roulette: `${base}images/roulette.jpg?v=${v}`,
  dice: `${base}images/dice.jpg?v=${v}`,
  cards: `${base}images/cards.jpg?v=${v}`,
  slot: `${base}images/slot.jpg?v=${v}`,
  analytics: `${base}images/analytics.jpg?v=${v}`,
  chips: `${base}images/chips.jpg?v=${v}`,
  wallet: `${base}images/wallet.jpg?v=${v}`,
} as const;

export const MECHANISM_IMAGES: Record<MechanismId, string> = {
  lcg: IMAGES.slot,
  csprng: IMAGES.analytics,
  weightedWheel: IMAGES.roulette,
  provablyFair: IMAGES.dice,
};
