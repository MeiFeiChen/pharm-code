import addProblemToQueue from '../../config/problemQueue.js'

import {
  createSubmission,
  getSubmissionResult,
  getSubmissionsResults,
  getProblems,
  getProblem,
  getTestCases,
  getPosts,
  getSinglePost,
  createPost,
  getMessages,
  createMessage,
  getUserName
} from './problemModel.js'

export const getProblemsPage = async (req, res) => {
  try {
    const problems = await getProblems()
    // const passRate = await getProblemsPassRate()
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
    const exampleCases = await getTestCases(problemId, 'example')
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

  if (!code) {
    return res.status(400).json({ success: false, error: 'Empty code body' })
  }
  try {
    // store data to db
    const submittedId = await createSubmission(userId, problemId, language, 'pending', code)
    // add job to queue
    addProblemToQueue(submittedId, language, code)
    return res.status(201).json({ success: true, submittedId })
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
    if (!data.length) return res.status(400).json({ errors: "could't find data" })
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
    console.log(data)
    return res.status(200).json({ data })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get messages failed' })
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
  console.log(problemId, postId, userId, content)
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
