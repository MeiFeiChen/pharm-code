import express from 'express'
import {
  getProblemListPage,
  getSubmissionPage,
  getUserPage,
  updateUserPage,
  updateProblem
} from '../controllers/adminController.js'

const adminRouter = express.Router()

adminRouter.get('/users', getUserPage)
adminRouter.get('/submissions', getSubmissionPage)
adminRouter.get('/problemlist', getProblemListPage)
adminRouter.post('/problem', updateProblem)
adminRouter.put('/users', updateUserPage)

export default adminRouter
