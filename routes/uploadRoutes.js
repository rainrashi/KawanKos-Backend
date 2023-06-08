import express from 'express'
const router = express.Router()

import upload from '../middleware/upload.js'
import uploadImage from '../middleware/uploadImage.js'
import authenticateUser from '../middleware/auth.js'

import uploadController from '../controllers/uploadController.js'

router.post(
	'/',
	uploadImage,
	upload,
	authenticateUser,
	uploadController.uploadAvar
)

export default router
