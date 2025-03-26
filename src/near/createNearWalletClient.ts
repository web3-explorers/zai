import {
  Account,
  providers,
  Connection,
  InMemorySigner,
  KeyPair,
} from "near-api-js";
import { InMemoryKeyStore } from "near-api-js/lib/key_stores";


export async function createNearWalletClient() {
  // Check if the private key environment variable is set
  if (!process.env.WALLET_PRIVATE_KEY) {
    throw new Error(
      "⛔ WALLET_PRIVATE_KEY environment variable is not set. You need to set it to create a wallet client."
    );
  }
  if (!process.env.WALLET_ACCOUNT_ID) {
    throw new Error(
      "⛔ WALLET_ACCOUNT_ID environment variable is not set. You need to set it to create a wallet client."
    );
  }

  const provider = new providers.JsonRpcProvider({
    url: "https://rpc.mainnet.near.org",
  });

  const keyPair = KeyPair.fromString(process.env.WALLET_PRIVATE_KEY);

  const keyStore = new InMemoryKeyStore();
  await keyStore.setKey("mainnet", process.env.WALLET_ACCOUNT_ID, keyPair);

  const signer = new InMemorySigner(keyStore);

  const connection = new Connection("mainnet", provider, signer, "");

  return new Account(connection, process.env.WALLET_ACCOUNT_ID);
}
