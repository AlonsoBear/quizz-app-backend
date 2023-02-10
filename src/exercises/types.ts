import { Exercise } from "./models"
import { Error } from "mongoose"

export type FailedResponse = { ctype: "failure", error?: string }
export type ExerciseResponse<A> = { ctype: "success", data?: A } | FailedResponse

export type RegisterInput = Exercise
export type RemoveInput = string
export type UpdateInput = { id: string, data: Exercise}
export type ListInput = { topic: string, categories: string[]}
export type GetOneInput = {
    id?: string
    question?: string
}
export type AttemptInputOptions =
    RegisterInput |
    RemoveInput   |
    UpdateInput   |
    ListInput     |
    GetOneInput     