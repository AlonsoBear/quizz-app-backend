import { Model } from "mongoose"
import { Exercise } from "./models"
import * as types from "./types"
import { shuffleOptions } from "./utils"

type ExercisesSpec = {
    register(data: types.RegisterInput): Promise<Exercise>
    remove(id: types.RemoveInput): Promise<void>
    update(newExercise: types.UpdateInput): Promise<Exercise>
    list(data: types.ListInput): Promise<Exercise[]>
    getOne(data: types.GetOneInput): Promise<Exercise>
    attempt<T>(
        func: (input: T) => Promise<types.ExerciseResponse<any>>, 
        input: T
    ): Promise<types.ExerciseResponse<any>>
}

export const exerciseEndpoints = {
    create: "",
    list: "/:topic",
    update: "",
    delete: "",
    answer: "/answer"
}

export class Exercises implements ExercisesSpec {

    constructor(
        private exercise: Model<Exercise>,
    ) {
        this.register = this.register.bind(this)
        this.remove = this.remove.bind(this)
        this.update = this.update.bind(this)
        this.list = this.list.bind(this)
        this.getOne = this.getOne.bind(this)
    }

    async register(data: Exercise): Promise<Exercise> {
        const exercise = await this.exercise.create(data)
        return exercise.toJSON() as Exercise
    }

    async remove(id: string): Promise<void> {
        await this.exercise.deleteOne({ _id: id })
    }

    async update(newExercise: types.UpdateInput): Promise<Exercise> {
        const exercise = await this.exercise.findOneAndUpdate({ id: newExercise.id }, newExercise.data, { new: true, runValidators: true })
        return exercise?.toJSON() as Exercise
    }

    // FIXME: Correct Answer leaking to client
    async list(data: types.ListInput): Promise<Exercise[]> {  
        const query = data.categories.length ? 
            { topic: data.topic, categories: { $in: data.categories} } :
            { topic: data.topic }
            
        const exercises = await this.exercise.find(query, null,{ limit: 10 })
        return shuffleOptions(exercises)
    }

    async getOne(data: types.GetOneInput): Promise<Exercise> {
        let query: any = {}
        if(data.question) query["question"] = new RegExp(data.question, "i")
        if(data.id) query["id"] = new RegExp(data.id, "i")
        const exercise = await this.exercise.findOne(query)
        return exercise as Exercise
    }

    async attempt<T>(
        func: (input: T) => Promise<any>, 
        input: T): Promise<types.ExerciseResponse<any>> {
        try {
            const response = await func(input)
            return response !== null ?  { ctype: "success", data: response} : { ctype: "success" }
        } catch (error: any) {
            return { ctype: "failure", error: error}
        }
    }
}