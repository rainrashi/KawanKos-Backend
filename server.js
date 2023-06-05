import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

//security
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

const __dirname = dirname(fileURLToPath(import.meta.url))

//db and authenticateUser
import connectDB from './db/connect.js'

//routers
import authRouter from './routes/authRoutes.js'
import uploadRouter from './routes/uploadRoutes.js'
import profileRouter from './routes/profilesRoutes.js'
import messageRouter from './routes/messagesRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

//middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'

if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'))
}
app.use(express.json())
app.use('/uploads', express.static('uploads'))

//security
app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

app.get('/', (req, res) => {
	res.send('Hello World!')
})
app.get('/api/v1', (req, res) => {
	res.send('Hello World!')
})

// ! uncomment when deploy
// app.use(express.static(path.resolve(__dirname, './client/build')))
// app.get('*', function(request,response){
// 	response.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
// })

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/profiles', profileRouter)
app.use('/api/v1/messages', authenticateUser, messageRouter)
app.use('/api/v1/uploads', uploadRouter)

//* j
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 7000

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL)
		app.listen(port, () => {
			console.log(`Server listening on port ${port}`)
		})
	} catch (error) {
		console.log(error)
	}
}

start()
