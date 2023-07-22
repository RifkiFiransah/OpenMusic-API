const ClientError = require("../../exceptions/ClientError");

class AuthenticationsHandler{
  constructor(authenticationsService, usersService, tokenManager, validator){
    this._usersService = usersService,
    this._authenticationsService = authenticationsService
    this._validator = validator
    this._tokenManager = tokenManager

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this)
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this)
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this)
  }

  async postAuthenticationHandler(request, h){
    try {
      this._validator.ValidatePostAuthenticationPayload(request.payload)
      const {username, password} = request.payload
      const id = await this._usersService.verifyUserCredential(username, password)
      const accessToken = this._tokenManager.generateAccessToken({id})
      const refreshToken = this._tokenManager.generateRefreshToken({id})

      await this._authenticationsService.addRefreshToken(refreshToken)
      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken
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
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf terjadi kegagalan pada server'
      })
      response.code(500)
      console.log(error)
      return response
    }
  }

  async putAuthenticationHandler(request, h){
    try {
      this._validator.ValidatePutAuthenticationPayload(request.payload)
      const {refreshToken} = request.payload
      await this._authenticationsService.verifyRefreshToken(refreshToken)
      const id = await this._tokenManager.generateRefreshToken(refreshToken)
      const accessToken = await this._tokenManager.generateAccessToken({id})
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken
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
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf terjadi kegagalan pada server'
      })
      response.code(500)
      console.log(error)
      return response
    }
  }

  async deleteAuthenticationHandler(request, h){
    try {
      this._validator.ValidateDeleteAuthenticationPayload(request.payload)
      
      const {refreshToken} = request.payload
      await this._authenticationsService.verifyRefreshToken(refreshToken)
      await this._authenticationsService.deleteRefreshToken(refreshToken)
  
      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus'
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
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf terjadi kegagalan pada server'
      })
      response.code(500)
      console.log(error)
      return response
    }
  }
}

module.exports = AuthenticationsHandler