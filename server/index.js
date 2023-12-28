import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { createServer } from 'http'
import { ioInit, setSocketEvent } from './io.js'
import problemRouter from './api/problems/problemRouter.js'
import userRouter from './api/user/userRouter.js'
import openAIRouter from './api/openai/openAIRouter.js'
import adminRouter from './api/admin/adminRouter.js'

dotenv.config()

const port = process.env.PORT
const app = express()
const server = createServer(app)

const io = ioInit(server)
setSocketEvent(io)

app.set('socketio', io)

app.use(morgan('dev'))
app.use(cors('*'))
app.options('*', cors())

app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/problems', problemRouter)
app.use('/api/assistance', openAIRouter)
app.use('/api/admin', adminRouter)

server.listen(port, () => {
  console.log(`Server is listening on port ${port}....`)
})
