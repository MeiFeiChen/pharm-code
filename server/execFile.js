import { exec } from 'child_process'
import languageRuntime from './constants/runtime.js'

const execFile = (language, file) => (
  new Promise((resolve, reject) => {
    const { containerName, runtimeCommand } = languageRuntime[language]
    const inputs = ['1', '2'];

    // Concatenate inputs with newline characters
    const input = inputs.join('\n');

    exec(`echo "${input}"|docker exec -i ${containerName} ${runtimeCommand} /app/${file}`, (error, stdout, stderr) => {
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

export default execFile
