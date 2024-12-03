import {Bridge, Relay, assistive, TranslatedBridge, NetworkType} from 'otmoic-sdk'
import Table from 'cli-table3'
import {delay, Listr} from 'listr2'

export default class GetBridgeActuator {
  relayUrl: string

  fetching: boolean = true

  network: NetworkType

  rpcs: {
    [key: string]: string
  } = {}

  translateBridges: TranslatedBridge[] | undefined

  constructor(
    relayUrl: string,
    network: NetworkType,
    rpcs: {
      [key: string]: string
    },
  ) {
    this.relayUrl = relayUrl
    this.network = network
    this.rpcs = rpcs
  }

  run = () =>
    new Promise<TranslatedBridge[] | undefined>(async (resolve, reject) => {
      this.fetching = true

      let taskNow: any | undefined = undefined
      const uncaughtExceptionListener = (error: Error) => {
        if (taskNow != undefined) {
          taskNow.output = error.message
        }
      }

      const unhandledRejectionListener = (reason: any, promise: Promise<any>) => {
        if (taskNow != undefined) {
          taskNow.output = reason
        }
      }
      process.on('uncaughtException', uncaughtExceptionListener)
      process.on('unhandledRejection', unhandledRejectionListener)

      await new Listr([
        {
          title: 'fetch bridge from relay',
          enabled: true,
          task: async (_: any, task: any): Promise<void> => {
            taskNow = task

            this.startTask()

            task.output = `fetching...`

            while (this.fetching) {
              await delay(500)
            }

            process.removeListener('uncaughtException', uncaughtExceptionListener)
            process.removeListener('unhandledRejection', unhandledRejectionListener)
            resolve(this.translateBridges)
          },
        },
      ]).run()
    })

  startTask = () =>
    new Promise<void>(async (resolve, reject) => {
      const bridgeList: Bridge[] = await new Relay(this.relayUrl).getBridge()
      // const bridges: Bridge[] = bridgeList.filter(b => b.src_chain_id != 501 && b.dst_chain_id != 501)

      // console.log('bridgeList', bridgeList)
      console.log('network', this.network)
      console.log('rpcs', this.rpcs)
      this.translateBridges = await assistive.TranslateBridge(bridgeList, this.network, this.rpcs)

      const table = new Table()

      for (const b of this.translateBridges) {
        table.push([
          `${b.srcChainName}(${b.src_chain_id})`,
          `${b.srcTokenSymbol}(${b.src_token})`,
          '-->',
          `${b.dstChainName}(${b.dst_chain_id})`,
          `${b.dstTokenSymbol}(${b.dst_token})`,
        ])
      }

      this.fetching = false

      console.log(table.toString())
    })
}
