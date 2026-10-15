import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ganache from "ganache";
import { BrowserProvider, ContractFactory, Contract, parseEther } from "ethers";
import { createMarketClient } from "../agents/market-client.mjs";
const marketArtifact = JSON.parse(
  fs.readFileSync("public/contracts/MaisonMarket.json"),
);
const tokenArtifact = JSON.parse(
  fs.readFileSync("public/contracts/LumiToken.json"),
);
test("wallet-authorized mint → purchase → resale, policy enforcement, metadata, and transfer invariants", async (t) => {
  fs.mkdirSync(".test-results", { recursive: true });
  const dbPath = fs.mkdtempSync(".test-results/chain-");
  const rpc = ganache.provider({
    database: { dbPath },
    logging: { quiet: true },
    chain: { chainId: 31337, hardfork: "shanghai" },
    wallet: { totalAccounts: 4 },
  });
  const p = new BrowserProvider(rpc);
  p.pollingInterval = 20;
  try {
    const [artist, collector, next, stranger] = await Promise.all(
      [0, 1, 2, 3].map((i) => p.getSigner(i)),
    );
    const [a, b, c, d] = await Promise.all(
      [artist, collector, next, stranger].map((s) => s.getAddress()),
    );
    const market = await new ContractFactory(
      marketArtifact.abi,
      marketArtifact.bytecode,
      artist,
    ).deploy();
    await market.waitForDeployment();
    const address = await market.getAddress(),
      currency = new Contract(
        await market.currency(),
        tokenArtifact.abi,
        artist,
      );
    for (const [s, name] of [
      [artist, "Atelier"],
      [collector, "Curio"],
      [next, "Forma"],
    ]) {
      await (
        await market
          .connect(s)
          .registerAgent(name, "Test adapter", "Collect within budget")
      ).wait();
      await (await currency.connect(s).faucet()).wait();
    }
    await t.test("faucet cannot be repeatedly claimed", async () => {
      assert.equal(await currency.claimed(a), true);
      await assert.rejects(currency.faucet.staticCall(), /Already claimed/);
      // Verify the mined result even if gas estimation reused the first claim.
      await assert.rejects(async () => {
        await (await currency.faucet({ gasLimit: 100_000 })).wait();
      }, { code: "CALL_EXCEPTION" });
      assert.equal(await currency.balanceOf(a), parseEther("1000"));
    });
    await (
      await market.mint(
        'A "quoted" work',
        "https://example.com/art.png",
        "Abstract",
        parseEther("40"),
      )
    ).wait();

    const uri = await market.tokenURI(0);
    assert.equal(
      JSON.parse(Buffer.from(uri.split(",")[1], "base64")).name,
      'A "quoted" work',
    );
    const client = await createMarketClient({
      rpcUrl: "http://127.0.0.1:8545",
      contract: address,
      signer: collector,
      maxTradeLUM: 100,
      maxSessionLUM: 60,
    });
    const listing = (await client.browse())[0];
    assert.equal(listing.priceLUM, "40.0");
    await t.test("rejects impersonation and stale listing terms", async () => {
      await assert.rejects(async () => {
        await (await market.connect(stranger).list(0, parseEther("1"))).wait();
      });
      await assert.rejects(
        client.buy({
          id: "0",
          expectedSeller: d,
          priceLUM: "40",
          reason: "Stale seller",
        }),
      );
      await assert.rejects(
        client.buy({
          id: "0",
          expectedSeller: a,
          priceLUM: "41",
          reason: "Stale price",
        }),
      );
    });
    await client.buy({
      id: "0",
      expectedSeller: a,
      priceLUM: "40",
      reason: "Fits my abstract collection.",
    });
    assert.equal(await market.ownerOf(0), b);
    assert.equal(await market.prices(0), 0n);
    assert.equal(await currency.balanceOf(a), parseEther("1040"));
    assert.equal(await currency.balanceOf(b), parseEther("960"));
    await client.list({ id: "0", priceLUM: "80" });
    await (
      await currency.connect(next).approve(address, parseEther("80"))
    ).wait();
    await (
      await market
        .connect(next)
        .buy(0, b, parseEther("80"), "Resale acquisition")
    ).wait();
    await t.test(
      "resale pays current seller and 2.5% creator royalty",
      async () => {
        assert.equal(await market.ownerOf(0), c);
        assert.equal(await currency.balanceOf(b), parseEther("1038"));
        assert.equal(await currency.balanceOf(a), parseEther("1042"));
        assert.equal(await currency.balanceOf(c), parseEther("920"));
        assert.equal(await market.saleCount(), 2n);
      },
    );
    await (
      await market.mint(
        "Second work",
        "https://example.com/2.png",
        "Minimal",
        parseEther("25"),
      )
    ).wait();
    await t.test(
      "agent adapter enforces cumulative session budget",
      async () => {
        await assert.rejects(
          client.buy({
            id: "1",
            expectedSeller: a,
            priceLUM: "25",
            reason: "Exceeds remaining 20 LUM",
          }),
          /spending policy/,
        );
        assert.equal(await market.ownerOf(1), a);
      },
    );
    await t.test("failed payment does not transfer the NFT", async () => {
      await assert.rejects(async () => {
        await (
          await market.connect(next).buy(1, a, parseEther("25"), "No allowance")
        ).wait();
      });
      assert.equal(await market.ownerOf(1), a);
    });
    await t.test("external transfer clears a listing", async () => {
      await (await market.transferFrom(a, d, 1)).wait();
      assert.equal(await market.prices(1), 0n);
    });
    await t.test(
      "concurrent duplicate purchases settle only once",
      async () => {
        await (
          await market.mint(
            "Third work",
            "https://example.com/3.png",
            "Minimal",
            parseEther("10"),
          )
        ).wait();
        const results = await Promise.allSettled(
          [1, 2].map(() =>
            client.buy({
              id: "2",
              expectedSeller: a,
              priceLUM: "10",
              reason: "One unique edition",
            }),
          ),
        );
        assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
        assert.equal(await market.ownerOf(2), b);
      },
    );
    await t.test(
      "unauthorized tool names cannot invoke client internals",
      async () => {
        await assert.rejects(client.executeTool("constructor", {}), /Unknown/);
      },
    );
    const records = await market.getSales(0, 50);
    assert.equal(records[1].royalty, parseEther("2"));
  } finally {
    await rpc.disconnect();
  }
});
