import Bull from 'bull'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import languageRuntime from '../constants/runtime.js'
import { generateTempFile } from '../generateFile.js'
import { createSubmissionsResult, getProblemBySubmittedId, getTestCases } from '../models/problemModel.js'
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
const execFile = async (submittedId, language, code, index, inputs, timeLimit) => {
  // generate a temporary file
  const { imageName, containerName, runtimeCommand } = languageRuntime[language]
  const tempFilePath = await generateTempFile(language, code)
  const tempFileName = path.basename(tempFilePath)
  const tempFileDir = path.dirname(tempFilePath)

  return new Promise((resolve, reject) => {
    const volumePath = '/app'
    const input = inputs.replace(/ /g, '\n')

    const command = `echo "${input}" | docker run -i --rm --name ${submittedId}${containerName}${index} -v ${tempFileDir}:${volumePath} ${imageName}:latest /usr/bin/time -f '%e %M' ${runtimeCommand} ${volumePath}/${tempFileName}`

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new RunTimeError(stderr))
      }
      const output = { index, stdout, stderr }
      return resolve(output)
    })
    // Kill the container when the timeout is reached
    setTimeout(() => {
      const timeoutError = new TimeLimitExceededError('Time Limit Exceeded')
      exec(`docker kill ${submittedId}${containerName}${index}`)
      return reject(timeoutError)
    }, timeLimit + 10000)
  })
}

// process problem
problemQueue.process(NUM_WORKERS, async ({ data }) => {
  const { id: submittedId, language, code } = data
  let result;
  try {
    // get the test cases
    const problem = await getProblemBySubmittedId(submittedId)
    const testCases = await getTestCases(problem.id, 'test')

    const execFilePromises = testCases.map(async (testCase, index) => {
      const { test_input: testInput, expected_output: expectedOutput } = testCase
      const output = await execFile(
        submittedId,
        language,
        code,
        index,
        testInput,
        problem.time_limit
      )
      console.log('expectedOutput', expectedOutput, 'output.stdout', output)
      // compare result with test case
      if (expectedOutput !== output.stdout.replace(/\n/g, '')) {
        throw new WrongAnswerError('Wrong Answer')
      }
      const timeAndMemory = output.stderr.split(/[\s\n]+/)
        .map((part) => parseFloat(part))
        .filter((number) => !Number.isNaN(number))
      return timeAndMemory
    })
    // calculate the average time and memory
    const results = await Promise.all(execFilePromises)
    console.log(results)
    const sumTimeMemory = results.reduce((acc, item) => {
      acc[0] += item[0]
      acc[1] += item[1]
      return acc
    }, [0, 0])
    const avgTimeMemory = [sumTimeMemory[0] / results.length, sumTimeMemory[1] / results.length]
    console.log(avgTimeMemory)
    const runTime = (avgTimeMemory[0] * 1000).toFixed(1) // milliseconds
    const memory = (avgTimeMemory[1] / 1024).toFixed(1) // kb -> mb
    // Check if the time and memory are within the limits.
    if (runTime > problem.time_limit
    || memory > problem.memory_limit) {
      throw new TimeLimitExceededError('Time Limit Exceeded')
    }
    result = 'AC'
    await createSubmissionsResult(submittedId, result, runTime, memory)
  } catch (err) {
    console.error(err.message)
    if (err instanceof RunTimeError) {
      result = 'RE'
    }
    if (err instanceof WrongAnswerError) {
      result = 'WA'
    }
    if (err instanceof TimeLimitExceededError) {
      result = 'TLE'
    }
    await createSubmissionsResult(submittedId, result, null, null)
  }
})

// add problem
const addProblemToQueue = async (problemId, language, code) => {
  await problemQueue.add({ id: problemId, language, code })
}

export default addProblemToQueue
