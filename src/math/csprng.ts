/** Cryptographically Secure Pseudo-Random Number Generator via Web Crypto API */

export function csprngNext(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]! / 0x100000000;
}

export function csprngInt(max: number): number {
  if (max <= 0) return 0;
  return Math.floor(csprngNext() * max);
}

export function csprngRange(min: number, max: number): number {
  return min + csprngInt(max - min + 1);
}

const CRASH_HOUSE_EDGE = 0.04;

/**
 * Generates crash point using industry-standard inverse transform.
 * Even with perfect CSPRNG entropy, E[profit] < 0 due to house edge.
 */
export function generateCrashPoint(rng: () => number = csprngNext): number {
  const u = Math.max(rng(), 1e-10);
  const raw = (1 - CRASH_HOUSE_EDGE) / u;
  return Math.max(1.0, Math.floor(raw * 100) / 100);
}

export function evaluateCrash(
  crashPoint: number,
  cashoutTarget: number,
  bet: number,
): { won: boolean; payout: number; crashed: boolean } {
  if (cashoutTarget <= crashPoint) {
    const profit = Math.floor(bet * (cashoutTarget - 1));
    return { won: true, payout: profit, crashed: false };
  }
  return { won: false, payout: 0, crashed: true };
}

export function csprngTheoreticalWinRate(cashoutTarget: number): number {
  const pSurvive = (1 - CRASH_HOUSE_EDGE) / cashoutTarget;
  return Math.min(99, pSurvive * 100);
}

export function getCrashHouseEdge(): number {
  return CRASH_HOUSE_EDGE;
}
