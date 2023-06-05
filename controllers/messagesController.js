import Message from '../models/Message.js'
import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'

const getRecipientProfile = async (req, res) => {
	const { id: messageRecipientId } = req.params

	const messageRecipient = await User.findOne({ _id: messageRecipientId })

	if (!messageRecipient) {
		throw new NotFoundError(`ID ${messageRecipientId} tidak ditemukan`)
	}

	//just the some data, not entire user data
	const messageRecipientProfile = {
		id: messageRecipient.id,
		name: messageRecipient.name,
		userAvatar: messageRecipient.userAvatar,
	}

	res.status(StatusCodes.OK).json({ messageRecipientProfile })
}

const createMessage = async (req, res) => {
	const { messageTo, messageTitle, messageContent } = req.body

	if (!messageTo || !messageTitle || !messageContent) {
		throw new BadRequestError('Tolong isi dengan data yang valid')
	}

	// ? Redundant maybe
	req.body.messageFrom = req.user.userId

	const message = await Message.create(req.body)
	res.status(StatusCodes.CREATED).json({ message })
}

const getAllMessagesInbox = async (req, res) => {
	// const userSender = await User.findById(req.user.userId)
	// console.log(req.user)
	//* v1
	const messages = await Message.find({ messageTo: req.user.userId })
		.populate('messageFrom', 'name userAvatar')
		.populate('messageTo', 'name userAvatar')

	res.status(StatusCodes.OK).json({
		userInboxMessages: messages,
		totalInbox: messages.length,
		numOfPages: 1,
	})

	// const messages = await Message.find({ messageTo: req.user.userId })
	// 	.populate('messageFrom', 'name')
	// 	.populate('messageTo', 'name')

	// const messagesWithUserNames = messages.map((message) => {
	// 	const messageObject = message.toObject()
	// 	messageObject.messageToName = message.messageTo.name
	// 	messageObject.messageFromName = message.messageFrom.name
	// 	return messageObject
	// })

	// res.status(StatusCodes.OK).json({
	// 	messages: messagesWithUserNames,
	// 	totalMessages: messages.length,
	// 	numOfPages: 1,
	// })
}

// const getInboxWithName = async (req, res) => {
// 	const user = await User.findById(req.user.userId)
// 	await getAllMessagesInbox(req, res, User)
// }

const getAllMessagesOutbox = async (req, res) => {
	const messages = await Message.find({ messageFrom: req.user.userId })
		.populate('messageFrom', 'name userAvatar')
		.populate('messageTo', 'name userAvatar')

	res.status(StatusCodes.OK).json({
		userOutboxMessages: messages,
		totalOutbox: messages.length,
		numOfPages: 1,
	})
}

const getSingleMessageOutbox = async (req, res) => {
	const { id: messageId } = req.params

	// const message = await Message.findOne({ _id: messageId })
	const message = await Message.findOne({ _id: messageId })
		.populate('messageFrom', 'name userAvatar')
		.populate('messageTo', 'name userAvatar')

	if (!message) {
		throw new NotFoundError(`ID ${messageId} tidak ditemukan`)
	}

	res.status(StatusCodes.OK).json({ messageInboxDetails: message })
}

const getSingleMessage = async (req, res) => {
	const { id: messageId } = req.params

	// const message = await Message.findOne({ _id: messageId })
	const message = await Message.findOneAndUpdate(
		{ _id: messageId },
		//* flip seen
		{ messageSeen: true },
		{ new: true }
	)
		.populate('messageFrom', 'name userAvatar')
		.populate('messageTo', 'name userAvatar')

	if (!message) {
		throw new NotFoundError(`ID ${messageId} tidak ditemukan`)
	}

	res.status(StatusCodes.OK).json({ messageInboxDetails: message })
}

const deleteMessage = async (req, res) => {
	const { id: messageId } = req.params

	const message = await Message.findOne({ _id: messageId })

	if (!message) {
		throw new NotFoundError(`ID ${messageId} tidak ditemukan`)
	}

	checkPermissions(req.user, message.createdBy)

	await message.deleteOne({ _id: messageId })

	res.status(StatusCodes.OK).json({ msg: 'Success! Message removed' })
}

export {
	createMessage,
	getAllMessagesInbox,
	getAllMessagesOutbox,
	getSingleMessage,
	deleteMessage,
	getRecipientProfile,
	getSingleMessageOutbox,
	// getInboxWithName,
}
