import express from 'express'
import { body } from 'express-validator'
import handleResult from '../../middleware/validator.js'
import verifyAuth from '../../middleware/auth.js'
import { getProblemListPage, getSubmissionPage, getUserPage, updateUserPage } from './adminController.js'

const adminRouter = express.Router()

adminRouter.get('/users', getUserPage)
adminRouter.get('/submissions', getSubmissionPage)
adminRouter.get('/problemlist', getProblemListPage)

adminRouter.put('/users', updateUserPage)

export default adminRouter
