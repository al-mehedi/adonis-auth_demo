'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectSchema extends Schema {
	up() {
		this.create('projects', (table) => {
			table.increments()
			table.string('title').notNullable()
			table.string('description')
			table.integer('user_id').unsigned();
			table.foreign('user_id').references('users.id').onDelete('cascade');
			table.timestamps()
		})
	}

	down() {
		this.drop('projects')
	}
}

module.exports = ProjectSchema
