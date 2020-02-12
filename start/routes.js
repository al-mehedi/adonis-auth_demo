'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
	return { warning: 'Careful what you wish for!' }
})

Route.group(() => {
	Route.post('/register', 'AuthController.register')
	Route.post('/login', 'AuthController.login')
	Route.post('/logout', 'AuthController.logout')
}).prefix('api/v1')

Route.group(() => {
	Route.get('/projects', 'ProjectController.index')
	Route.post('/projects', 'ProjectController.store')

	Route.get('/tasks', 'TaskController.index')
	Route.get('/tasks/:id', 'TaskController.show')
}).prefix('api/v1').middleware('auth')

Route.group(() => {
	Route.post('/tasks', 'TaskController.store')
	Route.patch('/tasks/update/:id', 'TaskController.update')
	Route.delete('/tasks/delete/:id', 'TaskController.destroy')

	Route.get('/projects/:id', 'ProjectController.show')
	Route.patch('/projects/update/:id', 'ProjectController.update')
	Route.delete('/projects/delete/:id', 'ProjectController.destroy')
}).prefix('api/v1').middleware(['auth', 'checkProjectOwnerShip'])