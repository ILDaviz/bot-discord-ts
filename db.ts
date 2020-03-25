import mongodb from 'mongodb'
import { ILogger } from './src/api'

export class DataBase {

    private _mongodb!: string
    private _db?: mongodb.Db
    private _client?: mongodb.MongoClient
    private logger: ILogger = console

    constructor(_mongoUrl: string ) {
        this._mongodb = _mongoUrl
    }

    /**
     * Create connetion
     */
    public async connect() {

        try {
            this._client = await mongodb.MongoClient.connect(this._mongodb, { useNewUrlParser: true })
            this._db = this._client.db()
        } catch (error) {
            this.logger.error('no connection to database')
        }
    }

    /**
     * getDbConnection
     */
    public getDbConnection() {
        return this._db
    }
}