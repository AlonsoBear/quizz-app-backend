import { Router, Request, Response, NextFunction } from "express"
import { handleErrors } from "../utils/error"
import { ExercisesController } from "./controller"
import { ListInput } from "./types"

export const buildExercisesRouter = (router: Router, controller: ExercisesController) => {
    router.post("", async (request: Request, response: Response) =>
        handleErrors(response, controller.addExercise(request.body)))

    router.post("/topics", async (request: Request, response: Response) =>
        handleErrors(response, controller.addTopic(request.body)))

    router.delete("", async (request: Request, response: Response) =>
        handleErrors(response, controller.deleteExercise(request.body.id)))

    router.delete("/topics", async (request: Request, response: Response) =>
        handleErrors(response, controller.deleteTopic(request.body.id)))

    router.put("", async (request: Request, response: Response) =>
        handleErrors(response, controller.updateExercise(request.body.id, request.body.data)))

    router.put("/topics", async (request: Request, response: Response) =>
        handleErrors(response, controller.updateTopic(request.body.id, request.body.data)))

    router.get("/topics", async (request: Request, response: Response) =>
        handleErrors(response, controller.getListOfTopics()))

    router.get("", async (request: Request, response: Response) =>
        handleErrors(response, controller.getListOfExercises(request.query as ListInput)))

    router.post("/answer", async (request: Request, response: Response) =>
        handleErrors(response, controller.answerQuestion(request.body.questionId, request.body.answer)))

    router.post("/dashboard", async (request: Request, response: Response) => 
        handleErrors(response, controller.getExercise(request.body)))

    return router
}