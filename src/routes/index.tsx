import { createFileRoute } from "@tanstack/react-router";
import {
  cases,
  capabilities,
  profile,
  sideProjects,
} from "@/content/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Joris Grouillet — Product Architect" },
      {
        name: "description",
        content:
          "Product clarity. Technical fluency. Portfolio freelance de Joris Grouillet : architecture produit & technique, santé, IA, interopérabilité, et side-business nocodext.studio.",
      },
      { property: "og:title", content: "Joris Grouillet — Product Architect" },
      {
        property: "og:description",
        content:
          "Product clarity. Technical fluency. Cas clients en santé, IA, interopérabilité et SaaS métier, plus quatre side-business en production.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-ground/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="flex items-center justify-between py-4">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-md bg-ink font-mono text-xs font-medium text-white">
              {profile.initials}
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">
              {profile.firstName} {profile.lastName}
            </span>
            <span className="hidden font-mono text-[11px] text-slate sm:inline">
              / product architect
            </span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-medium text-slate md:flex">
            <a href="#work" className="transition-colors hover:text-ink">
              Cas clients
            </a>
            <a href="#process" className="transition-colors hover:text-ink">
              Méthode
            </a>
            <a href="#lab" className="transition-colors hover:text-ink">
              Side-business
            </a>
            <a href="#contact" className="transition-colors hover:text-ink">
              Contact
            </a>
          </div>
          <a
            href="#contact"
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white ring-1 ring-ink/10 transition-transform hover:-translate-y-0.5"
          >
            Démarrer un projet
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pt-12 pb-16">
      <div className="mb-8 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
          {profile.role} — Freelance
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[11px] text-slate">
          {profile.location}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="reveal d1 font-mono text-xs text-slate">
            [01] — Positionnement
          </p>
          <h1 className="reveal d1 mt-4 max-w-[18ch] font-display text-5xl font-bold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Product clarity.
            <br />
            Technical fluency.
          </h1>
          <p className="reveal d2 mt-6 max-w-[52ch] text-base text-pretty text-slate sm:text-lg">
            Je transforme des besoins métier flous — hôpital, laboratoire, énergie,
            IA — en systèmes qui tiennent en production : modélisation des flux,
            architecture event-driven, interopérabilité normée, conformité HDS et
            RGPD, puis documentation et transmission aux équipes qui les portent.
          </p>
          <div className="reveal d3 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-white ring-1 ring-ink/10 transition-transform hover:-translate-y-0.5"
            >
              Voir les cas clients
            </a>
            <a
              href="#lab"
              className="rounded-md bg-white/70 px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-ink/10 backdrop-blur transition-transform hover:-translate-y-0.5"
            >
              {profile.sideBusinessBrand}
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="reveal d3 relative rounded-[min(1vw,16px)] bg-white/60 p-6 ring-1 ring-ink/10 backdrop-blur-xl prism-edge">
            <div className="spectrum absolute inset-x-6 top-0 h-px opacity-70" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="font-display text-3xl font-semibold leading-none">
                  {cases.length}
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate">
                  cas clients
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold leading-none">
                  {sideProjects.length}
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate">
                  produits solo
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold leading-none">
                  HDS
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate">
                  niveaux 4-6
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-ink/10 pt-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
                En ce moment
              </div>
              <p className="mt-2 text-sm font-medium">
                Architecture d'une plateforme hospitalière d'information
                Soignant · Patient · Familles, et lancement de{" "}
                {profile.sideBusinessBrand}.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-cyan/10 px-3 py-1 font-mono text-[11px] text-cyan">
                  Interopérabilité
                </span>
                <span className="rounded-full bg-violet/10 px-3 py-1 font-mono text-[11px] text-violet">
                  Event-driven
                </span>
                <span className="rounded-full bg-amber/10 px-3 py-1 font-mono text-[11px] text-amber">
                  IA appliquée
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ item }: { item: (typeof cases)[number] }) {
  return (
    <article
      id={item.id}
      className={`group relative overflow-hidden rounded-[min(1vw,14px)] bg-white/60 ring-1 ring-ink/10 backdrop-blur-xl prism-edge transition-transform hover:-translate-y-1 ${
        item.flagship ? "lg:col-span-2" : ""
      }`}
    >
      <div className="spectrum h-1 w-full opacity-80" />
      <div className="p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate">
          <span>
            {item.index} / {item.sector}
          </span>
          {item.flagship ? (
            <span className="rounded-full bg-amber/10 px-2.5 py-0.5 text-amber">
              Flagship
            </span>
          ) : null}
        </div>
        <h3 className="mt-5 max-w-[30ch] font-display text-2xl font-semibold leading-tight tracking-tight text-balance">
          {item.title}
        </h3>
        <p className="mt-3 max-w-prose text-sm text-pretty text-slate">
          {item.need}
        </p>
        <ul
          className={`mt-6 space-y-2.5 ${
            item.flagship ? "sm:columns-2 sm:gap-8 sm:space-y-0" : ""
          }`}
        >
          {item.highlights.map((h) => (
            <li
              key={h}
              className="flex gap-3 text-sm text-pretty sm:break-inside-avoid sm:pb-2.5"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
        {item.scope ? (
          <p className="mt-5 border-l-2 border-violet/40 pl-3 font-mono text-[11px] leading-relaxed text-slate">
            {item.scope}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px]">
          {item.stack.map((s) => (
            <span key={s} className="rounded-full bg-ink/5 px-2.5 py-1">
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function Work() {
  return (
    <section id="work" className="border-y border-ink/10 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
              [02] — Cas clients
            </span>
            <h2 className="mt-3 max-w-[26ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
              Des systèmes livrés en environnement contraint.
            </h2>
          </div>
          <span className="font-mono text-xs text-slate">
            {cases.length} missions
          </span>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {cases.map((item) => (
            <CaseCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-6 py-16">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
        [03] — Méthode
      </span>
      <h2 className="mt-3 max-w-[22ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
        Un plan lisible qui devient un système en marche.
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[min(1vw,14px)] ring-1 ring-ink/10 md:grid-cols-3">
        {capabilities.map((c) => (
          <div key={c.key} className="bg-white/60 p-6 ring-1 ring-ink/10">
            <span className={`font-mono text-xs ${c.accent}`}>{c.key}</span>
            <div className="mt-3 font-display text-lg font-semibold">
              {c.title}
            </div>
            <p className="mt-2 text-sm text-pretty text-slate">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SideBusiness() {
  return (
    <section id="lab" className="mx-auto max-w-6xl px-6 pb-16">
      <div className="relative overflow-hidden rounded-[min(1vw,16px)] bg-ink p-8 text-white ring-1 ring-ink/10 prism-edge sm:p-10">
        <div className="spectrum absolute inset-x-0 top-0 h-1 opacity-90" />
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/60">
          <span className="size-1.5 rounded-full bg-cyan" /> [04] — Side-business
        </div>
        <h2 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
          nocodext<span className="text-cyan">.</span>studio
        </h2>
        <p className="mt-3 max-w-[58ch] text-sm text-pretty text-white/70">
          Quatre produits menés en solopreneur, de l'idée à la production :
          extensions navigateur et outillage qui comblent les manques des
          plateformes que les équipes utilisent tous les jours.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {sideProjects.map((p) => (
            <div
              key={p.id}
              className="rounded-[min(1vw,14px)] bg-white/5 p-6 ring-1 ring-white/10"
            >
              <div className="font-mono text-[11px] text-white/50">
                {p.index} / produit
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold">
                {p.name}
              </h3>
              <p className="mt-2 text-sm text-pretty text-white/70">{p.pitch}</p>
              <ul className="mt-4 space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm text-white/80">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
                    <span className="text-pretty">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] text-white/60">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-white/10 px-2.5 py-1"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] text-cyan">
                {p.business}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-[min(1vw,16px)] bg-white/60 p-8 ring-1 ring-ink/10 backdrop-blur-xl prism-edge sm:p-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
              [05] — Contact
            </span>
            <h2 className="mt-4 max-w-[20ch] font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">
              Parlons du problème avant la solution.
            </h2>
            <p className="mt-4 max-w-[44ch] text-sm text-pretty text-slate sm:text-base">
              Une mission engagée à la fois. Décrivez le contexte et les
              contraintes : j'apporte le cadrage, l'architecture et le plan de
              livraison.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-md bg-ink px-6 py-3.5 text-center text-sm font-semibold text-white ring-1 ring-ink/10 transition-transform hover:-translate-y-0.5"
            >
              {profile.email}
            </a>
            <div className="flex flex-wrap gap-4 font-mono text-xs text-slate">
              <span>{profile.sideBusinessBrand}</span>
              <span>·</span>
              <span>LinkedIn</span>
              <span>·</span>
              <span>{profile.location} · CET</span>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-6 font-mono text-[11px] text-slate">
        <span>
          © {new Date().getFullYear()} {profile.firstName} {profile.lastName} —{" "}
          {profile.role}
        </span>
        <span>{profile.tagline}</span>
      </footer>
    </section>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-ground font-sans text-ink antialiased selection:bg-cyan/20">
      <Nav />
      <Hero />
      <Work />
      <Process />
      <SideBusiness />
      <Contact />
    </main>
  );
}
