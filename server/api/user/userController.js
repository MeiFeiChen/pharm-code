import jwt from 'jsonwebtoken'
import * as argon2 from 'argon2'
import {
  createUser,
  findUser,
  getSubmissionsByUserId,
  getProfile
} from './userModel.js'

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  secure: true,
  sameSite: 'strict',
}
const { JWT_ACCESS_TOKEN } = process.env
const EXPIRE_TIME = 60 * 60 * 6

export const signUp = async (req, res) => {
  const { name, email, password } = req.body
  const token = await argon2.hash(password)
  try {
    const userId = await createUser('native', name, email, token)
    const jwtToken = jwt.sign({ userId }, JWT_ACCESS_TOKEN, { expiresIn: EXPIRE_TIME })

    res.cookie('jwtToken', jwtToken, COOKIE_OPTIONS)
    return res.status(200).json({
      data: {
        access_token: jwtToken,
        access_expired: EXPIRE_TIME,
        user: {
          id: userId,
          provider: 'native',
          name,
          email,
          picture: ''
        }
      }
    })
  } catch (err) {
    console.error(err)
    if (err.message.includes('duplicate key value')) {
      return res.status(400).json({ errors: 'email already exist. Please log in.' })
    }
    return res.status(500).json({ errors: 'sign up failed' })
  }
}
export const signIn = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await findUser(email)
    if (!user) throw new Error('Invalid Credentials')

    const isValidPassword = await argon2.verify(user.token, password)
    if (!isValidPassword) throw new Error('invalid password')
    const jwtToken = jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN, { expiresIn: EXPIRE_TIME })
    res.cookie('jwtToken', jwtToken, COOKIE_OPTIONS)
    return res.status(200).json({
      data: {
        access_token: jwtToken,
        access_expired: EXPIRE_TIME,
        user: {
          id: user.id,
          provider: user.provider,
          name: user.name,
          email: user.email,
          picture: user.picture
        }
      }
    })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(400).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'sign up failed' })
  }
}

export const getUserSubmissions = async (req, res) => {
  const { userId } = res.locals
  try {
    const userSubmissions = await getSubmissionsByUserId(userId)
    console.log(userSubmissions)
    return res.status(200).json(userSubmissions)
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(400).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get Submission data failed' })
  }
}
export const getUserProfile = async (req, res) => {
  const { userId } = res.locals
  try {
    const userProfile = await getProfile(userId)
    return res.status(200).json({ data: userProfile })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(400).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'get user profile failed' })
  }
}