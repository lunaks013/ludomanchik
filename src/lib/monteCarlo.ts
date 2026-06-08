import { getTheoreticalWinRate, simulateWin } from "./games";
import { MECHANISMS } from "./mechanisms";
import { prngNext } from "./rng/prng";
import { xorshiftNext } from "./rng/xorshift";
import type {
  MechanismComparison,
  MechanismId,
  SimulationParams,
  SimulationResult,
  SimulationRun,
  SimulationStats,
} from "../types";

export const MONTE_CARLO_ITERATIONS = 40;

function getRandomFor(mechanism: MechanismId): () => number {
  switch (mechanism) {
    case "prng":
      return prngNext;
    case "xorshift":
      return xorshiftNext;
    case "fisherYates":
      return prngNext;
    case "weighted":
      return prngNext;
  }
}

function runSinglePlayer(
  mechanism: MechanismId,
  params: SimulationParams,
  random: () => number,
): SimulationRun {
  const { startingBalance, baseBet, numberOfBets } = params;
  let balance = startingBalance;
  const balances: number[] = [balance];
  let peak = balance;
  let maxDrawdown = 0;
  let wins = 0;
  let betsPlayed = 0;

  for (let i = 0; i < numberOfBets; i++) {
    if (balance <= 0) {
      balances.push(0);
      break;
    }

    const bet = Math.min(baseBet, balance);
    if (bet <= 0) {
      balances.push(balance);
      break;
    }

    betsPlayed += 1;
    const won = simulateWin(mechanism, random);

    if (won) {
      balance += bet;
      wins += 1;
    } else {
      balance -= bet;
    }

    if (balance > peak) peak = balance;
    const drawdown = peak > 0 ? (peak - balance) / peak : 0;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;

    balances.push(balance);
    if (balance <= 0) break;
  }

  while (balances.length < numberOfBets + 1) {
    balances.push(balance <= 0 ? 0 : balance);
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
  params: SimulationParams,
  mechanism: MechanismId,
): SimulationStats {
  const bankruptCount = runs.filter((r) => r.bankrupt).length;
  const totalWins = runs.reduce((s, r) => s + r.wins, 0);
  const totalBets = runs.reduce((s, r) => s + (r.betsPlayed ?? params.numberOfBets), 0);
  const avgFinal =
    runs.reduce((s, r) => s + r.balances[r.balances.length - 1], 0) / runs.length;
  const avgMaxDrawdown = runs.reduce((s, r) => s + r.maxDrawdown, 0) / runs.length;

  return {
    averageFinalBalance: avgFinal,
    averageProfit: avgFinal - params.startingBalance,
    bankruptcyRate: (bankruptCount / runs.length) * 100,
    maxDrawdown: avgMaxDrawdown * 100,
    winRate: totalBets > 0 ? (totalWins / totalBets) * 100 : 0,
    theoreticalWinRate: getTheoreticalWinRate(mechanism),
  };
}

export function runMonteCarlo(
  mechanism: MechanismId,
  params: SimulationParams,
): SimulationResult {
  const random = getRandomFor(mechanism);
  const runs: SimulationRun[] = [];
  for (let i = 0; i < MONTE_CARLO_ITERATIONS; i++) {
    runs.push(runSinglePlayer(mechanism, params, random));
  }

  const pathLength = params.numberOfBets + 1;
  return {
    runs,
    averageBalances: computeAverageBalances(runs, pathLength),
    stats: aggregateStats(runs, params, mechanism),
  };
}

export function compareAllMechanisms(
  params: SimulationParams,
  runs = MONTE_CARLO_ITERATIONS,
): MechanismComparison[] {
  const ids: MechanismId[] = ["prng", "xorshift", "fisherYates", "weighted"];

  return ids.map((mechanism) => {
    const random = getRandomFor(mechanism);
    const batch: SimulationRun[] = [];
    for (let i = 0; i < runs; i++) {
      batch.push(runSinglePlayer(mechanism, params, random));
    }
    const info = MECHANISMS[mechanism];
    return {
      mechanism,
      label: info.label,
      gameShell: info.gameShell,
      stats: aggregateStats(batch, params, mechanism),
    };
  });
}
