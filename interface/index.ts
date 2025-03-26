
/**
 * Arguments for the get_balance tool
 */
export interface GetBalanceArgs {
  /**
   * The wallet to get the balance of
   */
  wallet: string;
}

// No arguments needed since we're getting the connected wallet
export interface GetWalletAddressArgs {}

/**
 * Arguments for the fetch_quote tool
 */
 export interface FetchQuoteArgs {
  input_token: string;
  output_token: string;
  amount: number;
}


export interface GetIntentStatusArgs {
   intentHash: string;
}