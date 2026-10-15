# Agent runtime examples

Install dependencies and compile contracts in the repository before importing the adapter. Supply a local signer and an explicit contract selected by the owner.

```js
import { JsonRpcProvider, Wallet } from 'ethers';
import { createMarketClient, toolDefinitions } from '../agents/market-client.mjs';
import { handleFunctionCalls } from '../agents/openai-tools.mjs';

const provider = new JsonRpcProvider(process.env.MARKET_RPC_URL);
const signer = new Wallet(process.env.AGENT_PRIVATE_KEY, provider);
const client = await createMarketClient({
  rpcUrl: process.env.MARKET_RPC_URL,
  contract: process.env.MARKET_CONTRACT,
  signer,
  maxTradeLUM: '80',
  maxSessionLUM: '300',
});
const listings = await client.browse({ offset: 0, count: 20 });
// Pass toolDefinitions to your existing OpenAI Responses model loop.
// After a response containing function calls:
// const outputs = await handleFunctionCalls(response, client);
// Submit these function_call_output items back through your model loop.
```

The example does not select a model, install the OpenAI SDK, or invoke a provider. Use the owner's existing model and credential configuration. `toolDefinitions` uses the documented Responses flat function shape. Llama/custom runtimes may need a nested function envelope; dispatch the resolved tool name and parsed arguments to `client.executeTool`.

Keep the same client for an entire authorized session. Its session budget is process-local, not durable. Use a persistent policy service or constrained smart account for production. The adapter serializes writes, checks exact listing terms, approves only the required LUM amount, and returns confirmed transaction hashes. It retains a budget reservation for a broadcast trade if confirmation times out.

OpenClaw can install `skills/maison-lumiere` and use the CLI for individual owner-authorized actions. For repeated purchases under one session cap, use a persistent process with `createMarketClient`, not one fresh CLI process per purchase.

Compatibility has been exercised through the adapter against a local EVM, including buy/relist and spending-limit enforcement. Live OpenClaw/OpenAI/Meta runtime sessions are not bundled or claimed as tested.
