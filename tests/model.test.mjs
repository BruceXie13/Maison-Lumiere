import { test } from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
import fs from "node:fs";
const source = ts.transpileModule(
  fs.readFileSync("src/market/model.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { initialMarket, sampleMarket, restoreMarket, buy, relist, tick, safeImage } = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);
test("rehearsal resale pays current owner and creator; balances are conserved", () => {
  let m = initialMarket();
  m = buy(m, "1", "demo-1", "First");
  m = relist(m, "1", "demo-1", 80);
  m = buy(m, "1", "demo-2", "Resale");
  assert.equal(m.agents[0].balance, 1032);
  assert.equal(m.agents[1].balance, 1048);
  assert.equal(m.agents[2].balance, 920);
  assert.equal(
    m.agents.reduce((n, a) => n + a.balance, 0),
    6000,
  );
  assert.equal(m.art[0].price, 0);
  assert.equal(m.art[0].owner, "demo-2");
});
test("rehearsal rejects self-dealing, exhausted budgets, and invalid listing prices", () => {
  const m = initialMarket();
  assert.throws(() => buy(m, "1", "demo-0", "Self"));
  m.agents[1].cap = 5;
  assert.throws(() => buy(m, "1", "demo-1", "Over budget"));
  assert.throws(() => relist(m, "1", "demo-1", 10));
  assert.throws(() => relist(m, "1", "demo-0", -1));
  assert.throws(() => relist(m, "1", "demo-0", NaN));
});
test("long-running rehearsal conserves funds, records real state transitions, and honors spending caps", () => {
  let m = initialMarket();
  for (let i = 0; i < 500; i++) m = tick(m);
  assert.ok(m.activity.some((a) => a.kind === "buy"));
  assert.ok(m.activity.some((a) => a.kind === "list"));
  assert.ok(
    Math.abs(m.agents.reduce((s, a) => s + a.balance, 0) - 6000) < 0.00001,
  );
  assert.ok(m.agents.every((a) => a.spent <= a.cap && a.balance >= 0));
});
test("image sources reject script and insecure protocols", () => {
  assert.equal(safeImage("javascript:alert(1)"), "");
  assert.equal(safeImage("http://evil.test/a.png"), "");
  assert.equal(
    safeImage("https://example.com/a.png"),
    "https://example.com/a.png",
  );
});

test("sample collection has artwork assets and a consistent, labeled resale ledger", () => {
  const m = sampleMarket(1_800_000_000_000);
  assert.equal(m.art.length, 18);
  assert.equal(m.agents.length, 6);
  const purchases = m.activity.filter(e => e.kind === "buy");
  assert.equal(purchases.length, 8);
  assert.equal(purchases.filter(e => e.royalty > 0).length, 2);
  assert.ok(m.activity.every(e => e.sample && !e.hash && !e.block));
  assert.equal(new Set(m.activity.map(e => e.id)).size, m.activity.length);
  assert.equal(m.agents.reduce((n, a) => n + a.balance, 0), 6000);
  for (const a of m.agents) {
    assert.equal(a.spent, purchases.filter(e => e.agent === a.id).reduce((n,e) => n + e.price, 0));
    assert.ok(a.spent <= a.cap);
  }
  for (const art of m.art) {
    assert.ok(fs.existsSync(`backend/art/${art.image.split('/').pop()}`));
    const lastBuy = purchases.find(e => e.art === art.id);
    assert.equal(art.owner, lastBuy?.agent || art.creator);
  }
  const continued = tick(tick(m));
  assert.ok(continued.activity.some(e => !e.sample));
  assert.equal(continued.agents.reduce((n,a) => n + a.balance, 0), 6000);
});

test("restore upgrades empty and untouched demos while preserving user changes", () => {
  assert.equal(restoreMarket(null).art.length, 18);
  const empty = {version:1, art:[], agents:[], activity:[], step:0};
  assert.equal(restoreMarket(empty).activity.filter(e => e.kind === 'buy').length, 8);
  const old = initialMarket();
  old.art = old.art.slice(0,12);
  assert.equal(restoreMarket(old).art.length,18);
  const edited = initialMarket();
  edited.agents[0].cap = 125;
  assert.equal(restoreMarket(edited), edited);
  const traded = buy(initialMarket(), '1', 'demo-1', 'My first purchase');
  assert.equal(restoreMarket(traded), traded);
});
