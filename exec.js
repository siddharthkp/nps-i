const execa = require('execa')

module.exports = command => {
  const {stdout, stderr} = execa(command, { shell: true, env: { FORCE_COLOR: true } });
  stdout.pipe(process.stdout);
  stderr.pipe(process.stderr);
}
