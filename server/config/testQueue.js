import Bull from 'bull'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

import languageRuntime from '../constants/runtime.js'
import { generateFile, removeFile } from '../generateFile.js'
import { RunTimeError, WrongAnswerError, TimeLimitExceededError } from '../utils/errorHandler.js'
import {
  getTestCases,
  getProblem
} from '../api/problems/problemModel.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const testQueue = new Bull('test-queue', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
  }
})

const execFile = async (language, filepath, index, input, timeLimit) => {
  // generate a temporary file
  const { imageName, containerName, runtimeCommand } = languageRuntime[language]
  const tempFileName = path.basename(filepath)
  const tempFileDir = path.dirname(filepath)

  // use container to run the process
  return new Promise((resolve, reject) => {
    const volumePath = '/app'

    const command = `echo "${input}" | docker run -i --rm --name ${tempFileName}${containerName}${index} -v ${tempFileDir}:${volumePath} ${imageName}:latest timeout ${timeLimit / 1000} /usr/bin/time -f '%e %M' ${runtimeCommand} ${volumePath}/${tempFileName}`
    exec(command, (error, stdout, stderr) => {
      if (error) {
        if (error.code === 124 || error.code === 2) return reject(new TimeLimitExceededError('Time Limit Exceeded'))
        return reject(new RunTimeError(stderr, error))
      }
      const output = { stdout, stderr }
      return resolve(output)
    })
  })
}

export const processProblem = async (problemId, language, code) => {
  const filepath = generateFile(language, code)
  try {
    // get the test cases
    const problem = await getProblem(problemId)
    const testCases = await getTestCases(problemId, 'example')

    const execFilePromises = testCases.map(async (testCase, index) => {
      const { test_input: testInput, expected_output: expectedOutput } = testCase
      const output = await execFile(
        language,
        filepath,
        index,
        testInput,
        problem.time_limit
      )
      // compare result with test case
      console.log('expectedOutput', expectedOutput, 'output.stdout', output)
      const realOutput = output.stdout.replace(/\n/g, '')
      if (expectedOutput !== realOutput) {
        return {
          status: 'WA', testInput, expectedOutput, realOutput
        }
      }
      return {
        status: 'AC',
        testInput,
        expectedOutput,
        realOutput
      }
    })
    // calculate the average time and memory
    const results = await Promise.all(execFilePromises)
    // Check if there are any WA results
    const hasWaResults = results.some((result) => result.status === 'WA')

    if (hasWaResults) {
      const error = new WrongAnswerError()
      error.message = results
      throw error
    }
    // delete the file
    removeFile(filepath)

    return { status: 'AC', results }
  } catch (err) {
    console.log(err)
    console.error(err.message)
    if (err instanceof RunTimeError) {
      const cleanedErrorMessage = err.message.replace(/(Traceback \(most recent call last\):)?\s*File "[^"]+", /g, '').replace(/\d+\.\d+ \d+$/m, '')
      removeFile(filepath)
      return { status: 'RE', results: [cleanedErrorMessage] }
    }
    if (err instanceof WrongAnswerError) {
      removeFile(filepath)
      return { status: 'WA', results: err.message }
    }
    if (err instanceof TimeLimitExceededError) {
      removeFile(filepath)
      return { status: 'TLE', results: [] }
    }
    return { status: err.message }
  }
}

// add problem
export const addProblemToTestQueue = async (problemId, language, code) => {
  await testQueue.add({ problemId, language, code })
}
