import fetch, { Request } from 'node-fetch'
import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'
import { getRandomInt } from '../utils'

interface IComicsInfo {
    num: number
    img: string
    title: string
}

export default class ComicsCommand implements IBotCommand {
    private readonly CMD_REGEXP = /^\/(comics)(?: |$)/im
    private readonly API_URL = 'https://xkcd.com/info.0.json'
    private readonly TIMEOUT = 5000
    private _bot!: IBot

    public getHelp(): IBotCommandHelp {
        return { caption: '/comics', description: 'Fumetto casuale da xkcd.com.' }
    }

    public init(bot: IBot, dataPath: string): void {
        this._bot = bot
    }

    public isValid(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }

    public async process(msg: string, answer: IBotMessage): Promise<void> {
        try {
            const response = await fetch(this.API_URL, { timeout: this.TIMEOUT })
            const lastComicsInfo: IComicsInfo = await response.json()
            if (lastComicsInfo && lastComicsInfo.num > 0) {
                const comicsId = getRandomInt(1, lastComicsInfo.num)
                const url = `https://xkcd.com/${comicsId}/info.0.json`
                const response2 = await fetch(url, { timeout: this.TIMEOUT })
                const comicsInfo: IComicsInfo = await response2.json()
                answer.setTitle(comicsInfo.title)
                answer.setImage(comicsInfo.img)
                answer.setURL(`https://xkcd.com/${comicsId}/`)
            } else {
                answer.setTextOnly('Nessun dato')
            }
        } catch (ex) {
            this._bot.logger.warn(ex)
            answer.setTextOnly('Nessun dato')
        }
    }
}