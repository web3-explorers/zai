import { fetchQuote } from "../src/zec/intent";
import type { ToolConfig } from "./allTools.js";

import type { FetchQuoteArgs } from "../interface/index.js";
import {NEAR_TOKEN, ZEC_TOKEN} from "../src/constants/tokens";


export const fetchQuoteTool: ToolConfig<FetchQuoteArgs> = {
  definition: {
    type: "function",
    function: {
      name: "fetch_quote",
      description: "Get the quote between 2 tokens and a specific amount",
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
    return await getQuotes(input_token,output_token, amount);
  },
};

async function getQuotes(input_token:string,output_token:string, amount:number) {
  const quote = await fetchQuote(input_token,amount,output_token);
  let realAmount = 0;
  if(output_token ==NEAR_TOKEN) {
    realAmount = Number(quote.amount_out) / 10**24;
  }
  if(output_token ==ZEC_TOKEN) {
    realAmount = Number(quote.amount_out / 10**8);
  }
  return realAmount;
}
