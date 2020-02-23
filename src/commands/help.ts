import { IBot, IBotCommand, IBotCommandHelp, IBotMessage } from '../api'

export default class HelpCommand implements IBotCommand {
    private readonly CMD_REGEXP = /^\/(help)(?: |$)/im
    private _bot!: IBot

    public getHelp(): IBotCommandHelp {
        return { caption: '/help', description: 'Per richiedere aiuto' }
    }

    public init(bot: IBot, dataPath: string): void {
        this._bot = bot
    }

    public isValid(prefix: string, msg: string): boolean {
        return this.CMD_REGEXP.test(msg)
    }

    public async process(msg: string, answer: IBotMessage): Promise<void> {
        answer.setTitle('Ecco la lista dei comandi:')
        for (const cmd of this._bot.commands) {
            const help = cmd.getHelp()
            if (help.caption) {
                answer.addField(help.caption, help.description)
            }
        }
    }
}