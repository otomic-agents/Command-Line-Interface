import { Listr } from "listr2"
import AskActuator from "./AskActuator"


export default class SwapActuator {

    relayUrl: string | undefined

    network: string | undefined

    rpcs: {
        [key: string]: string
    } = {}

    bridgeName: string | undefined

    amount: string | undefined

    loading: boolean = false

    askActuator: AskActuator

    constructor (relayUrl: string | undefined, network: string | undefined, rpcs: string | undefined, 
        bridgeName: string | undefined, amount: string | undefined) {

        this.askActuator = new AskActuator(relayUrl, network, rpcs, bridgeName, amount)
    }

    initConfig = () => {
        this.relayUrl = this.askActuator.relayUrl
        this.network = this.askActuator.network
        this.rpcs = this.askActuator.rpcs
        this.bridgeName = this.askActuator.bridgeName
        this.amount = this.askActuator.amount
    }

    enterPrivateKeyForSign = () => new Promise<void>(async (resolve, reject) => {
        
    })

    enterPrivateKeyForSend = () => new Promise<void>(async (resolve, reject) => {
        
    })

    enterAddress = () => new Promise<void>(async (resolve, reject) => {
        
    })

    run = new Promise<void>(async (resolve, reject) => {
        const quote = await this.askActuator.run()
        
        this.initConfig()

        const privateKeyForSign = await this.enterPrivateKeyForSign()

        const privateKeyForSend = await this.enterPrivateKeyForSend()

        const receivingAddress = await this.enterAddress()

        try {
            new Listr([{
                title: 'Sign Quote',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {

                }
            }, {
                title: 'Lock SrcToken (transfer out)',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {

                }
            }, {
                title: 'Wait lp lock DstToken (transfer in)',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {

                }
            }, {
                title: 'Release SrcToken (transfer out confirm)',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {

                }
            }, {
                title: 'Wait lp release DstToken (transfer in confirm)',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {

                }
            }]).run()
        } catch (error) {
            
        }
    })
}