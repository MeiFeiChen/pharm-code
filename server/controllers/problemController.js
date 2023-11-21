import addProblemToQueue from '../config/problemQueue.js'
import {
  createSubmission,
  getSubmissionResult,
  getSubmissionsResults,
  getProblems,
  getProblem,
  getTestCases
} from '../models/problemModel.js'
import { generateFile } from '../generateFile.js'

export const getProblemsPage = async (req, res) => {
  try {
    const problems = await getProblems();
    return res.status(200).json(problems);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ errors: 'Get problems failed' });
  }
}

export const getProblemPage = async (req, res) => {
  const { id: problemId } = req.params
  try {
    const problem = await getProblem(problemId)
    const exampleCases = await getTestCases(problemId, 'example')
    const data = { ...problem, exampleCases }
    return res.status(200).json({ data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errors: 'get problem failed' })
  }
}

export const submitProblem = async (req, res) => {
  const userId = 1
  const { id: problemId } = req.params
  const { language, code } = req.body

  if (code === undefined) {
    return res.status(400).json({ success: false, error: 'Empty code body' })
  }
  try {
    // generate file and insert submission data to db
    const filename = await generateFile(language, code)
    const submittedId = await createSubmission(userId, problemId, language, 'pending', filename)
    // add job to queue
    addProblemToQueue(submittedId, language, code)
    return res.status(201).json({ submittedId })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'submit failed' })
  }
}

export const submitTest = async(req, res) => {

}

export const getSubmission = async (req, res) => {
  const { id: problemIid, submittedId } = req.params
  const userId = 1
  try {
    const data = await getSubmissionResult(submittedId, problemIid, userId)
    if (!data) return res.status(400).json({ errors: "could't find data" })
    return res.status(200).json({ data })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get submission failed' })
  }
}

export const getSubmissions = async (req, res) => {
  const { id: problemIid } = req.params
  const userId = 1
  try {
    const data = await getSubmissionsResults(problemIid, userId)
    if (!data.length) return res.status(400).json({ errors: "could't fund data" })
    return res.status(200).json({ data })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get submissions failed' })
  }
}
