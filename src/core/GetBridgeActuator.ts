import Otmoic, {TranslatedBridge, NetworkType} from 'otmoic-sdk'
import Table from 'cli-table3'
import {delay, Listr} from 'listr2'

export default class GetBridgeActuator {
  relayUrl: string

  fetching: boolean = true

  network: string

  rpcs: {
    [key: string]: string
  } = {}

  translateBridges: TranslatedBridge[] | undefined

  constructor(
    relayUrl: string,
    network: string,
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
      // const bridges: Bridge[] = bridgeList.filter(b => b.src_chain_id != 501 && b.dst_chain_id != 501)

      // console.log('bridgeList', bridgeList)
      let networkConfig = NetworkType[this.network.toUpperCase() as keyof typeof NetworkType]
      console.log('networkConfig', networkConfig)
      console.log('rpcs', this.rpcs)
      this.translateBridges = (await new Otmoic.Relay(this.relayUrl).getBridge({
        detailed: true,
        network: networkConfig,
      })) as TranslatedBridge[]

      const table = new Table()

      for (const b of this.translateBridges) {
        table.push([
          `${b.src_chain_name}(${b.src_chain_id})`,
          `${b.src_token_symbol}(${b.src_token})`,
          '-->',
          `${b.dst_chain_name}(${b.dst_chain_id})`,
          `${b.dst_token_symbol}(${b.dst_token})`,
        ])
      }

      this.fetching = false

      console.log(table.toString())
    })
}
