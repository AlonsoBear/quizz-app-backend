import * as responses from "../utils/utypes"
import { Exercise, Topic, Option, buildExerciseSchema, buildTopicSchema, buildModel } from "./models"
import { Exercises } from "./exercises"
import { Topics } from "./topics"
import { UpdateInput, ListInput, GetOneInput } from "./types"
import ApiError from "../utils/api-error"

type ExercisesControllerSpec = {
    getListOfExercises(data: ListInput): responses.ControllerResponse<responses.ListResponse, Exercise[]>
    getListOfTopics(): responses.ControllerResponse<responses.ListResponse, Topic[]>
    getExercise(data: GetOneInput): responses.ControllerResponse<responses.GetOneResponse, Exercise>
    addExercise(data: Exercise): responses.ControllerResponse<responses.CreateExerciseResponse, Exercise>
    addTopic(data: Topic): responses.ControllerResponse<responses.CreateResponse, Topic>
    updateExercise(id: string, data: Exercise): responses.ControllerResponse<responses.UpdateResponse, Exercise>
    updateTopic(id: string, data: Exercise): responses.ControllerResponse<responses.UpdateResponse, Topic>
    deleteExercise(id: string): responses.ControllerResponse<responses.DeleteResponse, void>
    deleteTopic(id: string): responses.ControllerResponse<responses.DeleteResponse, void>
    answerQuestion(id: string, answer: string): responses.ControllerResponse<responses.AnswerResponse, responses.QuestionOutcome>
}

export class ExercisesController implements ExercisesControllerSpec {
    private exercises: Exercises
    private topics: Topics
    
    constructor(){
        const TopicModel = buildModel<Topic>("Topic", buildTopicSchema())
        this.topics = new Topics(TopicModel)
        const ExerciseModel = buildModel<Exercise>("Exercise", buildExerciseSchema(TopicModel))
        this.exercises = new Exercises(ExerciseModel)
    }

    async addExercise(data: Exercise): responses.ControllerResponse<responses.CreateExerciseResponse, Exercise> {
        const findTopic = this.topics.get
        const topicRes = await this.topics.attempt<string>(findTopic, "Veterinary Medicine")
        if (topicRes.ctype == "failure") 
            throw new ApiError(topicRes.error).response("Topic not found").status(400)

        data["topic"] = topicRes.data._id   
        const register = this.exercises.register
        const res = await this.exercises.attempt<Exercise>(register, data)
        if (res.ctype == "failure") 
            throw new ApiError(res.error).response("Exercise creation failed").status(400)
        

        return {
            message: "instance_created",
            status: "success",
            data: res.data
        }
    }

    async addTopic(data: Topic): responses.ControllerResponse<responses.CreateResponse, Topic> {
        const register = this.topics.register
        const res = await this.topics.attempt<Topic>(register, data)
        if (res.ctype == "failure") return { message: "instance_not_created", status: "failure"}
        return {
            message: "instance_created",
            status: "success",
            data: res.data
        }
    }

    async updateExercise(id: string, data: Exercise): responses.ControllerResponse<responses.UpdateResponse, Exercise> {
        const update = this.exercises.update
        const newData = { id: id, data: data}
        const res = await this.exercises.attempt<UpdateInput>(update, newData)
        if (res.ctype == "failure") return { message: "instance_not_updated", status: "failure"}
        return {
            message: "instance_updated",
            status: "success",
            data: res.data
        }
    }

    async updateTopic(id: string, data: Exercise): responses.ControllerResponse<responses.UpdateResponse, Topic> {
        const update = this.topics.update
        const newData = { id: id, data: data}
        const res = await this.topics.attempt<UpdateInput>(update, newData)
        if (res.ctype == "failure") return { message: "instance_not_updated", status: "failure"}
        return {
            message: "instance_updated",
            status: "success",
            data: res.data
        }
    }

    async deleteExercise(id: string): responses.ControllerResponse<responses.DeleteResponse, void> {
        const remove = this.exercises.remove
        const res = await this.exercises.attempt(remove, id)
        if (res.ctype == "failure") return { message: "instance_not_deleted", status: "failure"}
        return {
            message: "instance_deleted",
            status: "success",
            data: res.data
        }
    }

    async deleteTopic(id: string): responses.ControllerResponse<responses.DeleteResponse, void> {
        const remove = this.topics.remove
        const res = await this.topics.attempt(remove, id)
        if (res.ctype == "failure") return { message: "instance_not_deleted", status: "failure"}
        return {
            message: "instance_deleted",
            status: "success",
            data: res.data
        }
    }

    async getListOfExercises(data: ListInput): responses.ControllerResponse<responses.ListResponse, Exercise[]> {
        const getList = this.exercises.list
        const input = { topic: data.topic, categories: data.categories }
        const res = await this.exercises.attempt<ListInput>(getList, input)
        if (res.ctype == "failure") return { message: "list_not_retrieved", status: "failure"}
        return {
            message: "list_retrieved",
            status: "success",
            data: res.data
        }
    }

    async getListOfTopics(): responses.ControllerResponse<responses.ListResponse, Topic[]> {
        const getList = this.topics.list
        const res = await this.topics.attempt<null>(getList, null)
        if (res.ctype == "failure") return { message: "list_not_retrieved", status: "failure"}
        return {
            message: "list_retrieved",
            status: "success",
            data: res.data
        }
    }

    async getExercise(data: GetOneInput): responses.ControllerResponse<responses.GetOneResponse, Exercise> {
        const getOne = this.exercises.getOne
        const res = await this.topics.attempt<GetOneInput>(getOne, data)
        if (res.ctype == "failure") throw new ApiError(res.error).response("Exercise not found").status(404)
        return {
            message: "exercise_retrieved",
            status: "success",
            data: res.data
        }
    }

    async answerQuestion(questionId: string, answer: string): responses.ControllerResponse<responses.AnswerResponse, responses.QuestionOutcome> {
        const getOne = this.exercises.getOne
        const res = await this.exercises.attempt<GetOneInput>(getOne, { id: questionId})
        if (res.ctype == "failure") return { message: "question_not_answered", status: "failure"}
        const exercise = res.data as Exercise
        const choise = exercise.options.find((option: Option) => option.answer === answer)
        const outcome = choise?.isCorrect ?? false
        // FIXME: When users are ready, add points to user
        return {
            message: "question_answered",
            status: "success",
            data: {
                outcome: outcome,
                points: outcome ? 5 : 0
            }
        }
    }
}