export interface Agent {
  id: string;
  name: string;
  runtime: string;
  strategy: string;
  balance: number;
  cap: number;
  spent: number;
  active: boolean;
  color: string;
}
export interface Art {
  id: string;
  title: string;
  image: string;
  style: string;
  creator: string;
  owner: string;
  price: number;
}
export interface Activity {
  id: string;
  kind: "observe" | "buy" | "list" | "mint" | "pause";
  agent: string;
  art: string;
  text: string;
  time: number;
  price?: number;
  seller?: string;
  royalty?: number;
  block?: number;
  hash?: string;
}
export interface Market {
  version: 1;
  agents: Agent[];
  art: Art[];
  activity: Activity[];
  step: number;
}
export const colors = [
  "#798a66",
  "#b4774d",
  "#6b83a3",
  "#a77d9e",
  "#9a925e",
  "#8c7471",
];
export const catalog = [
  ["Chromatic silence", "art_01_crimson_fractures.png", "Abstract"],
  ["A softer geometry", "art_02_crystal_void.png", "Geometric"],
  ["The shape of warmth", "art_03_solar_burst.png", "Abstract"],
  ["After the light", "art_04_bioluminescent.png", "Organic"],
  ["Studies in blue", "art_05_blue_horizon.png", "Minimal"],
  ["A distant memory", "art_06_deep_field.png", "Generative"],
  ["The quiet between", "art_07_ink_branches.png", "Minimal"],
  ["An imperfect garden", "art_08_glitch_garden.png", "Generative"],
  ["Earth, remembered", "art_09_terracotta.png", "Organic"],
  ["Echoes of tomorrow", "art_10_echo_chamber.png", "Geometric"],
  ["A slow departure", "art_11_drift.png", "Abstract"],
  ["Order of things", "art_12_grid.png", "Geometric"],
];
export function initialMarket(): Market {
  const names = ["Atelier", "Curio", "Forma", "Sable", "Echo", "Lumen"];
  return {
    version: 1,
    step: 0,
    agents: names.map((name, i) => ({
      id: `demo-${i}`,
      name,
      runtime: "Demo policy",
      strategy: [
        "Creates expressive abstract works.",
        "Collects abstract art within its session budget.",
        "Seeks geometric work within its session budget.",
        "Collects quiet, minimal compositions.",
        "Looks for generative experiments.",
        "Explores organic forms and texture.",
      ][i],
      balance: 1000,
      cap: 300,
      spent: 0,
      active: true,
      color: colors[i],
    })),
    art: catalog.map(([title, image, style], i) => ({
      id: String(i + 1),
      title,
      image: `/api/art/${image}`,
      style,
      creator: `demo-${i % 6}`,
      owner: `demo-${i % 6}`,
      price: 30 + i * 5,
    })),
    activity: [],
  };
}
export function buy(
  m: Market,
  id: string,
  buyerId: string,
  reason: string,
): Market {
  const next = structuredClone(m),
    art = next.art.find((a) => a.id === id),
    buyer = next.agents.find((a) => a.id === buyerId);
  if (!art || !buyer) throw Error("Artwork or agent is unavailable.");
  if (art.owner === buyerId)
    throw Error("This agent already owns the artwork.");
  if (art.price <= 0) throw Error("The artwork is not listed.");
  if (art.price > buyer.balance) throw Error("The agent has insufficient LUM.");
  if (buyer.spent + art.price > buyer.cap)
    throw Error("This trade exceeds the agent’s session spending limit.");
  const seller = next.agents.find((a) => a.id === art.owner)!,
    creator = next.agents.find((a) => a.id === art.creator)!;
  const price = art.price,
    royalty = seller.id === creator.id ? 0 : Math.round(price * 2.5) / 100;
  buyer.balance -= price;
  buyer.spent += price;
  seller.balance += price - royalty;
  creator.balance += royalty;
  next.activity.unshift({
    id: crypto.randomUUID(),
    kind: "buy",
    agent: buyerId,
    art: id,
    text: reason,
    time: Date.now(),
    price,
    seller: seller.id,
    royalty,
  });
  art.owner = buyerId;
  art.price = 0;
  return next;
}
export function relist(
  m: Market,
  id: string,
  owner: string,
  price: number,
): Market {
  if (!Number.isFinite(price) || price < 0 || price > 100000)
    throw Error("Choose a price between 0 and 100,000 LUM.");
  const next = structuredClone(m),
    art = next.art.find((a) => a.id === id);
  if (!art || art.owner !== owner)
    throw Error("Only the current owner can list this artwork.");
  art.price = price;
  next.activity.unshift({
    id: crypto.randomUUID(),
    kind: "list",
    agent: owner,
    art: id,
    text: price
      ? `Listed for ${price} LUM. A new collector can now acquire this work.`
      : "Removed the listing. The artwork stays in the collection.",
    time: Date.now(),
    price,
  });
  return next;
}
export function tick(m: Market): Market {
  const next = structuredClone(m);
  next.step++;
  const active = next.agents.filter((a) => a.active && a.spent < a.cap);
  if (!active.length) return next;
  const agent = active[Math.floor((next.step - 1) / 3) % active.length];
  const owned = next.art.find((a) => a.owner === agent.id && !a.price);
  if (next.step % 3 === 0 && owned)
    return {
      ...relist(next, owned.id, agent.id, 45 + (next.step % 8) * 5),
      step: next.step,
    };
  const preferences: Record<string, string> = {
    "demo-0": "Abstract",
    "demo-1": "Abstract",
    "demo-2": "Geometric",
    "demo-3": "Minimal",
    "demo-4": "Generative",
    "demo-5": "Organic",
  };
  const art = next.art
    .filter(
      (a) =>
        a.owner !== agent.id &&
        a.price > 0 &&
        a.price <= agent.balance &&
        a.price <= agent.cap - agent.spent,
    )
    .sort(
      (a, b) =>
        Number(b.style === preferences[agent.id]) -
          Number(a.style === preferences[agent.id]) || a.price - b.price,
    )[0];
  if (!art) {
    agent.active = false;
    next.activity.unshift({
      id: crypto.randomUUID(),
      kind: "pause",
      agent: agent.id,
      art: "",
      text: "Paused: no available listing fits the remaining budget. Adjust the budget or listings, then resume this agent.",
      time: Date.now(),
    });
    return next;
  }
  const reason = `${art.style} work fits my collection. ${art.price} LUM is within my ${Math.round(agent.cap - agent.spent)} LUM remaining budget.`;
  if (next.step % 3 === 2)
    return { ...buy(next, art.id, agent.id, reason), step: next.step };
  next.activity.unshift({
    id: crypto.randomUUID(),
    kind: "observe",
    agent: agent.id,
    art: art.id,
    text: `Considering “${art.title}”. ${reason}`,
    time: Date.now(),
  });
  return next;
}
export function safeImage(url: string) {
  return url.startsWith("/api/art/") || /^https:\/\//i.test(url) ? url : "";
}
export function short(address: string) {
  return address.length > 16
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : address;
}
