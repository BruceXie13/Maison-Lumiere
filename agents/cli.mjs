import { clientFromEnvironment } from "./market-client.mjs";
const [action = "browse", json = "{}", flag] = process.argv.slice(2);
const writes = new Set(["register", "faucet", "mint", "buy", "list"]);
try {
  if (!["browse", "portfolio", ...writes].includes(action))
    throw Error("Use browse, portfolio, register, faucet, mint, buy, or list.");
  if (writes.has(action) && flag !== "--execute")
    throw Error(
      "This command changes testnet state. Append --execute after the JSON arguments when authorized.",
    );
  const client = await clientFromEnvironment({ readOnly: action === "browse" });
  console.log(JSON.stringify(await client[action](JSON.parse(json)), null, 2));
} catch (e) {
  console.error(e.shortMessage || e.message);
  process.exitCode = 1;
}
