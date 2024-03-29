import Message from '../models/Message.js'
import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '../errors/index.js'
import checkPermissions, {
	checkMessagePermissions,
} from '../utils/checkPermissions.js'

const getRecipientProfile = async (req, res) => {
	const { id: messageRecipientId } = req.params

	const messageRecipient = await User.findOne({ _id: messageRecipientId })

	if (!messageRecipient) {
		throw new NotFoundError(`ID ${messageRecipientId} tidak ditemukan`)
	}

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
	const messages = await Message.find({ messageTo: req.user.userId })
		.populate('messageFrom', 'name userAvatar')
		.populate('messageTo', 'name userAvatar')

	res.status(StatusCodes.OK).json({
		userInboxMessages: messages,
		totalInbox: messages.length,
		numOfPages: 1,
	})
}

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

	checkMessagePermissions(
		req.user,
		message.messageFrom._id,
		message.messageTo._id
	)

	await message.deleteOne({ _id: messageId })

	res.status(StatusCodes.OK).json({ msg: 'Success! Message removed' })
}

const getEverything = async (req, res) => {
	const result = Message.find()

	res.status(StatusCodes.OK).json({
		allMessages: result,
		totalMessages: result.length,
		numOfPages: 1,
	})

	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (page - 1) * limit

	result = result.skip(skip).limit(limit)

	const messages = await result

	const totalMessages = await User.countDocuments(queryObject)
	const numOfPages = Math.ceil(totalMessages / limit)
	res.status(StatusCodes.OK).json({
		allMessages: messages,
		totalMessages: messages.length,
		numOfPages,
	})
}

export {
	createMessage,
	getAllMessagesInbox,
	getAllMessagesOutbox,
	getSingleMessage,
	deleteMessage,
	getRecipientProfile,
	getSingleMessageOutbox,
	getEverything,
}
