import { createNearWalletClient } from "../src/near/createNearWalletClient";
import type { ToolConfig } from "./allTools.js";

import type { GetBalanceArgs } from "../interface/index.js";

/**
 * Get the balance of a wallet.
 *
 * This tool takes a single parameter, the wallet address to get the balance
 * from.
 */
export const getBalanceTool: ToolConfig<GetBalanceArgs> = {
  definition: {
    type: "function",
    function: {
      name: "get_balance",
      description: "Get the balance of a wallet",
      parameters: {
        type: "object",
        properties: {
          wallet: {
            type: "string",
            //pattern: "^0x[a-fA-F0-9]{40}$",
            description: "The wallet address to get the balance from",
          },
        },
        required: ["wallet"],
      },
    },
  },
  handler: async ({ wallet }) => {
    return await getBalance(wallet);
  },
};

async function getBalance(wallet: string) {
  const publicClient = await createNearWalletClient();
  const balance = await publicClient.getAccountBalance();
  return `Total: ${Number(balance.total) / 10**24}, Available: ${Number(balance.available) / 10**24}, Staked: ${Number(balance.staked) / 10**24}`;
}
