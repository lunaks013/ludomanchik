import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useTelemetry } from "../../context/TelemetryContext";

export function BankruptcyAlert() {
  const { showBankruptcyAlert, topUp, dismissBankruptcyAlert, params } = useTelemetry();

  return (
    <AnimatePresence>
      {showBankruptcyAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40"
        >
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            className="mx-4 max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-lg"
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-md bg-red-50 p-2">
                <AlertTriangle className="h-5 w-5 text-red-700" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Исчерпание экспериментального капитала
                </h3>
                <p className="mt-1 text-sm text-slate-500">Баланс сессии = 0 ₽</p>
              </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-slate-600">
              Зафиксировано полное исчерпание капитала при отрицательном математическом ожидании.
              Повторное пополнение моделирует поведенческий паттерн «chasing losses»
              (попытка компенсировать потери).
            </p>

            <div className="flex gap-3">
              <button type="button" onClick={topUp} className="lab-btn-primary flex-1">
                Пополнить +{params.initialBalance.toLocaleString("ru-RU")} ₽
              </button>
              <button type="button" onClick={dismissBankruptcyAlert} className="lab-btn-secondary">
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
