import { ArrowRight, BarChart3, BookOpen, Code2, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { MechanismCard } from "../components/MechanismCard";
import { PageHeader } from "../components/PageHeader";
import { SectionHeader } from "../components/SectionHeader";
import { MECHANISM_LIST } from "../math/mechanisms";

const steps = [
  "Продемонстрировать 4 механизма генерации случайных чисел и их программную реализацию",
  "Провести серию экспериментальных итераций и зафиксировать поведенческие наблюдения",
  "Выполнить моделирование методом Монте-Карло и сравнить результаты по всем механизмам",
];

const features = [
  {
    icon: Code2,
    title: "4 механизма RNG",
    text: "LCG PRNG, CSPRNG, взвешенное распределение, Provably Fair (SHA-256)",
  },
  {
    icon: FlaskConical,
    title: "Поведенческий анализ",
    text: "Журнал наблюдений: пополнение счёта, серии исходов, эффект near-miss",
  },
  {
    icon: BarChart3,
    title: "Монте-Карло",
    text: "50 параллельных траекторий капитала для каждого механизма",
  },
];

const stats = [
  { value: "4", label: "механизма RNG" },
  { value: "4", label: "программных модуля" },
  { value: "50", label: "траекторий MC" },
  { value: "E[Δ]<0", label: "для всех модулей", accent: true },
];

export function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-[74px] md:px-6">
      <PageHeader
        label="Дипломная работа · 2026"
        title="Анализ гемблинга (лудомании)"
        description="На примере разработки программного комплекса и сводки результатов моделирования. Демонстрация того, что отрицательное математическое ожидание сохраняется при любом механизме рандомизации."
      />

      <div className="mb-8 flex flex-wrap gap-3">
        <Link to="/games" className="btn-primary">
          Открыть программу
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/theory" className="btn-outline">
          Теоретическая часть
        </Link>
        <Link to="/results" className="btn-outline">
          Итоги анализа
        </Link>
      </div>

      <div className="stat-row mb-12">
        {stats.map((s) => (
          <div key={s.label} className="stat-pill">
            <p className={`stat-pill-value ${s.accent ? "text-[#1e3a5f]" : ""}`}>{s.value}</p>
            <p className="stat-pill-label">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <SectionHeader
          label="Практическая часть"
          title="Программные модули"
          description="Каждый механизм реализован отдельно и доступен в разделе «Программа»."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {MECHANISM_LIST.map((m) => (
            <MechanismCard key={m.id} mechanism={m} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="Структура исследования" />
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="glass p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#1e3a5f]" />
            <p className="section-label !mb-0">Сценарий защиты</p>
          </div>
          <h2 className="heading-lg">Рекомендуемый порядок демонстрации</h2>
          <ol className="step-list mt-5">
            {steps.map((text, i) => (
              <li key={i} className="step-item">
                <span className="step-num">{i + 1}</span>
                <p className="text-sm leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Программный комплекс
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Перейти к экспериментальной части
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Модули RNG · журнал наблюдений · Монте-Карло · сводная таблица
          </p>
        </div>
        <Link to="/games" className="btn-primary shrink-0">
          Открыть программу
        </Link>
      </section>
    </div>
  );
}
