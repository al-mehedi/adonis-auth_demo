'use strict'

const Project = use ('App/Models/Project')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckProjectOwnerShip {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ auth, params, request, response }, next) {
    let projectId = null
    request.input('project_id') ? projectId = request.input('project_id') : projectId = params.id

    const user = auth.user
    const project = await Project.find(projectId)

    if (project !== null) {
      if (project.user_id === user.id) {
        return await next()
      }
    }

    return response.status(401).json({
      'status': 'error',
      'code': 401,
      'message': 'You do not have the owner ship to the requested project',
      'data': null
    })
  }
}

module.exports = CheckProjectOwnerShip
