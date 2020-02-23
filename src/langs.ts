import { ILangs, ILogger } from './api'

/**
 * Class for get langs
 */

export class Langs implements ILangs {

    public get logger() { return this._logger }

    private _logger: ILogger = console
    private _langs!: {}

    constructor() {
        // Load all Langs
        this.loadLangs()
    }

    public getLangs() {
        return this._langs
    }

    // Load all Langs
    private loadLangs() {
        const localsLangs = require('../lang/langs.json')
        this._langs = localsLangs.langs.map((lang: string) => {
            return {
                code: lang,
                ...require(`../lang/${lang}.json`)
            }
        }).sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
    }

}