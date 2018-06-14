const execa = require('execa')

module.exports = command => {
  execa.shell(command, { env: { FORCE_COLOR: true } }).stdout.pipe(process.stdout)
}
