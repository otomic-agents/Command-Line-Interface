import { Listr, delay } from "listr2"
import AskActuator from "./AskActuator"
import { prompt } from 'enquirer';
import { ethers } from "ethers";
import { PreBusiness, Quote, Relay, SignData, business as Business, evm, utils, ResponseSolana, ResponseTransferOut } from "otmoic-software-development-kit";

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

    quote: Quote | undefined

    privateKeyForSign: string | undefined

    privateKeyForSend: string | undefined

    receivingAddress: string | undefined

    srcRpc: string | undefined

    dstRpc: string | undefined

    solanaUuid: string | undefined

    constructor (relayUrl: string | undefined, network: string | undefined, rpcs: string | undefined, 
        bridgeName: string | undefined, amount: string | undefined, privateKeyForSign: string | undefined,
        privateKeyForSend: string | undefined, receivingAddress: string | undefined) {

        this.privateKeyForSign = privateKeyForSign
        this.privateKeyForSend = privateKeyForSend
        this.receivingAddress = receivingAddress

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
        if (this.privateKeyForSign == undefined) {
            const pvKeyValue: {value: string} = (await prompt({
                type: 'input',
                name: 'value',
                message: 'please enter your private key for sign this deal'
            }))
            this.privateKeyForSign = pvKeyValue.value
        }
        resolve()
    })

    enterPrivateKeyForSend = () => new Promise<void>(async (resolve, reject) => {
        if (this.privateKeyForSend == undefined) {
            const keyType: { value: string} = await prompt({
                type: 'select',
                name: 'value',
                message: 'sender key is ?',
                choices: [{
                    name: 'same as signer',
                    value: ''
                }, {
                    name: 'enter a new key',
                    value: ''
                }]
            });
            // console.log('keyType', keyType.value)
            if (keyType.value == 'same as signer') {
                this.privateKeyForSend = this.privateKeyForSign
            } else {
                const pvKeyValue: {value: string} = (await prompt({
                    type: 'input',
                    name: 'value',
                    message: "please enter your SecToken sender's private key"
                }))
                this.privateKeyForSend = pvKeyValue.value
            }

        }
        resolve()
    })

    getSignerAddress = () => {
        if (this.privateKeyForSign == undefined) {
            throw new Error("private key for sign is undefined");
        }
        return new ethers.Wallet(this.privateKeyForSign).address
    }

    getSenderAddress = () => {
        if (this.privateKeyForSend == undefined) {
            throw new Error("private key for send is undefined");
        }
        return new ethers.Wallet(this.privateKeyForSend).address
    }

    enterAddress = () => new Promise<void>(async (resolve, reject) => {
        if (this.receivingAddress == undefined) {
            const keyType: { value: string} = await prompt({
                type: 'select',
                name: 'value',
                message: 'receiving address is ?',
                choices: [{
                    name: 'same as signer',
                    value: ''
                }, {
                    name: 'same as sender',
                    value: ''
                }, {
                    name: 'enter a new address',
                    value: ''
                }]
            });

            if (keyType.value == 'same as signer') {
                this.receivingAddress = this.getSignerAddress()
            } else if (keyType.value == 'same as sender') {
                this.receivingAddress = this.getSenderAddress()
            } else {
                const addressValue: {value: string} = (await prompt({
                    type: 'input',
                    name: 'value',
                    message: "please enter your wallet address, for receiving DstToken"
                }))
                this.receivingAddress = addressValue.value
            }

        }

        if(this.receivingAddress == 'signer') {
            this.receivingAddress = this.getSignerAddress()
        }

        if(this.receivingAddress == 'sender') {
            this.receivingAddress = this.getSenderAddress()
        }

        resolve()
    })

    sign = () => new Promise<{signData: SignData, signed: string}>(async (resolve, reject) => {
        if (this.network == undefined) {
            throw new Error("network is undefined");
        }
        if (this.quote == undefined) {
            throw new Error("quote is undefined");
        }
        if (this.amount == undefined) {
            throw new Error("amount is undefined");
        }
        if (this.receivingAddress == undefined) {
            throw new Error("receivingAddress is undefined");
        }
        if (this.privateKeyForSign == undefined) {
            throw new Error("privateKeyForSign is undefined");
        }

        this.srcRpc = this.rpcs[utils.GetChainName(this.quote.quote_base.bridge.src_chain_id).toLowerCase()]
        this.dstRpc = this.rpcs[utils.GetChainName(this.quote.quote_base.bridge.dst_chain_id).toLowerCase()]

        const signData: {signData: SignData, signed: string} = await Business.signQuoteByPrivateKey(this.network, this.quote, this.privateKeyForSign, this.amount, 0, this.receivingAddress, 
        undefined, this.srcRpc, this.dstRpc)

        resolve(signData)
    })

    

    run = () => new Promise<string>(async (resolve, reject) => {
        this.quote = await this.askActuator.run()
        
        this.initConfig()

        await this.enterPrivateKeyForSign()

        await this.enterPrivateKeyForSend()

        await this.enterAddress()

        if (this.relayUrl == undefined) {
            throw new Error("relay url is undefined");
        }
        const relay = new Relay(this.relayUrl)

        let signData: {signData: SignData, signed: string} | undefined = undefined
        let business: PreBusiness | undefined = undefined
        let step = 0

        let taskNow : any | undefined = undefined
        process.on('uncaughtException', (error: Error) => {
            if (taskNow != undefined) {
                taskNow.output = error.message
            }
        })
        process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
            if (taskNow != undefined) {
                taskNow.output = reason
            }
        })

        try {
            new Listr([{
                title: 'Sign Quote',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {
                    taskNow = task
                    task.output = 'signing...'
                    signData = await this.sign()
                    step = 1
                }
            }, {
                title: 'Submit Deal',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {
                    
                    while (step < 1) {   
                        await delay(500)
                    }
                    taskNow = task

                    task.output = 'submitting...'
                    
                    if (this.quote == undefined) {
                        throw new Error("quote is undefined");
                    }
                    if (signData == undefined) {
                        throw new Error("sign data is undefined");
                    }
                    
                    business = await relay.swap(this.quote, signData.signData, signData.signed)

                    if (!business) {
                        throw new Error(`failed to get business from relay: ${JSON.stringify(business)}`);
                    }
                    if (business.locked == false) {
                        throw new Error(`lp lock failed: ${JSON.stringify(business)}`);
                    }

                    task.title = `${task.title} -- preimage:${business.preimage}, hashlock evm:${business.hashlock_evm}, bidid:${business.hash}`

                    step = 2
                }
            }, {
                title: 'Lock SrcToken (transfer out)',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {
                    
                    while (step < 2) {   
                        await delay(500)
                    }
                    taskNow = task
                    
                    task.output = 'sending...'

                    if (business == undefined) {
                        throw new Error("business is undefined");
                    }

                    if (this.privateKeyForSend == undefined) {
                        throw new Error("sender private key is undefined");
                    }
                    
                    if (this.network == undefined) {
                        throw new Error("network is undefined");
                    }

                    const resp = await Business.transferOutByPrivateKey(business, this.privateKeyForSend, this.network, this.srcRpc)
                    if (utils.GetChainType(business.swap_asset_information.quote.quote_base.bridge.src_chain_id) == 'evm') {
                        task.title = `${task.title} -- ${(resp as ResponseTransferOut).transferOut.hash}`
                    } else if (utils.GetChainType(business.swap_asset_information.quote.quote_base.bridge.src_chain_id) == 'solana') {
                        task.title = `${task.title} -- ${(resp as ResponseSolana).txHash}`
                        this.solanaUuid = (resp as ResponseSolana).uuid
                    }

                    step = 3
                }
            }, {
                title: 'Wait lp lock DstToken (transfer in)',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {
                    
                    while (step < 3) {   
                        await delay(500)
                    }
                    taskNow = task

                    task.output = 'waiting...'

                    if (business == undefined) {
                        throw new Error("business is undefined");
                    }

                    let succeed = false

                    while (succeed == false) {

                        await delay(500)
                        const resp = await relay.getBusiness(business.hash)
                        succeed = resp.step >= 3
                        if (succeed) {
                            //get business data and show txhash
                        }
                    }

                    step = 4
                }
            }, {
                title: 'Release SrcToken (transfer out confirm)',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {
                    
                    while (step < 4) {   
                        await delay(500)
                    }
                    taskNow = task
                    
                    task.output = 'sending...'

                    if (business == undefined) {
                        throw new Error("business is undefined");
                    }
                    if (this.privateKeyForSend == undefined) {
                        throw new Error("sender private key is undefined");
                    }
                    if (this.network == undefined) {
                        throw new Error("network is undefined");
                    }

                    if (utils.GetChainType(business.swap_asset_information.quote.quote_base.bridge.src_chain_id) == 'evm') {
                        const resp = await Business.transferOutConfirmByPrivateKey(business, this.privateKeyForSend, this.network, this.srcRpc)
                        task.title = `${task.title} -- ${(resp as ethers.ContractTransactionResponse).hash}`
                    } else if (utils.GetChainType(business.swap_asset_information.quote.quote_base.bridge.src_chain_id) == 'solana') {
                        const resp = await Business.transferOutConfirmByPrivateKey(business, this.privateKeyForSend, this.network, this.srcRpc, this.solanaUuid!)
                        task.title = `${task.title} -- ${(resp as ResponseSolana).txHash}`
                    }

                    step = 5
                }
            }, {
                title: 'Wait lp release DstToken (transfer in confirm)',
                enabled: true,
                task: async(_: any, task: any): Promise<void> => {
                    
                    while (step < 5) {   
                        await delay(500)
                    }
                    taskNow = task

                    task.output = 'waiting...'

                    let succeed = false

                    if (business == undefined) {
                        throw new Error("business is undefined");
                    }

                    while (succeed == false) {

                        await delay(500)
                        const resp = await relay.getBusiness(business.hash)
                        succeed = resp.step >= 5
                        if (succeed) {
                            //get business data and show txhash
                        }
                    }

                    resolve('finished')
                }
            }]).run()

        } catch (error) {
            console.log(error)
            resolve('exchange failed')
            return 
        }

        
    })
}