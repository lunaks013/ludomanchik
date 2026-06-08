/** Взвешенный случайный выбор — кумулятивное распределение (RTP слота) */

export interface WeightedOutcome<T> {
  value: T;
  weight: number;
}

export function weightedPick<T>(outcomes: WeightedOutcome<T>[], random: () => number): T {
  const total = outcomes.reduce((s, o) => s + o.weight, 0);
  let r = random() * total;
  for (const o of outcomes) {
    r -= o.weight;
    if (r <= 0) return o.value;
  }
  return outcomes[outcomes.length - 1].value;
}

export const SLOT_SYMBOLS = ["🍒", "🍋", "🔔", "⭐", "7️⃣"] as const;
export type SlotSymbol = (typeof SLOT_SYMBOLS)[number];

const SYMBOL_WEIGHTS: WeightedOutcome<SlotSymbol>[] = [
  { value: "🍒", weight: 30 },
  { value: "🍋", weight: 25 },
  { value: "🔔", weight: 20 },
  { value: "⭐", weight: 15 },
  { value: "7️⃣", weight: 10 },
];

export function spinReel(random: () => number): SlotSymbol {
  return weightedPick(SYMBOL_WEIGHTS, random);
}

const PAYOUTS: Record<SlotSymbol, number> = {
  "🍒": 2,
  "🍋": 3,
  "🔔": 5,
  "⭐": 10,
  "7️⃣": 20,
};

export function slotPayout(symbols: [SlotSymbol, SlotSymbol, SlotSymbol]): number {
  if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
    return PAYOUTS[symbols[0]];
  }
  if (symbols[0] === symbols[1] || symbols[1] === symbols[2]) {
    return 1.5;
  }
  return 0;
}

export function isNearMiss(symbols: [SlotSymbol, SlotSymbol, SlotSymbol]): boolean {
  return symbols[0] === symbols[1] && symbols[2] !== symbols[0];
}
