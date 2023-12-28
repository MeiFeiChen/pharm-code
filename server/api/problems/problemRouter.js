import express from 'express'
import { body, param } from 'express-validator'
import handleResult from '../../middleware/validator.js'
import {
  submitProblem,
  getSubmission,
  getSubmissions,
  getProblemsPage,
  getProblemPage,
  getDiscussion,
  createDiscussion,
  getPost,
  getPostMessage,
  createPostMessage
} from './problemController.js'
import verifyAuth from '../../middleware/auth.js'

const problemRouter = express.Router()

problemRouter.get('/', getProblemsPage)

problemRouter.get(
  '/:id',
  param('id').isInt().notEmpty(),
  handleResult,
  getProblemPage
)

problemRouter.post(
  '/:id/submit',
  param('id').isInt().notEmpty(),
  body('language').exists().notEmpty(),
  body('code').exists().notEmpty(),
  handleResult,
  verifyAuth,
  submitProblem
)

problemRouter.get(
  '/:id/submissions/:submittedId',
  param('id').isInt().notEmpty(),
  param('submittedId').isInt().notEmpty(),
  handleResult,
  verifyAuth,
  getSubmission
)

problemRouter.get(
  '/:id/submissions',
  param('id').isInt().notEmpty(),
  handleResult,
  verifyAuth,
  getSubmissions
)

problemRouter.get(
  '/:id/discussion',
  param('id').isInt().notEmpty(),
  handleResult,
  getDiscussion
)

problemRouter.post(
  '/:id/discussion',
  param('id').isInt().notEmpty(),
  handleResult,
  verifyAuth,
  createDiscussion
)

problemRouter.get(
  '/:id/discussion/:postId',
  param('id').isInt().notEmpty(),
  param('postId').isInt().notEmpty(),
  handleResult,
  getPost
)

problemRouter.get(
  '/:id/discussion/:postId/messages',
  param('id').isInt().notEmpty(),
  param('postId').isInt().notEmpty(),
  handleResult,
  getPostMessage
)

problemRouter.post(
  '/:id/discussion/:postId/messages',
  param('id').isInt().notEmpty(),
  param('postId').isInt().notEmpty(),
  handleResult,
  verifyAuth,
  createPostMessage
)

export default problemRouter
