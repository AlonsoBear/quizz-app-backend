import { DBUrl } from "./database/db"

export type Cors = {
    origin: string
    credentials: boolean
}

export type AppConfig = {
    port: number
    db: DBUrl
    cors: Cors
}

export const configSetup = (): AppConfig => {
    const port = parseInt(process.env["PORT"]!)
    const dbUrl: DBUrl = process.env["DB_URL"]! 
    const cors = {
        origin: process.env["CORS_ORIGIN"]!,
        credentials: true
    }
    const config: AppConfig = { port: port, db: dbUrl, cors: cors }
    return config
}