import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

const rootEl = document.getElementById("root");

if (!rootEl) {
  document.body.innerHTML =
    '<p style="color:#fff;background:#000;padding:40px;font-family:sans-serif">Не найден #root. Запустите: npm run dev</p>';
} else {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
