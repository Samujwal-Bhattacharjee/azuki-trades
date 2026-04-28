import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { buyOption, buyStock, getMarket, sellStock, type Stock } from "@/lib/api";

export const Route = createFileRoute("/trading")({
  head: () => ({
    meta: [
      { title: "Trade — Azuki Capital" },
      { name: "description", content: "Buy and sell stocks and options on the C++ engine." },
      { property: "og:title", content: "Trade — Azuki Capital" },
      { property: "og:description", content: "Place orders. Routed to the C++ engine." },
    ],
  }),
  component: TradePage,
});

type Toast = { kind: "ok" | "err"; msg: string } | null;

function TradePage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [tab, setTab] = useState<"stock" | "option">("stock");
  const [symbol, setSymbol] = useState("AKZU");
  const [qty, setQty] = useState(10);
  const [type, setType] = useState<"CALL" | "PUT">("CALL");
  const [strike, setStrike] = useState(400);
  const [premium, setPremium] = useState(5);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    getMarket().then((r) => setStocks(r.stocks));
    const id = setInterval(() => getMarket().then((r) => setStocks(r.stocks)), 3000);
    return () => clearInterval(id);
  }, []);

  const cur = stocks.find((s) => s.symbol === symbol);

  const flash = (t: Toast) => { setToast(t); setTimeout(() => setToast(null), 2500); };

  const submit = async (action: "buy" | "sell") => {
    if (tab === "stock") {
      const r = action === "buy" ? await buyStock(symbol, qty) : await sellStock(symbol, qty);
      flash({ kind: r.ok ? "ok" : "err", msg: r.message ?? (r.ok ? "Done" : "Failed") });
    } else {
      const r = await buyOption(symbol, type, strike, premium, qty);
      flash({ kind: r.ok ? "ok" : "err", msg: r.message ?? (r.ok ? "Done" : "Failed") });
    }
  };

  return (
    <div className="min-h-screen bg-background grain">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-xs uppercase tracking-[0.3em] text-azuki">Order Ticket</p>
          <h1 className="mt-2 font-display text-7xl leading-none">TRADE</h1>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            All orders are validated and executed by the C++ engine. The browser only sends JSON.
          </p>

          <div className="mt-10 vertical-rl hidden font-jp text-2xl text-ink md:block">注文 · 執 行</div>
        </div>

        <div className="md:col-span-7">
          <div className="border border-ink bg-card">
            <div className="grid grid-cols-2 border-b border-ink">
              {(["stock","option"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest ${tab===t?"bg-ink text-primary-foreground":"hover:bg-secondary"}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-5 p-6">
              <Field label="Symbol">
                <select value={symbol} onChange={(e) => setSymbol(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 outline-none focus:border-azuki">
                  {stocks.map((s) => (
                    <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.name}</option>
                  ))}
                </select>
              </Field>

              {cur && (
                <div className="flex items-baseline justify-between border border-dashed border-border px-4 py-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Last</span>
                  <span className="font-mono text-2xl">${cur.price.toFixed(2)}</span>
                  <span className={`font-mono text-sm ${cur.change>=0?"text-success":"text-azuki"}`}>
                    {cur.change>=0?"▲":"▼"} {Math.abs(cur.change).toFixed(2)}%
                  </span>
                </div>
              )}

              <Field label="Quantity">
                <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))}
                  className="w-full border border-border bg-background px-4 py-3 font-mono outline-none focus:border-azuki" />
              </Field>

              {tab === "option" && (
                <>
                  <Field label="Type">
                    <div className="grid grid-cols-2 border border-border">
                      {(["CALL","PUT"] as const).map((t) => (
                        <button key={t} onClick={() => setType(t)}
                          className={`py-3 text-sm font-semibold uppercase tracking-widest ${type===t?"bg-azuki text-primary-foreground":"bg-background hover:bg-secondary"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Strike">
                    <input type="number" value={strike} onChange={(e) => setStrike(+e.target.value)}
                      className="w-full border border-border bg-background px-4 py-3 font-mono outline-none focus:border-azuki" />
                  </Field>
                  <Field label="Premium">
                    <input type="number" step="0.01" value={premium} onChange={(e) => setPremium(+e.target.value)}
                      className="w-full border border-border bg-background px-4 py-3 font-mono outline-none focus:border-azuki" />
                  </Field>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => submit("buy")}
                  className="flex-1 bg-azuki py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground hover-lift">
                  {tab === "stock" ? "Buy" : "Buy Contract"}
                </button>
                {tab === "stock" && (
                  <button onClick={() => submit("sell")}
                    className="flex-1 border border-ink py-4 text-sm font-semibold uppercase tracking-widest hover:bg-ink hover:text-primary-foreground transition-colors">
                    Sell
                  </button>
                )}
              </div>
            </div>
          </div>

          {toast && (
            <div className={`mt-4 border px-4 py-3 text-sm animate-fade-up ${toast.kind==="ok"?"border-success text-success":"border-azuki text-azuki"}`}>
              {toast.msg}
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}