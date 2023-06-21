import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthenticatedError } from '../errors/index.js'

const register = async (req, res) => {
	const {
		name,
		email,
		password,
		userGender,
		userAge,
		userStatus,
		userJob,
		userMajor,
		userReligion,
		userBudget,
		userDescription,
		userHomeTown,
		userHasLocation,
		userLocation,
		userLocationPrice,
		userLocationArea,
	} = req.body

	if (
		!name ||
		!email ||
		!password ||
		!userGender ||
		userGender === 'Pilih jenis kelamin anda' ||
		!userAge ||
		!userHomeTown ||
		!userStatus ||
		userStatus === 'Status anda' ||
		!userReligion ||
		userReligion === 'Pilih agama anda' ||
		!userBudget ||
		userBudget === 0 ||
		!userDescription ||
		(userHasLocation && !userLocation)
	) {
		throw new BadRequestError('Tolong lengkapi semua data')
	}
	const userAlreadyExists = await User.findOne({ email })
	if (userAlreadyExists) {
		throw new BadRequestError('Email sudah terdaftar')
	}
	const user = await User.create({
		name,
		email,
		password,
		userGender,
		userAge,
		userStatus,
		userJob,
		userMajor,
		userReligion,
		userBudget,
		userDescription,
		userHomeTown,
		userHasLocation,
		userLocation,
		userLocationPrice,
	})
	const token = user.createJWT()
	res.status(StatusCodes.CREATED).json({
		user: {
			name: user.name,
			email: user.email,
			userGender: user.userGender,
			userHomeTown: user.userHomeTown,
			userStatus: user.userStatus,
			userJob: user.userJob,
			userMajor: user.userMajor,
			userReligion: user.userReligion,
			userBudget: user.userBudget,
			userDescription: user.userDescription,
			userHasLocation: user.userHasLocation,
			userLocation: user.userLocation,
			userLocationPrice: user.userLocationPrice,
			userLocationArea: user.userLocationArea,
			userAvatar: 'defaultAvatar',
		},
		token,
	})
}

const login = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new BadRequestError('Tolong lengkapi semua data')
	}
	const user = await User.findOne({ email }).select('+password')
	if (!user) {
		throw new UnauthenticatedError('Data yang anda berikan tidak valid')
	}
	console.log(user)
	const isPasswordCorrect = await user.comparePassword(password)
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Data yang anda berikan tidak valid')
	}
	const token = user.createJWT()
	user.password = undefined
	res.status(StatusCodes.OK).json({ user, token })
}

const updateUser = async (req, res) => {
	const {
		email,
		name,
		userGender,
		userAge,
		userHomeTown,
		userStatus,
		userReligion,
		userMajor,
		userJob,
		userBudget,
		userDescription,
		userHasLocation,
		userLocation,
		userLocationPrice,
		userLocationArea,
	} = req.body

	if (
		!email ||
		!name ||
		!userGender ||
		!userAge ||
		!userHomeTown ||
		!userStatus ||
		!userReligion ||
		(userStatus === 'Pelajar' && !userMajor) ||
		(userStatus === 'Pekerja' && !userJob) ||
		!userBudget ||
		!userDescription ||
		(userHasLocation && !userLocation)
	) {
		throw new BadRequestError('Tolong lengkapi semua data')
	}
	const user = await User.findOne({ _id: req.user.userId })

	user.email = email
	user.name = name
	user.userGender = userGender
	user.userAge = userAge
	user.userHomeTown = userHomeTown
	user.userReligion = userReligion
	user.userStatus = userStatus
	user.userJob = userJob
	user.userMajor = userMajor
	user.userBudget = userBudget
	user.userDescription = userDescription
	user.userHasLocation = userHasLocation
	user.userLocation = userLocation
	user.userLocationPrice = userLocationPrice
	user.userLocationArea = userLocationArea

	await user.save()

	const token = user.createJWT()

	res.status(StatusCodes.OK).json({ user, token })
}

//userFoundPartner flip function
const updateUserFoundPartner = async (req, res) => {
	const { userFoundPartner } = req.body
	const user = await User.findOne({ _id: req.user.userId })

	user.userFoundPartner = userFoundPartner
	await user.save()

	const token = user.createJWT()

	res.status(StatusCodes.OK).json({ user, token })
}

const updateUserAvatar = async (req, res) => {
	const { userAvatar } = req.body
	const user = await User.findOne({ _id: req.user.userId })

	user.userAvatar = userAvatar
	await user.save()

	const token = user.createJWT()

	res.status(StatusCodes.OK).json({ user, token })
}

export { register, login, updateUser, updateUserFoundPartner, updateUserAvatar }
