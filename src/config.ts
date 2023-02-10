import { DbOptions } from "./database/db"

export type Cors = {
    origin: string
    credentials: boolean
}

export type AppConfig = {
    port: number
    db: DbOptions
    cors: Cors
}

export const configSetup = (): AppConfig => {
    const port = parseInt(process.env["PORT"]!)
    const dbOptions: DbOptions = {
        host: process.env["MONGO_HOST"]!,
        db: process.env["MONGO_DB_NAME"]!,
        user: process.env["MONGO_USER"]!,
        password: process.env["MONGO_PASSWORD"]!,
        port: process.env["MONGO_PORT"]!
    }
    const cors = {
        origin: process.env["CORS_ORIGIN"]!,
        credentials: true
    }
    const config: AppConfig = { port: port, db: dbOptions, cors: cors }
    return config
}