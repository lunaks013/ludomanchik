import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SectionHeader } from "../components/SectionHeader";
import { SiteImage } from "../components/SiteImage";
import { IMAGES } from "../lib/images";
import { MECHANISM_LIST } from "../math/mechanisms";
import { MONTE_CARLO_PATHWAYS } from "../math/monteCarlo";

const points = [
  {
    title: "Иллюзия контроля",
    text: "Игрок выбирает ставку и момент пополнения — кажется, что результат от него зависит. RNG этого не меняет.",
    image: IMAGES.chips,
  },
  {
    title: "Пополнение баланса",
    text: "После проигрыша игрок вносит ещё деньги в надежде «отыграться» — ключевой триггер лудомании.",
    image: IMAGES.wallet,
  },
  {
    title: "Near-miss",
    text: "Два совпавших символа в слоте создают ощущение «почти выиграл» и подталкивают продолжать.",
    image: IMAGES.slot,
  },
  {
    title: "Любой RNG — один итог",
    text: "4 разных механизма, 4 разные игры — матожидание всегда отрицательное.",
    image: IMAGES.analytics,
  },
];

export function TheoryPage() {
  return (
    <div className="px-4 pb-20 pt-[74px] md:px-6">
      <PageHeader
        label="Теоретическая часть"
        title="Гемблинг и лудомания"
        description="Независимо от технической реализации генератора случайных чисел игрок на дистанции в проигрыше."
      />

      <SiteImage
        src={IMAGES.psychology}
        alt="Нейробиология зависимости"
        className="illustration-banner mb-10 md:min-h-[320px]"
        aspect="banner"
      />

      <section className="mb-14">
        <SectionHeader title="Ключевые положения" description="Четыре тезиса, которые демонстрирует программа" />
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
        <SectionHeader title="Механизмы рандома" />
        <div className="glass overflow-hidden">
          <table>
            <thead>
              <tr>
                <th>Механизм</th>
                <th>Реализация</th>
                <th>Игра</th>
                <th className="text-right">Edge</th>
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
            <strong className="text-white">{MONTE_CARLO_PATHWAYS} независимых сессий</strong> с
            одинаковыми параметрами. Сравниваются средний баланс, доля банкротств и винрейт.
          </p>
        </div>
        <SiteImage src={IMAGES.analytics} alt="Монте-Карло" className="split-section-img" aspect="card" />
      </section>

      <section className="mb-10">
        <div className="quote-block">
          <p className="text-lg leading-relaxed">
            Математическое ожидание отрицательное при любом RNG. Психологические триггеры
            усиливают иллюзию контроля и поддерживают цикл лудомании.
          </p>
        </div>
      </section>

      <Link to="/games" className="btn-primary">Открыть программу</Link>
    </div>
  );
}
