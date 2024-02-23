import express from 'express'
import OpenAI from 'openai'
import { getProblem } from '../models/problemModel.js'

const openai = new OpenAI({ apiKey: process.env.SECRET_KEY })

const openAIRouter = express.Router()

openAIRouter.post('/', async (req, res) => {
  const { problemId, language, code } = req.body
  try {
    const problem = await getProblem(problemId)
    console.log(problem)
    const commonContent = `
      題目為${problem.title}，內容為${problem.problem_statement}，
      輸入資料為${problem.input}，輸出資料須為${problem.output}，I/O mode為${problem.io_mode}。`
    const content = `${commonContent} 目前的程式碼為${code}，請確認解題方法是否正確，並用${language}，回答請用繁體中文`

    console.log(content)
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a code reviewer of an online judge system' },
        { role: 'user', content }],
      model: 'gpt-3.5-turbo',
    })
    console.log(completion.choices[0].message.content)
    res.status(200).json({ content: completion.choices[0].message.content })
  } catch (err) {
    console.error(err)
    if (err instanceof Error) {
      return res.status(500).json({ errors: err.message })
    }
    return res.status(500).json({ errors: 'ask question failed' })
  }
})

export default openAIRouter
