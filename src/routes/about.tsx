import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "OOP — Azuki Capital" },
      { name: "description", content: "How the C++ backend uses abstraction, inheritance, polymorphism, encapsulation." },
      { property: "og:title", content: "OOP — Azuki Capital" },
      { property: "og:description", content: "Viva-ready breakdown of the C++ engine." },
    ],
  }),
  component: AboutPage,
});

const pillars = [
  {
    n: "01",
    title: "Abstraction",
    desc: "Asset is a pure abstract class. It declares what every tradable thing must do, hiding how.",
    code: `class Asset {
public:
    virtual ~Asset() = default;
    // Returns market value of one unit of this asset.
    virtual double currentValue() const = 0;
    virtual void   printDetails() const = 0;
    virtual std::string symbol()  const = 0;
};`,
  },
  {
    n: "02",
    title: "Inheritance",
    desc: "Stock and Option both extend Asset. They reuse the contract and add their own state.",
    code: `class Stock : public Asset {
    std::string sym_;
    double price_;
public:
    Stock(std::string s, double p) : sym_(std::move(s)), price_(p) {}
    double currentValue() const override { return price_; }
    void   printDetails() const override;
    std::string symbol()  const override { return sym_; }
    void setPrice(double p) { price_ = p; }
};

class Option : public Asset {
    std::string sym_;
    bool   isCall_;
    double strike_, premium_;
public:
    double currentValue() const override; // intrinsic + premium
    /* ... */
};`,
  },
  {
    n: "03",
    title: "Polymorphism",
    desc: "The portfolio holds Asset pointers. The right currentValue() is dispatched at runtime.",
    code: `std::vector<std::shared_ptr<Asset>> book;
book.push_back(std::make_shared<Stock>("AKZU", 412.55));
book.push_back(std::make_shared<Option>("AKZU", true, 400, 18.20));

double total = 0;
for (const auto& a : book) {
    total += a->currentValue(); // virtual dispatch
    a->printDetails();
}`,
  },
  {
    n: "04",
    title: "Encapsulation",
    desc: "Cash, holdings, and positions are private. Mutation only through validated methods.",
    code: `class Portfolio {
    double cash_;
    std::vector<Holding> holdings_;
public:
    bool buyStock(const std::string& s, int qty, double price) {
        double cost = qty * price;
        if (cost > cash_) return false;   // validation
        cash_ -= cost;
        // ... merge holding
        return true;
    }
    double cash() const { return cash_; } // getter only
};`,
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background grain">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-azuki">Architecture</p>
        <h1 className="mt-2 font-display text-7xl leading-none">OOP IN C++</h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          The backend is written in modern C++ on top of the Crow micro-framework.
          Every endpoint you hit from the UI runs through these four pillars.
        </p>

        <div className="mt-16 space-y-16">
          {pillars.map((p, i) => (
            <article key={p.n} className="grid gap-8 border-t border-border pt-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="font-display text-azuki text-3xl">{p.n}</div>
                <h2 className="mt-2 font-display text-5xl">{p.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
              <pre className="md:col-span-8 overflow-x-auto border border-ink bg-ink p-6 text-xs leading-relaxed text-primary-foreground animate-fade-up" style={{animationDelay:`${i*0.05}s`}}>
                <code>{p.code}</code>
              </pre>
            </article>
          ))}
        </div>

        <div className="mt-24 border border-ink bg-card p-8">
          <h3 className="font-display text-3xl">REST endpoints (C++ Crow)</h3>
          <ul className="mt-6 grid gap-3 font-mono text-sm md:grid-cols-2">
            {[
              "GET  /market",
              "GET  /portfolio",
              "POST /buyStock",
              "POST /sellStock",
              "POST /buyOption",
              "POST /sellOption",
            ].map((e) => (
              <li key={e} className="border-l-2 border-azuki pl-4">{e}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            The C++ source lives in <code className="bg-secondary px-1">/backend</code> — see the project download.
            Run it with <code className="bg-secondary px-1">g++ -std=c++17 main.cpp -lpthread -o server</code> then
            <code className="bg-secondary px-1"> ./server</code>. The UI auto-detects it on <code className="bg-secondary px-1">localhost:18080</code>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}