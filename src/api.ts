export interface ILoggerMethod {
    (msg: string, ...args: any[]): void
    (obj: object, msg?: string, ...args: any[]): void
}

export interface ILogger {
    debug: ILoggerMethod
    info: ILoggerMethod
    warn: ILoggerMethod
    error: ILoggerMethod
}

export interface IBotConfig {
    prefix: string
    token: string
    commands: string[]
    game?: string
    username?: string
    idiots?: string[]
    idiotAnswer?: string
}

export interface IBotCommandHelp {
    caption: string
    description: string
}

export interface ILangs {
    readonly logger: ILogger
}

export interface IBot {
    readonly commands: IBotCommand[]
    readonly logger: ILogger
    readonly config: IBotConfig
    readonly allUsers: IUser[]
    readonly onlineUsers: IUser[]
    start(logger: ILogger, config: IBotConfig, commandsPath: string, dataPath: string): void
}

export interface IBotCommand {
    getHelp(prefix: string): IBotCommandHelp
    init(bot: IBot, dataPath: string): void
    isValid(msg: string): boolean
    process(prefix: string, msg: string, answer: IBotMessage): Promise<void>
}

export interface IUser {
    id: string
    username: string
    discriminator: string
    tag: string
}

type MessageColor =
    [number, number, number]
    | number
    | string

export interface IBotMessage {
    readonly user: IUser
    setTextOnly(text: string): IBotMessage
    addField(name: string, value: string): IBotMessage
    addBlankField(): IBotMessage
    setColor(color: MessageColor): IBotMessage
    setDescription(description: string): IBotMessage
    setFooter(text: string, icon?: string): IBotMessage
    setImage(url: string): IBotMessage
    setThumbnail(url: string): IBotMessage
    setTitle(title: string): IBotMessage
    setURL(url: string): IBotMessage
}