import mongoose from "mongoose";
import { ObjectId } from "mongoose";

export type Option = {
    answer: string,
    isCorrect: boolean
}

export type Exercise = {
    question: string
    options: Option[]
    categories: string[]
    topic: ObjectId
    description: string
    reference: string
}

export type Topic = {
    name: string
    categories: string[]
}

type ExerciseModels = {
    ExerciseModel: mongoose.Model<Exercise>
    TopicModel: mongoose.Model<Topic>
}

// Excercise Validators
const numberOfoptionsValidator = (options: Option[]) =>
    options.length === 4

const atLeastOneTrueValidator = (options: Option[]) => {
    let oneOptionCorrect: boolean = false
    options.forEach((option: Option) => {
        if (option.isCorrect)
            oneOptionCorrect = true
        })        
    return oneOptionCorrect
}

// Topic Validators
const topicCategoryValidator = (categories: string[]) => {
    const totalCategories = categories.length
    const differentCategories = new Set(categories).size 
    return totalCategories === differentCategories
}

// CHECKME: Some validations are inside schema, others not

export const buildExerciseSchema = (Topic: mongoose.Model<Topic>): mongoose.Schema<Exercise> => {
    const exerciseSchema = new mongoose.Schema<Exercise>({
        question: {
            type: String,
            required: [true, 'The field "question" is required'],
            unique: true,
            maxlength: [150, 'The field "question" is too long.']
        },
        topic: {
            type: mongoose.Types.ObjectId,
            required: [true, 'The field "topic" is required'],
            maxlength: [30, 'The category {VALUE} is too long.'],
            validate: [{
                validator: mongoose.isValidObjectId,
                msg: 'The id of field "topic" is not valid'
            },{
                validator: async (val: string) =>        
                    await Topic.findOne({ _id: val }),
                msg: "The topic {VALUE} does not exist"
            }]
        },
        categories: {
            type: [{
                type: String,
                maxlength: [30, 'The category {VALUE} is too long.'],
                validate: {
                    validator: async function (category: string) {
                        const id = (this as mongoose.SchemaTypeOptions<Exercise>).topic                    
                        const topic = await Topic.findOne({ id: id })
                        return topic?.categories.includes(category)
                    },
                    msg: "The category {VALUE} does not exist in the given topic."
                },
                
            }],
            required: [true, 'The field "categories" is required'],
        },
        options: {
            type: [{
                answer: {
                    type: String,
                    maxLength: [300, "This answer is too long to be storaged"],
                    required: [true, 'The field "answer" inside "options" is required']
                },
                isCorrect: {
                    type: Boolean,
                    required: [true, 'The field "isCorrect" inside "options" is required']
                }
            }],
            required: [true, 'The field "options" is required'],
            validate: [{
                validator: numberOfoptionsValidator,
                msg: "This field requires exactly 4 options"
            }, {
                validator: atLeastOneTrueValidator,
                msg: "There must be at least one correct option"
            }]
        },
        description: {
            type: String,
            required: [true, 'The field "description" is required']
        },
        reference: {
            type: String,
            required: false
        }
    })
    return exerciseSchema
}

export const buildTopicSchema = (): mongoose.Schema<Topic> => {
    const topicSchema = new mongoose.Schema<Topic> ({
        name: {
            type: String,
            required: [true, 'The field "name" is required'],
            unique: true,
            maxLength: [30, "This topic is too long to be saved"]
        },
        categories: {
            type: [{
                type: String,
                maxlength: [30, 'The category {VALUE} is too long.'],
            }],
            validate: [topicCategoryValidator, "All categories must be different"],
            required: [true, 'The field "categories" is required']
        }
    })
    return topicSchema
}

export const buildModel = <T>(modelName: string, modelSchema: mongoose.Schema): mongoose.Model<T> => 
    mongoose.model(modelName, modelSchema) as mongoose.Model<T>