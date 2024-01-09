import { Server } from 'socket.io'

export const ioInit = (server) => new Server(server, {
  cors: {
    origin: '*'
  }
})

export const setSocketEvent = (io) => {
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
}
