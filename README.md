otmoiccli
=================

otmoic-cli has functions such as generating account reports, querying quotes, and making exchanges.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/otmoiccli.svg)](https://npmjs.org/package/otmoiccli)
[![Downloads/week](https://img.shields.io/npm/dw/otmoiccli.svg)](https://npmjs.org/package/otmoiccli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Request a relay quote with specified parameters](#request-a-relay-quote-with-specified-parameters)
* [Get help for the ask command](#get-help-for-the-ask-command)
* [Get help for the monkey command](#get-help-for-the-monkey-command)
* [Run the reportforms command](#run-the-reportforms-command)
* [Run the reportforms command with a specific name](#run-the-reportforms-command-with-a-specific-name)
* [Run the swap command with specified parameters](#run-the-swap-command-with-specified-parameters)
* [Run the monkey command with specified parameters](#run-the-monkey-command-with-specified-parameters)
* [Run the monkey command with specified parameters](#run-the-monkey-command-with-specified-parameters)
* [Contributing](#contributing)
* [License](#license)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g otmoic-cli
$ otmoiccli COMMAND
running command...
$ otmoiccli (--version)
otmoic-cli/0.1.2 darwin-arm64 node-v20.11.1
$ otmoiccli --help [COMMAND]
USAGE
  $ otmoiccli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`otmoiccli ask`](#otmoiccli-ask)
* [`otmoiccli help [COMMAND]`](#otmoiccli-help-command)
* [`otmoiccli monkey`](#otmoiccli-monkey)
* [`otmoiccli reportforms`](#otmoiccli-reportforms)
* [`otmoiccli swap`](#otmoiccli-swap)

## `otmoiccli ask`

ask for relay

```
USAGE
  $ otmoiccli ask [-r <value>] [-n <value>] [-c <value>] [-b <value>] [-a <value>]

FLAGS
  -a, --amount=<value>    amount for you want to exchange
  -b, --bridge=<value>    bridge name, like: BSC-0x55d398326f99059ff775485246999027b3197955(USDT)-->OPT-0x94b008aa00579c
                          1307b0ef2c499ad98a8ce58e58(USDT)
  -c, --chainRpc=<value>  rpc config json, like: { bsc: "<RPC_BSC>" }
  -n, --network=<value>   network: mainnet / testnet
  -r, --relay=<value>     relay url

DESCRIPTION
  ask for relay

EXAMPLES
  $ otmoiccli ask
```

_See code: [src/commands/ask.ts](https://github.com/otmoic/Command-Line-Interface/blob/v0.1.2/src/commands/ask.ts)_

## `otmoiccli help [COMMAND]`

Display help for otmoiccli.

```
USAGE
  $ otmoiccli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for otmoiccli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.15/src/commands/help.ts)_

## `otmoiccli monkey`

describe the command here

```
USAGE
  $ otmoiccli monkey [-i <value>] [-r <value>] [-a <value>] [-b <value>] [-p <value>] [-s <value>] [-w
    <value>] [-t <value>] [-C <value>] [-l <value>] [-n <value>] [-c <value>] [-T <value>] [-S <value>] [-d] [-g]

FLAGS
  -C, --complaint=<value>         do complaint, enter [true] or [false], if "type" is not "succeed", complaint can be
                                  run
  -S, --solanaTo=<value>          your solana address for receiving token
  -T, --to=<value>                your evm address for receiving token
  -a, --amount=<value>            the per mille (num over 1000) of srctokens exchanged (base of balance) in each test,
                                  random within a specific range, in the format of [min]-[max]
  -b, --bridge=<value>            the bridges to be tested are separated by commas. If it is empty, there is no limit.
  -c, --chainRpc=<value>          rpc config json, like: { bsc: "<RPC_BSC>" }
  -d, --debug                     debug flag for output detailed lp. use -d if want to enable it
  -g, --useMaximumGasPriceAtMost  use the defined maximum gas price if exceeds. usd -g if want to enable it
  -i, --interval=<value>          the interval between the two monkeys' departures is random within a certain range, in
                                  the format of [min]-[max]
  -l, --lp=<value>                the lp name to be tested. no restriction if empty.
  -n, --network=<value>           network: mainnet / testnet
  -p, --privateKey=<value>        evm private key used during testing
  -r, --relay=<value>             relay url
  -s, --solanaPrivateKey=<value>  solana private key used during testing
  -t, --type=<value>              the test type, separated by commas, [succeed] or [refund] or [cheat amount] or [cheat
                                  address] or [cheat txin]
  -w, --webhook=<value>           webhook address for receiving execution reports

DESCRIPTION
  describe the command here

EXAMPLES
  $ otmoiccli monkey
```

_See code: [src/commands/monkey.ts](https://github.com/otmoic/Command-Line-Interface/blob/v0.1.2/src/commands/monkey.ts)_

## `otmoiccli reportforms`

describe the command here

```
USAGE
  $ otmoiccli reportforms

DESCRIPTION
  describe the command here

EXAMPLES
  $ otmoiccli reportforms
```

_See code: [src/commands/reportforms.ts](https://github.com/otmoic/Command-Line-Interface/blob/v0.1.2/src/commands/reportforms.ts)_

## `otmoiccli swap`

exchange token

```
USAGE
  $ otmoiccli swap [-r <value>] [-n <value>] [-c <value>] [-b <value>] [-a <value>] [-p <value>] [-s
    <value>] [-t <value>] [-g]

FLAGS
  -a, --amount=<value>             amount for you want to exchange
  -b, --bridge=<value>             bridge name, like: BSC-0x55d398326f99059ff775485246999027b3197955(USDT)-->OPT-0x94b00
                                   8aa00579c1307b0ef2c499ad98a8ce58e58(USDT)
  -c, --chainRpc=<value>           rpc config json, like: { bsc: "<RPC_BSC>" }
  -g, --useMaximumGasPriceAtMost   use the defined maximum gas price if exceeds. usd -g if want to enable it
  -n, --network=<value>            network: mainnet / testnet
  -p, --privateKeyForSign=<value>  your wallet private key for sign this deal
  -r, --relay=<value>              relay url
  -s, --privateKeyForSend=<value>  your wallet private key for send src token
  -t, --to=<value>                 your wallet address for receiving token

DESCRIPTION
  exchange token

EXAMPLES
  $ otmoiccli swap
```

_See code: [src/commands/swap.ts](https://github.com/otmoic/Command-Line-Interface/blob/v0.1.2/src/commands/swap.ts)_
<!-- commandsstop -->
* [`otmoiccli ask`](#otmoiccli-ask)
* [`otmoiccli help [COMMAND]`](#otmoiccli-help-command)
* [`otmoiccli reportforms`](#otmoiccli-reportforms)
* [`otmoiccli swap`](#otmoiccli-swap)
* [`otmoiccli monkey`](#otmoiccli-monkey)

## `otmoiccli ask`

The `otmoiccli ask` command is used to request a relay quote for a specified bridge and amount. This command interacts with the relay service to fetch the best available quote based on the provided parameters.

### Usage

```sh
otmoiccli ask [OPTIONS]
```

### Options

- `-r, --relay`: Relay URL.
- `-n, --network`: Network (mainnet/testnet).
- `-c, --chainRpc`: RPC config JSON (e.g., `{ bsc: "<RPC_BSC>" }`).
- `-b, --bridge`: Bridge name (e.g., `BSC=0x55d398326f99059ff775485246999027b3197955(USDT)-->OPT-0x94b00aa00579c1307b0ef2c499ad98a8ce58e58(USDT)`).
- `-a, --amount`: Amount to exchange.

### Examples

```sh
# Request a relay quote with specified parameters
otmoiccli ask --relay https://relay.example.com --network mainnet --chainRpc '{"bsc": "https://bsc.rpc.url"}' --bridge BSC=0x55d398326f99059ff775485246999027b3197955(USDT)-->OPT-0x94b00aa00579c1307b0ef2c499ad98a8ce58e58(USDT) --amount 100
```

### Code Reference

The implementation of this command can be found in `src/commands/ask.ts`.

## `otmoiccli help [COMMAND]`

The `otmoiccli help [COMMAND]` command provides detailed information about a specific command, including its usage and options.

### Usage

```sh
otmoiccli help [COMMAND] [OPTIONS]
```

### Options

- `COMMAND`: The command to get help for.
- `-n, --nested-commands`: Include all nested commands in the output.

### Examples

```sh
# Get help for the ask command
otmoiccli help ask

# Get help for the monkey command
otmoiccli help monkey
```

### Code Reference

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.0/src/commands/help.ts)_

## `otmoiccli reportforms`

The `otmoiccli reportforms` command is used to generate report forms by syncing data and creating reports based on the provided parameters.

### Usage

```sh
otmoiccli reportforms [OPTIONS]
```

### Options

- `-f, --force`: Force the operation.
- `-n, --name`: Name to print.

### Examples

```sh
# Run the reportforms command
otmoiccli reportforms

# Run the reportforms command with a specific name
otmoiccli reportforms --name oclif
```

### Detailed Steps

1. **Prompt for Modes**: The command will prompt you to select the modes you want to run (Sync Data, Create Report Forms).
2. **Prompt for DB Path**: You will be asked to enter the database path.
3. **Prompt for Wallets**: You will be asked to enter your wallets.
4. **Prompt for Chains**: You will be asked to select the chains you want to include (BSC, OPT).

### Code Reference

The implementation of this command can be found in `src/commands/reportforms.ts`.

## `otmoiccli swap`

The `otmoiccli swap` command is used to exchange tokens across different blockchains. This command interacts with various blockchain networks to facilitate token swaps.


### Usage

```sh
otmoiccli swap [OPTIONS]
```

### Options

- `-r, --relay`: Relay URL.
- `-n, --network`: Network (mainnet/testnet).
- `-c, --chainRpc`: RPC config JSON (e.g., `{ bsc: "<RPC_BSC>" }`).
- `-b, --bridge`: Bridge name (e.g., `BSC-0x55d398326f99059fF775485246999027b3197955(USDT)-->OPT-0x94b08aa00579c1307b0ef2c499ad98a8ce58e58(USDT)`).
- `-a, --amount`: Amount to exchange.
- `-p, --privateKeyForSign`: Your wallet private key for signing the deal.
- `-s, --privateKeyForSend`: Your wallet private key for sending the source token.
- `-t, --to`: Your wallet address for receiving the token.

### Examples

```sh
# Run the swap command with specified parameters
otmoiccli swap --relay https://relay.example.com --network mainnet --chainRpc '{"bsc": "https://bsc.rpc.url"}' --bridge BSC-0x55d398326f99059ff775485246999027b3197955(USDT)-->OPT-0x94b008aa00579c1307b0ef2c499ad98a8ce58e58(USDT) --amount 100 --privateKeyForSign <PRIVATE_KEY> --privateKeyForSend <PRIVATE_KEY> --to <RECEIVING_ADDRESS>
```

### Detailed Steps

1. **Initialize SwapActuator**: The command initializes a `SwapActuator` with the provided parameters.
2. **Fetch Quote**: The actuator fetches a quote for the specified bridge and amount.
3. **Sign and Send Transaction**: The actuator signs and sends the transaction using the provided private keys.
4. **Receive Tokens**: The tokens are received at the specified receiving address.

### Code Reference

The implementation of this command can be found in `src/commands/swap.ts`.

## `otmoiccli monkey`

The `otmoiccli monkey` command is used to perform automated periodic swap tasks on the blockchain network, often in conjunction with shell scripts such as `monkey_mainnet.sh`.

### Usage

```sh
otmoiccli monkey [OPTIONS]
```

### Options

- `-i, --interval`: Interval range for task execution, in the format of [min]-[max] (e.g., 3600-7200).
- `-r, --relay`: Relay URL.
- `-a, --amount`: Per mille of srctokens exchanged (base of balance) in each test, random within a specific range, in the format of [min]-[max] (e.g., 1000-1000).
- `-p, --privateKey`: Your Evm wallet private key for signing the deal.
- `-s, --solanaPrivateKey`: Your Solana wallet private key.
- `-t, --task`: Task type (e.g., succeed, refund, cheat amount, cheat address, cheat txin).
- `-C, --complaint`: Complaint flag (true/false).
- `-n, --network`: Network (mainnet/testnet).
- `-T, --to`: Your Evm address for receiving token.
- `-S, --solanaTo`: Your Solana address for receiving token.
- `-w, --webhook`: Webhook URL.
- `-b, --bridge`: Bridges to be tested are separated by commas. If it is empty, there is no limit.
- `-c, --chainRpc`: RPC config JSON (e.g., `{"opt": "https://sepolia.optimism.io"}`).
- `-l, --lp`: Lp name to be tested. no restriction if empty.
- `-d, --debug`: Debug flag for output detailed lp (true/false).

### Examples

```sh
# Run the monkey command with specified parameters
otmoiccli monkey -i 300-450 -r https://relay.example.com -a 1000-1000 -p <PRIVATE_KEY> -s <SOLANA_PRIVATE_KEY>
# Run the monkey command with specified parameters
otmoiccli monkey -i 300-450 -r https://relay.example.com -a 1000-1000 -p <PRIVATE_KEY> -s <SOLANA_PRIVATE_KEY> -t "succeed" -C true -n testnet -T 0x945e9704D2735b420363071bB935ACf2B9C4b814 -S 0xfee69ce6840ffcc48af425d5827e8dbcb1a9afd688ef206ee3da5c9ef23503dc -w http://xxx -b "" -c '{"opt": "https://sepolia.optimism.io"}' -l "" -d true
```

### Detailed Steps

1. **Initialize Log Directory**: The script checks if the log directory exists and creates it if it doesn't.
2. **Get Current Date and Time**: The script fetches the current date and time.
3. **Set Break Times**: The script sets the break start and end times for the day.
4. **Check Break Window**: The script checks if the current time is within the break window. If it is, it sleeps until the break ends.
5. **Execute Task**: If not in the break window, the script logs the start of the task and executes the `monkey` command with the specified parameters.
6. **Log Output**: The script logs the output of the task execution.
7. **Restart on Exit**: If the task exits, the script logs the exit code and restarts the task after a short delay.

### Code Reference

The implementation of this command can be found in `src/commands/monkey.ts` and `monkey_mainnet.sh`. 

# Contributing

We welcome contributions to this project! If you are interested in contributing, please follow these steps:

1. **Fork the repository**: Click the "Fork" button at the top right of this page to create a copy of this repository in your GitHub account.

2. **Clone your fork**: Use the following command to clone your forked repository to your local machine:
    ```sh
    git clone https://github.com/your-username/Command-Line-Interface.git
    ```

3. **Create a new branch**: Create a new branch for your feature or bugfix:
    ```sh
    git checkout -b my-feature-branch
    ```

4. **Install dependencies**: Navigate to the project directory and install the dependencies:
    ```sh
    cd Command-Line-Interface
    npm install
    ```

5. **Make your changes**: Implement your feature or bugfix.

6. **Commit your changes**: Commit your changes with a descriptive commit message:
    ```sh
    git commit -am 'Add new feature'
    ```

7. **Push to your fork**: Push your changes to your forked repository:
    ```sh
    git push origin my-feature-branch
    ```

8. **Create a pull request**: Open a pull request from your forked repository to the main repository.

Thank you for contributing!

# License

This project is licensed under the terms of the [LICENSE.txt](LICENSE.txt) file.
