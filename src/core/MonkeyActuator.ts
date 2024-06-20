import { prompt } from 'enquirer';
import { ethers } from "ethers";
import { Listr } from 'listr2';

function getRandomNumberInRange(n: number, m: number): number {
    return Math.floor(Math.random() * (m - n + 1) + n);
}

interface Config {
    
    intervalMin: number

    intervalMax: number

    relayUrl: string

    amountMin: number

    amountMax: number

    bridges: string[]

    privateKey: string

    webhook: string
}

export default class MonkeyActuator {

    interval: string | undefined

    relay: string | undefined

    amount: string | undefined

    bridge: string | undefined

    privateKey: string | undefined

    webhook: string | undefined

    config: Config = {
        intervalMin: 0,
        intervalMax: 0,
        relayUrl: '',
        amountMin: 0,
        amountMax: 0,
        bridges: [],
        privateKey: '',
        webhook: ''
    }

    constructor(interval: string | undefined, relay: string | undefined, amount: string | undefined, 
        bridge: string | undefined, privateKey: string | undefined, webhook: string | undefined) {
        this.interval = interval
        this.relay = relay
        this.amount = amount
        this.bridge = bridge
        this.privateKey = privateKey
        this.webhook = webhook
    }

    run = () => new Promise<void>(async (resolve, reject) => {


        await this.initInterval()
        await this.initRelay()
        await this.initAmount()
        await this.initBridge()
        await this.initPrivateKey()
        await this.initWebhook()

        console.log('config', this.config)

        this.tick()
    })

    tick = () => new Promise<void>(async (resolve, reject) => {
        
        try {
            new Listr([
                {
                    title: '',
                    enabled: true,
                    task: async(_: any, task: any): Promise<void> => {
                        
                    }
                }
            ]).run()
        } catch (error) {
            console.error(error)
        }


        const interval = getRandomNumberInRange(this.config.intervalMin, this.config.intervalMax)

        setTimeout(this.tick, interval * 1000)
    })

    initInterval = () => new Promise<void>(async (resolve, reject) => {
        if (this.interval == undefined || this.interval.split('-').length != 2) {
            const intervalValue: any = await prompt({
                name: 'ConfigRPSC',
                type: 'snippet',
                message: 'enter the interval, unit in seconds: [min]-[max]',
                required: true,
                template: `#{min}-#{max}`
            })
            this.interval = intervalValue.ConfigRPSC.result as string
        }
        const intervalStr = this.interval.split('-')
        this.config.intervalMin = parseInt(intervalStr[0])
        this.config.intervalMax = parseInt(intervalStr[1])

        console.log(`interval min: ${this.config.intervalMin}`)
        console.log(`interval max: ${this.config.intervalMax}`)

        resolve()
    })

    initRelay = () => new Promise<void>(async (resolve, reject) => {
        if (this.relay == undefined) {
            const relayUrlValue: { value: string} = (await prompt({
                type: 'input',
                name: 'value',
                message: 'Enter relay url',
            }))
            this.config.relayUrl = relayUrlValue.value
        }
        console.log('relay url:', this.config.relayUrl)

        resolve()
    })

    initAmount = () => new Promise<void>(async (resolve, reject) => {
        if (this.amount == undefined || this.amount.split('-').length != 2) {
            const amountValue: any = await prompt({
                name: 'ConfigAmount',
                type: 'snippet',
                message: 'enter the amount, unit is percentage: [min]-[max]',
                required: true,
                template: `#{min}%-#{max}%`
            })
            this.amount = amountValue.ConfigAmount.result as string
        }
        const amountStr = this.amount.split('-')
        this.config.amountMin = parseInt(amountStr[0])
        this.config.amountMax = parseInt(amountStr[1])

        if (this.config.amountMin < 0 || this.config.amountMin > 100 || this.config.amountMax < 0 || this.config.amountMax > 100) {
            throw new Error("amount of percentage only support 0 ~ 100");
        }
        console.log(`amount of percentage min: ${this.config.amountMin}`)
        console.log(`amount of percentage max: ${this.config.amountMax}`)
        resolve()
    })

    initBridge = () => new Promise<void>(async (resolve, reject) => {
        if (this.bridge != undefined) {
            this.config.bridges = this.bridge.split(',')
            console.log('bridge range ', this.config.bridges)
        } else {
            const bridgeValue: {value: string} = (await prompt({
                type: 'input',
                name: 'value',
                message: 'please enter range of bridge, empty is unrestricted'
            }))
            this.bridge = bridgeValue.value
            if (this.bridge != undefined && this.bridge != "") {
                this.config.bridges = this.bridge.split(',')
                console.log('bridge range ', this.config.bridges)
            } else {
                console.log('unrestricted bridge range')
            }
            
        }
        resolve()
    })

    initPrivateKey = () => new Promise<void>(async (resolve, reject) => {
        if (this.privateKey == undefined) {
            const pvKeyValue: {value: string} = (await prompt({
                type: 'input',
                name: 'value',
                message: 'please enter your private key for monkey test'
            }))
            this.privateKey = pvKeyValue.value
        }
        this.config.privateKey = this.privateKey

        const wallet = new ethers.Wallet(this.config.privateKey)

        console.log(`test wallet is: ${wallet.address}`)
        resolve()
    })

    initWebhook = () => new Promise<void>(async (resolve, reject) => {
        if (this.webhook == undefined) {
            const webhookValue: {value: string} = (await prompt({
                type: 'input',
                name: 'value',
                message: 'if you want to recevie monkey deal details, enter webhook url'
            }))
            this.webhook = webhookValue.value
        }
        this.config.webhook = this.webhook
        console.log(`webhook: ${this.config.webhook}`)
    })
}
