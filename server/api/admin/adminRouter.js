import express from 'express'
import { body } from 'express-validator'
import handleResult from '../../middleware/validator.js'
import verifyAuth from '../../middleware/auth.js'
import { getUserPage, updateUserPage } from './adminController.js'

const adminRouter = express.Router()

adminRouter.get('/user', getUserPage)
adminRouter.put('/user', updateUserPage)

export default adminRouter
