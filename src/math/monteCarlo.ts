import type {
  BettingStrategy,
  CustomGameRules,
  MechanismId,
  SimulationResult,
  SimulationRun,
  SimulationStats,
  TelemetryParams,
} from "../types";
import { computeStrategyBet, type StrategyState } from "./betting";
import { csprngNext } from "./csprng";
import { getTheoreticalWinRate, simulateWin } from "./engine";
import { lcgNext } from "./lcg";
import { MECHANISMS } from "./mechanisms";

export const MONTE_CARLO_PATHWAYS = 50;
export const MONTE_CARLO_BETS = 100;

function getRandomFor(mechanism: MechanismId): () => number {
  switch (mechanism) {
    case "lcg":
      return lcgNext;
    case "csprng":
    case "weightedWheel":
    case "provablyFair":
      return csprngNext;
  }
}

function runSinglePathway(
  mechanism: MechanismId,
  params: TelemetryParams,
  rules: CustomGameRules,
  random: () => number,
  bets: number,
): SimulationRun {
  let balance = params.initialBalance;
  const balances: number[] = [balance];
  let peak = balance;
  let maxDrawdown = 0;
  let wins = 0;
  let betsPlayed = 0;

  const strategyState: StrategyState = {
    consecutiveLosses: 0,
    consecutiveWins: 0,
    lastBet: 0,
  };

  for (let i = 0; i < bets; i++) {
    if (balance <= 0) {
      balances.push(0);
      break;
    }

    const bet = computeStrategyBet(params.strategy, params.baseBet, balance, strategyState);
    if (bet <= 0) {
      balances.push(balance);
      break;
    }

    betsPlayed += 1;
    const won = simulateWin(mechanism, random, params, rules);

    if (won) {
      balance += bet;
      wins += 1;
      strategyState.consecutiveWins += 1;
      strategyState.consecutiveLosses = 0;
    } else {
      balance -= bet;
      strategyState.consecutiveLosses += 1;
      strategyState.consecutiveWins = 0;
    }

    strategyState.lastBet = bet;

    if (balance > peak) peak = balance;
    const drawdown = peak > 0 ? (peak - balance) / peak : 0;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;

    balances.push(Math.max(0, balance));
    if (balance <= 0) break;
  }

  while (balances.length < bets + 1) {
    balances.push(Math.max(0, balance));
  }

  return { balances, bankrupt: balance <= 0, maxDrawdown, wins, betsPlayed };
}

function computeAverageBalances(runs: SimulationRun[], length: number): number[] {
  const avg: number[] = [];
  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (const run of runs) {
      sum += run.balances[i] ?? run.balances[run.balances.length - 1] ?? 0;
    }
    avg.push(sum / runs.length);
  }
  return avg;
}

function aggregateStats(
  runs: SimulationRun[],
  params: TelemetryParams,
  mechanism: MechanismId,
  rules: CustomGameRules,
): SimulationStats {
  const bankruptCount = runs.filter((r) => r.bankrupt).length;
  const totalWins = runs.reduce((s, r) => s + r.wins, 0);
  const totalBets = runs.reduce((s, r) => s + r.betsPlayed, 0);
  const avgFinal =
    runs.reduce((s, r) => s + r.balances[r.balances.length - 1], 0) / runs.length;
  const avgMaxDrawdown = runs.reduce((s, r) => s + r.maxDrawdown, 0) / runs.length;

  const initialTotal = params.initialBalance * runs.length;
  const finalTotal = runs.reduce((s, r) => s + r.balances[r.balances.length - 1], 0);
  const houseMargin = Math.max(0, initialTotal - finalTotal);

  const decayRates = runs.map((r) => {
    const start = r.balances[0] ?? params.initialBalance;
    const end = r.balances[r.balances.length - 1] ?? 0;
    return start > 0 ? ((start - end) / start) * 100 : 100;
  });
  const capitalDecayRate = decayRates.reduce((a, b) => a + b, 0) / decayRates.length;

  return {
    averageFinalBalance: avgFinal,
    averageProfit: avgFinal - params.initialBalance,
    bankruptcyRate: (bankruptCount / runs.length) * 100,
    maxDrawdown: avgMaxDrawdown * 100,
    winRate: totalBets > 0 ? (totalWins / totalBets) * 100 : 0,
    theoreticalWinRate: getTheoreticalWinRate(mechanism, params, rules),
    capitalDecayRate,
    houseMargin,
  };
}

export function runMonteCarlo(
  mechanism: MechanismId,
  params: TelemetryParams,
  rules: CustomGameRules,
  pathways = MONTE_CARLO_PATHWAYS,
  bets = MONTE_CARLO_BETS,
): SimulationResult {
  const random = getRandomFor(mechanism);
  const runs: SimulationRun[] = [];
  for (let i = 0; i < pathways; i++) {
    runs.push(runSinglePathway(mechanism, params, rules, random, bets));
  }

  const pathLength = bets + 1;
  return {
    runs,
    averageBalances: computeAverageBalances(runs, pathLength),
    stats: aggregateStats(runs, params, mechanism, rules),
  };
}

export function computeBankruptcyIndex(
  sessions: { bankrupt: boolean }[],
): number {
  if (sessions.length === 0) return 0;
  return (sessions.filter((s) => s.bankrupt).length / sessions.length) * 100;
}

export function computeCapitalDecay(sessions: { pathway: number[] }[]): number {
  if (sessions.length === 0) return 0;
  const rates = sessions.map((s) => {
    const start = s.pathway[0] ?? 0;
    const end = s.pathway[s.pathway.length - 1] ?? 0;
    return start > 0 ? ((start - end) / start) * 100 : 0;
  });
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

export function computeHouseMargin(
  sessions: { pathway: number[]; initialBalance?: number }[],
  totalDeposited: number,
): number {
  const currentTotal = sessions.reduce(
    (s, sess) => s + (sess.pathway[sess.pathway.length - 1] ?? 0),
    0,
  );
  return Math.max(0, totalDeposited - currentTotal);
}

export { type BettingStrategy };

export interface MechanismComparison {
  mechanism: MechanismId;
  label: string;
  gameShell: string;
  stats: SimulationStats;
}

export function compareAllMechanisms(
  params: TelemetryParams,
  rules: CustomGameRules,
  pathways = MONTE_CARLO_PATHWAYS,
  bets = MONTE_CARLO_BETS,
): MechanismComparison[] {
  const ids: MechanismId[] = ["lcg", "csprng", "weightedWheel", "provablyFair"];

  return ids.map((mechanism) => {
    const result = runMonteCarlo(mechanism, params, rules, pathways, bets);
    const info = MECHANISMS[mechanism];
    return {
      mechanism,
      label: info.label,
      gameShell: info.gameShell,
      stats: result.stats,
    };
  });
}
