import { Quote, Relay, TranslatedBridge } from 'otmoic-software-development-kit';
import GetBridgeActuator from './GetBridgeActuator'
import { prompt } from 'enquirer';
import { Listr, delay } from 'listr2';
import Table from 'cli-table3'

export default class AskActuator {

    relayUrl: string | undefined

    network: string | undefined

    rpcs: {
        [key: string]: string
    } = {}

    bridgeName: string | undefined

    amount: string | undefined

    loading: boolean = false

    constructor (relayUrl: string | undefined, network: string | undefined, rpcs: string | undefined, 
        bridgeName: string | undefined, amount: string | undefined) {

        this.relayUrl = relayUrl
        this.network = network
        this.rpcs = rpcs == undefined ? {} : JSON.parse(rpcs)
        this.bridgeName = bridgeName
        this.amount = amount
    }

    initRelayUrl = async () => {
        if (this.relayUrl == undefined) {
            const relayUrlValue: { value: string} = (await prompt({
                type: 'input',
                name: 'value',
                message: 'Enter relay url',
            }))
            this.relayUrl = relayUrlValue.value
        }
        console.log('relayUrl', this.relayUrl)
    }

    initNetwork = async () => {
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
        console.log('network', this.network)
    }

    initChainRpc = async () => {
        if (Object.keys(this.rpcs).length == 0) {
            const configRpc: { value: boolean } = await prompt({
              type: 'toggle',
              name: 'value',
              message: 'Do you want to customize the rpc address?',
              enabled: 'Yes',
              disabled: 'No'
            });
            console.log('configRpc', configRpc)
            if (configRpc.value == true) {
              const rpcsValue: string = await prompt({
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
              this.rpcs = JSON.parse(rpcsValue)
            }
      
        }
    }

    run = () => new Promise<Quote>(async (resolve, reject) => {

        await this.initRelayUrl()
        await this.initNetwork()
        await this.initRelayUrl()

        if (this.relayUrl == undefined) {
            throw new Error("know error, relayUrl is undefined");
        }
        if (this.network == undefined) {
            throw new Error("know error, network is undefined");
        }

        const getBridge = new GetBridgeActuator(this.relayUrl, this.network, this.rpcs)
        const bridgeInfo = await getBridge.run()
        if (bridgeInfo == undefined) {
            throw new Error("get bridge info from relay failed");
        }

        const choosed = await this.chooseABridge(bridgeInfo)
        if (choosed == undefined) {
            throw new Error("no bridge selected");
        }

        await this.enterAmount()
        if (this.amount == undefined) {
            throw new Error("no amount entered");
        }

        const relay = new Relay(this.relayUrl)

        const quotes: Quote[] = []

        relay.ask({
            bridge: choosed,
            amount: this.amount
        }, {
            OnQuote: (quote: Quote) => {
                console.log('t789')
                for (const iterator of quotes) {
                    if (iterator.lp_info.name == quote.lp_info.name) {
                        return
                    }
                }
                quotes.push(quote)
            }
        })

        let choosedQuote = undefined

        while (choosedQuote == undefined) {

            await this.startLoading('Waiting for quotation...', true)

            choosedQuote = await this.chooseAQuote(quotes)
        }
        
        resolve(choosedQuote)
    })

    enterAmount = () => new Promise<void>(async (resolve, reject) => {
        if  (this.amount == undefined) {
            const amountValue: {value: string} = (await prompt({
                type: 'input',
                name: 'value',
                message: 'How many tokens do you want to exchange?'
            }))
            this.amount = amountValue.value
        }
        console.log('amount', this.amount)
        resolve()
    })

    chooseABridge = (bridgeInfo: TranslatedBridge[]) => new Promise<TranslatedBridge>(async (resolve, reject) => {
        const choices = []
        for (const iterator of bridgeInfo) {
            choices.push({
                name: `${iterator.srcChainName}-${iterator.src_token}(${iterator.srcTokenSymbol})-->${iterator.dstChainName}-${iterator.dst_token}(${iterator.dstTokenSymbol})`,
                value: ''
            })
        }
        if (this.bridgeName == undefined) {
            const bridgeValue: { value: string} = await prompt({
                type: 'select',
                name: 'value',
                message: 'Pick a bridge',
                choices: choices
            });
            this.bridgeName = bridgeValue.value
        }

        const [src, dst] = this.bridgeName.split('-->')
        const [srcChain, srcToken] = src.split('-')
        const [dstChain, dstToken] = dst.split('-')
        let choosed : TranslatedBridge | undefined = undefined
        for (const iterator of bridgeInfo) {
            if (srcChain == iterator.srcChainName &&
                srcToken == `${iterator.src_token}(${iterator.srcTokenSymbol})` &&
                dstChain == iterator.dstChainName &&
                dstToken == `${iterator.dst_token}(${iterator.dstTokenSymbol})`
            ) {
                choosed = iterator
            }
        }
        if (choosed == undefined) {
            throw new Error("no bridge selected");
        } else {
            console.log('choosed bridge', choosed)
            resolve(choosed)
        }

    })

    chooseAQuote = (quotes: Quote[]) => new Promise<Quote | undefined>(async (resolve, reject) => {
        const choices = []
        const table = new Table()
        table.push([
            'lp name', 
            'credit score',
            'price', 
            'capacity',
            'native token price',
            'native token min',
            'native token max',
            'need kyc',
            ])
        for (const iterator of quotes) {
            table.push([
                iterator.lp_info.name, 
                iterator.lp_info.credit_score,
                iterator.quote_base.price, 
                iterator.quote_base.capacity,
                iterator.quote_base.native_token_price,
                iterator.quote_base.native_token_min,
                iterator.quote_base.native_token_max,
                iterator.authentication_limiter.limiter_state,
                ])
            choices.push({
                name: `${iterator.lp_info.name}-${iterator.quote_base.price}`,
                value: ''
            })
        }

        console.log(table.toString());

        choices.push({
            name: 'Waiting for other quotes',
            value: ''
        })
        const quoteValue: { value: string} = await prompt({
            type: 'select',
            name: 'value',
            message: 'Pick a quote',
            choices: choices
        });

        if (quoteValue.value == 'Waiting for other quotes') {
            resolve(undefined)
        } else {
            for (const iterator of quotes) {
                if (`${iterator.lp_info.name}-${iterator.quote_base.price}` == quoteValue.value) {
                    resolve(iterator)
                }
            }
        }

    })

    startLoading = (message: string, autoStop: boolean) => new Promise<void>(async (resolve, reject) => {
        this.loading = true
        let times = 5
        
        await delay(500)
        try {
            await new Listr([
                {
                    title: message,
                    enabled: true,
                    task: async(_: any, task: any): Promise<void> => {
                        
                        while (this.loading) {
                            
                            task.output = `${times}...`
                            await delay(1000)
                            times--

                            if (autoStop) {
                                if (times == 0) {
                                    this.stopLoading()
                                }
                            }

                        }
                        resolve()
                    }
                }
            ]).run()
        } catch (error) {
            console.error(error)
        }
    })

    stopLoading = () => {
        this.loading = false
    }

}