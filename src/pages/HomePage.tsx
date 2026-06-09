import { ArrowRight, BarChart3, Brain, Code2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroBanner } from "../components/HeroBanner";
import { MechanismCard } from "../components/MechanismCard";
import { SectionHeader } from "../components/SectionHeader";
import { SiteImage } from "../components/SiteImage";
import { IMAGES } from "../lib/images";
import { MECHANISM_LIST } from "../lib/mechanisms";

const steps = [
  "Продемонстрировать 4 механизма RNG и их программную реализацию",
  "Провести симуляции в каждой модели, зафиксировать поведенческие события в журнале",
  "Выполнить анализ Монте-Карло и сформировать сводку результатов",
];

const features = [
  { icon: Code2, title: "4 механизма RNG", text: "Math.random(), XorShift32, Fisher-Yates, взвешенный выбор" },
  { icon: Brain, title: "Поведенческий анализ", text: "Пополнение, серии исходов, near-miss — журнал событий" },
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
        image={IMAGES.hero}
        label="Дипломная работа · 2026"
        title="Анализ гемблинга (лудомании)"
        subtitle="на примере создания собственной программы и сводки результатов"
      >
        <Link to="/games" className="btn-primary">
          Практическая часть
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/theory" className="btn-secondary">Теория</Link>
      </HeroBanner>

      <div className="stat-row mb-12">
        {stats.map((s) => (
          <div key={s.label} className="stat-pill">
            <p className={`stat-pill-value ${s.accent ? "text-neg" : ""}`}>{s.value}</p>
            <p className="stat-pill-label">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mb-14">
        <SectionHeader
          label="Практическая часть"
          title="Механизмы генерации случайных чисел"
          description="Каждый механизм реализован отдельно и представлен в виде модели симуляции."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {MECHANISM_LIST.map((m) => (
            <MechanismCard key={m.id} mechanism={m} />
          ))}
        </div>
      </section>

      <section className="split-section mb-14">
        <SiteImage src={IMAGES.psychology} alt="Психология лудомании" className="split-section-img" aspect="card" />
        <div className="glass p-8">
          <p className="section-label">О чём работа</p>
          <h2 className="heading-lg mt-2">Математика и психология</h2>
          <p className="body-text mt-4">
            Программа демонстрирует, что независимо от реализации RNG математическое
            ожидание отрицательное. Отдельно фиксируются поведенческие факторы лудомании:
            пополнение баланса, серии исходов и эффект near-miss.
          </p>
          <Link to="/theory" className="btn-outline mt-6">Теоретическая часть</Link>
        </div>
      </section>

      <section className="mb-14">
        <SectionHeader title="Методы исследования" />
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-ozon-text">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ozon-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="split-section mb-14">
        <div className="glass p-8">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-6 w-6 text-accent" />
            <p className="section-label !mb-0">План демонстрации</p>
          </div>
          <h2 className="heading-lg">Сценарий для комиссии</h2>
          <ol className="step-list mt-6">
            {steps.map((text, i) => (
              <li key={i} className="step-item">
                <span className="step-num">{i + 1}</span>
                <p className="text-sm leading-relaxed text-ozon-muted pt-1">{text}</p>
              </li>
            ))}
          </ol>
        </div>
        <SiteImage src={IMAGES.analytics} alt="Анализ Монте-Карло" className="split-section-img" aspect="card" />
      </section>

      <section className="cta-banner">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-light">Сводка результатов</p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">Программа и итоги анализа</h2>
          <p className="mt-2 text-sm text-white/75">Симуляция · журнал поведения · Монте-Карло · таблица итогов</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/games" className="btn-primary">Программа</Link>
          <Link to="/results" className="btn-secondary">Итоги</Link>
        </div>
      </section>
    </div>
  );
}
