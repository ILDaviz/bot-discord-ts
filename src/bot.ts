import * as discord from 'discord.js'
import { RichEmbed } from 'discord.js'
import * as path from 'path'
import { IBot, IBotCommand, IBotConfig, ILogger, IUser } from './api'
import { BotMessage } from './message'

export class Bot implements IBot {
    public get commands(): IBotCommand[] { return this._commands }

    public get logger() { return this._logger }

    public get allUsers() { return this._client ? this._client.users.array().filter((i) => i.id !== '1') : [] }

    public get onlineUsers() { return this.allUsers.filter((i) => i.presence.status !== 'offline') }

    private readonly _commands: IBotCommand[] = []
    private _client!: discord.Client
    private _config!: IBotConfig
    private _logger!: ILogger
    private _iuser!: IUser
    private _botId!: string

    public start(logger: ILogger, config: IBotConfig, commandsPath: string, dataPath: string) {
        this._logger = logger
        this._config = config

        this.loadCommands(commandsPath, dataPath)

        if (!this._config.token) { throw new Error('invalid discord token') }

        this._client = new discord.Client()

        // Message ready bot
        this._client.on('ready', () => {
            this._botId = this._client.user.id
            if (this._config.game) {
                this._client.user.setGame(this._config.game)
            }
            if (this._config.username && this._client.user.username !== this._config.username) {
                this._client.user.setUsername(this._config.username)
            }
            this._client.user.setStatus('online')
            this._logger.info('started...')
        })

        // Read command
        this._client.on('message', async (message) => {
            if (message.author.id !== this._botId) {
                const text = message.cleanContent
                this._logger.debug(`[${message.author.tag}] ${text}`)
                for (const cmd of this._commands) {
                    try {
                        if (cmd.isValid(text)) {
                            const answer = new BotMessage(message.author)
                            if (!this._config.idiots || !this._config.idiots.includes(message.author.id)) {
                                await cmd.process(text, answer)
                            } else {
                                if (this._config.idiotAnswer) {
                                    answer.setTextOnly(this._config.idiotAnswer)
                                }
                            }
                            if (answer.isValid()) {
                                message.reply(answer.text || { embed: answer.richText })
                            }
                            break
                        }
                    } catch (ex) {
                        this._logger.error(ex)
                        return
                    }
                }
            }
        })

        // Message Welcome
        this._client.on('guildMemberAdd', (member) => {
            const channel = this._client.channels.get('642399832572428288') as discord.TextChannel
            this._iuser.id = member.id
            this._iuser.username = member.user.username
            this._iuser.tag = member.user.tag
            this._iuser.discriminator = member.user.discriminator
            const answer = new BotMessage(this._iuser)
            answer.setTitle('')
            answer.setColor('RANDOM')
            answer.setThumbnail('https://media1.tenor.com/images/0edd53dd2110147b786329c2e24fb1d0/tenor.gif')
            answer.setTextOnly('Ciao, benvenuto nel gruppo Developer Italia! Ti invito a leggere il regolamento.')
            channel.send(answer)
        })

        this._client.login(this._config.token)
    }

    private loadCommands(commandsPath: string, dataPath: string) {
        if (!this._config.commands || !Array.isArray(this._config.commands) || this._config.commands.length === 0) {
            throw new Error('Invalid / empty commands list')
        }
        for (const cmdName of this._config.commands) {
            const cmdClass = require(`${commandsPath}/${cmdName}`).default
            const command = new cmdClass() as IBotCommand
            command.init(this, path.resolve(`${dataPath}/${cmdName}`))
            this._commands.push(command)
            this._logger.info(`command "${cmdName}" loaded...`)
        }
    }
}