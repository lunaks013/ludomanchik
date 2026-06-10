import type { BettingStrategy } from "../types";

export interface StrategyState {
  consecutiveLosses: number;
  consecutiveWins: number;
  lastBet: number;
}

export function computeStrategyBet(
  strategy: BettingStrategy,
  baseBet: number,
  balance: number,
  state: StrategyState,
): number {
  if (balance <= 0) return 0;

  let raw: number;
  switch (strategy) {
    case "flat":
      raw = baseBet;
      break;
    case "martingale":
      raw = baseBet * Math.pow(2, state.consecutiveLosses);
      break;
    case "dalembert":
      raw = baseBet + state.consecutiveLosses * baseBet - state.consecutiveWins * baseBet;
      break;
  }

  return Math.min(Math.max(1, Math.floor(raw)), balance);
}

export function getStrategyLabel(strategy: BettingStrategy): string {
  switch (strategy) {
    case "flat":
      return "Фиксированная (Flat)";
    case "martingale":
      return "Мартингейл";
    case "dalembert":
      return "Д'Аламбер";
  }
}

export function getStrategyDescription(strategy: BettingStrategy): string {
  switch (strategy) {
    case "flat":
      return "Постоянный размер ставки независимо от исхода.";
    case "martingale":
      return "Удвоение ставки после каждого проигрыша — классическая «ловушка отыгрыша».";
    case "dalembert":
      return "Линейное увеличение после проигрыша и уменьшение после выигрыша.";
  }
}
