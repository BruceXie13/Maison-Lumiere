// Pass toolDefinitions to an OpenAI Responses request, or translate the same JSON
// schemas for your Llama/custom runtime. Your application executes tool calls.
// No model credential or private wallet key is ever sent to the marketplace server.
export {
  toolDefinitions,
  createMarketClient,
  clientFromEnvironment,
} from "./market-client.mjs";

export async function handleFunctionCalls(response, client) {
  const outputs = [];
  for (const call of response.output || []) {
    if (call.type !== "function_call") continue;
    try {
      const result = await client.executeTool(
        call.name,
        JSON.parse(call.arguments),
      );
      outputs.push({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
      });
    } catch (e) {
      outputs.push({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify({ error: e.shortMessage || e.message }),
      });
    }
  }
  return outputs;
}
