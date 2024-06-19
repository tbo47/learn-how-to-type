export interface IProgress {
    level: number // 0, 1, 2, 3, 4
    step: number // a level has 4 steps
    input: string // the user input
    model: string // the model to type
    time: number // the time spent on the current step in milliseconds
}

export interface IExcercises {
    content: { title: string; content: string[] }[]
    finger_mapping: [number, string[]][]
}

export const LOCAL_STORAGE_KEY = 'typing-game-progress_01'
export type AppLocale = 'en' | 'fr'

export const downloadExcercises = async (locale = 'en') => {
    const resourceUrl = `assets/data-${locale}.json`
    try {
        const url = `${resourceUrl}?nocache=${Math.random()}`
        const raw = await fetch(url)
        const data = await raw.json()
        localStorage.setItem(resourceUrl, JSON.stringify(data))
        return data as IExcercises
    } catch (error) {
        const data = localStorage.getItem(resourceUrl)
        return JSON.parse(data!) as IExcercises
    }
}

export const postStat = async (d: { score: number; time: number; ts: number; locale: string }) => {
    try {
        const b = `https://www.learn-how-to-type.com/stat.php`
        await fetch(`${b}?score=${d.score}&time=${d.time}&ts=${d.ts}&locale=${d.locale}`)
    } catch (error) {}
}

export const getScore = ({ input, model, time }: { input: string; model: string; time: number }) => {
    const correct = input.split('').filter((char, index) => char === model[index])
    const score = Math.round((correct.length / model.length) * 100)
    return { score, time }
}

export const getVelocity = ({ input, time }: { input: string; time: number }) => {
    const n = input.split(' ')
    return (60 * Math.round((n.length * 10) / time)) / 10
}

export const onKeyEnter = (callback: () => void) => {
    const f = ({ key }: KeyboardEvent) => {
        if (key === 'Enter') {
            callback()
        }
    }
    document.addEventListener('keydown', f)
    return f
}

export const getScoreComment = (score: number, time: number) => {
    const not_enough = $localize`Start over to unlock the next level`
    const normal = $localize`Not bad`
    const good = $localize`Good job! 🎉🎉🎉`

    let comment = ''
    let canGoToNextStep = true
    if (score < 90 || time > 30) {
        canGoToNextStep = false
        comment = not_enough
    } else if (score < 95 || time > 15) {
        comment = normal
    } else {
        comment = good
    }
    return { comment, canGoToNextStep }
}
