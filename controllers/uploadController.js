import { StatusCodes } from 'http-status-codes'
import cloudinary from 'cloudinary'
import fs from 'fs'

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_SECRET_KEY,
})

const uploadController = {
	uploadAvar: async (req, res) => {
		try {
			//get file
			const file = req.file

			//upload ke cloudinary
			cloudinary.v2.uploader.upload(
				file.path,
				{
					folder: 'avatar',
					width: 150,
					height: 150,
					crop: 'fill',
				},
				(err, result) => {
					if (err) throw err
					fs.unlinkSync(file.path)
					res.status(StatusCodes.OK).json({
						msg: 'Upload berhasil',
						url: result.secure_url,
					})
				}
			)
		} catch (err) {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
		}
	},
}

export default uploadController
