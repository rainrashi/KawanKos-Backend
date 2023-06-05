import jwt from 'jsonwebtoken'
import { UnauthenticatedError } from '../errors/index.js'

const auth = async (req, res, next) => {
	const authHeader = req.headers.authorization
	if (!authHeader || !authHeader.startsWith('Bearer')) {
		throw new UnauthenticatedError('Authentication Invalid')
	}
	const token = authHeader.split(' ')[1]
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET)
		// console.log(payload)
		// * TEST USER
		const testUser = payload.userId === 'testUserID'
		req.user = { userId: payload.userId, testUser }
		// * END OF TEST USER

		// req.user = payload
		next()
	} catch (error) {
		throw new UnauthenticatedError('Authentication Invalid')
	}
}

export default auth
