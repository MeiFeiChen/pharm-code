import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { Job } from './models/job.js'
import addJobToQueue from './jobQueue.js'
import generateFile from './generateFile.js'

const app = express()
const port= 3000

app.use(cors('*'))
app.use(express.json())


app.get('/status', async(req, res) => {
  const jobId = req.query.id;

  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }

  const job = await Job.findById(jobId);

  if (job === undefined) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }

  return res.status(200).json({ success: true, job });

})

app.post('/run', async(req, res) => {
  const { language = "js", code } = req.body;

  console.log(language, "Length:", code.length);

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  // need to generate a c++ file with content from the request
  const filename = await generateFile(language, code)
  // write into DB
  const job = await new Job({ language, filename }).save()
  const jobId = job["_id"];
  addJobToQueue(jobId);
  res.status(201).json({ jobId });
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}....`)
})
