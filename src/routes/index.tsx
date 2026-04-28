import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Azuki Capital — C++ Powered Stock & Options Engine" },
      { name: "description", content: "Minimal, brutalist trading desk. C++ Crow backend, real OOP, real positions." },
      { property: "og:title", content: "Azuki Capital" },
      { property: "og:description", content: "Trade stocks and options on a C++ engine." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background grain">
      <SiteHeader />

      <section className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:py-32">
        <div className="md:col-span-8">
          <p className="mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-azuki animate-fade-up">
            <span className="h-px w-10 bg-azuki" /> Edition 01 · 2026
          </p>
          <h1 className="font-display text-[14vw] leading-[0.85] md:text-[10rem] animate-fade-up">
            PORT<span className="text-azuki">FOLIO</span><br/>MANAGER
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground animate-fade-up" style={{animationDelay:"0.1s"}}>
            A brutalist trading desk for stocks and options.
            All business logic — pricing, positions, P&L — runs on a C++ Crow backend.
            The browser only paints.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-fade-up" style={{animationDelay:"0.2s"}}>
            <Link to="/trading" className="bg-azuki px-7 py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground hover-lift">
              Start Trading →
            </Link>
            <Link to="/market" className="border border-ink px-7 py-4 text-sm font-semibold uppercase tracking-widest text-ink hover:bg-ink hover:text-primary-foreground transition-colors">
              View Market
            </Link>
          </div>
        </div>

        <aside className="hidden md:col-span-4 md:flex md:items-end md:justify-end">
          <div className="vertical-rl font-jp text-3xl text-ink animate-stamp">
            小豆 · 資 本
          </div>
        </aside>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border md:grid-cols-4">
          {[
            { k: "Engine", v: "C++ 17" },
            { k: "Framework", v: "Crow" },
            { k: "Paradigm", v: "OOP" },
            { k: "Latency", v: "< 5ms" },
          ].map((s) => (
            <div key={s.k} className="bg-card px-6 py-8">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.k}</div>
              <div className="mt-2 font-display text-4xl">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { n: "01", t: "Live Market", d: "Eight tickers, fluctuating ±1.5% per tick. Polled from the C++ engine." },
            { n: "02", t: "Stocks & Options", d: "Buy and sell shares, calls, and puts. Strike, premium, quantity — all routed server-side." },
            { n: "03", t: "Pure OOP", d: "Asset → Stock / Option. Virtual currentValue(). Encapsulated state. Viva-ready." },
          ].map((c, i) => (
            <div key={c.n} className="border-l-2 border-azuki pl-6 animate-fade-up" style={{animationDelay:`${i*0.1}s`}}>
              <div className="font-display text-azuki text-2xl">{c.n}</div>
              <h3 className="mt-2 font-display text-3xl">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
