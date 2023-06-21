import NotFoundError from '../errors/not-found.js'
import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import checkPermissions from '../utils/checkPermissions.js'

const getAllProfiles = async (req, res) => {
	const {
		search,
		userHomeTown,
		userJob,
		userMajor,
		userStatus,
		userGender,
		userReligion,
		userHasLocation,
		userLocationArea,
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

	if (userLocationArea && userLocationArea !== 'semua') {
		queryObject.userLocationArea = userLocationArea
	}

	//ADMINT ID
	// 64930252d7026861a3febd8f
	queryObject._id = { $ne: '64930252d7026861a3febd8f' }

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
	const profileDetails = profile

	res.status(StatusCodes.OK).json({ profileDetails })
}

const deleteProfileAdm = async (req, res) => {
	const { id: profileId } = req.params

	const profile = await User.findOne({ _id: profileId })

	if (!profile) {
		throw new NotFoundError(`ID ${profileId} tidak ditemukan`)
	}

	// checkPermissions(req.user, '64930252d7026861a3febd8f')

	await profile.deleteOne({ _id: profileId })

	res.status(StatusCodes.OK).json({ msg: 'Profil telah dihapus.' })
}

export { getAllProfiles, getProfileDetail, deleteProfileAdm }
