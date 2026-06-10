/** Provably Fair Cryptographic Algorithm — SHA-256(serverSeed + clientSeed + nonce) */

export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateServerSeed(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateClientSeed(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashServerSeed(serverSeed: string): Promise<string> {
  return sha256(serverSeed);
}

export async function computeProvablyFairRoll(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
): Promise<{ roll: number; hash: string; rawHex: string }> {
  const combined = `${serverSeed}:${clientSeed}:${nonce}`;
  const hash = await sha256(combined);
  const rawHex = hash.slice(0, 8);
  const roll = parseInt(rawHex, 16) % 100;
  return { roll, hash, rawHex };
}

export function evaluateProvablyFairDice(
  roll: number,
  bet: number,
  threshold: number,
  payoutMultiplier = 1,
): { won: boolean; payout: number; netChange: number } {
  const winProbability = (100 - threshold) / 100;
  const fairPayout = 1 / winProbability;
  const adjustedPayout = fairPayout * 0.96 * payoutMultiplier;

  if (roll >= threshold) {
    const gross = Math.floor(bet * adjustedPayout);
    const net = gross - bet;
    return { won: true, payout: Math.max(0, net), netChange: net };
  }
  return { won: false, payout: 0, netChange: -bet };
}

export function provablyFairTheoreticalWinRate(threshold: number): number {
  const winProbability = (100 - threshold) / 100;
  return winProbability * 96;
}
