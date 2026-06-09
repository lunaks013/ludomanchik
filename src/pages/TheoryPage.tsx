import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SectionHeader } from "../components/SectionHeader";
import { SiteImage } from "../components/SiteImage";
import { IMAGES } from "../lib/images";
import { MECHANISM_LIST } from "../lib/mechanisms";
import { MONTE_CARLO_ITERATIONS } from "../lib/monteCarlo";

const points = [
  {
    title: "Иллюзия контроля",
    text: "Участник выбирает ставку и момент пополнения — кажется, что результат от него зависит. RNG этого не меняет.",
    image: IMAGES.psychology,
  },
  {
    title: "Пополнение баланса",
    text: "После неудачных исходов фиксируется стремление внести дополнительные средства — поведенческий маркер лудомании.",
    image: IMAGES.analytics,
  },
  {
    title: "Near-miss",
    text: "Близкий к выигрышу исход создаёт ощущение «почти получилось» и усиливает мотивацию продолжать.",
    image: IMAGES.analytics,
  },
  {
    title: "Независимость от RNG",
    text: "При смене алгоритма генерации случайных чисел математическое ожидание остаётся отрицательным.",
    image: IMAGES.analytics,
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

      <SiteImage
        src={IMAGES.psychology}
        alt="Нейробиология зависимости"
        className="illustration-banner mb-10 md:min-h-[280px]"
        aspect="banner"
      />

      <section className="mb-14">
        <SectionHeader title="Ключевые положения" description="Тезисы, подтверждаемые в практической части" />
        <div className="grid gap-6 sm:grid-cols-2">
          {points.map((p) => (
            <article key={p.title} className="topic-card">
              <SiteImage src={p.image} alt={p.title} className="topic-card-img" />
              <div className="topic-card-body">
                <h3 className="text-lg font-bold text-ozon-text">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ozon-muted">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-14">
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
                  <td className="text-right font-bold text-neg">−{m.houseEdge}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="split-section mb-14">
        <div className="glass p-8">
          <h2 className="heading-lg mb-3">Метод Монте-Карло</h2>
          <p className="text-sm leading-relaxed text-ozon-muted">
            Для каждого механизма —{" "}
            <strong className="text-ozon-text">{MONTE_CARLO_ITERATIONS} независимых сессий</strong> с
            одинаковыми параметрами. Сравниваются средний баланс, доля банкротств и частота положительных исходов.
          </p>
        </div>
        <SiteImage src={IMAGES.analytics} alt="Монте-Карло" className="split-section-img" aspect="card" />
      </section>

      <section className="mb-10">
        <div className="quote-block">
          <p className="text-base leading-relaxed">
            Математическое ожидание отрицательно при любом RNG. Поведенческие факторы
            усиливают иллюзию контроля и поддерживают цикл лудомании.
          </p>
        </div>
      </section>

      <Link to="/games" className="btn-primary">Перейти к программе</Link>
    </div>
  );
}
