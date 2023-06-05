import multer, { diskStorage } from 'multer'

//storage utk upload
const storage = diskStorage({
	destination: function (req, res, cb) {
		cb(null, './uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + file.originalname)
	},
})

const filerFilter = (req, file, cb) => {
	cb(null, true)
}

let upload = multer({
	storage: storage,
	fileFilter: filerFilter,
})

export default upload.single('avatar')
