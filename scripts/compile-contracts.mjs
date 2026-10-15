import fs from "node:fs";
import path from "node:path";
import solc from "solc";
const input = {
  language: "Solidity",
  sources: {
    "MaisonMarket.sol": {
      content: fs.readFileSync("contracts/MaisonMarket.sol", "utf8"),
    },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    evmVersion: "shanghai",
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};
const output = JSON.parse(
  solc.compile(JSON.stringify(input), {
    import: (name) => ({
      contents: fs.readFileSync(path.join("node_modules", name), "utf8"),
    }),
  }),
);
for (const e of output.errors || []) {
  if (e.severity === "error") throw new Error(e.formattedMessage);
}
fs.mkdirSync("public/contracts", { recursive: true });
for (const name of ["MaisonMarket", "LumiToken"]) {
  const c = output.contracts["MaisonMarket.sol"][name];
  fs.writeFileSync(
    `public/contracts/${name}.json`,
    JSON.stringify(
      {
        contractName: name,
        compiler: solc.version(),
        abi: c.abi,
        bytecode: "0x" + c.evm.bytecode.object,
      },
      null,
      2,
    ),
  );
}
console.log("Compiled testnet marketplace and LUM currency.");
