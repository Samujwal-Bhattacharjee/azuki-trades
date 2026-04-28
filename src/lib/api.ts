// API client: tries C++ Crow backend at localhost:18080, falls back to in-browser mock.
// Set VITE_API_URL to override.

const BASE = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:18080";

export type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number; // percent
};

export type Holding = {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
};

export type OptionHolding = {
  symbol: string;
  type: "CALL" | "PUT";
  strike: number;
  premium: number;
  quantity: number;
  currentValue: number;
};

export type Portfolio = {
  cash: number;
  totalValue: number;
  pnl: number;
  holdings: Holding[];
  options: OptionHolding[];
};

// ---------- Mock state (used when C++ backend is not reachable) ----------
const seed: Stock[] = [
  { symbol: "AKZU", name: "Azuki Corp", price: 412.55, change: 0 },
  { symbol: "SHOG", name: "Shogun Industries", price: 188.2, change: 0 },
  { symbol: "KITS", name: "Kitsune Labs", price: 76.4, change: 0 },
  { symbol: "RONI", name: "Ronin Capital", price: 254.9, change: 0 },
  { symbol: "SAKU", name: "Sakura Energy", price: 33.1, change: 0 },
  { symbol: "TORI", name: "Torii Holdings", price: 612.0, change: 0 },
  { symbol: "KATA", name: "Katana Motors", price: 145.7, change: 0 },
  { symbol: "INKU", name: "Inku Media", price: 22.85, change: 0 },
];

let mockMarket: Stock[] = seed.map((s) => ({ ...s }));
let mockPortfolio: Portfolio = {
  cash: 100000,
  totalValue: 100000,
  pnl: 0,
  holdings: [],
  options: [],
};

function tickMock() {
  mockMarket = mockMarket.map((s) => {
    const pct = (Math.random() * 3 - 1.5) / 100; // -1.5% .. +1.5%
    const newPrice = Math.max(0.5, +(s.price * (1 + pct)).toFixed(2));
    return { ...s, price: newPrice, change: +(pct * 100).toFixed(2) };
  });
  // refresh holdings prices
  mockPortfolio.holdings = mockPortfolio.holdings.map((h) => {
    const m = mockMarket.find((s) => s.symbol === h.symbol);
    const cp = m ? m.price : h.currentPrice;
    return { ...h, currentPrice: cp, pnl: +((cp - h.avgPrice) * h.quantity).toFixed(2) };
  });
  const holdingsValue = mockPortfolio.holdings.reduce((a, h) => a + h.currentPrice * h.quantity, 0);
  const optionsValue = mockPortfolio.options.reduce((a, o) => a + o.currentValue * o.quantity, 0);
  mockPortfolio.totalValue = +(mockPortfolio.cash + holdingsValue + optionsValue).toFixed(2);
  mockPortfolio.pnl = +(mockPortfolio.totalValue - 100000).toFixed(2);
}

async function tryFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const r = await fetch(BASE + path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      signal: AbortSignal.timeout(1500),
    });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export async function getMarket(): Promise<{ stocks: Stock[]; source: "cpp" | "mock" }> {
  const r = await tryFetch<{ stocks: Stock[] }>("/market");
  if (r?.stocks) return { stocks: r.stocks, source: "cpp" };
  tickMock();
  return { stocks: mockMarket, source: "mock" };
}

export async function getPortfolio(): Promise<{ portfolio: Portfolio; source: "cpp" | "mock" }> {
  const r = await tryFetch<{ portfolio: Portfolio }>("/portfolio");
  if (r?.portfolio) return { portfolio: r.portfolio, source: "cpp" };
  tickMock();
  return { portfolio: mockPortfolio, source: "mock" };
}

export async function buyStock(symbol: string, qty: number) {
  const r = await tryFetch<{ ok: boolean; message?: string }>("/buyStock", {
    method: "POST",
    body: JSON.stringify({ symbol, quantity: qty }),
  });
  if (r) return r;
  // mock
  const stock = mockMarket.find((s) => s.symbol === symbol);
  if (!stock) return { ok: false, message: "Unknown symbol" };
  const cost = stock.price * qty;
  if (cost > mockPortfolio.cash) return { ok: false, message: "Insufficient cash" };
  mockPortfolio.cash = +(mockPortfolio.cash - cost).toFixed(2);
  const ex = mockPortfolio.holdings.find((h) => h.symbol === symbol);
  if (ex) {
    const totalQty = ex.quantity + qty;
    ex.avgPrice = +((ex.avgPrice * ex.quantity + stock.price * qty) / totalQty).toFixed(2);
    ex.quantity = totalQty;
    ex.currentPrice = stock.price;
  } else {
    mockPortfolio.holdings.push({
      symbol, quantity: qty, avgPrice: stock.price, currentPrice: stock.price, pnl: 0,
    });
  }
  return { ok: true, message: `Bought ${qty} ${symbol}` };
}

export async function sellStock(symbol: string, qty: number) {
  const r = await tryFetch<{ ok: boolean; message?: string }>("/sellStock", {
    method: "POST",
    body: JSON.stringify({ symbol, quantity: qty }),
  });
  if (r) return r;
  const h = mockPortfolio.holdings.find((x) => x.symbol === symbol);
  if (!h || h.quantity < qty) return { ok: false, message: "Not enough shares" };
  const stock = mockMarket.find((s) => s.symbol === symbol)!;
  mockPortfolio.cash = +(mockPortfolio.cash + stock.price * qty).toFixed(2);
  h.quantity -= qty;
  if (h.quantity === 0) {
    mockPortfolio.holdings = mockPortfolio.holdings.filter((x) => x.symbol !== symbol);
  }
  return { ok: true, message: `Sold ${qty} ${symbol}` };
}

export async function buyOption(
  symbol: string, type: "CALL" | "PUT", strike: number, premium: number, quantity: number
) {
  const r = await tryFetch<{ ok: boolean; message?: string }>("/buyOption", {
    method: "POST",
    body: JSON.stringify({ symbol, type, strike, premium, quantity }),
  });
  if (r) return r;
  const cost = premium * quantity * 100;
  if (cost > mockPortfolio.cash) return { ok: false, message: "Insufficient cash" };
  mockPortfolio.cash = +(mockPortfolio.cash - cost).toFixed(2);
  mockPortfolio.options.push({
    symbol, type, strike, premium, quantity, currentValue: premium * 100,
  });
  return { ok: true, message: `Bought ${quantity} ${symbol} ${type} @${strike}` };
}

export async function sellOption(index: number) {
  const r = await tryFetch<{ ok: boolean; message?: string }>("/sellOption", {
    method: "POST",
    body: JSON.stringify({ index }),
  });
  if (r) return r;
  const o = mockPortfolio.options[index];
  if (!o) return { ok: false, message: "Not found" };
  mockPortfolio.cash = +(mockPortfolio.cash + o.currentValue * o.quantity).toFixed(2);
  mockPortfolio.options.splice(index, 1);
  return { ok: true, message: "Option sold" };
}