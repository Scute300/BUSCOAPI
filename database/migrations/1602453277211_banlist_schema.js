'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BanlistSchema extends Schema {
  up () {
    this.create('banlists', (table) => {
      table.increments()
      table.string('user_id')
      table.string('reason')
      table.timestamps()
    })
  }

  down () {
    this.drop('banlists')
  }
}

module.exports = BanlistSchema
