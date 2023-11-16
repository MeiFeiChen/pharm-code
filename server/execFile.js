import ChildProcess from 'child_process'
import languageRuntime from './config.js'

const child = cp.spawn('ls', ['-lh', '/usr']);
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

const execMemory = () => (
  new Promise((resolve, reject) => {
    const { containerName } = languageRuntime[language]

    const memoryMonitoringCommand = `docker stats --no-stream ${containerName} --format "{{ json . }}"`;

    ChildProcess.exec(memoryMonitoringCommand, (error, stdout, stderr) => {
      if (error) {
        const rejectionReason = { error, stderr };
        reject(new Error(JSON.stringify(rejectionReason)));
      }
      if (stderr) {
        reject(new Error(stderr));
      }
      resolve(stdout);
    });
  })
);

export { execFile, execMemory };
