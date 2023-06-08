import NotFoundError from '../errors/not-found.js'
import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'

// const getAllProfiles = async (req, res) => {
// 	const profiles = await User.find({})

// 	res
// 		.status(StatusCodes.OK)
// 		.json({ profiles, totalprofiles: profiles.length, numOfPages: 1 })
// }

// TODO  UPDATE KETIKA SUDAH SUKSES TEST
const getAllProfiles = async (req, res) => {
	// TODO update dengan kondisi lebih lengkap nanti
	const {
		search,
		userHomeTown,
		userJob,
		userMajor,
		userStatus,
		userGender,
		userReligion,
		userHasLocation,
		sort,
	} = req.query

	//kondisi
	const queryObject = { userFoundPartner: false }

	if (search) {
		queryObject.name = { $regex: search, $options: 'i' }
	}

	if (userHomeTown) {
		queryObject.userHomeTown = { $regex: userHomeTown, $options: 'i' }
	}

	if (userJob) {
		queryObject.userJob = { $regex: userJob, $options: 'i' }
	}

	if (userMajor) {
		queryObject.userMajor = { $regex: userMajor, $options: 'i' }
	}

	if (userStatus && userStatus !== 'semua') {
		queryObject.userStatus = userStatus
	}

	if (userGender && userGender !== 'semua') {
		queryObject.userGender = userGender
	}

	if (userReligion && userReligion !== 'semua') {
		queryObject.userReligion = userReligion
	}

	if (userHasLocation !== 'semua') {
		if (userHasLocation === 'ya') {
			queryObject.userHasLocation = true
		} else if (userHasLocation === 'tidak') {
			queryObject.userHasLocation = false
		}
	}
	let result = User.find(queryObject)

	//kondisi sort
	if (sort === 'Pengguna terbaru') {
		result = result.sort('-createdAt')
	}
	if (sort === 'Pengguna terlama') {
		result = result.sort('createdAt')
	}
	if (sort === 'A-Z') {
		result = result.sort('name')
	}
	if (sort === 'Z-A') {
		result = result.sort('-name')
	}
	if (sort === 'Budget terendah') {
		result = result.sort('userBudget')
	}
	if (sort === 'Budget tertinggi') {
		result = result.sort('-userBudget')
	}
	if (sort === 'Umur termuda') {
		result = result.sort('userAge')
	}
	if (sort === 'Umur tertua') {
		result = result.sort('-userAge')
	}

	//pagination
	const page = Number(req.query.page) || 1
	const limit = Number(req.query.limit) || 10
	const skip = (page - 1) * limit

	result = result.skip(skip).limit(limit)

	const profiles = await result

	const totalProfiles = await User.countDocuments(queryObject)
	const numOfPages = Math.ceil(totalProfiles / limit)

	res
		.status(StatusCodes.OK)
		.json({ profiles, totalProfiles: profiles.length, numOfPages })
}

const getProfileDetail = async (req, res) => {
	const { id: profileId } = req.params

	const profile = await User.findOne({ _id: profileId })

	if (!profile) {
		throw new NotFoundError(`ID ${profileId} tidak ditemukan`)
	}

	//just the personal data, not user data
	const profileDetails = {
		id: profile.id,
		name: profile.name,
		userAvatar: profile.userAvatar,
		userGender: profile.userGender,
		userAge: profile.userAge,
		userHomeTown: profile.userHomeTown,
		userStatus: profile.userStatus,
		userReligion: profile.userReligion,
		userJob: profile.userJob,
		userMajor: profile.userMajor,
		userBudget: profile.userBudget,
		userDescription: profile.userDescription,
		userHasLocation: profile.userHasLocation,
		userLocation: profile.userLocation,
		userLocationPrice: profile.userLocationPrice,
	}

	res.status(StatusCodes.OK).json({ profileDetails })
}

export { getAllProfiles, getProfileDetail }
