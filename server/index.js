import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import OpenAI from 'openai'
import { Server } from 'socket.io'
import { createServer } from 'http'

import problemRouter from './api/problems/problemRouter.js'
import userRouter from './api/user/userRouter.js'

dotenv.config()

const port = 3000
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
})

app.set('socketio', io)

const openai = new OpenAI({ apiKey: process.env.SECRET_KEY });

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(morgan('dev'))
app.use(cors('*'))
app.options('*', cors())

app.use(express.json())
app.use(express.static('./public/dist'))

app.use('/api/user', userRouter)
app.use('/api/problems', problemRouter)

app.use('/api/openai', async (req, res) => {
  const completion = await openai.chat.completions.create({
    messages: [{
      role: 'assistant', content: `輸入a和b，輸出a+b結果
        Input: 一行兩個正整數a和b
        Output: 一行一個正整數 給我javascript或python的做法`
    }],
    model: 'gpt-3.5-turbo',
  })
  res.send(completion)

  console.log(completion.choices[0]);
})

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
