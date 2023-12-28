import { Server } from 'socket.io'
import { processProblem } from './config/testQueue.js'
import processMysqlProblem from './config/mysqlTestQueue.js'

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
    socket.on('task', (data) => {
      console.log('server side received', data)
    })
    socket.on('test_data', async (data) => {
      try {
        socket.join(socket.id);
        const { problemId, language, code } = data;
        let result;
        if (language !== 'mysql') {
          result = await processProblem(problemId, language, code);
        } else {
          result = await processMysqlProblem(problemId, language, code);
        }
        io.to(socket.id).emit('result', result);
      } catch (error) {
        console.error('Error processing test data:', error);
        io.to(socket.id).emit('error', 'An error occurred while processing your request.');
      }
    })
  })
}
