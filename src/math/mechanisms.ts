import type { MechanismId, MechanismInfo } from "../types";

export const MECHANISMS: Record<MechanismId, MechanismInfo> = {
  lcg: {
    id: "lcg",
    label: "LCG PRNG",
    technicalName: "Линейный конгруэнтный генератор (LCG)",
    gameShell: "Ретро-слоты",
    description:
      "Кастомный seedable LCG с тремя барабанами. Демонстрирует статистическое поведение стандартных PRNG-алгоритмов на больших выборках.",
    implementation: "state = (1664525 × state + 1013904223) mod 2³²",
    houseEdge: 12,
    theoreticalWinRate: 22.4,
    researchFocus:
      "Показывает, как стандартные алгоритмы псевдослучайности ведут себя при длительных сериях — без изменения отрицательного матожидания.",
  },
  csprng: {
    id: "csprng",
    label: "CSPRNG",
    technicalName: "Криптографически стойкий ГПСЧ (Web Crypto API)",
    gameShell: "Квантовый Crash",
    description:
      "Crash-игра с точкой обрыва, генерируемой через crypto.getRandomValues. Математически идеальная энтропия не компенсирует house edge.",
    implementation: "crypto.getRandomValues(Uint32Array) → crash = (1−ε)/U",
    houseEdge: 4,
    theoreticalWinRate: 48,
    researchFocus:
      "Доказывает, что даже «квантовая» криптостойкая случайность не спасает от отрицательного матожидания.",
  },
  weightedWheel: {
    id: "weightedWheel",
    label: "Weighted RNG",
    technicalName: "Динамическая RTP-матрица с near-miss",
    gameShell: "Кибер-колесо фортуны",
    description:
      "Сектора с весами и инженерным размещением проигрышных зон рядом с джекпотом для усиления дофаминового отклика.",
    implementation: "r -= weight[i]; if (r ≤ 0) → sector[i]; nearMiss = adj(jackpot)",
    houseEdge: 12,
    theoreticalWinRate: 31,
    researchFocus:
      "Демонстрирует near-miss эффект: высокоценные проигрышные сектора непосредственно рядом с выигрышными.",
  },
  provablyFair: {
    id: "provablyFair",
    label: "Provably Fair",
    technicalName: "SHA-256(serverSeed + clientSeed + nonce)",
    gameShell: "Криптографические кости",
    description:
      "100% прозрачный алгоритм: хеш исхода верифицируется до броска. Даже без обмана отрицательное матожидание уничтожает банкролл.",
    implementation: "roll = parseInt(SHA256(s+c+n)[0:8], 16) mod 100",
    houseEdge: 4,
    theoreticalWinRate: 48,
    researchFocus:
      "Абсолютная прозрачность не меняет математику: E[profit] < 0 при любом механизме рандомизации.",
  },
};

export const MECHANISM_LIST = Object.values(MECHANISMS);

export const ALL_MECHANISM_IDS: MechanismId[] = ["lcg", "csprng", "weightedWheel", "provablyFair"];
