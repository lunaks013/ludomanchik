export type MechanismId = "lcg" | "csprng" | "weightedWheel" | "provablyFair";

export type BettingStrategy = "flat" | "martingale" | "dalembert";

export type PsychEventType =
  | "top_up"
  | "win_streak"
  | "loss_streak"
  | "near_miss"
  | "martingale_trap"
  | "dalembert_escalation"
  | "illusion_of_control"
  | "bankruptcy"
  | "big_win"
  | "chase_loss"
  | "parameter_change";

export interface PsychEvent {
  id: string;
  type: PsychEventType;
  mechanism: MechanismId;
  message: string;
  brainRegion?: string;
  timestamp: number;
}

export interface MechanismInfo {
  id: MechanismId;
  label: string;
  technicalName: string;
  gameShell: string;
  description: string;
  implementation: string;
  houseEdge: number;
  theoreticalWinRate: number;
  researchFocus: string;
}

export interface CustomGameRules {
  winThreshold: number;
  payoutMultiplier: number;
  modified: boolean;
}

export interface GameSession {
  balance: number;
  initialBalance: number;
  totalDeposited: number;
  topUpCount: number;
  betsPlayed: number;
  wins: number;
  losses: number;
  consecutiveLosses: number;
  consecutiveWins: number;
  currentStreak: number;
  maxWinStreak: number;
  lastResult: string | null;
  lastBet: number;
  pathway: number[];
  houseAbsorbed: number;
}

export interface SessionSnapshot {
  id: string;
  mechanism: MechanismId;
  pathway: number[];
  bankrupt: boolean;
  timestamp: number;
}

export interface TelemetryParams {
  initialBalance: number;
  baseBet: number;
  strategy: BettingStrategy;
  crashTarget: number;
  diceThreshold: number;
}

export interface SimulationRun {
  balances: number[];
  bankrupt: boolean;
  maxDrawdown: number;
  wins: number;
  betsPlayed: number;
}

export interface SimulationStats {
  averageFinalBalance: number;
  averageProfit: number;
  bankruptcyRate: number;
  maxDrawdown: number;
  winRate: number;
  theoreticalWinRate: number;
  capitalDecayRate: number;
  houseMargin: number;
}

export interface SimulationResult {
  runs: SimulationRun[];
  averageBalances: number[];
  stats: SimulationStats;
}

export interface GameRoundResult {
  won: boolean;
  payout: number;
  netChange: number;
  message: string;
  nearMiss?: boolean;
  metadata?: Record<string, string | number | boolean>;
}

export interface ProvablyFairState {
  serverSeed: string;
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
  revealed: boolean;
}

export interface TelemetryMetrics {
  bankruptcyProbabilityIndex: number;
  averageCapitalDecayRate: number;
  accumulatedHouseMargin: number;
  sessionCount: number;
}
