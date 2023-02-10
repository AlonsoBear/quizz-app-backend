import { Model, Error } from "mongoose"
import { Exercise, Topic } from "./models"
import * as types from "./types"

type TopicsSpec = {
    register(data: Topic): Promise<Topic>
    remove(id: types.RemoveInput): Promise<void>
    update(newTopic: types.UpdateInput): Promise<Topic>
    list(): Promise<Topic[]>
    get(name: string): Promise<Topic | null>
    attempt<T>(
        func: (input: T) => Promise<types.ExerciseResponse<any>>, 
        input: T
    ): Promise<types.ExerciseResponse<any>>
}

export const topicEndpoints = {
    create: "",
    list: "",
    update: "",
    delete: "",
}

export class Topics implements TopicsSpec {

    constructor(
        private topic: Model<Topic>,
    ) {
        this.register = this.register.bind(this)
        this.remove = this.remove.bind(this)
        this.update = this.update.bind(this)
        this.list = this.list.bind(this)
        this.get = this.get.bind(this)
    }

    async register(data: Topic): Promise<Topic> {
        const topic = await this.topic.create(data)
        return topic.toJSON() as Topic
    }

    async remove(id: string): Promise<void> {
        await this.topic.deleteOne({ _id: id })
    }

    async update(newTopic: types.UpdateInput): Promise<Topic> {
        const topic = await this.topic.findOneAndUpdate({ _id: newTopic.id}, newTopic.data, { new: true, runValidators: true })
        return topic?.toJSON() as Topic
    }

    async list(): Promise<Topic[]> {
        const topics = await this.topic.find({}, null,{ limit: 10 })
        return topics
    }

    async get(name: string): Promise<Topic | null> {
        const topic = await this.topic.findOne({ name })
        return topic
    }

    async attempt<T>(
        func: (input: T) => Promise<any>, 
        input: T): Promise<types.ExerciseResponse<any>> {
        try {
            const response = await func(input)
            return response !== null ?  { ctype: "success", data: response} : { ctype: "success" }
        } catch (error: any) {                         
            return { ctype: "failure", error: error }
        }
    }
}