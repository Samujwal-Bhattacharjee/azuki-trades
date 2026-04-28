import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { getMarket, type Stock } from "@/lib/api";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market — Azuki Capital" },
      { name: "description", content: "Live tickers from the C++ engine." },
      { property: "og:title", content: "Market — Azuki Capital" },
      { property: "og:description", content: "Live tickers, fluctuating in real time." },
    ],
  }),
  component: MarketPage,
});

function MarketPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [source, setSource] = useState<"cpp" | "mock">("mock");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"symbol" | "price" | "change">("symbol");

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      const r = await getMarket();
      if (!alive) return;
      setStocks(r.stocks);
      setSource(r.source);
    };
    tick();
    const id = setInterval(tick, 2500);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const filtered = stocks
    .filter((s) => s.symbol.toLowerCase().includes(query.toLowerCase()) || s.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "symbol") return a.symbol.localeCompare(b.symbol);
      if (sortBy === "price") return b.price - a.price;
      return b.change - a.change;
    });

  return (
    <div className="min-h-screen bg-background grain">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-azuki">Live Tape</p>
            <h1 className="mt-2 font-display text-7xl leading-none">MARKET</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${source === "cpp" ? "bg-success" : "bg-azuki"} animate-pulse`} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {source === "cpp" ? "C++ Engine · Live" : "Mock · Start C++ backend"}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol or name…"
            className="flex-1 min-w-[220px] border border-border bg-card px-4 py-3 text-sm outline-none focus:border-azuki"
          />
          {(["symbol","price","change"] as const).map((k) => (
            <button key={k} onClick={() => setSortBy(k)}
              className={`px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors ${sortBy===k?"bg-ink text-primary-foreground":"border border-border bg-card hover:border-ink"}`}>
              Sort · {k}
            </button>
          ))}
        </div>

        <div className="mt-8 overflow-hidden border border-border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary text-left text-xs uppercase tracking-widest text-muted-foreground">
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Δ %</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.symbol} className="border-b border-border last:border-0 transition-colors hover:bg-secondary">
                  <td className="px-6 py-5 font-display text-2xl">{s.symbol}</td>
                  <td className="px-6 py-5 text-sm text-muted-foreground">{s.name}</td>
                  <td className="px-6 py-5 text-right font-mono text-lg">${s.price.toFixed(2)}</td>
                  <td className={`px-6 py-5 text-right font-mono text-lg ${s.change >= 0 ? "text-success" : "text-azuki"}`}>
                    {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.change).toFixed(2)}%
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-muted-foreground">No tickers match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}