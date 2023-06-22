const ClientError = require('ClientError')
class InvariantError extends ClientError {
    constructor(message){
        super(message, 400)
        this.name = 'Invariant Error'
    }
}
module.exports = InvariantError