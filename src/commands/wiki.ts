import fetch, { Request } from 'node-fetch'
import * as qs from 'querystring'
import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

interface IWikiList { [key: string]: { fullurl: string } }

export default class WikiCommand implements IBotCommand {
    private readonly API_URL = '.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&format=json&titles='
    private readonly CMD_REGEXP = /^(wiki|w)(?: |$)/im
    private readonly TIMEOUT = 5000
    private _bot!: IBot

    public getHelp(prefix: string): IBotCommandHelp {
        return {
            caption: prefix + 'wiki ' + prefix + 'w {parola chiave}',
            description: 'Ricerca Wikipedia: /wiki /w - in italiano.'
        }
    }

    public init(bot: IBot, dataPath: string): void {
        this._bot = bot
    }

    public isValid(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }

    public async process(prefix: string, msg: string, answer: IBotMessage): Promise<void> {
        const matches = msg.match(this.CMD_REGEXP)!
        const keywords = msg.substr(matches[0].length).trim()
        if (!keywords) {
            answer.setTextOnly('indica parole chiave')
            return
        }
        const cmd = matches[1].toLowerCase()
        const lang = 'it'
        try {
            const url = `https://${lang}${this.API_URL}${qs.escape(keywords)}`
            const response = await fetch(url, { timeout: this.TIMEOUT })
            const rawData = await response.json()
            if (rawData) {
                const list = rawData.query.pages as IWikiList
                const pages = Object.keys(list)
                if (pages.length === 0 || pages[0] === '-1') {
                    answer.setTextOnly('Nessun dato')
                } else {
                    answer.setTextOnly(list[pages[0]].fullurl)
                }
            } else {
                answer.setTextOnly('Nessun dato')
            }
        } catch (ex) {
            this._bot.logger.warn(ex)
            answer.setTextOnly('Nessun dato')
        }
    }
}