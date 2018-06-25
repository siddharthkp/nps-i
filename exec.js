const execa = require('execa')

module.exports = command => {
  const output = execa.shell(command, { env: { FORCE_COLOR: true } })
  output.stdout.pipe(process.stdout)
  output.stderr.pipe(process.stderr)
}
