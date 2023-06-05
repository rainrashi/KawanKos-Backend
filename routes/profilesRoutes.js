import express from 'express'
const router = express.Router()

import {
	getAllProfiles,
	getProfileDetail,
} from '../controllers/profilesController.js'

router.route('/').get(getAllProfiles)
router.route('/:id').get(getProfileDetail)

export default router
