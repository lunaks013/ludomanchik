/** Fisher-Yates shuffle — перемешивание колоды */
export function createDeck(): number[] {
  return Array.from({ length: 52 }, (_, i) => i);
}

export function fisherYatesShuffle<T>(arr: T[], random: () => number): T[] {
  const deck = [...arr];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function cardValue(index: number): number {
  return (index % 13) + 1;
}

export function cardLabel(index: number): string {
  const v = cardValue(index);
  const suits = ["♠", "♥", "♦", "♣"];
  const names = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  return `${names[v]}${suits[Math.floor(index / 13)]}`;
}
