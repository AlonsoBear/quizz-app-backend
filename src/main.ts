import { buildApp } from "./app";
import { configSetup } from "./config";

(async () => {
    try {
        const config = configSetup()
        const app = buildApp(config)
        app.runListen()
    } catch (error) {
        console.log("ERROR: Something went wrong")
    }
})()