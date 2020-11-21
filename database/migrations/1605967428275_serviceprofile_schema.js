'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServiceprofileSchema extends Schema {
  up () {
    this.create('serviceprofiles', (table) => {
      table.increments()
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('category')
      table.string('bio')
      table.timestamps()
    })
  }

  down () {
    this.drop('serviceprofiles')
  }
}

module.exports = ServiceprofileSchema
