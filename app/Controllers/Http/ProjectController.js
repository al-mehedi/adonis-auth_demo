'use strict'

const Project = use('App/Models/Project')
const { validate } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
	/**
	 * Show a list of all projects.
	 * GET projects
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async index({ auth, response }) {
		let projects = await auth.user.projects().query().fetch()

		return response.status(200).json({
			'status': 'success',
			'code': 200,
			'message': 'Projects query was successful',
			'data': projects
		})
	}

	/**
	 * Render a form to be used for creating a new project.
	 * GET projects/create
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async create({ auth, request, response, view }) {

	}

	/**
	 * Create/save a new project.
	 * POST projects
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async store({ auth, request, response }) {
		const rules = { title: 'required' }
		const validation = await validate(request.all(), rules)
		if (validation.fails()) {
			return response.status(406).json({
				status: 'failed',
				code: 406,
				body: validation.messages()
			})
		} else {
			let project = await auth.user.projects().create(request.all())
			
			// Loads current user data into projects
			//await project.load('user');

			return response.status(201).json({
				message: 'Project created successfully', body: project
			})
		}	
	}

	/**
	 * Display a single project.
	 * GET projects/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async show({ params, response }) {
		let project = await Project.query().where('id', params.id).fetch()

		return response.status(200).json({
			'status': 'success',
			'code': 200,
			'message': 'Projects query was successful',
			'data': project
		})
	}

	/**
	 * Render a form to update an existing project.
	 * GET projects/:id/edit
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 * @param {View} ctx.view
	 */
	async edit({ params, request, response, view }) {
	}

	/**
	 * Update project details.
	 * PUT or PATCH projects/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async update({ request, params, response }) {
		let { title, description } = request.post()

		let project = await Project.find(params.id)
        project.title = title
        project.description = description

        await project.save()
        return response.status(200).json({
			message: 'Project updated successfully', body: project
		})
	}

	/**
	 * Delete a project with id.
	 * DELETE projects/:id
	 *
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Response} ctx.response
	 */
	async destroy({ params, response }) {
		let project = await Project.find(params.id)
		project.delete()

        return response.status(200).json({
			message: 'Project deleted successfully', body: project
		})
	}
}

module.exports = ProjectController
