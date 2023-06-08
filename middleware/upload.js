import { StatusCodes } from 'http-status-codes'
import fs from 'fs'

const upload = (req, res, next) => {
	//exist check
	if (typeof req.file === 'undefined' || typeof req.body === 'undefined')
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'Permasalahan dalam upload foto' })

	//app.use upload
	let image = req.file.path

	//filetype
	if (
		!req.file.mimetype.includes('jpeg') &&
		!req.file.mimetype.includes('jpg') &&
		!req.file.mimetype.includes('png')
	) {
		//remove file
		fs.unlinkSync(image)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'File ini tidak didukung (hanya JPG, JPEG, dan PNG)' })
	}

	//filesize
	if (req.file.size > 4096 * 4096) {
		fs.unlinkSync(image)
		return res
			.status(StatusCodes.BAD_REQUEST)
			.json({ msg: 'File ini terlalu besar (MAX: 4MB)' })
	}

	//success
	next()
}

export default upload
