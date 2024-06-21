import {Args, Command, Flags} from '@oclif/core'
import MonkeyActuator from '../core/MonkeyActuator'

export default class Monkey extends Command {
  static override args = {
    file: Args.string({description: 'file to read'}),
  }

  static override description = 'describe the command here'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    interval: Flags.string({char: 'i', description: ''}),

    relay: Flags.string({char: 'r', description: ''}),

    amount: Flags.string({char: 'a', description: ''}),

    bridge: Flags.string({char: 'b', description: ''}),

    privateKey: Flags.string({char: 'p', description: ''}),

    webhook: Flags.string({char: 'w', description: ''}),

    type: Flags.string({char: 't', description: ''}),

    lp: Flags.string({char: 'l', description: ''}),

    network: Flags.string({char: 'n', description: 'network: main / test'}),

    chainRpc: Flags.string({char: 'c', description: 'rpc config json, like: { bsc: "<RPC_BSC>" }'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Monkey)

    let interval = flags.interval
    let relay = flags.relay
    let amount = flags.amount
    let bridge = flags.bridge
    let privateKey = flags.privateKey
    let webhook = flags.webhook
    let type = flags.type
    let lp = flags.lp
    let network = flags.network
    let chainRpc = flags.chainRpc

    let monkeyActuator = new MonkeyActuator(interval, relay, amount, bridge, privateKey, webhook, type, lp, network, chainRpc)
    monkeyActuator.run()


  }
}
