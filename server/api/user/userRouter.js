import express from 'express'
import { body } from 'express-validator'
import handleResult from '../../middleware/validator.js'
import {
  signIn,
  signUp,
  getUserSubmissions,
  getUserProfile
} from './userController.js'
import verifyAuth from '../../middleware/auth.js'

const userRouter = express.Router()

userRouter.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('name').exists().notEmpty().trim(),
  body('password').isLength({ min: 6 }).notEmpty(),
  handleResult,
  signUp,
])

userRouter.post('/signin', signIn)

userRouter.get('/submissions', verifyAuth, getUserSubmissions)
userRouter.get('/profile', verifyAuth, getUserProfile)

userRouter.get('profile/submission')

export default userRouter
