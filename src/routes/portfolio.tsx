import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { getPortfolio, sellOption, type Portfolio } from "@/lib/api";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Azuki Capital" },
      { name: "description", content: "Holdings, options, cash, P&L." },
      { property: "og:title", content: "Portfolio — Azuki Capital" },
      { property: "og:description", content: "Your positions, served by the C++ engine." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [p, setP] = useState<Portfolio | null>(null);

  const refresh = async () => {
    const r = await getPortfolio();
    setP(r.portfolio);
  };
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, []);

  if (!p) return <div className="min-h-screen bg-background"><SiteHeader /></div>;

  const pnlPositive = p.pnl >= 0;

  return (
    <div className="min-h-screen bg-background grain">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-azuki">Book</p>
        <h1 className="mt-2 font-display text-7xl leading-none">PORTFOLIO</h1>

        <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
          <Stat label="Cash" value={`$${p.cash.toLocaleString(undefined,{minimumFractionDigits:2})}`} />
          <Stat label="Total Value" value={`$${p.totalValue.toLocaleString(undefined,{minimumFractionDigits:2})}`} />
          <Stat
            label="P&L"
            value={`${pnlPositive ? "+" : ""}$${p.pnl.toLocaleString(undefined,{minimumFractionDigits:2})}`}
            accent={pnlPositive ? "text-success" : "text-azuki"}
          />
        </div>

        <h2 className="mt-16 font-display text-3xl">HOLDINGS</h2>
        <div className="mt-4 overflow-hidden border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4 text-right">Qty</th>
                <th className="px-6 py-4 text-right">Avg</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {p.holdings.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No positions yet.</td></tr>
              )}
              {p.holdings.map((h) => (
                <tr key={h.symbol} className="border-t border-border">
                  <td className="px-6 py-4 font-display text-xl">{h.symbol}</td>
                  <td className="px-6 py-4 text-right font-mono">{h.quantity}</td>
                  <td className="px-6 py-4 text-right font-mono">${h.avgPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono">${h.currentPrice.toFixed(2)}</td>
                  <td className={`px-6 py-4 text-right font-mono ${h.pnl >= 0 ? "text-success" : "text-azuki"}`}>
                    {h.pnl >= 0 ? "+" : ""}${h.pnl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-16 font-display text-3xl">OPTIONS</h2>
        <div className="mt-4 overflow-hidden border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Strike</th>
                <th className="px-6 py-4 text-right">Premium</th>
                <th className="px-6 py-4 text-right">Qty</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {p.options.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No options.</td></tr>
              )}
              {p.options.map((o, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-6 py-4 font-display text-xl">{o.symbol}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold ${o.type==="CALL"?"bg-success/15 text-success":"bg-azuki/15 text-azuki"}`}>{o.type}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono">${o.strike.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono">${o.premium.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono">{o.quantity}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={async () => { await sellOption(i); refresh(); }}
                      className="border border-ink px-3 py-1 text-xs uppercase tracking-widest hover:bg-ink hover:text-primary-foreground transition-colors">
                      Close
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-card px-6 py-8">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-5xl ${accent ?? ""}`}>{value}</div>
    </div>
  );
}