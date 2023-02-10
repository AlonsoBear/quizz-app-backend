import mongoose from "mongoose"

export type DbOptions = {
    host: string
    db: string
    user: string
    password: string
    port: string
}

export const setupDb = (options: DbOptions) => {
    const { db, user, password, port, host } = { ...options }
    const url = `mongodb://${user}:${password}@${host}:${port}/`
    mongoose.connect(url, (error) => {
        if (error) console.error(error)
        else console.log("Connected to MongoDb")
    })
}