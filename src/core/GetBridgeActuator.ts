import { Bridge, Relay, assistive } from 'otmoic-software-development-kit'
import Table from 'cli-table3'
import { delay, Listr } from 'listr2';
import { TranslatedBridge } from 'otmoic-software-development-kit';

export default class GetBridgeActuator {

    relayUrl: string

    fetching: boolean = true

    network: string

    rpcs: {
        [key: string]: string
    } = {}

    translateBridges: TranslatedBridge[] | undefined

    constructor (relayUrl: string, network: string, rpcs: {
        [key: string]: string
    }) {
        this.relayUrl = relayUrl
        this.network = network
        this.rpcs = rpcs
    }

    run = () => new Promise<TranslatedBridge[] | undefined>(async (resolve, reject) => {

        this.fetching = true
        let taskNow = undefined
        try {
            await new Listr([
                {
                    title: 'fetch bridge from relay',
                    enabled: true,
                    task: async(_: any, task: any): Promise<void> => {
                        taskNow = task
                        
                        this.startTask()
                        
                        task.output = `fetching...`

                        while (this.fetching) {
                            await delay(500)
                        }

                        resolve(this.translateBridges)
                    }
                }
            ]).run()
        } catch (error) {
            console.error(error)
        }


    })

    startTask = () => new Promise<void>(async (resolve, reject) => {
        const bridges: Bridge[] = await (await new Relay(this.relayUrl).getBridge()).filter(b => b.src_chain_id == 9006 && b.dst_chain_id == 9006)

        // console.log('bridges', bridges)
        console.log('network', this.network)
        console.log('rpcs', this.rpcs)
        this.translateBridges = await assistive.TranslateBridge(bridges, this.network, this.rpcs)

        const table = new Table()
        
        for (const b of this.translateBridges) {
            table.push([`${b.srcChainName}(${b.src_chain_id})`, `${b.srcTokenSymbol}(${b.src_token})`, '-->', `${b.dstChainName}(${b.dst_chain_id})`, `${b.dstTokenSymbol}(${b.dst_token})`])
        }

        this.fetching = false

        console.log(table.toString());
    })
}