import * as puppeteer from 'puppeteer'

let browser: puppeteer.Browser
let page: puppeteer.Page

export function setupBrowserHooks(url: string) {
    beforeAll(async () => {
        browser = await puppeteer.launch({
            // headless: 'new',
            headless: false,
            ignoreHTTPSErrors: true,
            args: [`--window-size=1920,1080`],
            defaultViewport: {
                width: 1920,
                height: 1080,
            },
        })
    })

    beforeEach(async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1_000_000
        page = await browser.newPage()
        await page.goto(url)
    })

    afterEach(async () => {
        await page.close()
    })

    afterAll(async () => {
        await browser.close()
    })
}

export function getBrowserState(): {
    browser: puppeteer.Browser
    page: puppeteer.Page
} {
    if (!browser) {
        throw new Error('No browser state found! Ensure `setupBrowserHooks()` is called.')
    }
    return {
        browser,
        page,
    }
}

export function wait(s: number) {
    return new Promise((resolve) => setTimeout(resolve, s * 1_000))
}

const fs = require('fs')

export const getData = (file: any) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err: any, data: any) => {
            if (err) return reject(err)
            try {
                const json = JSON.parse(data)
                resolve(json)
            } catch (E) {
                reject(E)
            }
        })
    })
}
