import Queue from 'bull'
import { Job } from './models/job.js'
import execFile from './execFile.js'

const jobQueue = new Queue('job-queue')

const NUM_WORKERS = 5

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  const jobId = data.id
  const job = await Job.findById(jobId);
  if (job === undefined) {
    throw Error(`cannot find Job with id ${jobId}`)
  }

  try {
    job.startedAt = new Date()
    const output = await execFile(job.language, job.filename)
    job.completedAt = new Date()
    job.output = output
    job.status = 'success'
    console.log(job)

    await job.save();
    return true;
  } catch (err) {
    console.log(err)
    job.completedAt = new Date();
    job.output = JSON.stringify(err);
    job.status = 'error';
    await job.save();
    throw Error(JSON.stringify(err));
  }
})
jobQueue.on('failed', (error) => {
  console.error(error.data.id, error.failedReason);
})

const addJobToQueue = async (jobId) => {
  await jobQueue.add({ id: jobId })
}

export default addJobToQueue;
