import Bull from 'bull'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import languageRuntime from '../constants/runtime.js'
import { generateFile, removeFile } from '../generateFile.js'
import {
  createAcSubmission,
  createWaReSubmission,
  getProblemBySubmittedId,
  getTestCases
} from '../api/problems/problemModel.js'
import { RunTimeError, WrongAnswerError, TimeLimitExceededError } from '../utils/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

let problemQueue

if (process.env.MODE === 'develop') {
  console.log('problem bull is on develop mode')
  problemQueue = new Bull('problem-queue', {
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST
    }
  })
} else {
  console.log('problem queue is deployed mode')
  problemQueue = new Bull(
    'problem-queue',
    `rediss://:${process.env.AWS_REDIS_AUTH_TOKEN}@${process.env.AWS_REDIS_HOST}:${process.env.REDIS_PORT}`,
    { redis: { tls: true, enableTLSForSentinelMode: false } }
  )
}

const NUM_WORKERS = 5
const execFile = async (submittedId, language, filepath, index, input, timeLimit) => {
  // generate a temporary file
  const { imageName, containerName, runtimeCommand } = languageRuntime[language]
  const tempFileName = path.basename(filepath)
  const tempFileDir = path.dirname(filepath)

  // use container to run the process
  return new Promise((resolve, reject) => {
    const volumePath = '/app'

    const command = `echo "${input}" | docker run -i --rm --name ${submittedId}${containerName}${index} -v ${tempFileDir}:${volumePath} ${imageName}:latest timeout ${timeLimit / 1000} /usr/bin/time -f '%e %M' ${runtimeCommand} ${volumePath}/${tempFileName}`
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

// process problem
problemQueue.process(NUM_WORKERS, async ({ data }) => {
  const { submittedId, language, code } = data
  // generate a file
  const filepath = generateFile(language, code)
  try {
    console.log(`---- ${submittedId} start ---`)
    // get the test cases
    const problem = await getProblemBySubmittedId(submittedId)
    const testCases = await getTestCases(problem.id, 'test')

    const execFilePromises = testCases.map(async (testCase, index) => {
      const { test_input: testInput, expected_output: expectedOutput } = testCase
      const output = await execFile(
        submittedId,
        language,
        filepath,
        index,
        testInput,
        problem.time_limit
      )
      // compare result with test case
      const realOutput = output.stdout.replace(/\n/g, '')
      if (expectedOutput !== realOutput) {
        return {
          status: 'WA', testInput, expectedOutput, realOutput
        }
      }
      console.log(output.stderr.split(/[\s\n]+/))
      const timeAndMemory = output.stderr.split(/[\s\n]+/)
        .map((part) => parseFloat(part))
        .filter((number) => !Number.isNaN(number))
        .map((number, i) => {
          if (!Number.isNaN(number)) {
            return i === 0 ? (number * 1000) : (number / 1024);
          }
          return number;
        })

      return {
        status: 'AC',
        time: timeAndMemory[0],
        memory: timeAndMemory[1],
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
    console.log(`---- ${submittedId} hasWaResults----`)
    console.log(hasWaResults)
    console.log(`---- ${submittedId} results----`)
    console.log(results)
    const { totalTime, totalMemory } = results.reduce((acc, cur) => {
      const { time, memory } = cur
      acc.totalTime += time
      acc.totalMemory += memory
      return acc
    }, { totalTime: 0, totalMemory: 0 })
    const avgTime = (totalTime / results.length).toFixed(1)
    const avgMemory = (totalMemory / results.length).toFixed(1)
    console.log(totalTime, totalMemory)
    console.log(`--- ${submittedId} avgTime, avgMemory---`)
    console.log(avgTime, avgMemory)

    await createAcSubmission(submittedId, 'AC', language, avgTime, avgMemory)
  } catch (err) {
    console.log(err)
    console.error(err.message)
    if (err instanceof RunTimeError) {
      const cleanedErrorMessage = err.message.replace(/(Traceback \(most recent call last\):)?\s*File "[^"]+", /g, '').replace(/\d+\.\d+ \d+$/m, '')
      await createWaReSubmission(submittedId, 'RE', cleanedErrorMessage)
    }
    if (err instanceof WrongAnswerError) {
      await createWaReSubmission(submittedId, 'WA', err.message)
    }
    if (err instanceof TimeLimitExceededError) {
      await createWaReSubmission(submittedId, 'TLE', null)
    }
  }
  // delete the file
  removeFile(filepath)
  console.log(`----  ${submittedId} end ---`)
})

// add problem
const addProblemToQueue = async (submittedId, language, code) => {
  await problemQueue.add({ submittedId, language, code })
}

export default addProblemToQueue
