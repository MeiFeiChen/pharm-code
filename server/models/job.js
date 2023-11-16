import mongoose from 'mongoose'

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/compiler_app')
}

main().catch(err => console.error(err))

const JobSchema = mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['js', 'py'],
  },
  filename: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  output: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'success', 'error'],
  },
});

const Job = new mongoose.model('job', JobSchema)

export { Job }
