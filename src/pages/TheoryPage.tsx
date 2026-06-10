import { Brain, RefreshCw, Scale, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { AcademicFigure } from "../components/AcademicFigure";
import { PageHeader } from "../components/PageHeader";
import { SectionHeader } from "../components/SectionHeader";
import { IMAGES } from "../lib/images";
import { MECHANISM_LIST } from "../math/mechanisms";
import { MONTE_CARLO_PATHWAYS } from "../math/monteCarlo";

const points = [
  {
    icon: Target,
    title: "Иллюзия контроля",
    text: "Субъект выбирает размер ставки и момент пополнения счёта. Создаётся ощущение влияния на исход, хотя RNG остаётся независимым от действий пользователя.",
  },
  {
    icon: RefreshCw,
    title: "Повторное пополнение",
    text: "После серии отрицательных исходов наблюдается попытка «отыграться» — один из ключевых поведенческих маркеров лудомании.",
  },
  {
    icon: Brain,
    title: "Эффект near-miss",
    text: "Исход, близкий к положительному, усиливает мотивацию продолжать серию, не меняя математическое ожидание.",
  },
  {
    icon: Scale,
    title: "Инвариантность результата",
    text: "При четырёх различных механизмах рандомизации средний итог остаётся отрицательным — меняется только скорость декапитализации.",
  },
];

export function TheoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-[74px] md:px-6">
      <PageHeader
        label="Теоретическая часть"
        title="Гемблинг и лудомания"
        description="Независимо от технической реализации генератора случайных чисел математическое ожидание результата для участника остаётся отрицательным."
      />

      <AcademicFigure
        src={IMAGES.psychology}
        alt="Нейрокогнитивные аспекты исследования зависимого поведения"
        caption="Рис. 1 — Поведенческие и нейрокогнитивные факторы, изучаемые в работе"
        className="mb-10"
      />

      <section className="mb-12">
        <SectionHeader
          title="Ключевые положения"
          description="Тезисы, которые подтверждаются программным комплексом"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {points.map((p) => (
            <article key={p.title} className="thesis-card">
              <div className="thesis-card-icon">
                <p.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="Механизмы генерации случайных чисел" />
        <div className="glass overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Механизм</th>
                <th>Реализация</th>
                <th>Модуль</th>
                <th className="text-right">Преимущество системы</th>
              </tr>
            </thead>
            <tbody>
              {MECHANISM_LIST.map((m, i) => (
                <tr key={m.id}>
                  <td className="text-slate-500">{i + 1}</td>
                  <td className="font-medium text-slate-900">{m.label}</td>
                  <td className="text-slate-600">{m.technicalName}</td>
                  <td className="text-slate-600">{m.gameShell}</td>
                  <td className="text-right font-medium text-neg">−{m.houseEdge}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <AcademicFigure
          src={IMAGES.analytics}
          alt="Визуализация метода Монте-Карло"
          caption="Рис. 2 — Сравнение траекторий при статистическом моделировании"
          className="mb-6"
        />
        <div className="glass p-6 md:p-8">
          <h2 className="heading-lg mb-3">Метод Монте-Карло</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Для каждого механизма выполняется{" "}
            <strong className="text-slate-900">{MONTE_CARLO_PATHWAYS} независимых симуляций</strong>{" "}
            при одинаковых начальных параметрах (капитал, ставка, число итераций). Сравниваются:
            средний остаток капитала, доля траекторий с полным исчерпанием средств и фактическая
            доля положительных исходов относительно теоретической.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-slate-600">
            <li>Индекс вероятности исчерпания капитала</li>
            <li>Скорость декапитализации (Δ капитала / начальный баланс)</li>
            <li>Накопленная системная маржа</li>
          </ul>
        </div>
      </section>

      <section className="mb-10">
        <div className="quote-block">
          <p className="text-base leading-relaxed">
            Математическое ожидание отрицательно при любом механизме RNG. Поведенческие факторы
            (иллюзия контроля, near-miss, повторное пополнение) усиливают субъективную вовлечённость,
            но не изменяют итоговый статистический результат на дистанции.
          </p>
        </div>
      </section>

      <Link to="/games" className="btn-primary">
        Перейти к программе
      </Link>
    </div>
  );
}
