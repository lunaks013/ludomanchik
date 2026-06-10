export interface WeightedSector {
  id: string;
  label: string;
  weight: number;
  multiplier: number;
  color: string;
  highValueLoss: boolean;
}

export interface WeightedSpinResult {
  sector: WeightedSector;
  sectorIndex: number;
  nearMiss: boolean;
  dopamineSpike: number;
  trigger: string;
}

export const RTP_MATRIX = {
  targetRtp: 0.88,
  houseEdge: 0.12,
  nearMissBoostAfterLosses: 0.08,
};

export const WEIGHTED_SECTORS: WeightedSector[] = [
  { id: "loss-left", label: "Почти ×20", weight: 12, multiplier: 0, color: "#ef4444", highValueLoss: true },
  { id: "win-small", label: "×1.2", weight: 20, multiplier: 1.2, color: "#10b981", highValueLoss: false },
  { id: "loss-neutral", label: "0", weight: 26, multiplier: 0, color: "#64748b", highValueLoss: false },
  { id: "win-mid", label: "×2", weight: 9, multiplier: 2, color: "#22d3ee", highValueLoss: false },
  { id: "loss-right", label: "Почти ×20", weight: 13, multiplier: 0, color: "#f97316", highValueLoss: true },
  { id: "jackpot", label: "×20", weight: 1, multiplier: 20, color: "#a855f7", highValueLoss: false },
  { id: "loss-after", label: "Почти ×20", weight: 14, multiplier: 0, color: "#ef4444", highValueLoss: true },
  { id: "win-return", label: "×0.5", weight: 5, multiplier: 0.5, color: "#94a3b8", highValueLoss: false },
];

export function pickWeightedSector(random = Math.random, lossStreak = 0): WeightedSpinResult {
  const adjusted = WEIGHTED_SECTORS.map((sector) => ({
    sector,
    weight:
      sector.highValueLoss && lossStreak >= 2
        ? sector.weight * (1 + RTP_MATRIX.nearMissBoostAfterLosses * lossStreak)
        : sector.weight,
  }));
  const total = adjusted.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = random() * total;
  const selected =
    adjusted.find((entry) => {
      cursor -= entry.weight;
      return cursor <= 0;
    }) ?? adjusted[adjusted.length - 1];

  const sector = selected.sector;
  const sectorIndex = WEIGHTED_SECTORS.findIndex((item) => item.id === sector.id);
  const nearMiss = detectNearMiss(sectorIndex);
  return {
    sector,
    sectorIndex,
    nearMiss,
    dopamineSpike: classifyDopamineSpike(nearMiss, sector.multiplier, lossStreak),
    trigger: classifyPsychologicalTrigger(nearMiss, sector.multiplier, lossStreak),
  };
}

export function detectNearMiss(index: number): boolean {
  const current = WEIGHTED_SECTORS[index];
  if (!current || !current.highValueLoss) return false;
  const left = WEIGHTED_SECTORS[(index - 1 + WEIGHTED_SECTORS.length) % WEIGHTED_SECTORS.length];
  const right = WEIGHTED_SECTORS[(index + 1) % WEIGHTED_SECTORS.length];
  return left.multiplier >= 10 || right.multiplier >= 10;
}

export function evaluateWeightedOutcome(bet: number, result: WeightedSpinResult): { won: boolean; payout: number; profit: number } {
  const gross = Math.floor(bet * result.sector.multiplier * RTP_MATRIX.targetRtp);
  const profit = gross - bet;
  return {
    won: profit > 0,
    payout: Math.max(0, gross),
    profit,
  };
}

function classifyDopamineSpike(nearMiss: boolean, multiplier: number, lossStreak: number): number {
  if (nearMiss) return Math.min(100, 70 + lossStreak * 8);
  if (multiplier >= 10) return 95;
  if (multiplier > 1) return 45;
  return 12;
}

function classifyPsychologicalTrigger(nearMiss: boolean, multiplier: number, lossStreak: number): string {
  if (nearMiss) return "Эффект почти выигрыша: высокий риск продолжения серии.";
  if (lossStreak >= 3) return "Эскалация после потерь: повышенная уязвимость к повторной ставке.";
  if (multiplier >= 10) return "Редкое крупное подкрепление: формирование переоценки вероятности.";
  return "Нейтральный исход распределения.";
}
