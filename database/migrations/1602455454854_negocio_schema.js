'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NegocioSchema extends Schema {
  up () {
    this.create('negocios', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.string('logo')
      table.string('portada')
      table.string('nombre_negocio')
      table.string('categoria')
      table.text('descripcion')
      table.string('latitude')
      table.string('longitude')
      table.timestamps()
    })
  }

  down () {
    this.drop('negocios')
  }
}

module.exports = NegocioSchema
