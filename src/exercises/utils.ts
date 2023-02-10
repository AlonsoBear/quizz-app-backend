import { Exercise } from "./models";

/**
 * Method that changes the position of the exercises options
 * @param exercises List of Exercises
 * @returns List of Exercises with options in different positions
 */
export const shuffleOptions = (
    exercises: Exercise[]
    ): Exercise[] => {

        const newExercise = exercises.map(exercise => {
            const options = exercise.options.sort((a, b) => 0.5 - Math.random())
            exercise.options = options
            return exercise
        })
        return newExercise
}