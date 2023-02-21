import mongoose from "mongoose"


export type DBUrl = string

export const setupDb = (dbUrl: DBUrl) => {
    const url = dbUrl
    mongoose.connect(url, (error) => {
        if (error) console.error(error)
        else console.log("Connected to MongoDb")
    })
}