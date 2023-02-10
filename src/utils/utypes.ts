export type Status = "success" | "failure"
   
export type CreateResponse = "instance_created"   | "instance_not_created"
export type UpdateResponse = "instance_updated"   | "instance_not_updated"
export type DeleteResponse = "instance_deleted"   | "instance_not_deleted"
export type ListResponse   = "list_retrieved"     | "list_not_retrieved"
export type AnswerResponse = "question_answered"  | "question_not_answered"
export type GetOneResponse = "exercise_retrieved" | "exercise_not_found"
export type CreateExerciseResponse = CreateResponse | "topic_does_not_exists"

export type QuestionOutcome = {
    outcome: boolean
    points: number
}

export type ControllerResponse<M, D> = Promise<{
    message: M
    status: Status
    data?: D
}>