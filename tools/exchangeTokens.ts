import { publishIntent } from "../src/zec/intent";
import type { ToolConfig } from "./allTools.js";

import type { FetchQuoteArgs } from "../interface/index.js";


export const exchangeTokensTool: ToolConfig<FetchQuoteArgs> = {
  definition: {
    type: "function",
    function: {
      name: "exchange_tokens",
      description: "Exchange between 2 tokens and a specific amount",
      parameters: {
        type: "object",
        properties: {
            input_token: {
                type: "string",
                //pattern: "^0x[a-fA-F0-9]{40}$",
                description: "The input token for the quote",
            },
            output_token: {
                type: "string",
                //pattern: "^0x[a-fA-F0-9]{40}$",
                description: "The output token for the quote",
            },
            amount: {
                type: "string",
                //pattern: "^0x[a-fA-F0-9]{40}$",
                description: "The amount to get the quote for exchanging",
            },
        },
        required: ["input_token","output_token","amount"],
      },
    },
  },
  handler: async ({ input_token,output_token, amount  }) => {
    return await execute(input_token,output_token, amount);
  },
};

async function execute(input_token:string,output_token:string, amount:number) {
  const quote = await publishIntent(input_token,amount,output_token);
  return quote;
}
