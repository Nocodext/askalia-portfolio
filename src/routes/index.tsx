import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Élise Laurent — Product & Technical Architect + AI" },
      {
        name: "description",
        content:
          "Portfolio freelance d'architecte produit & technique spécialisée en IA : études de cas, side-business et méthode.",
      },
      {
        property: "og:title",
        content: "Élise Laurent — Product & Technical Architect + AI",
      },
      {
        property: "og:description",
        content:
          "Portfolio freelance d'architecte produit & technique spécialisée en IA : études de cas, side-business et méthode.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Nav() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <nav className="flex items-center justify-between py-5">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-md bg-ink font-mono text-sm font-medium text-white">
            EL
          </div>
          <span className="font-display text-sm font-semibold tracking-tight">
            Élise Laurent
          </span>
          <span className="hidden font-mono text-[11px] text-slate sm:inline">
            / architect
          </span>
        </div>
        <div className="hidden items-center gap-7 text-sm font-medium text-slate sm:flex">
          <a href="#work" className="transition-colors hover:text-ink">
            Work
          </a>
          <a href="#process" className="transition-colors hover:text-ink">
            Process
          </a>
          <a href="#lab" className="transition-colors hover:text-ink">
            Side project
          </a>
          <a href="#contact" className="transition-colors hover:text-ink">
            Contact
          </a>
        </div>
        <a
          href="#contact"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white ring-1 ring-ink/10 transition-transform hover:-translate-y-0.5"
        >
          Start a project
        </a>
      </nav>
    </div>
  );
}

function Hero() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-8 pb-16">
      <div className="mb-8 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
          Product &amp; Technical Architect — AI
        </span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[11px] text-slate">Paris · remote</span>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="reveal d1 font-mono text-xs text-slate">
            [01] — Statement
          </p>
          <h1 className="mt-4 max-w-[20ch] font-display text-5xl font-bold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            I turn ambiguous problems into shipped systems.
          </h1>
          <p className="reveal d2 mt-6 max-w-[46ch] text-base text-pretty sm:text-lg sm:text-slate">
            Ten years at the seam of product and infrastructure. I design
            platforms, evaluation harnesses, and AI features that hold up
            under load — then make them legible to the people owning them.
          </p>
          <div className="reveal d3 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-white ring-1 ring-ink/10 transition-transform hover:-translate-y-0.5"
            >
              See the work
            </a>
            <a
              href="#process"
              className="rounded-md bg-white/70 px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-ink/10 backdrop-blur transition-transform hover:-translate-y-0.5"
            >
              How I work
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="reveal d3 relative rounded-[min(1vw,16px)] bg-white/60 p-6 ring-1 ring-ink/10 backdrop-blur-xl prism-edge">
            <div className="spectrum absolute inset-x-6 top-0 h-px opacity-70" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="font-display text-3xl font-semibold leading-none">
                  11
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate">
                  yrs shipping
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold leading-none">
                  40+
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate">
                  systems built
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-semibold leading-none">
                  3
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate">
                  exits advised
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-ink/10 pt-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">
                Currently
              </div>
              <p className="mt-2 text-sm font-medium">
                Architecting an agentic search platform for a Series-B fintech.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-cyan/10 px-3 py-1 font-mono text-[11px] text-cyan">
                  Distributed
                </span>
                <span className="rounded-full bg-violet/10 px-3 py-1 font-mono text-[11px] text-violet">
                  LLM evals
                </span>
                <span className="rounded-full bg-amber/10 px-3 py-1 font-mono text-[11px] text-amber">
                  Go · TS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Work() {
  return (
    <div id="work" className="border-y border-ink/10 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
              [02] — Case studies
            </span>
            <h2 className="mt-3 max-w-[24ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
              Selected work, systems shipped.
            </h2>
          </div>
          <span className="hidden font-mono text-xs text-slate lg:inline">
            03 / 12
          </span>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <article className="group relative overflow-hidden rounded-[min(1vw,14px)] bg-white/60 ring-1 ring-ink/10 backdrop-blur-xl prism-edge transition-transform hover:-translate-y-1 md:col-span-2 md:row-span-2">
            <div className="spectrum h-1 w-full opacity-80" />
            <div className="p-7">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate">
                <span>01 / Fintech · 2024</span>
                <span className="rounded-full bg-amber/10 px-2.5 py-0.5 text-amber">
                  Flagship
                </span>
              </div>
              <h3 className="mt-6 max-w-[18ch] font-display text-2xl font-semibold leading-tight tracking-tight text-balance sm:text-3xl">
                Meridian — real-time fraud signals
              </h3>
              <p className="mt-3 max-w-[48ch] text-sm text-pretty sm:text-base sm:text-slate">
                Rebuilt the decisioning pipeline into an event-sourced, sub-50ms
                engine. Cut false positives 38% while tripling rule throughput.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px]">
                <span className="rounded-full bg-ink/5 px-2.5 py-1">Kafka</span>
                <span className="rounded-full bg-ink/5 px-2.5 py-1">Flink</span>
                <span className="rounded-full bg-ink/5 px-2.5 py-1">Rust</span>
              </div>
              <div className="mt-7 flex items-center gap-2 font-mono text-xs font-medium text-ink">
                <span>Read case study</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-[min(1vw,14px)] bg-white/60 ring-1 ring-ink/10 backdrop-blur-xl prism-edge transition-transform hover:-translate-y-1">
            <div className="spectrum h-1 w-full opacity-80" />
            <div className="p-7">
              <div className="font-mono text-[11px] text-slate">
                02 / Health · 2024
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold leading-tight tracking-tight text-balance">
                Northwind triage copilot
              </h3>
              <p className="mt-3 text-sm text-pretty sm:text-slate">
                RAG over 2M clinical records with retrieval the doctors actually
                trust.
              </p>
              <div className="mt-5 font-mono text-[11px] text-cyan">
                RAG · embeddings
              </div>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-[min(1vw,14px)] bg-white/60 ring-1 ring-ink/10 backdrop-blur-xl prism-edge transition-transform hover:-translate-y-1">
            <div className="spectrum h-1 w-full opacity-80" />
            <div className="p-7">
              <div className="font-mono text-[11px] text-slate">
                03 / Devtools · 2023
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold leading-tight tracking-tight text-balance">
                Relay — CI reliability
              </h3>
              <p className="mt-3 text-sm text-pretty sm:text-slate">
                Flaky-test radar that cut median pipeline time from 24 to 9
                minutes.
              </p>
              <div className="mt-5 font-mono text-[11px] text-violet">
                Go · analysis
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function Process() {
  return (
    <div className="lg:col-span-5">
      <div className="lg:sticky lg:top-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
          [03] — Process
        </span>
        <h2 className="mt-3 max-w-[16ch] font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
          A blueprint that becomes a running engine.
        </h2>
        <div className="mt-8 space-y-px overflow-hidden rounded-[min(1vw,14px)] ring-1 ring-ink/10">
          <div className="flex items-start gap-4 bg-white/60 p-5 ring-1 ring-ink/10">
            <span className="font-mono text-xs text-cyan">01</span>
            <div>
              <div className="text-sm font-semibold">Frame</div>
              <p className="mt-1 text-sm text-pretty sm:text-slate">
                Map constraints, stakeholders, and the metric that actually moves.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/60 p-5 ring-1 ring-ink/10">
            <span className="font-mono text-xs text-violet">02</span>
            <div>
              <div className="text-sm font-semibold">Architect</div>
              <p className="mt-1 text-sm text-pretty sm:text-slate">
                Design the system and the eval harness before a line ships.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-white/60 p-5 ring-1 ring-ink/10">
            <span className="font-mono text-xs text-amber">03</span>
            <div>
              <div className="text-sm font-semibold">Ship &amp; harden</div>
              <p className="mt-1 text-sm text-pretty sm:text-slate">
                Bring it to production with the on-call story already written.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideBusiness() {
  return (
    <div id="lab" className="lg:col-span-7">
      <div className="relative overflow-hidden rounded-[min(1vw,14px)] bg-ink p-8 text-white ring-1 ring-ink/10 prism-edge">
        <div className="spectrum absolute inset-x-8 top-0 h-px opacity-90" />
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/60">
          <span className="size-1.5 rounded-full bg-cyan" /> [04] — Side
          business
        </div>
        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl">
              Lumen<span className="text-cyan">.</span>kit
            </h3>
            <p className="mt-3 max-w-[40ch] text-sm text-pretty text-white/70">
              An open-source eval harness for LLM features. 1.4k stars, adopted
              by teams who want guardrails without the vendor lock-in.
            </p>
          </div>
          <div className="shrink-0 rounded-md bg-white/10 px-4 py-3 text-center ring-1 ring-white/15">
            <div className="font-display text-2xl font-semibold">1.4k</div>
            <div className="font-mono text-[11px] text-white/60">stars</div>
          </div>
        </div>
        <div className="mt-7 border-t border-white/10 pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-display text-xl font-semibold">120+</div>
              <div className="font-mono text-[11px] text-white/50">teams</div>
            </div>
            <div>
              <div className="font-display text-xl font-semibold">MIT</div>
              <div className="font-mono text-[11px] text-white/50">license</div>
            </div>
            <div>
              <div className="font-display text-xl font-semibold">v2.3</div>
              <div className="font-mono text-[11px] text-white/50">latest</div>
            </div>
          </div>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-cyan px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            Explore on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

function ProcessAndSideBusiness() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <Process />
        <SideBusiness />
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="rounded-[min(1vw,14px)] bg-white/60 p-8 ring-1 ring-ink/10 backdrop-blur-xl prism-edge sm:p-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">
          [05] — In their words
        </span>
        <blockquote className="mt-5 max-w-[34ch] font-display text-2xl font-medium leading-snug tracking-tight text-balance sm:text-3xl">
          "Élise is the rare person who can argue about a query plan at 2am and
          then explain the whole platform to our board in five minutes."
        </blockquote>
        <div className="mt-6 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-ink font-mono text-xs font-medium text-white">
            MR
          </div>
          <div>
            <div className="text-sm font-semibold">Marta Reyes</div>
            <div className="font-mono text-[11px] text-slate">CTO, Meridian</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-[min(1vw,16px)] bg-ink p-8 text-white ring-1 ring-ink/10 prism-edge sm:p-12">
        <div className="spectrum absolute inset-x-0 top-0 h-1 opacity-90" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              [06] — Contact
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">
              Let&apos;s build something that holds.
            </h2>
            <p className="mt-4 max-w-[40ch] text-sm text-pretty text-white/70 sm:text-base">
              One focused engagement at a time. Tell me the problem; I&apos;ll
              bring the architecture and the plan.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:hello@eliselaurient.com"
              className="rounded-md bg-white px-6 py-3.5 text-center text-sm font-semibold text-ink ring-1 ring-white/10 transition-transform hover:-translate-y-0.5"
            >
              hello@eliselaurient.com
            </a>
            <div className="flex gap-4 font-mono text-xs text-white/60">
              <span>GitHub</span>
              <span>·</span>
              <span>LinkedIn</span>
              <span>·</span>
              <span>Paris / CET</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-ground font-sans text-ink antialiased selection:bg-cyan/20">
      <Nav />
      <Hero />
      <Work />
      <ProcessAndSideBusiness />
      <Testimonial />
      <Contact />
    </main>
  );
}
