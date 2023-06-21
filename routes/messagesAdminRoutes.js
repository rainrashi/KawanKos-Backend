import express from 'express'
const router = express.Router()

import {
	deleteMessage,
	getSingleMessage,
	getEverything,
} from '../controllers/messagesAdminController.js'

router.route('/:id').get(getSingleMessage).delete(deleteMessage)
router.route('/').get(getEverything)

export default router
