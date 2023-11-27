import Bull from 'bull'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import languageRuntime from '../constants/runtime.js'
import { generateFile, removeFile } from '../generateFile.js'
import { createSubmissionsResult, getProblemBySubmittedId, getTestCases } from '../api/problems/problemModel.js'
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
        if (error.code === 124) return reject(new TimeLimitExceededError('Time Limit Exceeded'))
        return reject(new RunTimeError(stderr))
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
        filepath,
        index,
        testInput,
        problem.time_limit
      )
      // compare result with test case
      console.log('expectedOutput', expectedOutput, 'output.stdout', output)
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
    await createSubmissionsResult(submittedId, result, runTime, memory, null)
  } catch (err) {
    console.error(err.message)
    if (err instanceof RunTimeError) {
      const cleanedErrorMessage = err.message.replace(/Traceback \(most recent call last\):\s*File "[^"]+", /g, '').replace(/\d+\.\d+ \d+$/m, '')
      result = 'RE'
      await createSubmissionsResult(submittedId, result, null, null, cleanedErrorMessage)
    }
    if (err instanceof WrongAnswerError) {
      result = 'WA'
      await createSubmissionsResult(submittedId, result, null, null, null)
    }
    if (err instanceof TimeLimitExceededError) {
      result = 'TLE'
      await createSubmissionsResult(submittedId, result, null, null, null)
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
