import { ArrowRight, BarChart3, Brain, Code2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroBanner } from "../components/HeroBanner";
import { MechanismCard } from "../components/MechanismCard";
import { SectionHeader } from "../components/SectionHeader";
import { MECHANISM_LIST } from "../lib/mechanisms";

const steps = [
  "Продемонстрировать 4 механизма генерации случайных чисел и их программную реализацию",
  "Провести серию симуляций в каждой модели, зафиксировать поведенческие триггеры в журнале",
  "Выполнить анализ методом Монте-Карло и сформировать сводку результатов",
];

const features = [
  { icon: Code2, title: "Реализация RNG", text: "Math.random(), XorShift32, Fisher-Yates, взвешенный выбор" },
  { icon: Brain, title: "Поведенческий анализ", text: "Фиксация пополнений, серий исходов и эффекта near-miss" },
  { icon: BarChart3, title: "Монте-Карло", text: "40 виртуальных сессий на каждый механизм" },
];

const stats = [
  { value: "4", label: "механизма RNG" },
  { value: "4", label: "модели симуляции" },
  { value: "40", label: "сессий в анализе" },
  { value: "−2.7%", label: "мин. мат. ожидание", accent: true },
];

export function HomePage() {
  return (
    <div>
      <HeroBanner
        label="Дипломная работа · 2026"
        title="Анализ гемблинга (лудомании)"
        subtitle="на примере создания собственной программы и сводки результатов"
      >
        <Link to="/theory" className="btn-primary">
          Теоретическая часть
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/games" className="btn-secondary">Программа</Link>
      </HeroBanner>

      <div className="stat-row mb-10">
        {stats.map((s) => (
          <div key={s.label} className="stat-pill">
            <p className={`stat-pill-value ${s.accent ? "text-neg" : ""}`}>{s.value}</p>
            <p className="stat-pill-label">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <SectionHeader
          label="Практическая часть"
          title="Механизмы генерации случайных чисел"
          description="Каждый механизм реализован отдельно и представлен в виде модели симуляции."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {MECHANISM_LIST.map((m) => (
            <MechanismCard key={m.id} mechanism={m} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="glass p-6 md:p-8">
          <p className="section-label">Цель работы</p>
          <h2 className="heading-lg mt-2">Математический и поведенческий анализ</h2>
          <p className="body-text mt-4">
            Программа демонстрирует, что при любом способе генерации случайных чисел
            математическое ожидание результата для участника отрицательное. Дополнительно
            фиксируются поведенческие факторы, связанные с развитием лудомании: повторное
            пополнение баланса, серии исходов и эффект near-miss.
          </p>
          <Link to="/theory" className="btn-outline mt-5">Подробнее в теории</Link>
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
              <h3 className="font-semibold text-ozon-text">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ozon-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="glass p-6 md:p-8">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-accent" />
            <p className="section-label !mb-0">План демонстрации</p>
          </div>
          <h2 className="heading-lg">Сценарий для комиссии</h2>
          <ol className="step-list mt-5">
            {steps.map((text, i) => (
              <li key={i} className="step-item">
                <span className="step-num">{i + 1}</span>
                <p className="text-sm leading-relaxed text-ozon-muted pt-0.5">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <h2 className="text-lg font-semibold text-ozon-text">Практическая часть и сводка результатов</h2>
          <p className="mt-1 text-sm text-ozon-muted">
            Симуляция · журнал поведения · Монте-Карло · итоговая таблица
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/games" className="btn-primary">Программа</Link>
          <Link to="/results" className="btn-outline">Итоги</Link>
        </div>
      </section>
    </div>
  );
}
