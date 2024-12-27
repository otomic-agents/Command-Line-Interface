import {Args, Command, Flags} from '@oclif/core'
import {prompt} from 'enquirer'
import AskActuator from '../core/AskActuator'
import {NetworkType} from 'otmoic-sdk'

export default class Ask extends Command {
  static override args = {}

  static override description = 'ask for relay'

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
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Ask)

    let relayUrl = flags.relay
    let network = flags.network
    let chainRpc = flags.chainRpc
    let bridgeName = flags.bridge
    let amount = flags.amount

    const askActuator = new AskActuator(relayUrl, network, chainRpc, bridgeName, amount)
    const quote = await askActuator.run()
    console.log('choosed quote', quote)

    process.exit(0)
  }
}
