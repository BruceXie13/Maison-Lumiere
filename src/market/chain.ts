import {
  BrowserProvider,
  Contract,
  ContractFactory,
  JsonRpcProvider,
  formatEther,
  parseEther,
  isAddress,
} from "ethers";
import type { Market, Agent, Art, Activity } from "./model";
import { colors, short } from "./model";
export interface Config {
  chainId: number;
  rpcUrl: string;
  explorer: string;
  contract: string;
  configured: boolean;
}
export const defaultConfig: Config = {
  chainId: 84532,
  rpcUrl: "https://sepolia.base.org",
  explorer: "https://sepolia.basescan.org",
  contract: "",
  configured: false,
};
export async function config(): Promise<Config> {
  const r = await fetch("/api/market/config");
  if (!r.ok) throw Error("Marketplace configuration could not be loaded.");
  return r.json();
}
async function artifact(name = "MaisonMarket") {
  const r = await fetch(`/contracts/${name}.json`);
  if (!r.ok)
    throw Error("Contract artifact unavailable. Rebuild the application.");
  return r.json();
}
export async function reader(c: Config) {
  if (!isAddress(c.contract))
    throw Error("The testnet marketplace has not been deployed yet.");
  const p = new JsonRpcProvider(c.rpcUrl, c.chainId, { staticNetwork: true });
  return new Contract(c.contract, (await artifact()).abi, p);
}
export async function wallet(c: Config) {
  const ethereum = (window as any).ethereum;
  if (!ethereum)
    throw Error(
      "Open this site in a browser with an Ethereum wallet, such as MetaMask or Coinbase Wallet.",
    );
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + c.chainId.toString(16) }],
    });
  } catch (e: any) {
    if (e.code !== 4902) throw e;
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x" + c.chainId.toString(16),
          chainName: "Base Sepolia",
          nativeCurrency: { name: "Test Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: [c.rpcUrl],
          blockExplorerUrls: [c.explorer],
        },
      ],
    });
  }
  const p = new BrowserProvider(ethereum);
  await p.send("eth_requestAccounts", []);
  const net = await p.getNetwork();
  if (Number(net.chainId) !== c.chainId)
    throw Error("Switch your wallet to the configured test network.");
  return p.getSigner();
}
export async function transact(
  c: Config,
  action: string,
  args: any[] = [],
  onPending?: (hash: string) => void,
) {
  const signer = await wallet(c),
    a = await artifact();
  if (action === "deploy") {
    const deployed = await new ContractFactory(
      a.abi,
      a.bytecode,
      signer,
    ).deploy();
    onPending?.(deployed.deploymentTransaction()!.hash);
    await deployed.waitForDeployment();
    return await deployed.getAddress();
  }
  const market = new Contract(c.contract, a.abi, signer);
  if (action === "faucet") {
    const token = new Contract(
      await market.currency(),
      (await artifact("LumiToken")).abi,
      signer,
    );
    const tx = await token.faucet();
    onPending?.(tx.hash);
    await tx.wait();
    return tx.hash;
  }
  if (action === "buy") {
    const token = new Contract(
        await market.currency(),
        (await artifact("LumiToken")).abi,
        signer,
      ),
      amount = parseEther(String(args[2]));
    if ((await token.balanceOf(await signer.getAddress())) < amount)
      throw Error("Not enough LUM. Claim test tokens in Connect agent.");
    if (
      (await token.allowance(await signer.getAddress(), c.contract)) < amount
    ) {
      const approval = await token.approve(c.contract, amount);
      onPending?.(approval.hash);
      await approval.wait();
    }
    args = [args[0], args[1], amount, args[3]];
  }
  if (action === "list") args = [args[0], parseEther(String(args[1]))];
  if (action === "mint")
    args = [...args.slice(0, 3), parseEther(String(args[3]))];
  const tx = await market[action](...args);
  onPending?.(tx.hash);
  await tx.wait();
  return tx.hash;
}
export async function snapshot(c: Config): Promise<Market> {
  const market = await reader(c);
  const [total, agentCount, saleCount, currency] = await Promise.all([
    market.nextId(),
    market.agentCount(),
    market.saleCount(),
    market.currency(),
  ]);
  const token = new Contract(
    currency,
    (await artifact("LumiToken")).abi,
    market.runner,
  );
  const art: Art[] = [];
  // Bounded UI snapshot; older lots remain addressable through the contract/SDK.
  const start = Math.max(0, Number(total) - 200);
  for (let offset = start; offset < Number(total); offset += 50) {
    const lots = await market.getLots(offset, 50);
    art.push(
      ...lots.map((l: any) => ({
        id: String(l.id),
        title: l.title,
        image: l.image,
        style: l.style,
        creator: l.creator.toLowerCase(),
        owner: l.owner.toLowerCase(),
        price: Number(formatEther(l.price)),
      })),
    );
  }
  const agents: Agent[] = [];
  for (
    let offset = 0;
    offset < Math.min(Number(agentCount), 100);
    offset += 10
  ) {
    const batch = await Promise.all(
      Array.from(
        { length: Math.min(10, Number(agentCount) - offset) },
        async (_, i) => {
          const id = await market.agentAddresses(offset + i),
            [p, b] = await Promise.all([
              market.profiles(id),
              token.balanceOf(id),
            ]);
          return {
            id: id.toLowerCase(),
            name: p.name || short(id),
            runtime: p.runtime,
            strategy: p.strategy,
            balance: Number(formatEther(b)),
            cap: 0,
            spent: 0,
            active: true,
            color: colors[(offset + i) % 6],
          };
        },
      ),
    );
    agents.push(...batch);
  }
  const sales = await market.getSales(Math.max(0, Number(saleCount) - 50), 50);
  const activity: Activity[] = sales
    .map((s: any, i: number) => ({
      id: `chain-${Number(saleCount) - sales.length + i}`,
      kind: "buy",
      agent: s.buyer.toLowerCase(),
      art: String(s.tokenId),
      seller: s.seller.toLowerCase(),
      price: Number(formatEther(s.price)),
      royalty: Number(formatEther(s.royalty)),
      text: s.reason,
      time: Number(s.timestamp) * 1000,
      block: Number(s.blockNumber),
    }))
    .reverse();
  return { version: 1, agents, art, activity, step: 0 };
}
