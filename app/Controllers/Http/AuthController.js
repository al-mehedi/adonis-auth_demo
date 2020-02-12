'use strict'

const User = use('App/Models/User')
const { validate } = use('Validator')

class AuthController {
    async register({ request, auth, response }) {
        const rules = {
            email: 'required|email|unique:users,email',
            password: 'required|min:6'
        }
        const validation = await validate(request.all(), rules)

        if (validation.fails()) {
            return response.status(406).json({
                status: 'failed',
                code: 406,
                body: validation.messages()
            })
        } else {
            let user = await User.create(request.all())

            let token = await auth.generate(user)
            Object.assign(user, token)
            return response.json({ message: 'Register successfully' })
        }
    }

    async login({ request, auth, response }) {
        const rules = {
            email: 'required|email',
            password: 'required'
        }
        const validation = await validate(request.all(), rules)

        if (validation.fails()) {
            return response.json(validation.messages())
        } else {
            let { email, password } = request.all();

            try {
                if (await auth.attempt(email, password)) {
                    let user = await User.findBy('email', email)
                    let token = await auth.generate(user)
    
                    Object.assign(user, token)
                    return response.json({ 
                        message: 'Login successfully',
                        authenticator: `${user.type} ${user.token}`
                    })
                }
            }
            catch (e) { return response.json({ message: 'Invalid credentials' }) }
        }
    }

    async logout({ request, auth, response }) {
        try {
            console.log(await auth.getUser())
            if (await auth.check()) {
              const token = await auth.getAuthHeader();
              await auth.authenticator('jwt').revokeTokens([token]);
              return response.status(200).send({ message: 'Logout successfully' });
            }
        } catch (error) {
            return response.send({ message: 'Missing or invalid JWT token' });
        }
    }
}

module.exports = AuthController
