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

const getSingleMessage = async (req, res) => {
	const { id: messageId } = req.params

	const message = await Message.findOneAndUpdate(
		{ _id: messageId },
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

	await message.deleteOne({ _id: messageId })

	res.status(StatusCodes.OK).json({ msg: 'Success! Message removed' })
}

const getEverything = async (req, res) => {
	const queryObject = {}

	let result = Message.find(queryObject)
		.populate('messageFrom', 'name userAvatar')
		.populate('messageTo', 'name userAvatar')

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

export { getSingleMessage, deleteMessage, getRecipientProfile, getEverything }
