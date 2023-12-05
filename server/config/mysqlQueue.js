import Bull from 'bull'
import dotenv from 'dotenv'
import path from 'path'
import { table, getBorderCharacters } from 'table'
import _ from 'lodash'
import { createPool } from 'mysql2'
import { fileURLToPath } from 'url'
import { RunTimeError, WrongAnswerError } from '../utils/errorHandler.js'
import {
  createAcSubmission,
  createWaReSubmission,
  getTestCases
} from '../api/problems/problemModel.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })
const mysqlQueue = new Bull('mysql-queue', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  }
})

const mysqlPool = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
}).promise()

const NUM_WORKERS = 5

// process problem
mysqlQueue.process(NUM_WORKERS, async ({ data }) => {
  const {
    submittedId,
    problemId,
    language,
    code
  } = data

  try {
    const testCases = await getTestCases(problemId, 'example')
    const queryPromise = testCases.map(async (testCase) => {
      try {
        // get the expect output
        const expectedOutput = JSON.parse(testCase.expected_output)
        // get real output and count time
        const startTime = new Date()
        const [testResult] = await mysqlPool.query(`${code}`)
        const endTime = new Date()
        // compare result
        const resultData = testResult.map((row) => Object.values(row))
        const resultTable = table([Object.keys(testResult[0]), ...resultData], { border: getBorderCharacters('ramac') })
        if (!_.isEqual(testResult, expectedOutput)) {
          return { status: 'WA', realOutput: resultTable, runtime: endTime - startTime }
        }
        return { status: 'AC', realOutput: resultTable, runtime: endTime - startTime }
      } catch (err) {
        throw new RunTimeError(err.message)
      }
    })
    const results = await Promise.all(queryPromise)
    console.log(results)
    // Check if there are any WA results
    const hasWaResults = results.some((result) => result.status === 'WA')
    if (hasWaResults) {
      const error = new WrongAnswerError()
      error.message = results
      throw error
    }
    // calculate the average time
    const totalTime = results.reduce((acc, { runtime }) => acc + runtime, 0)
    const avgTime = (totalTime / results.length).toFixed(1)
    console.log(avgTime)

    await createAcSubmission(submittedId, 'AC', language, avgTime, 0)
  } catch (err) {
    if (err instanceof RunTimeError) {
      await createWaReSubmission(submittedId, 'RE', err.message)
    }
    if (err instanceof WrongAnswerError) {
      await createWaReSubmission(submittedId, 'WA', err.message)
    }
  }
})

// add problem
const addMysqlProblemToQueue = async (submittedId, problemId, language, code) => {
  await mysqlQueue.add({
    submittedId,
    problemId,
    language,
    code
  })
}

export default addMysqlProblemToQueue
