import Bull from 'bull'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import languageRuntime from '../constants/runtime.js'
import { generateFile, removeFile } from '../generateFile.js'
import {
  createAcSubmission,
  createSubmissionsResult,
  createWaReSubmission,
  getProblemBySubmittedId,
  getTestCases
} from '../api/problems/problemModel.js'
import { RunTimeError, WrongAnswerError, TimeLimitExceededError } from '../utils/errorHandler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const problemQueue = new Bull('problem-queue', {
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  }
})

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
  const { id: submittedId, language, code } = data
  // generate a file
  const filepath = generateFile(language, code)
  console.log(filepath)
  try {
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
      console.log('expectedOutput', expectedOutput, 'output.stdout', output)
      if (expectedOutput !== output.stdout.replace(/\n/g, '')) {
        const realOutput = output.stdout.replace(/\n/g, '')
        return { WA: { testInput, expectedOutput, realOutput } }
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

      return { AC: { time: timeAndMemory[0], memory: timeAndMemory[1] } }
    })
    // calculate the average time and memory
    const results = await Promise.all(execFilePromises)
    // Check if there are any WA results
    const hasWaResults = results.some((result) => Object.keys(result)[0] === 'WA')
    if (hasWaResults) {
      const error = new WrongAnswerError()
      error.message = results
      throw error
    }
    console.log(hasWaResults)
    console.log(results)
    const { totalTime, totalMemory } = results.reduce((acc, cur) => {
      const { time, memory } = cur.AC
      acc.totalTime += time
      acc.totalMemory += memory
      return acc
    }, { totalTime: 0, totalMemory: 0 })
    const avgTime = (totalTime / results.length).toFixed(1)
    const avgMemory = (totalMemory / results.length).toFixed(1)
    console.log(totalTime, totalMemory)
    console.log(avgTime, avgMemory)

    await createSubmissionsResult(submittedId, 'AC', avgTime, avgMemory, null)
    await createAcSubmission(submittedId, 'AC', language, avgTime, avgMemory)
  } catch (err) {
    console.log(err)
    console.error(err.message)
    if (err instanceof RunTimeError) {
      const cleanedErrorMessage = err.message.replace(/(Traceback \(most recent call last\):)?\s*File "[^"]+", /g, '').replace(/\d+\.\d+ \d+$/m, '')
      await createSubmissionsResult(submittedId, 'RE', null, null, cleanedErrorMessage)
      await createWaReSubmission(submittedId, 'RE', cleanedErrorMessage)
    }
    if (err instanceof WrongAnswerError) {
      await createSubmissionsResult(submittedId, 'WA', null, null, null)
      await createWaReSubmission(submittedId, 'WA', err.message)
    }
    if (err instanceof TimeLimitExceededError) {
      await createSubmissionsResult(submittedId, 'TLE', null, null, null)
      await createWaReSubmission(submittedId, 'TLE', null)
    }
  }
  // delete the file
  removeFile(filepath)
})

// add problem
const addProblemToQueue = async (problemId, language, code) => {
  await problemQueue.add({ id: problemId, language, code })
}

export default addProblemToQueue
