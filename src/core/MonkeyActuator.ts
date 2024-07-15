import { prompt } from 'enquirer';
import { ethers } from "ethers";
import { Listr, delay } from 'listr2';
import { Bridge, PreBusiness, Quote, Relay, SignData, assistive, evm, utils, business as Business, ResponseTransferOut, ResponseSolana } from 'otmoic-software-development-kit';
import Bignumber from 'Bignumber.js'
import needle from 'needle'
import { title } from 'process';

function getRandomNumberInRange(n: number, m: number): number {
    return Math.floor(Math.random() * (m - n + 1) + n);
}

interface Config {
    
    intervalMin: number

    intervalMax: number

    relayUrl: string

    rpcs: {
        [key: string]: string
    }

    amountMin: number

    amountMax: number

    bridges: string[]

    privateKey: string

    receivingAddress: string

    webhook: string

    type: string[]

    complaint: string[]

    lp: string

    network: string
}

interface DealInfo {

    bridge: Bridge | undefined

    amount: string | undefined

    type: string | undefined

    complaint: boolean | undefined

    quote: Quote | undefined

    business: PreBusiness | undefined

    srcRpc: string | undefined

    dstRpc: string | undefined

    signData: {
        signData: SignData, 
        signed: string
    } | undefined

    uuid: string | undefined
}

export default class MonkeyActuator {

    interval: string | undefined

    relay: string | undefined

    amount: string | undefined

    bridge: string | undefined

    privateKey: string | undefined

    webhook: string | undefined

    type: string | undefined

    complaint: string | undefined

    lp: string | undefined

    network: string | undefined

    rpcs: {
        [key: string]: string
    } = {}

    taskList: Listr | undefined

    config: Config = {
        intervalMin: 0,
        intervalMax: 0,
        relayUrl: '',
        amountMin: 0,
        amountMax: 0,
        bridges: [],
        privateKey: '',
        receivingAddress: '',
        webhook: '',
        type: [],
        complaint: [],
        lp: '',
        network: '',
        rpcs: {}
    }

    constructor(interval: string | undefined, relay: string | undefined, amount: string | undefined, 
        bridge: string | undefined, privateKey: string | undefined, webhook: string | undefined, 
        type: string | undefined, complaint: string | undefined, lp: string | undefined, 
        network: string | undefined, rpcs: string | undefined) {

        this.interval = interval
        this.relay = relay
        this.amount = amount
        this.bridge = bridge
        this.privateKey = privateKey
        this.webhook = webhook
        this.type = type
        this.complaint = complaint
        this.lp = lp
        this.network = network
        this.rpcs = rpcs == undefined ? {} : JSON.parse(rpcs)
    }

    run = () => new Promise<void>(async (resolve, reject) => {

        await this.initNetwork()
        await this.initRelay()
        await this.initChainRpc()
        await this.initInterval()
        await this.initAmount()
        await this.initBridge()
        await this.initPrivateKey()
        await this.initWebhook()
        await this.initType()
        await this.initLP()

        console.log('config', this.config)

        this.tick()
    })

    tick = () => new Promise<void>(async (resolve, reject) => {
        
        let taskNow : any | undefined = undefined
        process.on('uncaughtException', (error: Error) => {
            if (taskNow != undefined) {
                try {
                    taskNow.output = error.message
                } catch (error) {
                    
                }
            }
        })
        process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
            if (taskNow != undefined) {
                try {
                    taskNow.output = reason
                } catch (error) {
                    
                }
                
            }
        })

        const relay = new Relay(this.config.relayUrl);

        const dealInfo: DealInfo = {
            bridge: undefined,
            amount: undefined,
            complaint: undefined,
            type: undefined,
            quote: undefined,
            business: undefined,
            srcRpc: undefined,
            dstRpc: undefined,
            signData: undefined,
            uuid: undefined
        }

        try {
            this.taskList = new Listr([
                {
                    title: 'check timeout',
                    enabled: true,
                    task: async(_: any, task: any): Promise<void> => {

                        const interval = getRandomNumberInRange(this.config.intervalMin, this.config.intervalMax)

                        let startTime = Date.now()

                        while ((startTime + interval * 1000) > Date.now()) {
                            await delay(1000)
                        }


                        setTimeout(this.tick, 5000)

                        if (this.taskList != undefined) {
                        
                            this.callWebHookFailed(taskNow, relay, dealInfo)

                            throw new Error("task timeout");
                        }
                
                            
                    },
                },
                {
                    title: 'tick',
                    enabled: true,
                    task: (_: any, task: any): Listr => task.newListr([
                        {
                            title: 'random bridge',
                            enabled: true,
                            task: async(_: any, task: any): Promise<void> => {
                                taskNow = task
                                
                                let finished = false
                                this.taskRandomBridge(task, relay, dealInfo)
                                    .then(() => finished = true)
                                while (finished == false) {
                                    await delay(100)
                                }
                                
                            }
                        },
                        {
                            title: 'random deal',
                            enabled: true,
                            task: async(_: any, task: any): Promise<void> => {
                                
                                taskNow = task
        
                                let finished = false
                                this.taskRandomDeal(task, dealInfo)
                                    .then(() => finished = true)
                                while (finished == false) {
                                    await delay(100)
                                }
        
                            }
                        },
                        {
                            title: 'submit deal',
                            enabled: true,
                            task: async(_: any, task: any): Promise<void> => {
                                
                                taskNow = task
        
                                let finished = false
                                this.taskSubmitDeal(task, relay, dealInfo)
                                    .then(() => finished = true)
                                while (finished == false) {
                                    await delay(100)
                                }
                                
                            }
                        },
                        {
                            title: 'exchange',
                            enabled: true,
                            task: (_: any, task: any): Listr => task.newListr([
                                {
                                    title: 'tx out',
                                    enable: true,
                                    task: async(_: any, task: any): Promise<void> => {
                                        
                                        taskNow = task
        
                                        let finished = false
                                        this.taskExchangeTxOut(task, dealInfo)
                                            .then(() => finished = true)
                                        while (finished == false) {
                                            await delay(100)
                                        }
        
                                    }
                                },
                                {
                                    title: 'tx in',
                                    enable: true,
                                    task: async(_: any, task: any): Promise<void> => {
                                        
                                        taskNow = task
        
                                        let finished = false
                                        this.taskExchangeTxIn(task, relay, dealInfo)
                                            .then(() => finished = true)
                                        while (finished == false) {
                                            await delay(100)
                                        }
        
                                    }
                                },
                                {
                                    title: 'tx out confirm',
                                    enable: true,
                                    task: async(_: any, task: any): Promise<void> => {
                                        
                                        if (dealInfo.type == 'succeed') {
                                            taskNow = task
        
                                            let finished = false
                                            this.taskExchangeTxOutCfm(task, dealInfo)
                                                .then(() => finished = true)
            
                                            while (finished == false) {
                                                await delay(100)
                                            }
                                        } else {

                                            if (dealInfo.type == 'cheat txin') {
                                                taskNow = task
        
                                                let finished = false
                                                this.cheatExchangeTxInCfm(task, dealInfo)
                                                    .then(() => finished = true)
                
                                                while (finished == false) {
                                                    await delay(100)
                                                }
                                            } else {
                                                task.title = `${task.title} -- type ${dealInfo.type} skip this task`
                                            }

                                            
                                        }
                                        
                                        
                                    }
                                },
                                {
                                    title: 'tx in confirm',
                                    enable: true,
                                    task: async(_: any, task: any): Promise<void> => {
                                        
                                        if (dealInfo.type == 'succeed') {
                                            taskNow = task
        
                                            let finished = false
                                            this.taskExchangeTxInCfm(task, relay, dealInfo)
                                                .then(() => finished = true)
            
                                            while (finished == false) {
                                                await delay(100)
                                            }
                                        } else {
                                            task.title = `${task.title} -- type ${dealInfo.type} skip this task`
                                        }
                                        
        
                                    }
                                },
                                {
                                    title: 'tx out refund',
                                    enable: true,
                                    task: async(_: any, task: any): Promise<void> => {
                                        if (dealInfo.type != 'succeed') {
                                            
                                            taskNow = task
        
                                            let finished = false
                                            this.taskExchangeTxOutRefund(task, dealInfo)
                                                .then(() => finished = true)
            
                                            while (finished == false) {
                                                await delay(100)
                                            }
                                        } else {
                                            task.title = `${task.title} -- type ${dealInfo.type} skip this task`
                                        }
                                    }
                                },
                                {
                                    title: 'tx in refund',
                                    enable: true,
                                    task: async(_: any, task: any): Promise<void> => {
                                        if (dealInfo.type != 'succeed') {
                                            taskNow = task
                                            
                                            let finished = false
                                            this.taskExchangeTxInRefund(task, relay, dealInfo)
                                                .then(() => finished = true)
            
                                            while (finished == false) {
                                                await delay(100)
                                            }
                                        } else {
                                            task.title = `${task.title} -- type ${dealInfo.type} skip this task`
                                        }
        
                                    }
                                },
                                {
                                    title: 'complaint',
                                    enable: true,
                                    task: async(_: any, task: any): Promise<void> => {
                                        taskNow = task

                                        if (dealInfo.type?.startsWith('cheat')) {

                                            if (dealInfo.complaint == true) {

                                                await this.taskExchangeComplaint(dealInfo)
                                            }
                                        }

                                        this.callWebHookSucceed(task, relay, dealInfo)

                                        this.taskList = undefined
                                    }
                                }
                            ], {
                                rendererOptions: { collapseSubtasks: false },
                                exitOnError: true,
                                concurrent: false,
                            })
                        },
                    ], {
                        rendererOptions: { collapseSubtasks: false },
                        exitOnError: true,
                        concurrent: false,
                    })
                }

                
            ], {
                concurrent: true,
                rendererOptions: { collapseSubtasks: false },
                exitOnError: true
            })
            this.taskList.run()
        } catch (error) {
            console.error(error)
        }



    })

    callWebHookSucceed = (task: any, relay: Relay, dealInfo: DealInfo) => new Promise<void>((resolve, reject) => {
        if (this.config.webhook != undefined) {
            needle('post', this.config.webhook, {
                state: 'succeed',
                relay: relay.relayUrl,
                bridge: dealInfo.business?.swap_asset_information.quote.quote_base.bridge.bridge_name,
                amount: dealInfo.business?.swap_asset_information.amount,
                type: `test flow: ${dealInfo.type}`,
            })
        }
    })

    callWebHookFailed = (task: any, relay: Relay, dealInfo: DealInfo) => new Promise<void>((resolve, reject) => {
        if (this.config.webhook != undefined) {
            needle('post', this.config.webhook, {
                state: 'failed',
                relay: relay.relayUrl,
                bridge: dealInfo.business?.swap_asset_information.quote.quote_base.bridge.bridge_name,
                amount: dealInfo.business?.swap_asset_information.amount,
                type: `test flow: ${dealInfo.type}`,
                messageTitle: task.title,
                messageData:  task.output
            })
        }
    })

    taskRandomBridge = (task: any, relay: Relay, dealInfo: DealInfo) => new Promise<void>(async (resolve, reject) => {

        task.output = `fetch bridge from ${this.config.relayUrl}`
        const bridgeList: Bridge[] = (await relay.getBridge()).filter(bridge => {
            if (this.config.bridges.length == 0) {
                return true
            } else {
                for (const b of this.config.bridges) {
                    if (`${bridge.src_chain_id}-${bridge.src_token}--->${bridge.dst_chain_id}-${bridge.dst_token}` == b) {
                        return true
                    } else {
                        return false
                    }
                }
            }
        }).filter(b => (b.src_chain_id != 501 && b.dst_chain_id != 501))

        task.output = `bridge size: ${bridgeList.length}, check token balance`

        const enoughList: Bridge[] = []

        for (const b of bridgeList) {
            if (await this.isBalanceEnough(b)) {
                enoughList.push(b)
            } 
        }

        task.output = `enough balance bridge size: ${bridgeList.length}`

        if (enoughList.length == 0) {
            throw new Error("no bridge can test");
        }

        dealInfo.bridge = enoughList[getRandomNumberInRange(0, enoughList.length - 1)]

        task.title = `${task.title} --- (${dealInfo.bridge.src_chain_id}-${dealInfo.bridge.src_token}--->${dealInfo.bridge.dst_chain_id}-${dealInfo.bridge.dst_token})`

        await delay(50)
        resolve()
    })

    taskRandomDeal = (task: any, dealInfo: DealInfo) => new Promise<void>(async (resolve, reject) => {
        task.output = 'randoming...'

        if (dealInfo.bridge == undefined) {
            throw new Error("bridge is undefined");
        }
        
        const balance = await this.getBalance(dealInfo.bridge)
        dealInfo.amount = balance.times(getRandomNumberInRange(this.config.amountMin, this.config.amountMax)).div(100).toFixed(8)

        dealInfo.type = this.config.type[getRandomNumberInRange(0, this.config.type.length - 1)]
        dealInfo.complaint = 'true' == this.config.complaint[getRandomNumberInRange(0, this.config.complaint.length - 1)]

        task.title = `${task.title} --- (amount:${dealInfo.amount}) --- (type:${dealInfo.type})`

        await delay(50)
        resolve()
    })

    taskSubmitDeal = (task: any, relay: Relay, dealInfo: DealInfo) => new Promise<void>(async (resolve, reject) => {
        if (dealInfo.bridge == undefined) {
            throw new Error("bridge is undefined");
        }
        if (dealInfo.amount == undefined) {
            throw new Error("amount is undefined");
            
        }

        let askFinished = false
        const askTime = Date.now()
        task.output = 'ask...'

        relay.ask({
            bridge: dealInfo.bridge,
            amount: dealInfo.amount
        }, {
            OnQuote: (quote: Quote) => {
                if (this.config.lp == undefined || this.config.lp == '') {
                    dealInfo.quote = quote
                } else {
                    if (quote.lp_info.name == this.config.lp) {
                        dealInfo.quote = quote
                    }
                }
                if (dealInfo.quote != undefined) {
                    askFinished = true
                }
            }
        })

        while (askFinished == false) {
            if (Date.now() - askTime > 1000 * 60 * 5) {
                throw new Error("get quote failed");
            }
            await delay(500)
        }

        task.output = 'signing...'

        if (dealInfo.quote == undefined) {
            throw new Error("quote is undefined");
        }

        dealInfo.srcRpc = this.config.rpcs[utils.GetChainName(dealInfo.quote.quote_base.bridge.src_chain_id).toLowerCase()]
        dealInfo.dstRpc = this.config.rpcs[utils.GetChainName(dealInfo.quote.quote_base.bridge.dst_chain_id).toLowerCase()]

        task.output = 'submitting...'

        dealInfo.signData = 
            await Business.signQuoteByPrivateKey(
                this.config.network, dealInfo.quote, this.config.privateKey, dealInfo.amount, 0, 
                this.config.receivingAddress, undefined, dealInfo.srcRpc, dealInfo.dstRpc)
        
        dealInfo.business = await relay.swap(dealInfo.quote, dealInfo.signData.signData, dealInfo.signData.signed)

        if (dealInfo.business.locked == false) {
            throw new Error(`lp lock failed: ${JSON.stringify(dealInfo.business)}`);
        }

        task.title = `${task.title} -- (bidid:${dealInfo.business.hash})`

        await delay(50)
        resolve()
    })

    taskExchangeTxOut = (task: any, dealInfo: DealInfo) => new Promise<void>(async (resolve, reject) => {
        task.output = 'sending...'

        if (dealInfo.business == undefined) {
            throw new Error("business is undefined");
        }

        if(dealInfo.type == 'cheat amount') {
            const dArr = dealInfo.business.swap_asset_information.amount.split('.')
            const d = dArr.length == 2 ? [dArr].length : 0
            dealInfo.business.swap_asset_information.amount = new Bignumber(dealInfo.business.swap_asset_information.amount).times(0.8).toFixed(d)
        }

        if (dealInfo.type == 'cheat address') {
            dealInfo.business.swap_asset_information.quote.quote_base.lp_bridge_address = dealInfo.business.swap_asset_information.sender
        }

        const resp = await Business.transferOutByPrivateKey(dealInfo.business, this.config.privateKey, 
            this.config.network, dealInfo.srcRpc)

        if (utils.GetChainType(dealInfo.business.swap_asset_information.quote.quote_base.bridge.src_chain_id) == 'evm') {
            task.title = `${task.title} -- ${(resp as ResponseTransferOut).transferOut.hash}`
        } else if (utils.GetChainType(dealInfo.business.swap_asset_information.quote.quote_base.bridge.src_chain_id) == 'solana') {
            task.title = `${task.title} -- ${(resp as ResponseSolana).txHash}`
            dealInfo.uuid = (resp as ResponseSolana).uuid
        }

        await delay(50)
        resolve()
    })

    taskExchangeTxIn = (task: any, relay: Relay, dealInfo: DealInfo) => new Promise<void>(async (resolve, reject) => {
        task.output = 'waiting...'

        if (dealInfo.business == undefined) {
            throw new Error("business is undefined");
        }

        let succeed = false

        while (succeed == false) {

            await delay(500)
            const resp = await relay.getBusiness(dealInfo.business.hash)
            succeed = resp.step >= 3
            if (succeed) {
                //get business data and show txhash
            }
        }

        resolve()
    })

    taskExchangeTxOutCfm = (task: any, dealInfo: DealInfo) => new Promise<void>(async (resolve, reject) => {
        task.output = 'sending...'

        if (dealInfo.business == undefined) {
            throw new Error("business is undefined");
        }

        if (utils.GetChainType(dealInfo.business.swap_asset_information.quote.quote_base.bridge.src_chain_id) == 'evm') {
            const resp = await Business.transferOutConfirmByPrivateKey(dealInfo.business, this.config.privateKey, this.config.network, dealInfo.srcRpc)
            task.title = `${task.title} -- ${(resp as ethers.ContractTransactionResponse).hash}`
        } else if (utils.GetChainType(dealInfo.business.swap_asset_information.quote.quote_base.bridge.src_chain_id) == 'solana') {
            const resp = await Business.transferOutConfirmByPrivateKey(dealInfo.business, this.config.privateKey, this.config.network, dealInfo.srcRpc, dealInfo.uuid!)
            task.title = `${task.title} -- ${(resp as ResponseSolana).txHash}`
        }
        
        await delay(50)
        resolve()
    })

    cheatExchangeTxInCfm = (task: any, dealInfo: DealInfo) => new Promise<void>((resolve, reject) => {
        // TODO FIXME
        resolve()
    })

    taskExchangeTxInCfm = (task: any, relay: Relay, dealInfo: DealInfo) => new Promise<void>(async (resolve, reject) => {
        task.output = 'waiting...'

        let succeed = false

        if (dealInfo.business == undefined) {
            throw new Error("business is undefined");
        }

        while (succeed == false) {

            await delay(500)
            const resp = await relay.getBusiness(dealInfo.business.hash)
            succeed = resp.step >= 5
            if (succeed) {
                //get business data and show txhash
            }
        }
        resolve()
    })

    taskExchangeTxOutRefund = (task: any, dealInfo: DealInfo) => new Promise<void>(async (resolve, reject) => {
        task.output = 'checking...'

        if (dealInfo.business == undefined) {
            throw new Error("business is undefined");
        }

        let canDo = false
        while (canDo == false) {
            await delay(1000)

            canDo = Date.now() > ((dealInfo.business.swap_asset_information.agreement_reached_time + dealInfo.business.swap_asset_information.step_time_lock * 7) * 1000)
            
            task.output = `can refund: ${canDo}, now: ${Date.now()}, time lock: ${(dealInfo.business.swap_asset_information.agreement_reached_time + dealInfo.business.swap_asset_information.step_time_lock * 7) * 1000}`
        }

        if (utils.GetChainType(dealInfo.business.swap_asset_information.quote.quote_base.bridge.src_chain_id) == 'evm') {
            const resp = await Business.transferOutRefundByPrivateKey(dealInfo.business, this.config.privateKey, this.config.network, dealInfo.srcRpc)
            task.title = `${task.title} -- ${(resp as ethers.ContractTransactionResponse).hash}`
        } else if (utils.GetChainType(dealInfo.business.swap_asset_information.quote.quote_base.bridge.src_chain_id) == 'solana') {
            const resp = await Business.transferOutRefundByPrivateKey(dealInfo.business, this.config.privateKey, this.config.network, dealInfo.srcRpc, dealInfo.uuid!)
            task.title = `${task.title} -- ${(resp as ResponseSolana).txHash}`
        }

        await delay(50)

        resolve()
    })

    taskExchangeTxInRefund = (task: any, relay: Relay, dealInfo: DealInfo) => new Promise<void>(async (resolve, reject) => {
        task.output = 'waiting...'

        let succeed = false

        if (dealInfo.business == undefined) {
            throw new Error("business is undefined");
        }

        while (succeed == false) {

            await delay(500)
            const resp = await relay.getBusiness(dealInfo.business.hash)
            succeed = resp.step >= 7
            if (succeed) {
                //get business data and show txhash
            }
        }
        resolve()
    })

    taskExchangeComplaint = (dealInfo: DealInfo) => new Promise<void>((resolve, reject) => {
        // TODO FIXME otmoic
        resolve()
    })

    initNetwork = () => new Promise<void>(async (resolve, reject) => {
        if (this.network == undefined || (this.network != 'mainnet' && this.network != 'testnet')) {
            const netValue: { value: string} = await prompt({
                type: 'select',
                name: 'value',
                message: 'Pick network',
                choices: [
                    { name: 'mainnet', value: 'mainnet' },
                    { name: 'testnet', value: 'testnet' },
                ]
            });
            this.network = netValue.value
        }
        this.config.network = this.network
        console.log('network', this.config.network)

        resolve()
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
            this.relay = relayUrlValue.value
        }
        this.config.relayUrl =  this.relay
        console.log('relay url:', this.config.relayUrl)

        resolve()
    })

    initChainRpc = async () => {
        if (Object.keys(this.rpcs).length == 0) {
            const configRpc: { value: boolean } = await prompt({
              type: 'toggle',
              name: 'value',
              message: 'Do you want to customize the rpc address?',
              enabled: 'Yes',
              disabled: 'No'
            });
            console.log('configRpc', configRpc.value)
            if (configRpc.value == true) {
              const rpcsValue: any = await prompt({
                name: 'ConfigRPSC',
                type: 'snippet',
                message: 'enter your rpc url',
                required: true,
                template: `{
                  bsc: #{bsc_rpc_url},
                  opt: #{opt_rpc_url}
                }`
              })
      
              
              console.log('rpcsValue', rpcsValue)
              this.rpcs = {
                bsc: rpcsValue.ConfigRPSC.values.bsc_rpc_url,
                opt: rpcsValue.ConfigRPSC.values.opt_rpc_url
              }
            }
      
        }
        this.config.rpcs = this.rpcs
        console.log('rpcsValue', this.config.rpcs)
    }

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
            if (this.bridge == '') {
                this.config.bridges = []
            } else {
                this.config.bridges = this.bridge.split(',')
            }
            
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
        this.config.receivingAddress = wallet.address

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
        resolve()
    })

    initType = () => new Promise<void>(async (resolve, reject) => {
        if (this.type == undefined) {
            const typeValue: {value: string[]} = await prompt({
                type: 'multiselect',
                name: 'value',
                message: 'Select the deal status you want to test.',
                choices: [
                    { name: 'succeed', value: 'succeed'},
                    { name: 'refund', value: 'refund'},
                    { name: 'cheat amount', value: 'cheat amount'},
                    { name: 'cheat address', value: 'cheat address'},
                    { name: 'cheat txin', value: 'cheat txin'}
                ]
            })
            this.config.type = typeValue.value
        } else {
            this.config.type = this.type.split(',')
        }

        for (const iterator of this.config.type) {
            if(iterator != 'succeed' && iterator != 'refund' && iterator != 'cheat amount' 
                && iterator != 'cheat address' && iterator != 'cheat txin'
            ) {
                throw new Error(`unknow type: ${iterator}`);
            }
        }
        console.log(`type:`, this.config.type)

        if (this.complaint == undefined) {
            const complaintValue: {value: string[]} = await prompt({
                type: 'multiselect',
                name: 'value',
                message: 'Select the deal complaint you want to test.',
                choices: [
                    { name: 'true', value: 'true'},
                    { name: 'false', value: 'false'}
                ]
            })
            this.config.complaint = complaintValue.value 
        } else {
            this.config.complaint = this.complaint.split(',')
        }
        console.log(`complaint:`, this.config.complaint)

        resolve()
    })

    initLP = () => new Promise<void>(async (resolve, reject) => {
        if (this.lp == undefined) {
            const lpValue: {value: string} = (await prompt({
                type: 'input',
                name: 'value',
                message: 'enter lp name for test, empty is unrestricted'
            }))
            this.lp = lpValue.value
        }
        if (this.lp != undefined && this.lp != "") {
            this.config.lp = this.lp
            console.log('lp ', this.config.lp)
        } else {
            console.log('unrestricted lp')
        }
        resolve()
    })

    isBalanceEnough = (bridge: Bridge) => new Promise<boolean>(async (resolve, reject) => {
        
        const balance = await assistive.GetBalance(bridge, this.config.receivingAddress, this.config.network, 
            this.config.rpcs[utils.GetChainName(bridge.src_chain_id).toLowerCase()])
        if (parseFloat(balance) > 0) {
            resolve(true)
        } else {
            resolve(false)
        }
    })

    getBalance = (bridge: Bridge) => new Promise<Bignumber>(async (resolve, reject) => {
        const balance = await assistive.GetBalance(bridge, this.config.receivingAddress, this.config.network, 
            this.config.rpcs[utils.GetChainName(bridge.src_chain_id).toLowerCase()])
        resolve(new Bignumber(balance))
    })
}
