import express from 'express'
import { param } from 'express-validator'
import handleResult from '../../middleware/validator.js'
import {
  submitProblem,
  getSubmission,
  getSubmissions,
  getProblemsPage,
  getProblemPage
} from './problemController.js'
import verifyAuth from '../../middleware/auth.js'

const problemRouter = express.Router()

problemRouter.get('/', getProblemsPage)

problemRouter.get(
  '/:id',
  param('id').isInt().not().isEmpty(),
  handleResult,
  getProblemPage
)

problemRouter.post(
  '/:id/submit',
  param('id').isInt().not().isEmpty(),
  handleResult,
  verifyAuth,
  submitProblem
)

problemRouter.get(
  '/:id/submissions/:submittedId',
  param('id').isInt().not().isEmpty(),
  param('submittedId').isInt().not().isEmpty(),
  handleResult,
  verifyAuth,
  getSubmission
)

problemRouter.get(
  '/:id/submissions',
  param('id').isInt().not().isEmpty(),
  handleResult,
  verifyAuth,
  getSubmissions
)

export default problemRouter
