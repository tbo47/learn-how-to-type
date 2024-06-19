import { Page } from 'puppeteer'
import { getBrowserState, getData, setupBrowserHooks, wait } from './utils'

const runPromisesInSeries = (ps: (() => Promise<void>)[]) =>
    ps.reduce((p: Promise<void>, next: () => Promise<void>) => p.then(next), Promise.resolve())

const testator = async (page: Page, l = 'fr', w = false) => {
    const data = (await getData(`src/assets/data-${l}.json`)) as { content: { content: string[] }[] }

    const excercises = data.content.reduce((acc: string[], { content }) => [...acc, ...content], [])

    const promisesInFunction = excercises.map((txt) => {
        return async () => {
            txt = txt.replaceAll('é', 'e').replaceAll('è', 'e').replaceAll('à', 'a').replaceAll('ç', 'c')
            await page.type('body', txt, { delay: w ? 120 : 0 })
            // await page.keyboard.press('Enter')
            const buttonDialogNext = await page.waitForSelector('#dialog-next')
            expect(buttonDialogNext).not.toBeNull()
            await wait(w ? 4 : 0)
            await buttonDialogNext!.click()
        }
    })
    await runPromisesInSeries(promisesInFunction)
    await wait(w ? 5 : 0)
}

xdescribe('Test the local version', () => {
    setupBrowserHooks('http://localhost:4200')
    it('is running', async () => {
        const { page } = getBrowserState()
        await testator(page, 'en', true)
    })
})

describe('Test the prod french version', () => {
    setupBrowserHooks('https://www.learn-how-to-type.com/fr/')
    it('is running', async () => {
        const { page } = getBrowserState()
        const element = await page.waitForSelector('text/Apprenez à taper au clavier')
        expect(element).not.toBeNull()
        await testator(page, 'fr', true)
    })
})

xdescribe('Test the prod english version', () => {
    setupBrowserHooks('https://www.learn-how-to-type.com/en/')
    it('is running', async () => {
        const { page } = getBrowserState()
        const element = await page.waitForSelector('text/Learn how to type')
        expect(element).not.toBeNull()
        await testator(page, 'en', false)
    })
})
