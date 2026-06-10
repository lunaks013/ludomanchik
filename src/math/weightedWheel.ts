/** Weighted Dynamic Randomizer with engineered near-miss sectors */

export interface WheelSector {
  id: string;
  label: string;
  color: string;
  weight: number;
  multiplier: number;
  isJackpot: boolean;
}

export const WHEEL_SECTORS: WheelSector[] = [
  { id: "j0", label: "×50", color: "#fbbf24", weight: 1, multiplier: 50, isJackpot: true },
  { id: "l1", label: "×0", color: "#ef4444", weight: 18, multiplier: 0, isJackpot: false },
  { id: "w1", label: "×2", color: "#22c55e", weight: 12, multiplier: 2, isJackpot: false },
  { id: "l2", label: "×0", color: "#dc2626", weight: 16, multiplier: 0, isJackpot: false },
  { id: "w2", label: "×3", color: "#10b981", weight: 8, multiplier: 3, isJackpot: false },
  { id: "l3", label: "×0", color: "#b91c1c", weight: 15, multiplier: 0, isJackpot: false },
  { id: "nm1", label: "×0.5", color: "#f97316", weight: 10, multiplier: 0.5, isJackpot: false },
  { id: "l4", label: "×0", color: "#991b1b", weight: 14, multiplier: 0, isJackpot: false },
  { id: "w3", label: "×1.5", color: "#34d399", weight: 6, multiplier: 1.5, isJackpot: false },
];

const NEAR_MISS_ADJACENT: Record<string, string[]> = {
  j0: ["l1", "l4"],
  l1: ["j0", "w1"],
  w1: ["l1", "l2"],
  l2: ["w1", "w2"],
  w2: ["l2", "l3"],
  l3: ["w2", "nm1"],
  nm1: ["l3", "l4"],
  l4: ["nm1", "j0"],
};

export function pickWheelSector(rng: () => number): WheelSector {
  const total = WHEEL_SECTORS.reduce((s, sec) => s + sec.weight, 0);
  let r = rng() * total;
  for (const sector of WHEEL_SECTORS) {
    r -= sector.weight;
    if (r <= 0) return sector;
  }
  return WHEEL_SECTORS[WHEEL_SECTORS.length - 1];
}

export function isWheelNearMiss(landed: WheelSector, rng: () => number): boolean {
  if (landed.isJackpot || landed.multiplier >= 2) return false;
  const adjacents = NEAR_MISS_ADJACENT[landed.id] ?? [];
  const jackpotNeighbor = adjacents.some((id) => {
    const sec = WHEEL_SECTORS.find((s) => s.id === id);
    return sec?.isJackpot;
  });
  if (!jackpotNeighbor) return false;
  return rng() < 0.72;
}

export function computeWheelAngle(sectorIndex: number, rng: () => number): number {
  const sectorCount = WHEEL_SECTORS.length;
  const sliceAngle = 360 / sectorCount;
  const base = sectorIndex * sliceAngle;
  const jitter = rng() * sliceAngle * 0.7 + sliceAngle * 0.15;
  return base + jitter;
}

export function evaluateWheelSpin(
  sector: WheelSector,
  bet: number,
  _nearMiss: boolean,
  payoutMultiplier = 1,
): { won: boolean; payout: number; netChange: number } {
  if (sector.multiplier === 0) {
    return { won: false, payout: 0, netChange: -bet };
  }
  if (sector.multiplier < 1) {
    const loss = Math.floor(bet * (1 - sector.multiplier));
    return { won: false, payout: 0, netChange: -loss };
  }
  const gross = Math.floor(bet * sector.multiplier * 0.88 * payoutMultiplier);
  const net = gross - bet;
  return { won: net > 0, payout: Math.max(0, net), netChange: net };
}

export function weightedWheelTheoreticalWinRate(): number {
  let expectedReturn = 0;
  const total = WHEEL_SECTORS.reduce((s, sec) => s + sec.weight, 0);
  for (const sec of WHEEL_SECTORS) {
    const p = sec.weight / total;
    expectedReturn += p * sec.multiplier * 0.88;
  }
  return Math.min(99, expectedReturn * 35);
}
