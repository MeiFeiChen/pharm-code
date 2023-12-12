import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server } from 'socket.io'
import { createServer } from 'http'
import problemRouter from './api/problems/problemRouter.js'
import userRouter from './api/user/userRouter.js'
import openAIRouter from './api/openai/openAIRouter.js'
import adminRouter from './api/admin/adminRouter.js'
import { processProblem } from './config/testQueue.js'
import processMysqlProblem from './config/mysqlTestQueue.js'

dotenv.config()

const port = process.env.PORT
const app = express()
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('joinPost', (postId) => {
    socket.join(postId)
    console.log(`Server: User joined ${postId}`)
  })

  socket.on('disconnect', () => {
    console.log('user disconnect')
  })
  socket.on('task', (data) => {
    console.log('server side received', data)
  })
  socket.on('test_data', async (data) => {
    socket.join(socket.id)
    const { problemId, language, code } = data
    if (language !== 'mysql') {
      const result = await processProblem(problemId, language, code)
      io.to(socket.id).emit('result', result)
    } else {
      const result = await processMysqlProblem(problemId, language, code)
      io.to(socket.id).emit('result', result)
    }
  })
})

app.set('socketio', io)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(morgan('dev'))
app.use(cors('*'))
app.options('*', cors())

app.use(express.json())
app.use(express.static('./public/dist'))

app.use('/api/user', userRouter)
app.use('/api/problems', problemRouter)
app.use('/api/assistance', openAIRouter)
app.use('/api/admin', adminRouter)

// front end page
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dist/index.html'), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    }
  })
})

server.listen(port, () => {
  console.log(`Server is listening on port ${port}....`)
})
