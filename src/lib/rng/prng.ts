/** Браузерный PRNG — Math.random() (линейный конгруэнтный генератор V8) */
export function prngNext(): number {
  return Math.random();
}

export function prngInt(max: number): number {
  return Math.floor(prngNext() * max);
}

export function prngRange(min: number, max: number): number {
  return min + prngInt(max - min + 1);
}
