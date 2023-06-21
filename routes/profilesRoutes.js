import express from 'express'
const router = express.Router()

import {
	getAllProfiles,
	getProfileDetail,
	deleteProfileAdm,
} from '../controllers/profilesController.js'

router.route('/').get(getAllProfiles)
router.route('/:id').get(getProfileDetail).delete(deleteProfileAdm)

export default router
