import Bull from 'bull'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

let problemQueue
let mysqlQueue

if (process.env.MODE === 'develop') {
  problemQueue = new Bull('problem-queue', {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST
    }
  })
  mysqlQueue = new Bull('mysql-queue', {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST
    }
  })
} else {
  problemQueue = new Bull(
    'problem-queue',
    `rediss://:${process.env.AWS_REDIS_AUTH_TOKEN}@${process.env.AWS_REDIS_HOST}:${process.env.REDIS_PORT}`,
    { redis: { tls: true, enableTLSForSentinelMode: false } }
  )
  mysqlQueue = new Bull(
    'mysql-queue',
    `rediss://:${process.env.AWS_REDIS_AUTH_TOKEN}@${process.env.AWS_REDIS_HOST}:${process.env.REDIS_PORT}`,
    { redis: { tls: true, enableTLSForSentinelMode: false } }
  )
}

const addProblemToQueue = async (submittedId, language, code) => {
  const addToQueueTime = Date.now()
  await problemQueue.add(
    { submittedId, language, code, addToQueueTime },
    { removeOnComplete: true, removeOnFail: true }
  )
}

const addMysqlProblemToQueue = async (submittedId, problemId, language, code) => {
  await mysqlQueue.add(
    {
      submittedId, problemId, language, code
    },
    { removeOnComplete: true, removeOnFail: true }
  )
}

export { addProblemToQueue, addMysqlProblemToQueue }
