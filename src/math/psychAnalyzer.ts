import type {
  BettingStrategy,
  CustomGameRules,
  MechanismId,
  PsychEvent,
  PsychEventType,
  TelemetryParams,
} from "../types";

let eventCounter = 0;

function createEvent(
  type: PsychEventType,
  mechanism: MechanismId,
  message: string,
  brainRegion?: string,
): PsychEvent {
  eventCounter += 1;
  return {
    id: `psych-${eventCounter}-${Date.now()}`,
    type,
    mechanism,
    message,
    brainRegion,
    timestamp: Date.now(),
  };
}

export function analyzeParameterChange(
  mechanism: MechanismId,
  field: string,
  value: string | number,
): PsychEvent {
  return createEvent(
    "parameter_change",
    mechanism,
    `Изменён параметр «${field}» → ${value}. Когнитивная переоценка контроля над исходом.`,
    "Префронтальная кора",
  );
}

export function analyzeCustomRulesChange(rules: CustomGameRules, mechanism: MechanismId): PsychEvent {
  return createEvent(
    "illusion_of_control",
    mechanism,
    `Предупреждение: активирована когнитивная иллюзия контроля. Порог=${rules.winThreshold}, множитель=${rules.payoutMultiplier}. Изменение правил не меняет E[profit] < 0.`,
    "Префронтальная кора (лateral PFC)",
  );
}

export function analyzeAfterRound(
  mechanism: MechanismId,
  params: TelemetryParams,
  session: {
    consecutiveLosses: number;
    consecutiveWins: number;
    wins: number;
    losses: number;
    topUpCount: number;
    balance: number;
    initialBalance: number;
  },
  round: { won: boolean; nearMiss?: boolean; payout: number; bet: number },
): PsychEvent[] {
  const events: PsychEvent[] = [];

  if (round.nearMiss) {
    events.push(
      createEvent(
        "near_miss",
        mechanism,
        "Near-miss: исход визуально близок к выигрышу. Активируется дофаминовая система вознаграждения без фактического профита.",
        "Вентральный striatum",
      ),
    );
  }

  if (round.won && round.payout >= params.baseBet * 5) {
    events.push(
      createEvent(
        "big_win",
        mechanism,
        `Крупный выигрыш +${round.payout} ₽ — пик дофаминового отклика. Риск эффекта «я нашёл систему».`,
        "Вентральный striatum / NAcc",
      ),
    );
  }

  if (!round.won && session.consecutiveLosses >= 3) {
    const isMartingale = params.strategy === "martingale";
    events.push(
      createEvent(
        isMartingale ? "martingale_trap" : "loss_streak",
        mechanism,
        isMartingale
          ? `Серия из ${session.consecutiveLosses} проигрышей при стратегии Мартингейл — «ловушка отыгрыша» активирована.`
          : `Серия из ${session.consecutiveLosses} проигрышей подряд — растёт субъективная вероятность «отыграться».`,
        isMartingale ? "Вентральный striatum / миндалина" : "Передняя поясная кора",
      ),
    );
  }

  if (round.won && session.consecutiveWins >= 3) {
    events.push(
      createEvent(
        "win_streak",
        mechanism,
        `Серия из ${session.consecutiveWins} побед — иллюзия «система работает». E[profit] остаётся отрицательным.`,
        "Вентральный striatum",
      ),
    );
  }

  if (params.strategy === "dalembert" && session.consecutiveLosses >= 2) {
    events.push(
      createEvent(
        "dalembert_escalation",
        mechanism,
        "Стратегия Д'Аламбер: линейный рост ставки после проигрышей ускоряет декапитализацию.",
        "Дорсолateralная PFC",
      ),
    );
  }

  return events;
}

export function analyzeTopUp(
  mechanism: MechanismId,
  amount: number,
  topUpCount: number,
  wasBankrupt: boolean,
): PsychEvent {
  if (wasBankrupt) {
    return createEvent(
      "bankruptcy",
      mechanism,
      `Банкротство → мгновенное пополнение +${amount} ₽ (раз #${topUpCount}). Паттерн «chasing losses» — попытка компенсировать невозвратные потери.`,
      "Миндалина / ventral striatum",
    );
  }
  return createEvent(
    "top_up",
    mechanism,
    `Пополнение +${amount} ₽ (раз #${topUpCount}) — субъективное «отыграюсь» без изменения матожидания.`,
    "Орбитofrontalная кора",
  );
}

export function analyzeStrategyChange(strategy: BettingStrategy, mechanism: MechanismId): PsychEvent {
  const labels: Record<BettingStrategy, string> = {
    flat: "Фиксированная",
    martingale: "Мартингейл",
    dalembert: "Д'Аламбер",
  };
  return createEvent(
    "parameter_change",
    mechanism,
    `Смена стратегии на «${labels[strategy]}». Ни одна стратегия ставок не меняет отрицательное матожидание.`,
    "Префронтальная кора",
  );
}

export function analyzeChaseLoss(mechanism: MechanismId, betIncrease: number): PsychEvent {
  return createEvent(
    "chase_loss",
    mechanism,
    `Ставка увеличена на ${betIncrease}% после проигрыша — поведенческий паттерн «chase losses».`,
    "Миндалина",
  );
}
