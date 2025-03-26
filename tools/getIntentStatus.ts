import { fetchIntentStatus } from "../src/zec/intent";
import type { ToolConfig } from "./allTools.js";

import type { GetIntentStatusArgs } from "../interface/index.js";


export const getIntentStatusTool: ToolConfig<GetIntentStatusArgs> = {
  definition: {
    type: "function",
    function: {
      name: "fetch_intent",
      description: "Fetch the status of an intent (created by exchanging between 2 tokens) ",
      parameters: {
        type: "object",
        properties: {
          intentHash: {
            type: "string",
            //pattern: "^0x[a-fA-F0-9]{40}$",
            description: "The hash of the intent to get the info",
          },
        },
        required: ["intentHash"],
      },
    },
  },
  handler: async ({ intentHash }) => {
    return await getStatus(intentHash);
  },
};

async function getStatus(intentHash: string) {
  const status = await fetchIntentStatus(intentHash);
  return status;
}
