import express from 'express'
const router = express.Router()

import {
	createMessage,
	deleteMessage,
	getAllMessagesInbox,
	getAllMessagesOutbox,
	getSingleMessage,
	getRecipientProfile,
	getSingleMessageOutbox,
	// getInboxWithName,
} from '../controllers/messagesController.js'

router.route('/').get(getAllMessagesInbox)
// router.route('/inbox').get(getInboxWithName)
router.route('/create/:id').get(getRecipientProfile).post(createMessage)
router.route('/outbox').get(getAllMessagesOutbox)
router.route('/outbox/:id').get(getSingleMessageOutbox)
router.route('/:id').get(getSingleMessage).delete(deleteMessage)

export default router
