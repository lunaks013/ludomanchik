import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  bootstrapProvablyFair,
  getProvablyFairState,
  playRoundWithBalance,
  revealServerSeed,
  rotateProvablyFairSeeds,
} from "../math/engine";
import { MONTE_CARLO_BETS, MONTE_CARLO_PATHWAYS, runMonteCarlo } from "../math/monteCarlo";
import { ALL_MECHANISM_IDS } from "../math/mechanisms";
import {
  analyzeAfterRound,
  analyzeCustomRulesChange,
  analyzeParameterChange,
  analyzeStrategyChange,
  analyzeTopUp,
} from "../math/psychAnalyzer";
import type {
  CustomGameRules,
  GameSession,
  MechanismId,
  ProvablyFairState,
  PsychEvent,
  SessionSnapshot,
  SimulationResult,
  TelemetryMetrics,
  TelemetryParams,
} from "../types";

const DEFAULT_PARAMS: TelemetryParams = {
  initialBalance: 1000,
  baseBet: 10,
  strategy: "flat",
  crashTarget: 2.0,
  diceThreshold: 50,
};

const DEFAULT_RULES: CustomGameRules = {
  winThreshold: 50,
  payoutMultiplier: 1,
  modified: false,
};

function createSession(balance: number): GameSession {
  return {
    balance,
    initialBalance: balance,
    totalDeposited: balance,
    topUpCount: 0,
    betsPlayed: 0,
    wins: 0,
    losses: 0,
    consecutiveLosses: 0,
    consecutiveWins: 0,
    currentStreak: 0,
    maxWinStreak: 0,
    lastResult: null,
    lastBet: 0,
    pathway: [balance],
    houseAbsorbed: 0,
  };
}

interface TelemetryContextValue {
  activeMechanism: MechanismId;
  setActiveMechanism: (id: MechanismId) => void;
  sessions: Record<MechanismId, GameSession>;
  params: TelemetryParams;
  setParams: (p: Partial<TelemetryParams>) => void;
  customRules: CustomGameRules;
  setCustomRules: (r: Partial<CustomGameRules>) => void;
  psychLog: PsychEvent[];
  sessionHistory: SessionSnapshot[];
  mcResult: SimulationResult | null;
  isSimulating: boolean;
  isPlaying: boolean;
  provablyFair: ProvablyFairState;
  metrics: TelemetryMetrics;
  showBankruptcyAlert: boolean;
  playGame: () => Promise<void>;
  topUp: () => void;
  resetSession: () => void;
  runMonteCarloSim: () => void;
  rotateSeeds: () => Promise<void>;
  revealSeed: () => void;
  dismissBankruptcyAlert: () => void;
}

const TelemetryContext = createContext<TelemetryContextValue | null>(null);

export function TelemetryProvider({ children }: { children: ReactNode }) {
  const [activeMechanism, setActiveMechanism] = useState<MechanismId>("lcg");
  const [params, setParamsState] = useState<TelemetryParams>(DEFAULT_PARAMS);
  const [customRules, setCustomRulesState] = useState<CustomGameRules>(DEFAULT_RULES);
  const [psychLog, setPsychLog] = useState<PsychEvent[]>([]);
  const [sessionHistory, setSessionHistory] = useState<SessionSnapshot[]>([]);
  const [mcResult, setMcResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [provablyFair, setProvablyFair] = useState<ProvablyFairState>({
    serverSeed: "",
    serverSeedHash: "",
    clientSeed: "",
    nonce: 0,
    revealed: false,
  });
  const [showBankruptcyAlert, setShowBankruptcyAlert] = useState(false);

  const [sessions, setSessions] = useState<Record<MechanismId, GameSession>>(() => {
    const init = {} as Record<MechanismId, GameSession>;
    for (const id of ALL_MECHANISM_IDS) init[id] = createSession(DEFAULT_PARAMS.initialBalance);
    return init;
  });

  useEffect(() => {
    void bootstrapProvablyFair().then(setProvablyFair);
  }, []);

  const addPsychEvents = useCallback((events: PsychEvent[]) => {
    if (events.length === 0) return;
    setPsychLog((prev) => [...events, ...prev].slice(0, 100));
  }, []);

  const setParams = useCallback(
    (partial: Partial<TelemetryParams>) => {
      setParamsState((prev) => {
        const next = { ...prev, ...partial };
        const events: PsychEvent[] = [];
        for (const key of Object.keys(partial) as (keyof TelemetryParams)[]) {
          if (partial[key] !== undefined && partial[key] !== prev[key]) {
            events.push(analyzeParameterChange(activeMechanism, key, partial[key] as string | number));
          }
        }
        if (partial.strategy && partial.strategy !== prev.strategy) {
          events.push(analyzeStrategyChange(partial.strategy, activeMechanism));
        }
        addPsychEvents(events);
        return next;
      });
    },
    [activeMechanism, addPsychEvents],
  );

  const setCustomRules = useCallback(
    (partial: Partial<CustomGameRules>) => {
      setCustomRulesState((prev) => {
        const next = { ...prev, ...partial, modified: true };
        addPsychEvents([analyzeCustomRulesChange(next, activeMechanism)]);
        return next;
      });
    },
    [activeMechanism, addPsychEvents],
  );

  const archiveSession = useCallback((mechanism: MechanismId, session: GameSession) => {
    const snapshot: SessionSnapshot = {
      id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mechanism,
      pathway: [...session.pathway],
      bankrupt: session.balance <= 0,
      timestamp: Date.now(),
    };
    setSessionHistory((prev) => [snapshot, ...prev].slice(0, 50));
  }, []);

  const playGame = useCallback(async () => {
    if (isPlaying) return;

    const mechanism = activeMechanism;
    const current = sessions[mechanism];
    if (current.balance <= 0) return;

    setIsPlaying(true);

    try {
      const strategyState = {
        consecutiveLosses: current.consecutiveLosses,
        consecutiveWins: current.consecutiveWins,
        lastBet: current.lastBet,
      };

      const { result, bet } = await playRoundWithBalance(mechanism, current.balance, {
        params,
        customRules,
        strategyState,
        provablyFair: getProvablyFairState(),
      });

      if (bet <= 0) return;

      const s = { ...current };
      s.betsPlayed += 1;
      s.lastBet = bet;
      s.lastResult = result.message;
      s.balance = Math.max(0, s.balance + result.netChange);
      s.houseAbsorbed += result.netChange < 0 ? Math.abs(result.netChange) : 0;
      s.pathway = [...s.pathway, s.balance];

      if (result.won) {
        s.wins += 1;
        s.consecutiveWins += 1;
        s.consecutiveLosses = 0;
        s.currentStreak += 1;
        if (s.currentStreak > s.maxWinStreak) s.maxWinStreak = s.currentStreak;
      } else {
        s.losses += 1;
        s.consecutiveLosses += 1;
        s.consecutiveWins = 0;
        s.currentStreak = 0;
      }

      if (s.pathway.length > 200) s.pathway = s.pathway.slice(-200);

      setSessions((prev) => ({ ...prev, [mechanism]: s }));

      const roundEvents = analyzeAfterRound(mechanism, params, s, {
        won: result.won,
        nearMiss: result.nearMiss,
        payout: result.payout,
        bet,
      });
      addPsychEvents(roundEvents);

      if (s.balance <= 0) {
        setShowBankruptcyAlert(true);
        archiveSession(mechanism, s);
      }

      setProvablyFair(getProvablyFairState());
    } finally {
      setIsPlaying(false);
    }
  }, [
    activeMechanism,
    addPsychEvents,
    archiveSession,
    customRules,
    isPlaying,
    params,
    sessions,
  ]);

  const topUp = useCallback(() => {
    const amount = params.initialBalance;
    const wasBankrupt = sessions[activeMechanism].balance <= 0;

    setSessions((prev) => {
      const s = { ...prev[activeMechanism] };
      s.balance += amount;
      s.totalDeposited += amount;
      s.topUpCount += 1;
      s.pathway = [...s.pathway, s.balance];
      return { ...prev, [activeMechanism]: s };
    });

    addPsychEvents([
      analyzeTopUp(activeMechanism, amount, sessions[activeMechanism].topUpCount + 1, wasBankrupt),
    ]);
    setShowBankruptcyAlert(false);
  }, [activeMechanism, addPsychEvents, params.initialBalance, sessions]);

  const resetSession = useCallback(() => {
    setSessions((prev) => ({
      ...prev,
      [activeMechanism]: createSession(params.initialBalance),
    }));
    addPsychEvents([
      analyzeParameterChange(activeMechanism, "session", "сброс"),
    ]);
  }, [activeMechanism, addPsychEvents, params.initialBalance]);

  const runMonteCarloSim = useCallback(() => {
    setIsSimulating(true);
    setTimeout(() => {
      const result = runMonteCarlo(activeMechanism, params, customRules, MONTE_CARLO_PATHWAYS, MONTE_CARLO_BETS);
      setMcResult(result);
      setIsSimulating(false);
      addPsychEvents([
        analyzeParameterChange(
          activeMechanism,
          "monteCarlo",
          `${MONTE_CARLO_PATHWAYS} траекторий`,
        ),
      ]);
    }, 300);
  }, [activeMechanism, addPsychEvents, customRules, params]);

  const rotateSeeds = useCallback(async () => {
    const next = await rotateProvablyFairSeeds();
    setProvablyFair(next);
  }, []);

  const revealSeed = useCallback(() => {
    setProvablyFair(revealServerSeed());
  }, []);

  const dismissBankruptcyAlert = useCallback(() => {
    setShowBankruptcyAlert(false);
  }, []);

  const metrics = useMemo((): TelemetryMetrics => {
    const allSessions = Object.values(sessions);
    const bankruptCount = allSessions.filter((s) => s.balance <= 0).length;
    const historyBankrupt =
      sessionHistory.length > 0
        ? (sessionHistory.filter((s) => s.bankrupt).length / sessionHistory.length) * 100
        : (bankruptCount / allSessions.length) * 100;

    const decayRates = allSessions.map((s) => {
      const start = s.pathway[0] ?? s.initialBalance;
      const end = s.pathway[s.pathway.length - 1] ?? s.balance;
      return start > 0 ? ((start - end) / start) * 100 : 0;
    });
    const avgDecay = decayRates.reduce((a, b) => a + b, 0) / Math.max(1, decayRates.length);

    const houseMargin = allSessions.reduce((s, sess) => s + sess.houseAbsorbed, 0);

    return {
      bankruptcyProbabilityIndex: mcResult?.stats.bankruptcyRate ?? historyBankrupt,
      averageCapitalDecayRate: mcResult?.stats.capitalDecayRate ?? avgDecay,
      accumulatedHouseMargin: mcResult?.stats.houseMargin ?? houseMargin,
      sessionCount: sessionHistory.length + allSessions.reduce((s, sess) => s + sess.betsPlayed, 0),
    };
  }, [mcResult, sessionHistory, sessions]);

  return (
    <TelemetryContext.Provider
      value={{
        activeMechanism,
        setActiveMechanism,
        sessions,
        params,
        setParams,
        customRules,
        setCustomRules,
        psychLog,
        sessionHistory,
        mcResult,
        isSimulating,
        isPlaying,
        provablyFair,
        metrics,
        showBankruptcyAlert,
        playGame,
        topUp,
        resetSession,
        runMonteCarloSim,
        rotateSeeds,
        revealSeed,
        dismissBankruptcyAlert,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const ctx = useContext(TelemetryContext);
  if (!ctx) throw new Error("useTelemetry must be used within TelemetryProvider");
  return ctx;
}

export { MONTE_CARLO_PATHWAYS, MONTE_CARLO_BETS };
