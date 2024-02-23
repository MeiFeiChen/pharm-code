import { addProblemToQueue, addMysqlProblemToQueue } from '../utils/bullQueue.js'
import {
  createSubmission,
  createPost,
  createMessage,
  getSubmissionResult,
  getSubmissionsResults,
  getProblems,
  getProblem,
  getTestCases,
  getPosts,
  getSinglePost,
  getMessages,
  getUserName
} from '../models/problemModel.js'
import { formatToTable, processTableData } from '../utils/tableFormat.js'

export const getProblemsPage = async (req, res) => {
  try {
    const problems = await getProblems()
    return res.status(200).json(problems)
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ errors: 'Get problems failed' });
  }
}

export const getProblemPage = async (req, res) => {
  const { id: problemId } = req.params
  try {
    const problem = await getProblem(problemId)
    let exampleCases = await getTestCases(problemId, 'example')
    if (problem.database) {
      problem.input = processTableData(problem.input)

      exampleCases = exampleCases.map((example) => {
        const exampleInput = processTableData(example.test_input)
        const exampleOutputParsed = JSON.parse(example.expected_output)
        const exampleOutputData = exampleOutputParsed.map(Object.values)
        const exampleOutputTable = [Object.keys(exampleOutputParsed[0]), ...exampleOutputData]
        return {
          ...example,
          test_input: exampleInput,
          expected_output: formatToTable(exampleOutputTable),
        }
      })
    }
    const data = { ...problem, exampleCases }

    return res.status(200).json({ data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ errors: 'get problem failed' })
  }
}

export const submitProblem = async (req, res) => {
  const { userId } = res.locals
  const { id: problemId } = req.params
  const { language, code } = req.body

  try {
    const submittedId = await createSubmission(userId, problemId, language, 'pending', code)
    const addToQueue = language === 'mysql' ? addMysqlProblemToQueue : addProblemToQueue
    addToQueue(submittedId, problemId, language, code)
    return res.status(201).json({ success: true, submittedId })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'submit failed' })
  }
}

export const getSubmission = async (req, res) => {
  const { id: problemIid, submittedId } = req.params
  const { userId } = res.locals

  try {
    const data = await getSubmissionResult(submittedId, problemIid, userId)
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
  const { userId } = res.locals
  try {
    const data = await getSubmissionsResults(problemIid, userId)
    return res.status(200).json({ data })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get submissions failed' })
  }
}

/* ---- Discussion ---- */
export const getDiscussion = async (req, res) => {
  const { id: problemIid } = req.params
  try {
    const data = await getPosts(problemIid)
    return res.status(200).json({ data })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get posts failed' })
  }
}

export const createDiscussion = async (req, res) => {
  const { id: problemId } = req.params
  const { userId } = res.locals
  const { title, content } = req.body

  try {
    const postId = await createPost(problemId, userId, title, content)
    return res.status(201).json({ success: true, postId })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'create a post failed' })
  }
}

export const getPost = async (req, res) => {
  const { id: problemId, postId } = req.params
  try {
    const data = await getSinglePost(problemId, postId)
    return res.status(200).json({ data })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get posts failed' })
  }
}

export const getPostMessage = async (req, res) => {
  const { id: problemId, postId } = req.params
  try {
    const data = await getMessages(problemId, postId)
    return res.status(200).json({ data })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get messages failed' })
  }
}

export const createPostMessage = async (req, res) => {
  const { id: problemId, postId } = req.params
  const { userId } = res.locals
  const { content } = req.body
  try {
    const io = req.app.get('socketio')
    const name = await getUserName(userId)
    const data = await createMessage(problemId, userId, postId, content)

    io.in(postId).emit('message', {
      ...data, name
    })

    return res.status(200).json({ success: true, id: data.id })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'create messages failed' })
  }
}
