export type MechanismId = "prng" | "xorshift" | "fisherYates" | "weighted";

export type ExcitementType = "top_up" | "win_streak" | "near_miss" | "recovery" | "big_win";

export interface ExcitementEvent {
  type: ExcitementType;
  mechanism: MechanismId;
  message: string;
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
}

export interface GameSession {
  balance: number;
  initialBalance: number;
  totalDeposited: number;
  topUpCount: number;
  betsPlayed: number;
  wins: number;
  losses: number;
  currentStreak: number;
  maxWinStreak: number;
  lastResult: string | null;
}

export interface SimulationParams {
  startingBalance: number;
  baseBet: number;
  numberOfBets: number;
}

export interface SimulationRun {
  balances: number[];
  bankrupt: boolean;
  maxDrawdown: number;
  wins: number;
  betsPlayed?: number;
}

export interface SimulationStats {
  averageFinalBalance: number;
  averageProfit: number;
  bankruptcyRate: number;
  maxDrawdown: number;
  winRate: number;
  theoreticalWinRate: number;
}

export interface SimulationResult {
  runs: SimulationRun[];
  averageBalances: number[];
  stats: SimulationStats;
}

export interface MechanismComparison {
  mechanism: MechanismId;
  label: string;
  gameShell: string;
  stats: SimulationStats;
}

export interface GameRoundResult {
  won: boolean;
  payout: number;
  message: string;
  nearMiss?: boolean;
}
