class ClientError extends Error {
    constructor(message, statusCode = 400){
        super(message)
        this.statusCode = statusCode
        this.message = message
    }
}

module.exports = ClientError