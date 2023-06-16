import { readFile } from 'fs/promises'

import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db/connect.js'
import User from './models/User.js'

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL)
		await User.deleteMany()
		const jsonProducts = JSON.parse(
			await readFile(new URL('./KK-Profiles-finale.json', import.meta.url))
		)
		await User.create(jsonProducts)
		console.log('Success!')
		process.exit(0)
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}

start()
