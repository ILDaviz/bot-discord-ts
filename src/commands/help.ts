import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

export default class HelpCommand implements IBotCommand {
    private readonly CMD_REGEXP = /^(help)(?: |$)/im
    private _bot!: IBot

    public getHelp(prefix: string): IBotCommandHelp {
        return { caption: prefix + 'help', description: 'Per richiedere aiuto' }
    }

    public init(bot: IBot, dataPath: string): void {
        this._bot = bot
    }

    public isValid(msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }

    public async process(prefix: string, msg: string, answer: IBotMessage): Promise<void> {
        answer.setTitle('Ecco la lista dei comandi:')
        for (const cmd of this._bot.commands) {
            const help = cmd.getHelp(prefix)
            if (help.caption) {
                answer.addField(help.caption, help.description)
            }
        }
    }
}