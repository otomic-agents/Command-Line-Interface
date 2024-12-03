import {Args, Command, Flags} from '@oclif/core'
import SwapActuator from '../core/SwapActuator'
import {delay} from 'listr2'

export default class Swap extends Command {
  static override args = {}

  static override description = 'exchange token'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    // flag with a value (-r, --relay=VALUE)
    relay: Flags.string({char: 'r', description: 'relay url'}),

    network: Flags.string({char: 'n', description: 'network: mainnet / testnet'}),

    chainRpc: Flags.string({char: 'c', description: 'rpc config json, like: { bsc: "<RPC_BSC>" }'}),

    bridge: Flags.string({
      char: 'b',
      description:
        'bridge name, like: BSC-0x55d398326f99059ff775485246999027b3197955(USDT)-->OPT-0x94b008aa00579c1307b0ef2c499ad98a8ce58e58(USDT)',
    }),

    amount: Flags.string({char: 'a', description: 'amount for you want to exchange'}),

    privateKeyForSign: Flags.string({char: 'p', description: 'your wallet private key for sign this deal'}),

    privateKeyForSend: Flags.string({char: 's', description: 'your wallet private key for send src token'}),

    to: Flags.string({char: 't', description: 'your wallet address for receiving token'}),

    useMaximumGasPriceAtMost: Flags.boolean({
      char: 'g',
      description: 'use the defined maximum gas price if exceeds. usd -g if want to enable it',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Swap)

    let relayUrl = flags.relay
    let network = flags.network
    let chainRpc = flags.chainRpc
    let bridgeName = flags.bridge
    let amount = flags.amount
    let privateKeyForSign = flags.privateKeyForSign
    let privateKeyForSend = flags.privateKeyForSend
    let receivingAddress = flags.to
    let useMaximumGasPriceAtMost = flags.useMaximumGasPriceAtMost

    const swapActuator = new SwapActuator(
      relayUrl,
      network,
      chainRpc,
      bridgeName,
      amount,
      privateKeyForSign,
      privateKeyForSend,
      receivingAddress,
      useMaximumGasPriceAtMost,
    )
    const resp = await swapActuator.run()
    console.log(resp)

    await delay(500)
    process.exit(0)
  }
}
