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
  async handle ({ request }, next) {
    const tokenheader = request.header('Authorization')
      const token = await Token.findBy('token', tokenheader)
      
      if(token !== null){
        
        const user = await User.findBy('id', token.user_id)
        const banverify = await Banlist.findBy('user_id', token.user_id)

        banverify == null ? request.user={status : '200', message:user} : request.user = {status: '413', message:`You're bannerd for ${banverify.reason}`}
      }else {
        request.user = {status: '413', message:'Unautorized'}
      }
    await next()
  }
}

module.exports = DetectSession
