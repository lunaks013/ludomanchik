import type { BettingStrategyId, StrategyResult, StrategyState } from "../types/simulation";

function clampBet(value: number, balance: number, maxBet: number): number {
  if (balance <= 0) return 0;
  return Math.max(1, Math.min(Math.floor(value), Math.floor(balance), Math.floor(maxBet)));
}

export function calculateNextBet(strategy: BettingStrategyId, state: StrategyState): StrategyResult {
  const warnings: string[] = [];
  let nextBet = state.baseBet;

  if (strategy === "martingale") {
    nextBet = state.lastRoundWon === false ? state.previousBet * 2 : state.baseBet;
    if (state.lossStreak >= 2) {
      warnings.push("Martingale Trap detected: ставка увеличивается после серии проигрышей.");
      warnings.push("Эскалация после потерь повышает риск банкротства.");
    }
  }

  if (strategy === "dalembert") {
    nextBet =
      state.lastRoundWon === false
        ? state.previousBet + state.baseBet
        : Math.max(state.baseBet, state.previousBet - state.baseBet);
    if (state.lossStreak >= 2) {
      warnings.push("D’Alembert escalation: линейное повышение ставки после потерь.");
    }
  }

  if (strategy === "flat") {
    nextBet = state.baseBet;
  }

  const bounded = clampBet(nextBet, state.balance, state.maxBet);
  if (bounded >= state.balance && state.balance > 0) {
    warnings.push("Cognitive distortion: ставка приблизилась к доступному капиталу.");
    warnings.push("Risk of bankruptcy: один отрицательный исход может обнулить баланс.");
  }

  return { nextBet: bounded, warnings };
}

export function getStrategyName(strategy: BettingStrategyId): string {
  switch (strategy) {
    case "flat":
      return "Flat";
    case "martingale":
      return "Мартингейл";
    case "dalembert":
      return "Д’Аламбер";
  }
}

export function getStrategyDescription(strategy: BettingStrategyId): string {
  switch (strategy) {
    case "flat":
      return "Фиксированная ставка: контрольный сценарий без эскалации.";
    case "martingale":
      return "Удвоение после проигрыша: демонстрирует ловушку эскалации ставок.";
    case "dalembert":
      return "Линейное повышение после проигрыша и снижение после выигрыша.";
  }
}
