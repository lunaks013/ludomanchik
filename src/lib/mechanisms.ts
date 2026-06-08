import type { MechanismId, MechanismInfo } from "../types";

export const MECHANISMS: Record<MechanismId, MechanismInfo> = {
  prng: {
    id: "prng",
    label: "Math.random()",
    technicalName: "Браузерный PRNG (LCG)",
    gameShell: "Рулетка",
    description:
      "Стандартный генератор браузера. Число от 0 до 36 — ставка на красное (18 ячеек).",
    implementation: "return Math.random() < 18 / 37",
    houseEdge: 2.7,
    theoreticalWinRate: (18 / 37) * 100,
  },
  xorshift: {
    id: "xorshift",
    label: "XorShift32",
    technicalName: "Собственный XorShift32 с семенем",
    gameShell: "Кости",
    description:
      "Два кубика 1–6 через XorShift32. Ставка на сумму ≥ 8 (15 из 36 комбинаций).",
    implementation: "x ^= x<<13; x ^= x>>>17; x ^= x<<5",
    houseEdge: 16.7,
    theoreticalWinRate: (15 / 36) * 100,
  },
  fisherYates: {
    id: "fisherYates",
    label: "Fisher-Yates",
    technicalName: "Перемешивание колоды 52 карты",
    gameShell: "Карты",
    description:
      "Колода перемешивается алгоритмом Фишера–Йетса. Угадайте: следующая карта выше?",
    implementation: "swap(deck[i], deck[j]) где j = random() * i",
    houseEdge: 8.3,
    theoreticalWinRate: 46,
  },
  weighted: {
    id: "weighted",
    label: "Взвешенный выбор",
    technicalName: "Кумулятивное распределение (RTP 88%)",
    gameShell: "Слот",
    description:
      "Три барабана с разным весом символов. Запрограммированный RTP ≈ 88%. Near-miss эффект.",
    implementation: "r -= weight[i]; if (r <= 0) return outcome[i]",
    houseEdge: 12,
    theoreticalWinRate: 28,
  },
};

export const MECHANISM_LIST = Object.values(MECHANISMS);
