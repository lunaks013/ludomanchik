import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SectionHeader } from "../components/SectionHeader";
import { MECHANISM_LIST } from "../lib/mechanisms";
import { MONTE_CARLO_ITERATIONS } from "../lib/monteCarlo";

const points = [
  {
    title: "Иллюзия контроля",
    text: "Участник выбирает параметры ставки и момент пополнения, что создаёт ощущение влияния на результат. Генератор случайных чисел этого не допускает.",
  },
  {
    title: "Повторное пополнение",
    text: "После серии неудачных исходов фиксируется стремление внести дополнительные средства — один из ключевых поведенческих маркеров лудомании.",
  },
  {
    title: "Эффект near-miss",
    text: "Близкий к выигрышу исход (например, два совпавших символа из трёх) усиливает мотивацию продолжать участие.",
  },
  {
    title: "Независимость от реализации RNG",
    text: "При смене алгоритма генерации случайных чисел математическое ожидание остаётся отрицательным для участника.",
  },
];

export function TheoryPage() {
  return (
    <div>
      <PageHeader
        label="Теоретическая часть"
        title="Гемблинг и лудомания"
        description="Исследование математических и поведенческих аспектов участия в азартных играх."
      />

      <section className="mb-12">
        <SectionHeader
          title="Ключевые положения"
          description="Тезисы, подтверждаемые в ходе практической части"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {points.map((p, i) => (
            <article key={p.title} className="topic-card">
              <div className="topic-card-body">
                <span className="topic-card-num">{i + 1}</span>
                <h3 className="text-base font-semibold text-ozon-text">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ozon-muted">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <SectionHeader title="Механизмы генерации случайных чисел" />
        <div className="glass overflow-hidden">
          <table>
            <thead>
              <tr>
                <th>Механизм</th>
                <th>Реализация</th>
                <th>Модель</th>
                <th className="text-right">Мат. ожидание</th>
              </tr>
            </thead>
            <tbody>
              {MECHANISM_LIST.map((m) => (
                <tr key={m.id}>
                  <td className="font-semibold">{m.label}</td>
                  <td className="text-ozon-muted">{m.technicalName}</td>
                  <td className="text-ozon-muted">{m.gameShell}</td>
                  <td className="text-right font-medium text-neg">−{m.houseEdge}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <div className="glass p-6 md:p-8">
          <h2 className="heading-lg mb-3">Метод Монте-Карло</h2>
          <p className="text-sm leading-relaxed text-ozon-muted">
            Для каждого механизма выполняется{" "}
            <strong className="text-ozon-text">{MONTE_CARLO_ITERATIONS} независимых сессий</strong> с
            идентичными начальными параметрами. Сравниваются средний итоговый баланс, доля
            «банкротств» и частота положительных исходов.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <div className="quote-block">
          <p className="text-sm leading-relaxed md:text-base">
            Математическое ожидание отрицательно независимо от выбранного алгоритма RNG.
            Поведенческие факторы усиливают субъективное ощущение контроля и поддерживают
            цикл зависимого поведения.
          </p>
        </div>
      </section>

      <Link to="/games" className="btn-primary">Перейти к программе</Link>
    </div>
  );
}
