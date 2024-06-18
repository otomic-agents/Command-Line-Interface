import { Level } from 'level'
import puppeteer from 'puppeteer';

export interface Logger {
    log(message: string): void;
}

const getBrowser = async () => {
    // const browser = await puppeteer.connect({
    //     browserWSEndpoint: 'ws://127.0.0.1:3000',
    // })

    // local browser need use <page.waitForNavigation()>
    const browser = await puppeteer.launch({
        headless: true
    });
    return browser
}

const getTotalNumber = (totalStr: string) => {
    const numberPattern = /\d+/; 
    const match = totalStr.match(numberPattern);
    if (match) {
        const number = parseInt(match[0], 10); 
        return number
    } else {
        return -1
    }
}

const getPageSize = (pageSizeStr: string) => {
    const pageSizeStrs = pageSizeStr.split('of')
    if (pageSizeStrs.length > 1) {
        const number = parseInt(pageSizeStrs[1], 10); 
        return number
    } else {
        return -1
    }
}

const getExplorerUrl = (chain: string) => {
    switch (chain) {
        case 'BSC':
            return 'https://bscscan.com'
        case 'OPT':
            return 'https://optimistic.etherscan.io'
        default:
            break;
    }
}

export default class ReportForms {

    syncData: boolean = false

    createReportForms: boolean = false

    path: string = __dirname

    wallets: string[] = []

    chains: string[] = []

    taskAndState: any = [
        {
            taskName: 'check & create db',
            state: 'pending',
            subTask: []
        },
        {
            taskName: 'sync data',
            state: 'pending',
            subTask: []
        }
    ]

    logger: Logger | undefined = undefined

    db: Level | undefined = undefined

    constructor(syncData: boolean, createReportForms: boolean, path: string, wallets: string[], chains: string[], logger: Logger | undefined) {
        this.syncData = syncData
        this.createReportForms = createReportForms
        this.path = path == undefined ? this.path : path
        this.wallets = wallets
        this.logger = logger
        this.chains = chains

        for (const w of this.wallets) {
            for (const c of this.chains) {
                this.taskAndState[1].subTask.push({
                    wallet: w,
                    chain: c,
                    taskName: `${c} - ${w}`,
                    state: 'pending',
                    subTask: [{
                        taskName: 'sync txs',
                        state: 'pending'
                    }, {
                        taskName: 'sync tx deatils',
                        state: 'pending'
                    }]
                })
            }
        }



    }

    start = async () => {
        if (this.syncData) {
            await this.doSyncData()
        }
        if (this.createReportForms) {
            await this.doCreateReportForms()
        }
    }

    doSyncData = () => new Promise<void>(async (resolve, reject) => {
        //check db exist
        this.taskAndState[0].state = 'running'
        try {
            this.db = new Level(this.path, { valueEncoding: 'json' })
        } catch (error: any) {
            this.logger?.log('open db failed:' + error.message)
            return
        }
        
        this.taskAndState[0].state = 'finished'

        //sync data
        this.taskAndState[1].state = 'running'

        for (const stLevel1 of this.taskAndState[1].subTask) {
            stLevel1.state = 'running'
            stLevel1.subTask[0].state = 'running'
            await this.getTxs(stLevel1.wallet, stLevel1.chain);
        } 


    })

    doCreateReportForms = () => new Promise<void>((resolve, reject) => {
        
    })

    onCloseDB = async () => {
        if (this.db != undefined) {
            await this.db.close()
            this.logger?.log('db closed')
        }
    }

    getTxs = async (wallet: string, chain: string) => {
        const browser = await getBrowser()
        let page = await browser.newPage()
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.152 Safari/537.36');

        await page.goto(`${getExplorerUrl(chain)}/txs?a=${wallet}`)
    
        
        //get total
        this.logger?.log('get total')
        
        try {
            await page.waitForNavigation({ timeout: 3000 })
        } catch (error) {
            this.logger?.log('waitForNavigation not end')
        }
        await page.screenshot({ path: 'screenshot-step-total.png' });

        const totalBox = await page.waitForSelector('#ContentPlaceHolder1_divDataInfo');
        const total = await totalBox?.waitForSelector('.content-center')
        if (total == undefined || total == null ) {
            this.logger?.log('total not found')
            return
        }

        const totalStr = await page.evaluate(total => total.textContent, total)
        if (totalStr == undefined || total == null) {
            this.logger?.log('get total string error')
            return 
        } else {
            this.logger?.log(totalStr)
        }

        const totalNum = getTotalNumber(totalStr)
        if (totalNum == -1) {
            this.logger?.log('total string format error')
            return
        }

        //get list
        // this.logger?.log('get list')
        const paginationBox = await page.waitForSelector('.pagination')
        const pageSizeStr = await page.evaluate((pagination) => {
            if (pagination == undefined || pagination == null) {
                this.logger?.log('paginationBox not found')
                return
            }

            const thirdChild = pagination.children[2];
            const firstChildOfThird = thirdChild.children[0];
            return firstChildOfThird.textContent;
        }, paginationBox);

        if (pageSizeStr == undefined || pageSizeStr == null) {
            this.logger?.log('get pageSizeStr failed')
            return
        }

        const pageSize = getPageSize(pageSizeStr)
        this.logger?.log(pageSize + '')
        
    }
}