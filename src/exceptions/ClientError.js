class ClientError extends Error {
    constructor(message, statusCode = 404){
        super(message)
        this.statusCode = statusCode
        this.message = message
    }
}

module.exports = ClientError