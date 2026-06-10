import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Zap } from "lucide-react";
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="mx-4 max-w-md rounded-2xl border border-red-500/40 bg-gradient-to-b from-red-950/80 to-slate-950 p-8 shadow-[0_0_80px_rgba(239,68,68,0.3)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-500/20 p-3">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-red-400">БАНКРОТСТВО</h3>
                <p className="text-sm text-slate-400">Баланс = 0 ₽</p>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-slate-300">
              Математическое ожидание отрицательно при любом механизме рандомизации.
              Пополнение баланса — классический триггер «отыграюсь» (chasing losses).
            </p>

            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={topUp}
                animate={{ boxShadow: ["0 0 20px rgba(251,191,36,0.3)", "0 0 40px rgba(251,191,36,0.6)", "0 0 20px rgba(251,191,36,0.3)"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="lab-btn-dopamine flex-1"
              >
                <Zap className="h-4 w-4" />
                Пополнить +{params.initialBalance.toLocaleString("ru-RU")} ₽
              </motion.button>
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
