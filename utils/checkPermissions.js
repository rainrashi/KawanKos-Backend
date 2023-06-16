import { UnauthenticatedError } from '../errors/index.js'

const checkPermissions = (requestUser, resourceUserId) => {
	if (requestUser.userId === resourceUserId.toString()) return

	throw new UnauthenticatedError('Tidak berhak mengakses rute ini')
}

const checkMessagePermissions = (
	requestUser,
	resourceMessageFromId,
	resourceMessageToId
) => {
	if (
		requestUser.userId === resourceMessageFromId.toString() ||
		requestUser.userId === resourceMessageToId.toString()
	) {
		return
	}

	throw new UnauthenticatedError('Tidak berhak mengakses rute ini')
}

export { checkPermissions as default, checkMessagePermissions }
