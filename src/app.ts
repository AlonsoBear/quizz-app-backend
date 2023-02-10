import express from "express"
import { setupDb } from "./database/db"
import { Router, Application } from "express"
import { AppConfig } from "./config"
import { Server } from "http"
import { buildExercisesRouter } from "./exercises/routes"
import { ExercisesController } from "./exercises/controller"
import cors from "cors"

type App = {
    app: Application
    runListen: () => Server
}

export const buildApp = (config: AppConfig): App => {
    const app = express()
    const router = Router()

    const exercisesRouter = buildExercisesRouter(router, new ExercisesController())

    app.use(cors(config.cors))
    app.use(express.json())
    app.use("/exercises", exercisesRouter)
    
    setupDb(config.db)

    return { 
        app,
        runListen: () => app.listen(config.port, () => console.log(`Server running on port ${config.port}...`)),
    }
}

