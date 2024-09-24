import {Args, Command, Flags} from '@oclif/core'
import MonkeyActuator from '../core/MonkeyActuator'

export default class Monkey extends Command {
  static override args = {
  }

  static override description = 'describe the command here'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    interval: Flags.string({char: 'i', description: "the interval between the two monkeys' departures is random within a certain range, in the format of [min]-[max]"}),

    relay: Flags.string({char: 'r', description: 'relay url'}),

    amount: Flags.string({char: 'a', description: 'the per mille (num over 1000) of srctokens exchanged (base of balance) in each test, random within a specific range, in the format of [min]-[max]'}),

    bridge: Flags.string({char: 'b', description: 'the bridges to be tested are separated by commas. If it is empty, there is no limit.'}),

    privateKey: Flags.string({char: 'p', description: 'evm private key used during testing'}),
    
    solanaPrivateKey: Flags.string({char: 's', description: 'solana private key used during testing'}),

    webhook: Flags.string({char: 'w', description: 'webhook address for receiving execution reports'}),

    type: Flags.string({char: 't', description: 'the test type, separated by commas, [succeed] or [refund] or [cheat amount] or [cheat address] or [cheat txin]'}),

    complaint: Flags.string({char: 'C', description: 'do complaint, enter [true] or [false], if "type" is not "succeed", complaint can be run'}),

    lp: Flags.string({char: 'l', description: 'the lp name to be tested. no restriction if empty.'}),

    network: Flags.string({char: 'n', description: 'network: mainnet / testnet'}),

    chainRpc: Flags.string({char: 'c', description: 'rpc config json, like: { bsc: "<RPC_BSC>" }'}),

    to: Flags.string({char: 'T', description: 'your evm address for receiving token'}),
    
    solanaTo: Flags.string({char: 'S', description: 'your solana address for receiving token'}),

    debug: Flags.string({char: 'd', description: 'output verbose logs for debugging if true, otherwise be false'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Monkey)

    let interval = flags.interval
    let relay = flags.relay
    let amount = flags.amount
    let bridge = flags.bridge
    let privateKey = flags.privateKey
    let solanaPrivateKey = flags.solanaPrivateKey
    let webhook = flags.webhook
    let type = flags.type
    let complaint = flags.complaint
    let lp = flags.lp
    let network = flags.network
    let chainRpc = flags.chainRpc
    let receivingAddress = flags.to
    let solanaReceivingAddress = flags.solanaTo
    let debug = flags.debug

    let monkeyActuator = new MonkeyActuator(interval, relay, amount, bridge, privateKey, solanaPrivateKey, webhook, type, complaint, lp, network, chainRpc, receivingAddress, solanaReceivingAddress, debug)
    monkeyActuator.run()


  }
}
