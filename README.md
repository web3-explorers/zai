# ZAI

## Description

ZAI is a powerful AI tool designed to interact Zcash using Near Intents. It leverages OpenAI's GPT-4o-mini model to provide a conversational interface for users to perform various blockchain operations.

## Features

- **Conversational Interface**: Engage with the assistant to perform blockchain operations through natural language.
- **Wallet Operations**: Check wallet balances and retrieve connected wallet addresses.
- **Transaction Management**: Fetch quotes and exchange between NEAR and ZEC.
- **Error Handling**: Robust error handling and feedback for failed operations.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- TypeScript
- OpenAI API key
- Environment variables for wallet private key and other configurations

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/web3-explorers/zai.git
   cd zai
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your OpenAI API key and wallet private key:
   ```plaintext
   OPENAI_API_KEY=************ enter your key here
   WALLET_PRIVATE_KEY=**************** enter your key here
   WALLET_ACCOUNT_ID=******** wallet from near (ex: dsdsdsd.near)
   ```

### Usage

To start the assistant, run:

```bash
bun run src/index.ts
```

You can then interact with the assistant in the command line. Type "exit" to end the conversation.

### Tools

The assistant has access to various tools for performing blockchain operations:

#### Read Operations
- **get_balance**: Check wallet balances on the Near network
- **get_wallet_address**: Retrieve the connected wallet's address
- **fetch_quote**: Fetch a quote between NEAR and ZEC (or viceversa)
- **fetch_intent**: Fetch the status of the intent (to exchange between the 2 tokens)

#### Write Operations
- **exchange_tokens**: Execute an exchange between 2 tokens and specific amount (from the origin token)


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## Contact

https://x.com/nes_campos 
