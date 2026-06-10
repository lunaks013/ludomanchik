import { lazy, Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { TelemetryProvider } from "./context/TelemetryContext";

const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.HomePage })));
const TheoryPage = lazy(() => import("./pages/TheoryPage").then((m) => ({ default: m.TheoryPage })));
const GamesPage = lazy(() => import("./pages/GamesPage").then((m) => ({ default: m.GamesPage })));
const ResultsPage = lazy(() =>
  import("./pages/ResultsPage").then((m) => ({ default: m.ResultsPage })),
);

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-slate-400">
      Загрузка…
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <TelemetryProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="theory" element={<TheoryPage />} />
              <Route path="games" element={<GamesPage />} />
              <Route path="simulator" element={<Navigate to="/games" replace />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </TelemetryProvider>
    </HashRouter>
  );
}
