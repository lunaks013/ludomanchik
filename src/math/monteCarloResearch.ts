import { calculateNextBet } from "./bettingStrategies";
import { LCG, spinLcgReels, evaluateLcgSlots } from "./lcg";
import { generateCrashPoint, evaluateCrash } from "./csprng";
import { evaluateWeightedOutcome, pickWeightedSector } from "./weightedRandom";
import type {
  BettingStrategyId,
  MonteCarloPath,
  MonteCarloResult,
  RandomizerId,
  SimulationSettings,
} from "../types/simulation";

export const MONTE_CARLO_SESSIONS = 50;
export const MONTE_CARLO_ROUNDS = 100;

interface SimulateOptions {
  settings: SimulationSettings;
  sessions?: number;
  rounds?: number;
}

export function runResearchMonteCarlo({
  settings,
  sessions = MONTE_CARLO_SESSIONS,
  rounds = MONTE_CARLO_ROUNDS,
}: SimulateOptions): MonteCarloResult {
  const paths: MonteCarloPath[] = [];
  for (let i = 0; i < sessions; i += 1) {
    paths.push(simulateSession(settings, rounds, i + 1));
  }

  const averagePath = Array.from({ length: rounds + 1 }, (_, index) => {
    const sum = paths.reduce((acc, path) => acc + (path.balances[index] ?? path.finalBalance), 0);
    return Math.round(sum / paths.length);
  });

  const bankruptCount = paths.filter((path) => path.bankrupt).length;
  const finalSum = paths.reduce((sum, path) => sum + path.finalBalance, 0);
  const startSum = settings.initialBalance * paths.length;
  const expectedValue = (finalSum - startSum) / Math.max(1, paths.length * rounds);
  const averageCapitalDecayRate = ((startSum - finalSum) / Math.max(1, startSum)) * 100;

  return {
    paths,
    averagePath,
    bankruptcyProbability: (bankruptCount / paths.length) * 100,
    averageCapitalDecayRate,
    expectedValue,
    accumulatedHouseMargin: Math.max(0, startSum - finalSum),
  };
}

function simulateSession(settings: SimulationSettings, rounds: number, id: number): MonteCarloPath {
  let balance = settings.initialBalance;
  let previousBet = settings.baseBet;
  let lastRoundWon: boolean | null = null;
  let lossStreak = 0;
  const balances = [balance];
  const lcg = new LCG(settings.lcgSeed + id * 9973);

  for (let round = 0; round < rounds; round += 1) {
    if (balance <= 0) {
      balances.push(0);
      continue;
    }

    const strategy = calculateNextBet(settings.strategy as BettingStrategyId, {
      balance,
      baseBet: settings.baseBet,
      previousBet,
      lastRoundWon,
      lossStreak,
      maxBet: balance,
    });
    const bet = Math.min(strategy.nextBet, balance);
    const profit = simulateProfit(settings.activeRandomizer, settings, bet, lossStreak, lcg);

    balance = Math.max(0, balance + profit);
    previousBet = bet;
    lastRoundWon = profit > 0;
    lossStreak = profit > 0 ? 0 : lossStreak + 1;
    balances.push(Math.round(balance));
  }

  return {
    id,
    balances,
    bankrupt: balance <= 0,
    finalBalance: Math.round(balance),
  };
}

function simulateProfit(
  randomizer: RandomizerId,
  settings: SimulationSettings,
  bet: number,
  lossStreak: number,
  lcg: LCG,
): number {
  switch (randomizer) {
    case "lcg": {
      const reels = spinLcgReels(() => lcg.next());
      const result = evaluateLcgSlots(reels, bet);
      return result.won ? result.payout - bet : -bet;
    }
    case "csprng": {
      const crashPoint = generateCrashPoint(() => lcg.next());
      const result = evaluateCrash(crashPoint, settings.crashCashOut, bet);
      return result.won ? result.payout : -bet;
    }
    case "weighted": {
      const spin = pickWeightedSector(() => lcg.next(), lossStreak);
      return evaluateWeightedOutcome(bet, spin).profit;
    }
    case "provablyFair": {
      const roll = Math.floor(lcg.next() * 100);
      const winProbability = (100 - settings.diceThreshold) / 100;
      const payout = roll >= settings.diceThreshold ? Math.floor(bet * (1 / winProbability) * 0.96) : 0;
      return payout > 0 ? payout - bet : -bet;
    }
  }
}
