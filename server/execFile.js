import { exec } from 'child_process'
import languageRuntime from './config.js'

const execFile = (language, file) => (
  new Promise((resolve, reject) => {
    const { containerName, runtimeCommand } = languageRuntime[language]
    exec(`docker exec ${containerName} ${runtimeCommand} /app/${file}`, (error, stdout, stderr) => {
      if (error) {
        const rejectionReason = { error, stderr }
        reject(new Error(JSON.stringify(rejectionReason)))
      }
      if (stderr) {
        reject(new Error(stderr))
      }
      resolve(stdout)
    })
  })
)

export default execFile;
