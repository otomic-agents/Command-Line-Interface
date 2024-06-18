import {Args, Command, Flags} from '@oclif/core'

export default class Swap extends Command {
  static override args = {
    file: Args.string({description: 'file to read'}),
  }

  static override description = 'describe the command here'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static override flags = {
    // flag with a value (-r, --relay=VALUE)
    relay: Flags.string({char: 'r', description: 'relay url'}),

    network: Flags.string({char: 'n', description: 'network: main / test'}),

    chainRpc: Flags.string({char: 'c', description: 'rpc config json, like: { bsc: "<RPC_BSC>" }'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Swap)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/sai/dev/work/otmoic-new-repo/Command-Line-Interface/src/commands/swap.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
