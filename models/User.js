import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Tolong isi nama anda'],
			minlength: 3,
			maxlength: 50,
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'Tolong isi email anda'],
			validate: {
				validator: validator.isEmail,
				message: 'Tolong isi dengan alamat email yang valid',
			},
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Tolong isi password anda'],
			minlength: 6,
			select: false,
		},
		userAvatar: {
			type: String,
			default: 'defaultAvatar',
		},
		userGender: {
			type: String,
			required: [true, 'Tolong isi data jenis kelamin anda.'],
		},
		userAge: { type: Number, required: [true, 'Tolong isi usia anda'] },
		userHomeTown: {
			type: String,
			required: [true, 'Tolong isi kota asal anda.'],
		},
		userStatus: {
			type: String,
			required: true,
		},
		userReligion: {
			type: String,
			required: [true, 'Tolong isi data agama anda.'],
		},
		userJob: {
			type: String,
		},
		userMajor: {
			type: String,
		},
		userHasLocation: {
			type: Boolean,
			default: false,
		},
		userLocation: {
			type: String,
		},
		userLocationPrice: {
			type: Number,
		},
		userLocationArea: {
			type: String,
			default: 'Jakarta Pusat',
		},
		userBudget: {
			type: Number,
			required: [true, 'Tolong isi budget anda.'],
		},
		userDescription: {
			type: String,
			required: [true, 'Tolong isi deskripsi singkat anda.'],
		},
		userFoundPartner: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
)

UserSchema.pre('save', async function () {
	if (!this.isModified('password')) return
	const salt = await bcrypt.genSalt(13)
	this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
	return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_LIFETIME,
	})
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password)
	return isMatch
}

export default mongoose.model('User', UserSchema)
