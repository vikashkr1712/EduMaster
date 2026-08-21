import { spawn } from 'node:child_process'

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const services = [
  { name: 'frontend', args: ['--prefix', 'frontend', 'run', 'dev'] },
  { name: 'backend', args: ['--prefix', 'backend', 'run', 'dev'] },
]

let stopping = false
const children = services.map(({ name, args }) => {
  const child = spawn(npmCommand, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
  })

  child.on('error', (error) => {
    console.error(`[${name}] could not start: ${error.message}`)
  })

  child.on('exit', (code, signal) => {
    if (stopping) return
    console.error(`[${name}] stopped${signal ? ` (${signal})` : ` with code ${code}`}. Stopping development servers.`)
    stop(code || 1)
  })

  return child
})

function stop(exitCode = 0) {
  if (stopping) return
  stopping = true

  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM')
  }

  // Give npm and its child server a moment to exit cleanly.
  const timer = setTimeout(() => process.exit(exitCode), 800)
  timer.unref()
}

process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
