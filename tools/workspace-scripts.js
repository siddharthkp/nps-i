const { series: { nps: series }, concurrent: { nps: parallel } } = require('nps-utils')

module.exports = {
  scripts: {
    default: 'echo default',
    object: {
      script: 'echo object',
      description: 'This one is an object'
    },
    nested: {
      dev: {
        script: 'echo nested dev',
        description: 'nested dev'
      },
      prod: {
        script: 'echo nested prod',
        description: 'nested prod'
      }
    }
  }
}
