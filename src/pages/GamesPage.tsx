import { PageHeader } from "../components/PageHeader";
import { Dashboard } from "../components/Dashboard";
import { ExcitementLog } from "../components/ExcitementLog";
import { GamePanel } from "../components/GamePanel";
import { RngInfoPanel } from "../components/RngInfoPanel";
import { useGameContext } from "../context/GameContext";
import { MECHANISMS } from "../lib/mechanisms";

export function GamesPage() {
  const {
    activeMechanism,
    excitementLog,
    params,
    setParams,
    mcResults,
    isRunning,
    runAnalysis,
    runAllAnalysis,
  } = useGameContext();

  const result = mcResults[activeMechanism] ?? null;
  const info = MECHANISMS[activeMechanism];

  return (
    <div>
      <PageHeader
        label="Практическая часть"
        title="Программа"
        description="4 механизма рандома в 4 игровых оболочках. Играйте, пополняйте баланс, запускайте Монте-Карло."
      />

      <GamePanel />

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <RngInfoPanel mechanism={activeMechanism} />
        <ExcitementLog events={excitementLog} />
      </div>

      <section className="mt-12">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Монте-Карло</p>
            <h2 className="heading-lg mt-1">Анализ · {info.gameShell}</h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isRunning}
              onClick={() => runAnalysis()}
              className="btn-primary text-sm disabled:opacity-40"
            >
              {isRunning ? "Считаем…" : "Запустить анализ"}
            </button>
            <button
              type="button"
              disabled={isRunning}
              onClick={runAllAnalysis}
              className="btn-outline text-sm disabled:opacity-40"
            >
              Все 4 механизма
            </button>
          </div>
        </div>

        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          <label>
            <span className="mb-1 block text-xs font-medium text-ozon-muted">Стартовый баланс</span>
            <input
              type="number"
              min={1}
              className="input-field"
              value={params.startingBalance}
              onChange={(e) =>
                setParams({ ...params, startingBalance: Math.max(1, Number(e.target.value) || 1) })
              }
            />
          </label>
          <label>
            <span className="mb-1 block text-xs font-medium text-ozon-muted">Ставка</span>
            <input
              type="number"
              min={1}
              className="input-field"
              value={params.baseBet}
              onChange={(e) =>
                setParams({ ...params, baseBet: Math.max(1, Number(e.target.value) || 1) })
              }
            />
          </label>
          <label>
            <span className="mb-1 block text-xs font-medium text-ozon-muted">Кол-во ставок</span>
            <input
              type="number"
              min={1}
              max={500}
              className="input-field"
              value={params.numberOfBets}
              onChange={(e) =>
                setParams({
                  ...params,
                  numberOfBets: Math.min(500, Math.max(1, Number(e.target.value) || 1)),
                })
              }
            />
          </label>
        </div>

        <Dashboard
          result={result}
          numberOfBets={params.numberOfBets}
          startingBalance={params.startingBalance}
        />
      </section>
    </div>
  );
}
