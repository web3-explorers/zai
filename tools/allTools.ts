import { getBalanceTool } from "./getBalance";
import { getWalletAddressTool } from "./getWalletAddress";
import { fetchQuoteTool } from "./getQuote";
import { getIntentStatusTool } from "./getIntentStatus";
import { exchangeTokensTool } from "./exchangeTokens";

export interface ToolConfig<T = any> {
  /**
   * The definition of the tool.
   */
  definition: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
      };
    };
  };

  /**
   * The handler function that will be called when the tool is executed.
   */
  handler: (args: T) => Promise<any>;
}

export const tools: Record<string, ToolConfig> = {
  // == READ == \\
  /**
   * Get the balance of a wallet.
   */
  get_balance: getBalanceTool,
  /**
   * Get the connected wallet address.
   */
  get_wallet_address: getWalletAddressTool,
  /**
   * Fetch a quote
   */
   fetch_quote: fetchQuoteTool,
  /**
   * Fetch an intent info
   */
   fetch_intent: getIntentStatusTool,


  // == WRITE == \\
  /**
   * Execute an intent
   */
   exchange_tokens: exchangeTokensTool,

};
