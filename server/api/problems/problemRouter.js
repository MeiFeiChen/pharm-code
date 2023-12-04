import express from 'express'
import { param } from 'express-validator'
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

// discussion
// get all the posts in the discussion
problemRouter.get(
  '/:id/discussion',
  param('id').isInt().not().isEmpty(),
  handleResult,
  getDiscussion
)

// create a post in a discussion
problemRouter.post(
  '/:id/discussion',
  param('id').isInt().not().isEmpty(),
  handleResult,
  verifyAuth,
  createDiscussion
)

// get single post
problemRouter.get(
  '/:id/discussion/:postId',
  param('id').isInt().not().isEmpty(),
  param('postId').isInt().not().isEmpty(),
  handleResult,
  getPost
)

// get all the message of a post
problemRouter.get(
  '/:id/discussion/:postId/messages',
  param('id').isInt().not().isEmpty(),
  param('postId').isInt().not().isEmpty(),
  handleResult,
  getPostMessage
)

// create a message in a post
problemRouter.post(
  '/:id/discussion/:postId/messages',
  param('id').isInt().not().isEmpty(),
  param('postId').isInt().not().isEmpty(),
  handleResult,
  verifyAuth,
  createPostMessage
)

export default problemRouter
