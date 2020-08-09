'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CurriculoSchema extends Schema {
  up () {
    this.create('curriculos', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users').unsigned().notNullable()
      .onDelete('CASCADE')
      table.string('cvlink', 350).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('curriculos')
  }
}

module.exports = CurriculoSchema
