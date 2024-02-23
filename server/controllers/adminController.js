import { getAllProblemsAndTestCases, getAllSubmissions, getAllUsers, updateProblemData } from '../models/adminModel.js'

export const getUserPage = async (req, res) => {
  try {
    const data = await getAllUsers()
    return res.status(200).json({ data })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(400).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get User data failed' })
  }
}

export const getSubmissionPage = async (req, res) => {
  try {
    const data = await getAllSubmissions()
    return res.status(200).json({ data })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(400).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get Submission data failed' })
  }
}

export const getProblemListPage = async (req, res) => {
  try {
    const data = await getAllProblemsAndTestCases()
    return res.status(200).json({ data })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(400).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get Problem List data failed' })
  }
}

export const updateProblem = async (req, res) => {
  const { problem } = req.body
  try {
    await updateProblemData(problem)
    return res.status(200).json({ success: true })
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'update problem failed' })
  }
}

export const updateUserPage = async (req, res) => {
  res.send('hi')
}

