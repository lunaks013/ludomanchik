interface StatCardProps {
  title: string;
  value: string;
  hint?: string;
  valueClassName?: string;
}

export function StatCard({ title, value, hint, valueClassName = "" }: StatCardProps) {
  return (
    <div className="glass p-5 transition hover:shadow-lift">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <p className={`mt-2 text-2xl font-bold text-white ${valueClassName}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
