import express from 'express'
const router = express.Router()

//security
import rateLimiter from 'express-rate-limit'

//security
// TODO Sementara 5 menit cd, 50 api req cooldown
const apiLimiter = rateLimiter({
	windowMs: 5 * 60 * 1000,
	max: 50,
	message:
		'Terlalu banyak request dari IP ini. Silahkan coba lagi setelah 5 menit',
})

import {
	register,
	login,
	updateUser,
	updateUserFoundPartner,
} from '../controllers/authController.js'
import authenticateUser from '../middleware/auth.js'
// import testUser from '../middleware/testUser.js'

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
// router.route('/updateUser').patch(authenticateUser, testUser, updateUser)
router.route('/updateUser').patch(authenticateUser, updateUser)
router
	.route('/updateUserFoundPartner')
	.patch(authenticateUser, updateUserFoundPartner)

export default router
