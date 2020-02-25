import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import { IDatabase, ILogger } from './api'

/**
 * Database class
 */
export class Database implements IDatabase {

    public get logger() { return this._logger }

    private _logger: ILogger = console
    private _db!: JsonDB

    constructor(database: string) {
        this.initDB(database)
    }

    /**
     * pushData
     */
    public pushData(dataPatch: string, data: any, override: boolean) {
        this._db.push(dataPatch, data, override)
        try {
            this._db.push(dataPatch, data, override)
        } catch (error) {
            this._logger.error(error)
        }
    }

    /**
     * getData
     */
    public getData(dataPatch: string): any {
        try {
            const data = this._db.getData(dataPatch)
            return data
        } catch (error) {
            this._logger.error(error)
            return ''
        }
    }

    /**
     * deleteData
     */
    public deleteData(dataPatch: string) {
        try {
            this._db.delete(dataPatch)
        } catch (error) {
            this._logger.error(error)
        }
    }

    /**
     * existData
     */
    public existData(dataPatch: string): boolean {
        try {
            const data = this._db.exists(dataPatch)
            return data
        } catch (error) {
            this._logger.error(error)
            return false
        }
    }

    /**
     * saveDB Save the data (useful if you disable the saveOnPush)
     */
    public saveDb() {
        try {
            this._db.save()
        } catch (error) {
            this._logger.error(error)
        }
    }

    /**
     * In case you have a exterior change to the databse file and want to reload it use this method
     */
    public reloadDB() {
        try {
            this._db.reload()
        } catch (error) {
            this._logger.error(error)
        }
    }

    private initDB(database: string) {
        this._db = new JsonDB(new Config(database, true, false, '/'));
    }
}