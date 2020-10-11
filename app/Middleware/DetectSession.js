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
    const tokenjson = tokenheader !== undefined ? JSON.parse(tokenheader) : null
    if(tokenjson !== null){
      const token = await Token.findBy('token', tokenjson.token)
      if(token !== null){
        const user = await User.findBy('id', token.user_id)
        banverify = await Banlist.findBy('user_id', token.user_id)
        banverify === null ? request.user={status : '200', message:user} : request.user = {status: '413', message:`You're bannerd for ${banverify.reason}`}
      }else {
        request.user = {status: '413', message:'Unautorized'}
      }
    }else {
      request.user = {status: '413', message:'Unautorized'}
    }
    await next()
  }
}

module.exports = DetectSession
