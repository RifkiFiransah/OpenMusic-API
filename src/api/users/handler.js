const ClientError = require("../../exceptions/ClientError");

class UsersHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postUserHandler = this.postUserHandler.bind(this)
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this)
  }

  async postUserHandler(request, h) {
    try {
      this._validator.ValidateUserPayload(request.payload)
      const {username, password, fullname} = request.payload
      const userId = await this._service.addUser({username, password, fullname})
      const response = h.response({
        status: 'success',
        message: 'Berhasil menambahkan pengguna',
        data: {
          userId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if(error instanceof ClientError){
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      // SERVER ERROR
      const response = h.response({
        status: 'fail',
        message: 'maaf terjadi kegagalan pada server'
      })
      response.code(500)
      console.log(error);
      return response
    }
  }

  async getUserByIdHandler(request, h){
    try {
      const {id} = request.params
      const user = await this._service.getUserById(id)
      return {
        status: 'success',
        data: {
          user
        }
      }
    } catch (error) {
      if(error instanceof ClientError){
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      // SERVER ERROR
      const response = h.response({
        status: 'fail',
        message: 'maaf terjadi kegagalan pada server'
      })
      response.code(500)
      console.log(error);
      return response
    }
  }

  async getUserByUsernameHandler(request, h){
    try {
      const {username = ''} = request.query
      const users = await this._service.getUsersByUsername(username)

      return {
        status: 'success',
        data: {
          users,
        }
      }
    } catch(error) {
        if (error instanceof ClientError) {
          const response = h.response({
            status: 'fail',
            message: error.message,
          })
          response.code(error.statusCode)
          return response
        }
        // Server Error
        const response = h.response({
          status: 'fail',
          message: 'maaf, terjadi kegagalan pada server'
        })
        response.code(500)
        console.log(error.message);
        return response
    }
  }
}

module.exports = UsersHandler