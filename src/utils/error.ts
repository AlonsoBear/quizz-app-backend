import { Response } from "express";
import ApiError from "./api-error";

export const handleErrors = async (response: Response, promise: Promise<object>) => {
    try { 
        response.json(await promise)
    }
    catch (error: any) {
        console.log(1)
        console.error(error)
        
        if(error instanceof ApiError)
            {return response.status(error.statusCode ?? 400).json(error.reason)}
        return response.sendStatus(500) 
    }
}