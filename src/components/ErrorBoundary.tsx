import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crash:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9] p-6">
          <div className="glass max-w-md p-8 text-center">
            <h1 className="text-lg font-semibold text-slate-900">Ошибка загрузки</h1>
            <p className="mt-2 text-sm text-slate-600">
              Запустите через терминал: <code className="text-slate-900">npm run dev</code>
            </p>
            <p className="mt-3 text-xs text-neg">{this.state.error.message}</p>
            <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-4">
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
