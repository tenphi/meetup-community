let argv = require('yargs').argv;

function toUpperCase(str) {
  return str.replace(/\-/g, '_').toUpperCase();
}

let env = {
  get(name) {
    return argv[name] || process.env['APP_' + toUpperCase(name)];
  }
};

export default env;
