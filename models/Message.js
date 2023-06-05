import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema(
	{
		messageTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Tolong isi User Penerima'],
		},
		messageFrom: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Tolong isi User Pengirim'],
		},
		messageTitle: {
			type: String,
			required: [true, 'Tolong isi judul pesan.'],
		},
		messageContent: {
			type: String,
			required: [true, 'Tolong isi pesan.'],
		},
		messageReplyTo: {
			type: String,
			// ID of message it replies to, not  userid
		},
		// messageFromName: {
		// 	type: String,
		// 	//name of sender
		// },
		// messageToName: {
		// 	type: String,
		// 	//name of recipient
		// },
		messageSeen: { type: Boolean, default: false },
	},
	{ timestamps: true }
)

export default mongoose.model('Message', MessageSchema)
