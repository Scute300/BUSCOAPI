'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.hashPassword')
  }
  static get hidden () {
    return ['password']
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  Token (){
    return this.hasOne('App/Models/Token')
  }

  banlist (){
    return this.belongsTo('App/Models/Banlist')
  }

  serviceprofile(){
    return this.hasOne('App/Models/Serviceprofile')
  }
}

module.exports = User
