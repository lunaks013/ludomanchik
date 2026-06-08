import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { playRound } from "../lib/games";
import { runMonteCarlo, MONTE_CARLO_ITERATIONS } from "../lib/monteCarlo";
import type {
  ExcitementEvent,
  GameSession,
  MechanismId,
  SimulationParams,
  SimulationResult,
} from "../types";

const defaultParams: SimulationParams = {
  startingBalance: 1000,
  baseBet: 10,
  numberOfBets: 100,
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
    currentStreak: 0,
    maxWinStreak: 0,
    lastResult: null,
  };
}

interface GameContextValue {
  activeMechanism: MechanismId;
  setActiveMechanism: (id: MechanismId) => void;
  sessions: Record<MechanismId, GameSession>;
  excitementLog: ExcitementEvent[];
  params: SimulationParams;
  setParams: (p: SimulationParams) => void;
  mcResults: Partial<Record<MechanismId, SimulationResult>>;
  isRunning: boolean;
  bet: number;
  setBet: (n: number) => void;
  playGame: () => void;
  topUp: (amount: number) => void;
  runAnalysis: (mechanism?: MechanismId) => void;
  runAllAnalysis: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const ALL_MECHANISMS: MechanismId[] = ["prng", "xorshift", "fisherYates", "weighted"];

export function GameProvider({ children }: { children: ReactNode }) {
  const [activeMechanism, setActiveMechanism] = useState<MechanismId>("prng");
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [bet, setBet] = useState(10);
  const [excitementLog, setExcitementLog] = useState<ExcitementEvent[]>([]);
  const [mcResults, setMcResults] = useState<Partial<Record<MechanismId, SimulationResult>>>({});
  const [isRunning, setIsRunning] = useState(false);

  const [sessions, setSessions] = useState<Record<MechanismId, GameSession>>(() => {
    const init = {} as Record<MechanismId, GameSession>;
    for (const id of ALL_MECHANISMS) init[id] = createSession(defaultParams.startingBalance);
    return init;
  });

  const addExcitement = useCallback((event: Omit<ExcitementEvent, "timestamp">) => {
    setExcitementLog((prev) => [
      { ...event, timestamp: Date.now() },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const playGame = useCallback(() => {
    setSessions((prev) => {
      const s = { ...prev[activeMechanism] };
      if (s.balance < bet) return prev;

      const result = playRound(activeMechanism, bet);
      s.betsPlayed += 1;
      s.lastResult = result.message;

      if (result.won) {
        s.balance += result.payout;
        s.wins += 1;
        s.currentStreak += 1;
        if (s.currentStreak > s.maxWinStreak) s.maxWinStreak = s.currentStreak;
        if (s.currentStreak >= 3) {
          addExcitement({
            type: "win_streak",
            mechanism: activeMechanism,
            message: `Серия из ${s.currentStreak} побед — «система работает»!`,
          });
        }
        if (result.payout >= bet * 5) {
          addExcitement({
            type: "big_win",
            mechanism: activeMechanism,
            message: `Крупный выигрыш +${result.payout} ₽ — порог дофамина`,
          });
        }
      } else {
        s.balance -= bet;
        s.losses += 1;
        s.currentStreak = 0;
        if (result.nearMiss) {
          addExcitement({
            type: "near_miss",
            mechanism: activeMechanism,
            message: "Near-miss: два символа совпали — «ещё чуть-чуть»!",
          });
        }
      }

      return { ...prev, [activeMechanism]: s };
    });
  }, [activeMechanism, bet, addExcitement]);

  const topUp = useCallback(
    (amount: number) => {
      setSessions((prev) => {
        const s = { ...prev[activeMechanism] };
        s.balance += amount;
        s.totalDeposited += amount;
        s.topUpCount += 1;
        return { ...prev, [activeMechanism]: s };
      });
      addExcitement({
        type: "top_up",
        mechanism: activeMechanism,
        message: `Пополнение +${amount} ₽ — «отыграюсь» (раз #${sessions[activeMechanism].topUpCount + 1})`,
      });
    },
    [activeMechanism, addExcitement, sessions],
  );

  const runAnalysis = useCallback(
    (mechanism?: MechanismId) => {
      const id = mechanism ?? activeMechanism;
      setIsRunning(true);
      setTimeout(() => {
        setMcResults((prev) => ({ ...prev, [id]: runMonteCarlo(id, params) }));
        setIsRunning(false);
      }, 400);
    },
    [activeMechanism, params],
  );

  const runAllAnalysis = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => {
      const results: Partial<Record<MechanismId, SimulationResult>> = {};
      for (const id of ALL_MECHANISMS) {
        results[id] = runMonteCarlo(id, params);
      }
      setMcResults(results);
      setIsRunning(false);
    }, 600);
  }, [params]);

  return (
    <GameContext.Provider
      value={{
        activeMechanism,
        setActiveMechanism,
        sessions,
        excitementLog,
        params,
        setParams,
        mcResults,
        isRunning,
        bet,
        setBet,
        playGame,
        topUp,
        runAnalysis,
        runAllAnalysis,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used within GameProvider");
  return ctx;
}

export { MONTE_CARLO_ITERATIONS };
