/** Seedable Linear Congruential Generator (Park-Miller variant) */
export class LCG {
  private state: number;

  constructor(seed?: number) {
    this.state = (seed ?? Date.now()) >>> 0;
    if (this.state === 0) this.state = 1;
  }

  next(): number {
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }

  nextInt(max: number): number {
    if (max <= 0) return 0;
    return Math.floor(this.next() * max);
  }

  nextRange(min: number, max: number): number {
    return min + this.nextInt(max - min + 1);
  }

  nextFloatRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  getSeed(): number {
    return this.state;
  }

  setSeed(seed: number): void {
    this.state = seed >>> 0;
    if (this.state === 0) this.state = 1;
  }
}

let globalLcg = new LCG();

export function lcgNext(): number {
  return globalLcg.next();
}

export function lcgFloatRange(min: number, max: number): number {
  return globalLcg.nextFloatRange(min, max);
}

export function lcgIntegerRange(min: number, max: number): number {
  return globalLcg.nextRange(min, max);
}

export function resetLcg(seed?: number): LCG {
  globalLcg = new LCG(seed);
  return globalLcg;
}

export function getLcgInstance(): LCG {
  return globalLcg;
}

export const SLOT_SYMBOLS = ["7", "BAR", "CH", "LM", "OR"] as const;
export type SlotSymbol = (typeof SLOT_SYMBOLS)[number];

const SYMBOL_WEIGHTS: { symbol: SlotSymbol; weight: number }[] = [
  { symbol: "OR", weight: 35 },
  { symbol: "LM", weight: 28 },
  { symbol: "CH", weight: 20 },
  { symbol: "BAR", weight: 12 },
  { symbol: "7", weight: 5 },
];

const PAYOUT_TABLE: Record<SlotSymbol, number> = {
  "7": 25,
  BAR: 10,
  CH: 5,
  LM: 3,
  OR: 2,
};

function pickSymbol(rng: () => number): SlotSymbol {
  const total = SYMBOL_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let r = rng() * total;
  for (const entry of SYMBOL_WEIGHTS) {
    r -= entry.weight;
    if (r <= 0) return entry.symbol;
  }
  return SYMBOL_WEIGHTS[SYMBOL_WEIGHTS.length - 1].symbol;
}

export function spinLcgReels(rng: () => number = lcgNext): [SlotSymbol, SlotSymbol, SlotSymbol] {
  return [pickSymbol(rng), pickSymbol(rng), pickSymbol(rng)];
}

export function evaluateLcgSlots(
  reels: [SlotSymbol, SlotSymbol, SlotSymbol],
  bet: number,
  payoutMultiplier = 1,
): { won: boolean; payout: number; nearMiss: boolean } {
  const [a, b, c] = reels;
  const nearMiss = (a === b && c !== a) || (b === c && a !== b);

  if (a === b && b === c) {
    const raw = bet * PAYOUT_TABLE[a] * 0.88 * payoutMultiplier;
    return { won: true, payout: Math.floor(raw), nearMiss: false };
  }

  if (a === b || b === c) {
    const raw = bet * 1.2 * 0.88 * payoutMultiplier;
    return { won: true, payout: Math.floor(raw), nearMiss };
  }

  return { won: false, payout: 0, nearMiss };
}

export function lcgTheoreticalWinRate(): number {
  return 22.4;
}
