import { cardLabel, cardValue, createDeck, fisherYatesShuffle } from "./rng/fisherYates";
import { prngNext } from "./rng/prng";
import { isNearMiss, slotPayout, spinReel, type SlotSymbol } from "./rng/weighted";
import { xorshiftRange } from "./rng/xorshift";
import type { GameRoundResult, MechanismId } from "../types";

const ROULETTE_WIN = 18 / 37;
const DICE_WIN = 15 / 36;
const CARD_WIN = 0.46;
const SLOT_WIN = 0.28;

export function playRound(mechanism: MechanismId, bet: number): GameRoundResult {
  switch (mechanism) {
    case "prng":
      return playRoulette(bet);
    case "xorshift":
      return playDice(bet);
    case "fisherYates":
      return playCards(bet);
    case "weighted":
      return playSlots(bet);
  }
}

function playRoulette(bet: number): GameRoundResult {
  const sector = Math.floor(prngNext() * 37);
  const isRed = sector > 0 && sector <= 18;
  if (isRed) {
    return { won: true, payout: bet, message: `Сектор ${sector} — красное! +${bet} ₽` };
  }
  return { won: false, payout: 0, message: `Сектор ${sector} — не красное. −${bet} ₽` };
}

function playDice(bet: number): GameRoundResult {
  const d1 = xorshiftRange(1, 6);
  const d2 = xorshiftRange(1, 6);
  const sum = d1 + d2;
  if (sum >= 8) {
    return { won: true, payout: bet, message: `🎲 ${d1}+${d2}=${sum} ≥ 8! +${bet} ₽` };
  }
  return { won: false, payout: 0, message: `🎲 ${d1}+${d2}=${sum} < 8. −${bet} ₽` };
}

let cardDeck = fisherYatesShuffle(createDeck(), prngNext);
let cardIndex = 0;

export function resetCardDeck() {
  cardDeck = fisherYatesShuffle(createDeck(), prngNext);
  cardIndex = 0;
}

function playCards(bet: number): GameRoundResult {
  if (cardIndex >= cardDeck.length - 1) {
    cardDeck = fisherYatesShuffle(createDeck(), prngNext);
    cardIndex = 0;
  }
  const current = cardDeck[cardIndex];
  const next = cardDeck[cardIndex + 1];
  cardIndex += 2;

  const curVal = cardValue(current);
  const nextVal = cardValue(next);

  if (nextVal > curVal) {
    const net = Math.floor(bet * 0.92);
    return {
      won: true,
      payout: net,
      message: `${cardLabel(current)} → ${cardLabel(next)} выше! +${net} ₽`,
    };
  }
  if (nextVal === curVal) {
    return {
      won: false,
      payout: 0,
      message: `${cardLabel(current)} → ${cardLabel(next)} — ничья, проигрыш. −${bet} ₽`,
    };
  }
  return {
    won: false,
    payout: 0,
    message: `${cardLabel(current)} → ${cardLabel(next)} ниже. −${bet} ₽`,
  };
}

function playSlots(bet: number): GameRoundResult {
  const r = prngNext;
  const reels: [SlotSymbol, SlotSymbol, SlotSymbol] = [spinReel(r), spinReel(r), spinReel(r)];
  const mult = slotPayout(reels);
  const nearMiss = isNearMiss(reels);

  if (mult > 0) {
    const win = Math.floor(bet * mult * 0.88);
    return {
      won: true,
      payout: win,
      message: `${reels.join(" ")} — выигрыш ×${mult}! +${win} ₽`,
      nearMiss,
    };
  }

  return {
    won: false,
    payout: 0,
    message: nearMiss
      ? `${reels.join(" ")} — почти! (near-miss) −${bet} ₽`
      : `${reels.join(" ")} — проигрыш. −${bet} ₽`,
    nearMiss,
  };
}

export function simulateWin(mechanism: MechanismId, random: () => number): boolean {
  switch (mechanism) {
    case "prng":
      return random() < ROULETTE_WIN;
    case "xorshift": {
      const d1 = Math.floor(random() * 6) + 1;
      const d2 = Math.floor(random() * 6) + 1;
      return d1 + d2 >= 8;
    }
    case "fisherYates":
      return random() < CARD_WIN;
    case "weighted":
      return random() < SLOT_WIN;
  }
}

export function getTheoreticalWinRate(mechanism: MechanismId): number {
  switch (mechanism) {
    case "prng":
      return ROULETTE_WIN * 100;
    case "xorshift":
      return DICE_WIN * 100;
    case "fisherYates":
      return CARD_WIN * 100;
    case "weighted":
      return SLOT_WIN * 100;
  }
}
