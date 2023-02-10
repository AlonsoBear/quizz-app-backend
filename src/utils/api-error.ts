class ApiError extends Error {
    statusCode: number
    reason: { error: string } | null

    constructor(...params: any) {
        super(...params)
        this.statusCode = 500
        this.reason = null
    }

    debug(msg: string) {
        console.error(msg)
    }

    log(msg: string, isWarning: boolean){
        if (isWarning) {
            console.error(msg)
        }
    }

    status(statusCode: number) {
        this.statusCode = statusCode
        return this
    }

    response(error: string) {
        this.reason = { error }
        return this
    }
}

export default ApiError