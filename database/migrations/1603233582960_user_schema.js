'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('avatar').notNullable().defaultTo('https://res.cloudinary.com/dukgqrudk/image/upload/v1605969531/no-avatar-png-8_sbc3tp.png')
      table.string('social_type')
      table.string('name')
      table.string('username')
      table.string('email')
      table.string('phonenumber', 60),
      table.string('city')
      table.boolean('is_service').notNullable().defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
