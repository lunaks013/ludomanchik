import { csprngNext, evaluateCrash, generateCrashPoint } from "./csprng";
import { evaluateLcgSlots, LCG, spinLcgReels } from "./lcg";
import { computeProvablyFairRoll, evaluateProvablyFairDice } from "./provablyFair";
import { evaluateWeightedOutcome, pickWeightedSector } from "./weightedRandom";
import type { RandomizerId, RoundOutcome, SimulationSettings } from "../types/simulation";

export const RANDOMIZER_META = {
  lcg: {
    id: "lcg",
    title: "Seedable PRNG / LCG",
    shortTitle: "LCG",
    subtitle: "Воспроизводимая псевдослучайная последовательность",
    houseEdge: 0.12,
    researchFocus:
      "Стандартные программные генераторы случайных чисел создают воспроизводимые последовательности. Однако даже при равномерном распределении отрицательное математическое ожидание сохраняет преимущество системы.",
  },
  csprng: {
    id: "csprng",
    title: "CSPRNG / Web Crypto API",
    shortTitle: "CSPRNG",
    subtitle: "Криптографически стойкая энтропия браузера",
    houseEdge: 0.04,
    researchFocus:
      "Криптографически стойкая случайность исключает предсказание результата, но не отменяет отрицательное математическое ожидание.",
  },
  weighted: {
    id: "weighted",
    title: "Weighted Dynamic Randomizer",
    shortTitle: "Weighted",
    subtitle: "Взвешенная RTP-матрица и near-miss эффект",
    houseEdge: 0.12,
    researchFocus:
      "Эффект почти выигрыша усиливает вовлеченность пользователя, хотя фактически результат остается проигрышным.",
  },
  provablyFair: {
    id: "provablyFair",
    title: "Provably Fair SHA-256 Dice",
    shortTitle: "SHA-256",
    subtitle: "Проверяемый исход server seed + client seed + nonce",
    houseEdge: 0.04,
    researchFocus:
      "Даже полностью проверяемый и прозрачный алгоритм не устраняет преимущество системы, если правила игры имеют отрицательное математическое ожидание.",
  },
} as const satisfies Record<RandomizerId, {
  id: RandomizerId;
  title: string;
  shortTitle: string;
  subtitle: string;
  researchFocus: string;
  houseEdge: number;
}>;

export interface ResearchEngineOptions {
  settings: SimulationSettings;
  bet: number;
  lossStreak: number;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

export async function playResearchRound(options: ResearchEngineOptions): Promise<RoundOutcome> {
  const { settings, bet, lossStreak } = options;
  switch (settings.activeRandomizer) {
    case "lcg":
      return playLcg(settings, bet);
    case "csprng":
      return playCsprng(settings, bet);
    case "weighted":
      return playWeighted(bet, lossStreak);
    case "provablyFair":
      return playProvablyFair(options);
  }
}

function playLcg(settings: SimulationSettings, bet: number): RoundOutcome {
  const rng = new LCG(settings.lcgSeed + settings.balance + bet);
  const reels = spinLcgReels(() => rng.next());
  const result = evaluateLcgSlots(reels, bet, 1);
  const profit = result.won ? result.payout - bet : -bet;
  return {
    won: profit > 0,
    bet,
    profit,
    payout: result.won ? result.payout : 0,
    risk: result.nearMiss ? "nearMiss" : "neutral",
    message: result.nearMiss
      ? `LCG: ${reels.join(" · ")}. Зафиксирован эффект почти выигрыша, Δ=${profit} ₽.`
      : `LCG: ${reels.join(" · ")}. Результат итерации Δ=${profit} ₽.`,
    details: {
      reels: reels.join(", "),
      seed: settings.lcgSeed,
      expectedValue: "-12%",
    },
  };
}

function playCsprng(settings: SimulationSettings, bet: number): RoundOutcome {
  const crashPoint = generateCrashPoint(csprngNext);
  const result = evaluateCrash(crashPoint, settings.crashCashOut, bet);
  const profit = result.won ? result.payout : -bet;
  return {
    won: result.won,
    bet,
    profit,
    payout: result.won ? bet + result.payout : 0,
    risk: crashPoint < settings.crashCashOut && crashPoint >= settings.crashCashOut * 0.85 ? "nearMiss" : "neutral",
    message: `CSPRNG: точка краха ${crashPoint.toFixed(2)}×, целевой cash-out ${settings.crashCashOut.toFixed(2)}×, Δ=${profit} ₽.`,
    details: {
      crashPoint: crashPoint.toFixed(2),
      cashOut: settings.crashCashOut.toFixed(2),
      expectedValue: "-4%",
    },
  };
}

function playWeighted(bet: number, lossStreak: number): RoundOutcome {
  const spin = pickWeightedSector(Math.random, lossStreak);
  const result = evaluateWeightedOutcome(bet, spin);
  return {
    won: result.won,
    bet,
    profit: result.profit,
    payout: result.payout,
    risk: spin.nearMiss ? "nearMiss" : "neutral",
    message: `Weighted RNG: сектор «${spin.sector.label}», ${spin.trigger} Δ=${result.profit} ₽.`,
    details: {
      sector: spin.sector.label,
      multiplier: spin.sector.multiplier,
      dopamineSpike: spin.dopamineSpike,
      expectedValue: "-12%",
    },
  };
}

async function playProvablyFair(options: ResearchEngineOptions): Promise<RoundOutcome> {
  const { settings, bet, serverSeed, clientSeed, nonce } = options;
  const roll = await computeProvablyFairRoll(serverSeed, clientSeed, nonce);
  const result = evaluateProvablyFairDice(roll.roll, bet, settings.diceThreshold);
  return {
    won: result.won,
    bet,
    profit: result.netChange,
    payout: result.won ? bet + result.payout : 0,
    risk: "neutral",
    message: `SHA-256: roll=${roll.roll}, nonce=${nonce}, hash=${roll.hash.slice(0, 12)}…, Δ=${result.netChange} ₽.`,
    details: {
      roll: roll.roll,
      nonce,
      hash: roll.hash.slice(0, 16),
      threshold: settings.diceThreshold,
      expectedValue: "-4%",
    },
  };
}
