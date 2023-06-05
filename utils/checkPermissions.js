import { UnauthenticatedError } from '../errors/index.js'

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) return

  throw new UnauthenticatedError('Tidak berhak mengakses rute ini')
}

export default checkPermissions
