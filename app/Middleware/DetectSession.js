'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Token = use('App/Models/Token')
const Banlist = use('App/Models/Banlist')
const User = use('App/Models/User')

class DetectSession {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    const tokenheader = request.header('Authorization')
      const token = await Token.findBy('token', tokenheader)
      
      if(token == null){
        return response.status(401).json({
          status:'Unautorized',
          message: 'sesion inactiva'
        })
      }
        
      const user = await User.findBy('id', token.user_id)
      const banverify = await Banlist.findBy('user_id', token.user_id)
      
      if(banverify !== null){
        return response.status(401).json({
          status:'Unautorized',
          message: 'Estás Baneado por: '+banverify.reason
        })
      }

     request.user = user
    
    await next()
  }
}

module.exports = DetectSession
