'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Negocio extends Model {

usuario (){
      return this.belongsTo('App/Models/Usuario')
    }
tags(){
    return this.hasMany('App/Models/Tag')
}
}

module.exports = Negocio
