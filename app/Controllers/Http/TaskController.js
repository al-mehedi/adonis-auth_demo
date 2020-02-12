'use strict'

const Task = use('App/Models/Task')
const { validate } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
	/**
	 * Show a list of all tasks.
	 * GET tasks
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index({ response }) {
		let tasks = await Task.query().fetch()

		return response.status(200).json({
			'status': 'success',
			'code': 200,
			'message': 'Task query was successful',
			'data': tasks
		})
	}

	/**
	 * Render a form to be used for creating a new task.
	 * GET tasks/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async create({ request, response, view }) {
	}

	/**
	 * Create/save a new task.
	 * POST tasks
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ request, auth, response }) {
		const rules = { title: 'required', project_id: 'required' }
		const validation = await validate(request.all(), rules)

		if (validation.fails()) {
			return response.status(406).json({
				status: 'failed',
				code: 406,
				body: validation.messages()
			})
		} else {
			let tasks = await Task.create(request.all())

			// Loads current user data into projects
			//await project.load('user');

			return response.status(201).json({
				message: 'Task created successfully', body: tasks
			})
		}
	}

	/**
	 * Display a single task.
	 * GET tasks/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show({ params, request, response, view }) {
		let task = await Task.query().where('id', params.id).fetch()

		if (task.rows.length) {
			return response.status(200).json({
				'status': 'success',
				'code': 200,
				'message': 'Task query was successful',
				'data': task
			})
		}
		else {
			return response.status(404).json({
				'status': 'failed',
				'code': 404,
				'message': 'Task could not be found'
			})
		}
	}

	/**
	 * Render a form to update an existing task.
	 * GET tasks/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit({ params, request, response, view }) {
	}

	/**
	 * Update task details.
	 * PUT or PATCH tasks/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ params, request, response }) {
		let { title, description, project_id } = request.post()

		let task = await Task.find(params.id)
		task.title = title
		task.description = description
		task.project_id = project_id

		await task.save()
		return response.status(200).json({
			message: 'Task updated successfully', body: task
		})
	}

	/**
	 * Delete a task with id.
	 * DELETE tasks/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params, request, response }) {
		let task = await Task.find(params.id)
		task.delete()

		return response.status(200).json({
			message: 'Project deleted successfully', body: task
		})
	}
}

module.exports = TaskController
