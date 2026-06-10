import { ArrowRight, BarChart3, Brain, Code2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroBanner } from "../components/HeroBanner";
import { MechanismCard } from "../components/MechanismCard";
import { SectionHeader } from "../components/SectionHeader";
import { SiteImage } from "../components/SiteImage";
import { IMAGES } from "../lib/images";
import { MECHANISM_LIST } from "../math/mechanisms";

const steps = [
  "Показать 4 механизма рандома и их техническую реализацию",
  "Сыграть в каждую оболочку, пополнить баланс — показать журнал азарта",
  "Запустить Монте-Карло и сравнить итоги по всем механизмам",
];

const features = [
  { icon: Code2, title: "4 RNG-механизма", text: "LCG PRNG, CSPRNG, Weighted Near-Miss, Provably Fair SHA-256" },
  { icon: Brain, title: "Психология азарта", text: "Пополнение, серии побед, near-miss — научный псих-лог" },
  { icon: BarChart3, title: "Монте-Карло", text: "50 параллельных траекторий на каждый механизм" },
];

const stats = [
  { value: "4", label: "механизма рандома" },
  { value: "4", label: "игровые оболочки" },
  { value: "50", label: "траекторий MC" },
  { value: "−4%", label: "мин. edge казино", accent: true },
];

export function HomePage() {
  return (
    <div className="px-4 pb-20 pt-[74px] md:px-6">
      <HeroBanner
        image={IMAGES.hero}
        label="Дипломная работа · 2026"
        title="Анализ гемблинга (лудомании)"
        subtitle="на примере создания собственной программы и сводки результатов"
      >
        <Link to="/games" className="btn-primary">
          Открыть лабораторию
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
          title="4 механизма рандома"
          description="Каждый реализован по-разному и обёрнут в свою игру. Нажмите на карточку — откроется в программе."
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
            Программа демонстрирует, что независимо от реализации RNG матожидание
            отрицательное. Отдельно фиксируются триггеры лудомании: пополнение баланса
            после проигрыша, серии побед и near-miss в слоте.
          </p>
          <Link to="/theory" className="btn-outline mt-6">Читать теорию</Link>
        </div>
      </section>

      <section className="mb-14">
        <SectionHeader title="Возможности платформы" />
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
            <Shield className="h-6 w-6 text-gold" />
            <p className="section-label !mb-0">Сценарий защиты</p>
          </div>
          <h2 className="heading-lg">Как показать комиссии</h2>
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
          <p className="text-sm font-bold uppercase tracking-widest text-gold">Готово к защите</p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">Запустите программу прямо сейчас</h2>
          <p className="mt-2 text-sm text-white/70">4 игры · журнал азарта · Монте-Карло · сводка итогов</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/games" className="btn-primary">Программа</Link>
          <Link to="/results" className="btn-secondary">Итоги</Link>
        </div>
      </section>
    </div>
  );
}
