import type { MechanismId, MechanismInfo } from "../types";

export const MECHANISMS: Record<MechanismId, MechanismInfo> = {
  lcg: {
    id: "lcg",
    label: "Механизм I — LCG PRNG",
    technicalName: "Линейный конгруэнтный генератор (LCG)",
    gameShell: "Модуль I: трёхкомпонентная выборка LCG",
    description:
      "Seedable LCG генерирует три последовательных значения. Исследуется статистическое поведение стандартных PRNG на длинных сериях.",
    implementation: "state = (1664525 × state + 1013904223) mod 2³²",
    houseEdge: 12,
    theoreticalWinRate: 22.4,
    researchFocus:
      "Демонстрация того, что стандартный PRNG не изменяет отрицательное математическое ожидание при длительных сериях.",
  },
  csprng: {
    id: "csprng",
    label: "Механизм II — CSPRNG",
    technicalName: "Криптографически стойкий ГПСЧ (Web Crypto API)",
    gameShell: "Модуль II: экспоненциальная модель CSPRNG",
    description:
      "Точка прекращения роста генерируется через crypto.getRandomValues. Исследуется влияние криптостойкой энтропии на итоговый результат.",
    implementation: "crypto.getRandomValues(Uint32Array) → t = (1−ε)/U",
    houseEdge: 4,
    theoreticalWinRate: 48,
    researchFocus:
      "Проверка гипотезы: криптографически стойкая случайность не компенсирует отрицательное матожидание.",
  },
  weightedWheel: {
    id: "weightedWheel",
    label: "Механизм III — Weighted RNG",
    technicalName: "Взвешенное секторное распределение (near-miss)",
    gameShell: "Модуль III: секторное распределение с near-miss",
    description:
      "Взвешенный выбор сектора с инженерным размещением исходов, провоцирующим эффект «почти выигрыш» (near-miss).",
    implementation: "r -= weight[i]; if (r ≤ 0) → sector[i]",
    houseEdge: 12,
    theoreticalWinRate: 31,
    researchFocus:
      "Анализ near-miss эффекта как фактора усиления субъективной мотивации к продолжению серии.",
  },
  provablyFair: {
    id: "provablyFair",
    label: "Механизм IV — Provably Fair",
    technicalName: "SHA-256(serverSeed + clientSeed + nonce)",
    gameShell: "Модуль IV: верифицируемый криптографический исход",
    description:
      "Полностью прозрачный алгоритм: хеш исхода верифицируется до выполнения итерации. Исключается фактор скрытого манипулирования.",
    implementation: "roll = parseInt(SHA256(s+c+n)[0:8], 16) mod 100",
    houseEdge: 4,
    theoreticalWinRate: 48,
    researchFocus:
      "Доказательство: прозрачность алгоритма не меняет отрицательное матожидание E[profit] < 0.",
  },
};

export const MECHANISM_LIST = Object.values(MECHANISMS);

export const ALL_MECHANISM_IDS: MechanismId[] = ["lcg", "csprng", "weightedWheel", "provablyFair"];
