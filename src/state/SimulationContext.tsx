import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { calculateNextBet } from "../math/bettingStrategies";
import { runResearchMonteCarlo } from "../math/monteCarloResearch";
import { generateClientSeed, generateServerSeed, hashServerSeed } from "../math/provablyFair";
import { playResearchRound, RANDOMIZER_META } from "../math/researchEngine";
import type {
  BettingStrategyId,
  MonteCarloResult,
  RandomizerId,
  RoundOutcome,
  SimulationSettings,
  TelemetryEvent,
  TelemetryStats,
} from "../types/simulation";

const STORAGE_KEY = "ludomania-research-telemetry-v1";

const initialSettings: SimulationSettings = {
  initialBalance: 10_000,
  balance: 10_000,
  baseBet: 250,
  activeRandomizer: "lcg",
  strategy: "flat",
  customRule: "Базовое правило: результат оценивается по отрицательному математическому ожиданию.",
  crashCashOut: 2,
  diceThreshold: 50,
  lcgSeed: 1_337_777,
};

const initialStats: TelemetryStats = {
  totalRounds: 0,
  wins: 0,
  losses: 0,
  lossStreak: 0,
  maxLossStreak: 0,
  accumulatedHouseMargin: 0,
  bankruptcyEvents: 0,
  nearMissEvents: 0,
  dopamineTopUps: 0,
  ruleChanges: 0,
  strategyChanges: 0,
  stakeChanges: 0,
};

interface PersistedState {
  settings: SimulationSettings;
  stats: TelemetryStats;
  events: TelemetryEvent[];
  balancePath: number[];
  previousBet: number;
  lastRoundWon: boolean | null;
}

interface SimulationContextValue {
  settings: SimulationSettings;
  stats: TelemetryStats;
  events: TelemetryEvent[];
  balancePath: number[];
  lastOutcome: RoundOutcome | null;
  monteCarlo: MonteCarloResult | null;
  isRunningMonteCarlo: boolean;
  isRoundRunning: boolean;
  serverSeed: string;
  serverHash: string;
  clientSeed: string;
  nonce: number;
  updateSettings: (patch: Partial<SimulationSettings>) => void;
  setRandomizer: (id: RandomizerId) => void;
  setStrategy: (strategy: BettingStrategyId) => void;
  applyCustomRule: (rule: string) => void;
  playRound: () => Promise<void>;
  runMonteCarlo: () => void;
  topUp: () => void;
  resetSession: () => void;
  setClientSeed: (seed: string) => void;
  rotateProvablyFairSeeds: () => Promise<void>;
}

export const SimulationContext = createContext<SimulationContextValue | null>(null);

function now(): string {
  return new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function createEvent(type: TelemetryEvent["type"], message: string): TelemetryEvent {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    type,
    message: `[${now()}] ${message}`,
  };
}

function readPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : null;
  } catch {
    return null;
  }
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const persisted = useMemo(readPersisted, []);
  const [settings, setSettings] = useState<SimulationSettings>(persisted?.settings ?? initialSettings);
  const [stats, setStats] = useState<TelemetryStats>(persisted?.stats ?? initialStats);
  const [events, setEvents] = useState<TelemetryEvent[]>(
    persisted?.events ?? [
      createEvent(
        "round",
        "Инициализирован программный комплекс научного анализа лудомании. Система не является азартной игрой.",
      ),
    ],
  );
  const [balancePath, setBalancePath] = useState<number[]>(persisted?.balancePath ?? [initialSettings.balance]);
  const [previousBet, setPreviousBet] = useState(persisted?.previousBet ?? initialSettings.baseBet);
  const [lastRoundWon, setLastRoundWon] = useState<boolean | null>(persisted?.lastRoundWon ?? null);
  const [lastOutcome, setLastOutcome] = useState<RoundOutcome | null>(null);
  const [monteCarlo, setMonteCarlo] = useState<MonteCarloResult | null>(null);
  const [isRunningMonteCarlo, setIsRunningMonteCarlo] = useState(false);
  const [isRoundRunning, setIsRoundRunning] = useState(false);
  const [serverSeed, setServerSeed] = useState("");
  const [serverHash, setServerHash] = useState("");
  const [clientSeed, setClientSeedState] = useState("");
  const [nonce, setNonce] = useState(0);

  const addEvent = useCallback((type: TelemetryEvent["type"], message: string) => {
    setEvents((prev) => [createEvent(type, message), ...prev].slice(0, 80));
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const server = generateServerSeed();
      const client = generateClientSeed();
      setServerSeed(server);
      setClientSeedState(client);
      setServerHash(await hashServerSeed(server));
    };
    void bootstrap();
  }, []);

  useEffect(() => {
    const payload: PersistedState = {
      settings,
      stats,
      events,
      balancePath,
      previousBet,
      lastRoundWon,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [settings, stats, events, balancePath, previousBet, lastRoundWon]);

  const updateSettings = useCallback(
    (patch: Partial<SimulationSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }));
      if (patch.baseBet !== undefined) {
        setStats((prev) => ({ ...prev, stakeChanges: prev.stakeChanges + 1 }));
        addEvent("strategyChange", "Изменён размер базовой ставки: зафиксировано изменение риск-параметров.");
      }
    },
    [addEvent],
  );

  const setRandomizer = useCallback(
    (id: RandomizerId) => {
      setSettings((prev) => ({ ...prev, activeRandomizer: id }));
      addEvent("round", `Выбран механизм: ${RANDOMIZER_META[id].title}. ${RANDOMIZER_META[id].researchFocus}`);
    },
    [addEvent],
  );

  const setStrategy = useCallback(
    (strategy: BettingStrategyId) => {
      setSettings((prev) => ({ ...prev, strategy }));
      setStats((prev) => ({ ...prev, strategyChanges: prev.strategyChanges + 1 }));
      addEvent("strategyChange", "Изменена стратегия ставок: обнаружен риск когнитивного искажения контроля.");
    },
    [addEvent],
  );

  const applyCustomRule = useCallback(
    (rule: string) => {
      setSettings((prev) => ({ ...prev, customRule: rule }));
      setStats((prev) => ({ ...prev, ruleChanges: prev.ruleChanges + 1 }));
      addEvent(
        "ruleChange",
        "Предупреждение: активирована когнитивная иллюзия контроля. Изменение правил не отменяет отрицательное математическое ожидание.",
      );
    },
    [addEvent],
  );

  const playRound = useCallback(async () => {
    if (isRoundRunning || settings.balance <= 0) return;
    setIsRoundRunning(true);
    try {
      const strategy = calculateNextBet(settings.strategy, {
        balance: settings.balance,
        baseBet: settings.baseBet,
        previousBet,
        lastRoundWon,
        lossStreak: stats.lossStreak,
        maxBet: settings.balance,
      });
      strategy.warnings.forEach((warning) => addEvent("martingaleTrap", warning));

      const outcome = await playResearchRound({
        settings,
        bet: strategy.nextBet,
        lossStreak: stats.lossStreak,
        serverSeed,
        clientSeed,
        nonce,
      });

      const nextBalance = Math.max(0, settings.balance + outcome.profit);
      setLastOutcome(outcome);
      setPreviousBet(outcome.bet);
      setLastRoundWon(outcome.won);
      setNonce((prev) => prev + (settings.activeRandomizer === "provablyFair" ? 1 : 0));
      setBalancePath((prev) => [...prev.slice(-149), nextBalance]);
      setSettings((prev) => ({ ...prev, balance: nextBalance }));
      setStats((prev) => {
        const nextLossStreak = outcome.won ? 0 : prev.lossStreak + 1;
        return {
          ...prev,
          totalRounds: prev.totalRounds + 1,
          wins: prev.wins + (outcome.won ? 1 : 0),
          losses: prev.losses + (outcome.won ? 0 : 1),
          lossStreak: nextLossStreak,
          maxLossStreak: Math.max(prev.maxLossStreak, nextLossStreak),
          accumulatedHouseMargin: prev.accumulatedHouseMargin + Math.max(0, -outcome.profit),
          bankruptcyEvents: prev.bankruptcyEvents + (nextBalance <= 0 ? 1 : 0),
          nearMissEvents: prev.nearMissEvents + (outcome.risk === "nearMiss" ? 1 : 0),
        };
      });
      addEvent(outcome.risk === "nearMiss" ? "nearMiss" : "round", outcome.message);
      if (nextBalance <= 0) {
        addEvent("bankruptcy", "Баланс достиг нуля: активирован сценарий банкротства игрока.");
      }
    } finally {
      setIsRoundRunning(false);
    }
  }, [addEvent, clientSeed, isRoundRunning, lastRoundWon, nonce, previousBet, serverSeed, settings, stats.lossStreak]);

  const runMonteCarlo = useCallback(() => {
    setIsRunningMonteCarlo(true);
    window.setTimeout(() => {
      const result = runResearchMonteCarlo({ settings });
      setMonteCarlo(result);
      setIsRunningMonteCarlo(false);
      addEvent(
        "monteCarlo",
        `Выполнено моделирование Монте-Карло: банкротство ${result.bankruptcyProbability.toFixed(1)}%, EV ${result.expectedValue.toFixed(2)} ₽/раунд.`,
      );
    }, 180);
  }, [addEvent, settings]);

  const topUp = useCallback(() => {
    setSettings((prev) => ({ ...prev, balance: prev.balance + prev.initialBalance }));
    setStats((prev) => ({ ...prev, dopamineTopUps: prev.dopamineTopUps + 1 }));
    setBalancePath((prev) => [...prev, settings.balance + settings.initialBalance]);
    addEvent("topUp", "Симулировано дофаминовое пополнение: пользователь пытается компенсировать потери.");
  }, [addEvent, settings.balance, settings.initialBalance]);

  const resetSession = useCallback(() => {
    setSettings((prev) => ({ ...prev, balance: prev.initialBalance }));
    setStats(initialStats);
    setBalancePath([settings.initialBalance]);
    setPreviousBet(settings.baseBet);
    setLastRoundWon(null);
    setLastOutcome(null);
    setMonteCarlo(null);
    addEvent("round", "Сессия сброшена. Начат новый экспериментальный прогон.");
  }, [addEvent, settings.baseBet, settings.initialBalance]);

  const setClientSeed = useCallback((seed: string) => {
    setClientSeedState(seed);
  }, []);

  const rotateProvablyFairSeeds = useCallback(async () => {
    const server = generateServerSeed();
    setServerSeed(server);
    setClientSeedState(generateClientSeed());
    setServerHash(await hashServerSeed(server));
    setNonce(0);
    addEvent("round", "Сгенерирована новая пара seed для проверяемого SHA-256 алгоритма.");
  }, [addEvent]);

  const value = useMemo(
    () => ({
      settings,
      stats,
      events,
      balancePath,
      lastOutcome,
      monteCarlo,
      isRunningMonteCarlo,
      isRoundRunning,
      serverSeed,
      serverHash,
      clientSeed,
      nonce,
      updateSettings,
      setRandomizer,
      setStrategy,
      applyCustomRule,
      playRound,
      runMonteCarlo,
      topUp,
      resetSession,
      setClientSeed,
      rotateProvablyFairSeeds,
    }),
    [
      applyCustomRule,
      balancePath,
      clientSeed,
      events,
      isRoundRunning,
      isRunningMonteCarlo,
      lastOutcome,
      monteCarlo,
      nonce,
      playRound,
      resetSession,
      rotateProvablyFairSeeds,
      runMonteCarlo,
      serverHash,
      serverSeed,
      setRandomizer,
      setStrategy,
      settings,
      stats,
      topUp,
      updateSettings,
    ],
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}
