'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Tag extends Model {
    negocio (){
          return this.belongsTo('App/Models/Negocio')
        }
}

module.exports = Tag
