/** XorShift32 — собственная реализация псевдослучайного генератора с семенем */
export class XorShift32 {
  private state: number;

  constructor(seed = Date.now()) {
    this.state = seed || 1;
  }

  next(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return (this.state & 0xffffffff) / 0x100000000;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  nextRange(min: number, max: number): number {
    return min + this.nextInt(max - min + 1);
  }

  setSeed(seed: number) {
    this.state = seed || 1;
  }
}

let globalXor = new XorShift32();

export function xorshiftNext(): number {
  return globalXor.next();
}

export function xorshiftInt(max: number): number {
  return globalXor.nextInt(max);
}

export function xorshiftRange(min: number, max: number): number {
  return globalXor.nextRange(min, max);
}

export function resetXorSeed(seed: number) {
  globalXor.setSeed(seed);
}
