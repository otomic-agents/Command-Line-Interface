otmoiccli
=================

otmoic-cli has functions such as generating account reports, querying quotes, and making exchanges.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/otmoiccli.svg)](https://npmjs.org/package/otmoiccli)
[![Downloads/week](https://img.shields.io/npm/dw/otmoiccli.svg)](https://npmjs.org/package/otmoiccli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g otmoiccli
$ otmoiccli COMMAND
running command...
$ otmoiccli (--version)
otmoiccli/0.0.7 darwin-arm64 node-v20.11.1
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

_See code: [src/commands/ask.ts](https://github.com/otmoic/Command-Line-Interface/blob/v0.0.7/src/commands/ask.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.0/src/commands/help.ts)_

## `otmoiccli monkey`

describe the command here

```
USAGE
  $ otmoiccli monkey [-i <value>] [-r <value>] [-a <value>] [-b <value>] [-p <value>] [-s <value>] [-w
    <value>] [-t <value>] [-C <value>] [-l <value>] [-n <value>] [-c <value>] [-T <value>] [-S <value>]

FLAGS
  -C, --complaint=<value>         do complaint, enter [true] or [false], if "type" is not "succeed", complaint can be
                                  run
  -S, --solanaTo=<value>          your solana address for receiving token
  -T, --to=<value>                your evm address for receiving token
  -a, --amount=<value>            the per mille (num over 1000) of srctokens exchanged (base of balance) in each test,
                                  random within a specific range, in the format of [min]-[max]
  -b, --bridge=<value>            the bridges to be tested are separated by commas. If it is empty, there is no limit.
  -c, --chainRpc=<value>          rpc config json, like: { bsc: "<RPC_BSC>" }
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

_See code: [src/commands/monkey.ts](https://github.com/otmoic/Command-Line-Interface/blob/v0.0.7/src/commands/monkey.ts)_

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

_See code: [src/commands/reportforms.ts](https://github.com/otmoic/Command-Line-Interface/blob/v0.0.7/src/commands/reportforms.ts)_

## `otmoiccli swap`

exchange token

```
USAGE
  $ otmoiccli swap [-r <value>] [-n <value>] [-c <value>] [-b <value>] [-a <value>] [-p <value>] [-s
    <value>] [-t <value>]

FLAGS
  -a, --amount=<value>             amount for you want to exchange
  -b, --bridge=<value>             bridge name, like: BSC-0x55d398326f99059ff775485246999027b3197955(USDT)-->OPT-0x94b00
                                   8aa00579c1307b0ef2c499ad98a8ce58e58(USDT)
  -c, --chainRpc=<value>           rpc config json, like: { bsc: "<RPC_BSC>" }
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

_See code: [src/commands/swap.ts](https://github.com/otmoic/Command-Line-Interface/blob/v0.0.7/src/commands/swap.ts)_
<!-- commandsstop -->
