import { IBot, IBotConfig, ILogger } from './api'
import { Bot } from './bot'
import { DataBase } from './db'

const logger: ILogger = console

let cfg = require('./../bot.json') as IBotConfig
try {
    const cfgProd = require('./../bot.prod.json') as IBotConfig
    cfg = { ...cfg, ...cfgProd }
} catch {
    logger.info('no production config found...')
}

/**
 * Connessione al database
 */

const connection = new DataBase(cfg.mongo_uri)
const cs = connection.connect()
console.log(cs)

new Bot().start(logger, cfg, `${__dirname}/commands`, `${__dirname}/../data`)