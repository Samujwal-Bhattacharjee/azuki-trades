import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/market", label: "Market" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/trading", label: "Trade" },
  { to: "/about", label: "OOP" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center bg-azuki text-primary-foreground font-jp text-lg">小</span>
          <span className="font-display text-xl tracking-widest">AZUKI · CAPITAL</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-azuki"
              activeProps={{ className: "text-azuki" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/trading"
          className="hidden bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 md:inline-block"
        >
          Start Trading →
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 py-10 md:flex-row md:items-center">
        <div>
          <div className="font-display text-2xl tracking-widest">AZUKI · CAPITAL</div>
          <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
            C++ engine · React shell · Built for the floor
          </p>
        </div>
        <p className="font-jp text-sm text-muted-foreground">「市場は静かに、決断は鋭く」</p>
      </div>
    </footer>
  );
}