export type RandomizerId = "lcg" | "csprng" | "weighted" | "provablyFair";

export type BettingStrategyId = "flat" | "martingale" | "dalembert";

export type RoundRisk =
  | "neutral"
  | "nearMiss"
  | "martingaleTrap"
  | "bankruptcy"
  | "illusionOfControl"
  | "topUp";

export interface StrategyState {
  balance: number;
  baseBet: number;
  previousBet: number;
  lastRoundWon: boolean | null;
  lossStreak: number;
  maxBet: number;
}

export interface StrategyResult {
  nextBet: number;
  warnings: string[];
}

export interface RoundOutcome {
  won: boolean;
  bet: number;
  profit: number;
  payout: number;
  message: string;
  risk: RoundRisk;
  details: Record<string, string | number | boolean>;
}

export interface TelemetryEvent {
  id: string;
  timestamp: number;
  type: RoundRisk | "strategyChange" | "ruleChange" | "round" | "monteCarlo";
  message: string;
}

export interface SimulationSettings {
  initialBalance: number;
  balance: number;
  baseBet: number;
  activeRandomizer: RandomizerId;
  strategy: BettingStrategyId;
  customRule: string;
  crashCashOut: number;
  diceThreshold: number;
  lcgSeed: number;
}

export interface TelemetryStats {
  totalRounds: number;
  wins: number;
  losses: number;
  lossStreak: number;
  maxLossStreak: number;
  accumulatedHouseMargin: number;
  bankruptcyEvents: number;
  nearMissEvents: number;
  dopamineTopUps: number;
  ruleChanges: number;
  strategyChanges: number;
  stakeChanges: number;
}

export interface MonteCarloPath {
  id: number;
  balances: number[];
  bankrupt: boolean;
  finalBalance: number;
}

export interface MonteCarloResult {
  paths: MonteCarloPath[];
  averagePath: number[];
  bankruptcyProbability: number;
  averageCapitalDecayRate: number;
  expectedValue: number;
  accumulatedHouseMargin: number;
}

export interface RandomizerMeta {
  id: RandomizerId;
  title: string;
  shortTitle: string;
  subtitle: string;
  researchFocus: string;
  houseEdge: number;
}
