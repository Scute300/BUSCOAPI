'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NegocioSchema extends Schema {
  up () {
    this.create('negocios', (table) => {
      table.increments()
      table.integer('user_id')
      table.string('logo').notNullable()
      table.string('portada').notNullable()
      table.string('nombre_negocio').notNullable()
      table.string('categoria').notNullable()
      table.text('descripcion').notNullable()
      table.decimal('latitude',[10],[8]).notNullable()
      table.decimal('longitude',[11],[8]).notNullable()
      table.string('tiposervicio').notNullable()
      table.string('telefono').notNullable()
      table.string('logo_secureid').notNullable()
      table.string('portada_secureid').notNullable()
      table.boolean('aprobado').notNullable().defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('negocios')
  }
}

module.exports = NegocioSchema
