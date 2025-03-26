import { createHash, randomBytes } from "crypto";
import {createNearWalletClient} from "../near/createNearWalletClient";
import { BorshSchema, borshSerialize } from "borsher";
import {
    KeyPair,
  } from "near-api-js";
import bs58 from "bs58";
import {NEAR_TOKEN, ZEC_TOKEN} from "../constants/tokens"

const RPC_URL = "https://solver-relay-v2.chaindefuser.com/rpc";



export async function fetchQuote(
  assetInput: string,
  amountInput: number,
  assetOutput: string
): Promise<any | undefined> {

  let realAmount = BigInt(0);
  if(assetInput ==NEAR_TOKEN) {
    realAmount = BigInt(amountInput * 10**24);
  }
  if(assetInput ==ZEC_TOKEN) {
    realAmount = BigInt(amountInput * 10**8);
  }

  const body = {
    id: "dontcare",
    jsonrpc: "2.0",
    method: "quote",
    params: [
      {
        defuse_asset_identifier_in: assetInput,
        defuse_asset_identifier_out: assetOutput,
        exact_amount_in: String(realAmount),
      },
    ],
  };


  const response = await fetch(RPC_URL, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });


  const json: any = await response.json();

  if (!response.ok) {
    throw new Error(
      `Request failed ${response.status} ${
        response.statusText
      } - ${JSON.stringify(json)}`
    );
  }

  const result = json.result;

  if (result === null) return undefined;

  return result.at(0);
}


export async function fetchIntentStatus(
    intentHash: string
  ): Promise<any | undefined> {
    const body = {
      id: "dontcare",
      jsonrpc: "2.0",
      method: "get_status",
      params: [
        {
          intent_hash: intentHash,
        },
      ],
    };
  
    const response = await fetch(RPC_URL, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const json: any = await response.json();
  
    if (!response.ok) {
      throw new Error(
        `Request failed ${response.status} ${
          response.statusText
        } - ${JSON.stringify(json)}`
      );
    }
  
    const result = json.result;
  
    return result.toString() || undefined;
  }


  export async function publishIntent(
    assetInput: string,
    amountInput: number,
    assetOutput: string
  ): Promise<any | undefined> {

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

    let realAmount = 0;
      if(assetInput ==NEAR_TOKEN) {
        realAmount = Number(amountInput * 10**24);
      }
      if(assetInput ==ZEC_TOKEN) {
        realAmount = Number(amountInput * 10**8);
      }

    const keyPair = KeyPair.fromString(process.env.WALLET_PRIVATE_KEY);

    const quote = await fetchQuote(assetInput, realAmount, assetOutput);

    const standard = "nep413";
    const message = {
      signer_id: process.env.WALLET_ACCOUNT_ID,
      deadline: quote["expiration_time"],
      intents: [
        {
          intent: "token_diff",
          diff: {
            [quote["defuse_asset_identifier_in"]]: `-${quote["amount_in"]}`,
            [quote["defuse_asset_identifier_out"]]: `${quote["amount_out"]}`,
          },
        },
      ],
    };

    const messageStr = JSON.stringify(message);
    const nonce = await generateNonce();
    const recipient = "intents.near";
    const intent = serializeIntent(messageStr, recipient, nonce, standard);
    const { signature, publicKey } = keyPair.sign(intent);

    const signedData = {
        standard,
        payload: {
          message: messageStr,
          nonce,
          recipient,
        },
        signature: `ed25519:${bs58.encode(signature)}`,
        public_key: publicKey.toString(),
      };

    const body = {
      id: "dontcare",
      jsonrpc: "2.0",
      method: "publish_intent",
      params: [
        {
          quote_hashes: [quote["quote_hash"]],
          signed_data: signedData,
        },
      ],
    };
  
    const response = await fetch(RPC_URL, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const json: any = await response.json();
  
    if (!response.ok) {
      throw new Error(
        `Request failed ${response.status} ${
          response.statusText
        } - ${JSON.stringify(json)}`
      );
    }
  
    const result = json.result;

    if (result["status"] === "FAILED")
      throw new Error(`Intent wasn't executed - ${result["reason"]}`);

    const intentHash = result["intent_hash"];
    if (!intentHash) throw new Error(`No intent hash received`);

  
    return `Status: ${result["status"]}, Intent hash: ${intentHash}`;
  }

  async function isNonceUsed(nonce: string): Promise<boolean> {
    const account = await createNearWalletClient();
  
    return await account.viewFunction({
      contractId: "intents.near",
      methodName: "is_nonce_used",
      args: {
        account_id: account.accountId,
        nonce,
      },
    });
  }

async function generateNonce(): Promise<string> {
    const randomArray = randomBytes(32);
  
    const nonceString = randomArray.toString("base64");
  
    if (await isNonceUsed(nonceString)) {
      //this step can be skipped but if nonce is already used quote wont be taken into account
      return generateNonce();
    } else {
      return nonceString;
    }
  }

  const standardNumber = {
    ["nep413"]: 413,
  };
  
  const Nep413PayloadSchema = BorshSchema.Struct({
    message: BorshSchema.String,
    nonce: BorshSchema.Array(BorshSchema.u8, 32),
    recipient: BorshSchema.String,
    callback_url: BorshSchema.Option(BorshSchema.String),
  });

  export function serializeIntent(
    intentMessage: any,
    recipient: string,
    nonce: string,
    standard: "nep413"
  ): Buffer {
    const payload = {
      message: intentMessage,
      nonce: base64ToUint8Array(nonce),
      recipient,
    };
    const payloadSerialized = borshSerialize(Nep413PayloadSchema, payload);
    const baseInt = 2 ** 31 + standardNumber[standard];
    const baseIntSerialized = borshSerialize(BorshSchema.u32, baseInt);
    const combinedData = Buffer.concat([baseIntSerialized, payloadSerialized]);
    return createHash("sha256").update(combinedData).digest();
  }

  const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };